// this holds the results of the latest search so they can be retrieved 
// for changing views, adding bookmarks, etc.
var resultsData;
var mightyData;
// initializes chosen with all the yelp categories 
// and then sets up listeners for search bar
jQuery(function($) {// !!IMPORTANT: using failsafe $ alias to ensure jQuery loading
	jQuery(document).ready(function() {
		// let's add in all of the yelp categories to our select box
		// (in the future let's use mustache templates)
		$.getJSON('./json/category.json', function(data) {
			var jtext = "<option value=''></option>";
			$.each(data, function(key, val) {
				jtext += "<option class='opt-cat-level1' data-alias='" + val.alias + "'>" + val.title + "</option>";	
				$.each(val.category, function(k, v) {
					if (v.category) {
						jtext += "<option class='opt-cat-level2' data-alias='" + v.alias + "'>" + v.title + "</option>";
						$.each(v.category, function(thirdKey, thirdVal) {
							jtext += "<option class='opt-single-cat' data-alias='" + thirdVal.alias + "'>" + thirdVal.title + "</option>";
						});
					} else {
						jtext += "<option class='opt-single-cat' data-alias='" + v.alias + "'>" + v.title + "</option>";
					}
				});		
			});
			
			/* *************** SET UP CHOSEN FOR AUTOCOMPLETION OF CATEGORIES IN SEARCH BAR ************** */		
			$(".chzn-select").html(jtext);							// add the parsed categories to the chosen.js dropdown
			$(".chzn-select").chosen();								// initialize chosen
			$(".chzn-choices").addClass("search-query span4");		// add classes to chosen.js ul tag in order to size search bar

			createListeners();										// set up listeners for page		
			
		});
	});
});

function createListeners() {
	createSearchClickListener();
	createSearchKeyListener();
	createAllMarksDisplayListener();
	createMightyManagerListener();
	createMightyDropdownListener();
	createListSpecificDropdownListener();
	createNewListFromMenuListener();
	
	// management listeners
	createDestroyListButtonListener();
	createToggleListItemsListener();
	createListEditListener();
}

function createSearchClickListener() {
	// set up listener for search click
	$(document).on("click", "#searchButton", function(jQEvent) { // jQEvent added for isotope
		jQEvent.preventDefault(); 							
		var parsedCategories = parseCategoryStrings();
		var categoryString = parsedCategories[0];
		var catFilterString = parsedCategories[1];
		if(searchTermToUse != "" && catFilterString != "") {
			init_search(searchTermToUse, catFilterString);
		} else if(searchTermToUse == ""){
			init_search("", catFilterString);					// search on empty string if undefined (find by category)
		} else if(searchTermToUse != "") {
			init_search(searchTermToUse, "");						// search with no categories
		} else {
			// generate error message
			var info = generateNoty("info", "Just so you know, you didn't provide any search terms or categories.");    
			// SET NOTIFICATION TIMEOUTS  
			setNotyTimeout(info);
		}
		updateBreadcrumbs(categoryString, searchTermToUse);
	});	
}

function createSearchKeyListener() {
	// set up listener for user return in search bar
	// currently this causes issues with chosen because there is also return for found categories
	$(document).on("keypress", ".default", function(event) {							
		if (event.which == 13) {
			var parsedCategories = parseCategoryStrings();  
				init_search(searchTermToUse, parsedCategories[1]);		// search with term and categories
				updateBreadcrumbs(parsedCategories[0], searchTermToUse);				
			return false;
		}
	});	
}

function createAllMarksDisplayListener() {
	$(document).on("click", "#mightyMarksDisplay", function(jQEvent) { // jQEvent added for isotope
		jQEvent.preventDefault(); 							
		displayAllMightyMarks();
	});	
}

function createMightyManagerListener() {
	// $(document).on("click", "#mightyManager", function(jQEvent) { // jQEvent added for isotope
		// jQEvent.preventDefault(); 							
		// displayManagerModal();
	// });	
}

function createMightyDropdownListener() {
	// LISTENER: ADD NEW LIST IN DROPDOWN WITH SPECIFIC BOOKMARK OBJECT 
	$(document).on("keypress", ".mightyDropInput", function(event) {		
		// event.preventDefault();		
		if (event.which == 13) {
			var listName = this.value;
			var objectIndex = this.getAttribute('data-yelpid');
			console.log(model.getListNames());
			model.addBookmark(resultsData.businesses[objectIndex], listName);
			console.log(model.getListNames());
			var message = "Nice! " + listName + ", your brand new MightyList has been successfully created!";
			// generate success message
			var success = generateNoty("success", message);    
			// SET NOTIFICATION TIMEOUTS  
			setTimeout(function() {
		      $.noty.setText(success.options.id, 'I\'m closing now!'); // same as alert.setText('Text Override')
		    }, 14000);
		    setTimeout(function() {
		      $.noty.close(success.options.id);
		    }, 2000);
			return false;
		}
	});
}

function createListSpecificDropdownListener() {
	// LISTENER: ADD BOOKMARK TO LIST SPECIFIED BY CURRENT ELEMENT OF CLASS .dropdown-bookmark-item
	$(document).on("click", ".dropdown-bookmark-item", function(event) {		
		event.preventDefault();				
		var listName = this.getAttribute("data-list-name"); // data attribute that stores name of list
		var objectIndex = this.getAttribute('data-yelpid');	// stores index in results of item we wish to add
		// model.createList(listName);
		var result = resultsData.businesses[objectIndex];
		alert(result.name + " " + result.categories[0] + " " + result.url);
		model.addBookmark(resultsData.businesses[objectIndex], listName);
		var busName = resultsData.businesses[objectIndex].name;
		var message = "You just added " + busName + " to " + listName + ".  Nicely done!";
		// generate success message
		var success = generateNoty("success", message);    
		// SET NOTIFICATION TIMEOUTS  
		setTimeout(function() {
	      $.noty.setText(success.options.id, 'I\'m closing now!'); // same as alert.setText('Text Override')
	    }, 14000);
	    setTimeout(function() {
	      $.noty.close(success.options.id);
	    }, 2000);
	});
}

// FOR ADDING NEW LIST WITH NO BOOKMARK
function createNewListFromMenuListener() {
	// LISTENER: ADD NEW LIST WITHOUT ANY BOOKMARK OBJECT 
	$(document).on("keypress", ".newListAdder", function(event) {		
		// event.preventDefault();		
		if (event.which == 13) {
			var listName = this.value;
			model.createList(listName);
			// i want to put an if(model.createList(listName)) then success, otherwise error message already taken
			var message = "Nice! " + listName + ", your brand new MightyList has been successfully created!";
			// generate success message
			var success = generateNoty("success", message);    
			// SET NOTIFICATION TIMEOUTS  
			setTimeout(function() {
		      $.noty.setText(success.options.id, 'I\'m closing now!'); // same as alert.setText('Text Override')
		    }, 14000);
		    setTimeout(function() {
		      $.noty.close(success.options.id);
		    }, 2000);
			return false;
		}
	});
}

function parseCategoryStrings() {
	var count = 0;					// no comma before first category string
	var categoryString = "";		// string of actual category names for displaying in breadcrumbs
	var catFilterString = "";		// category_filter names for passing to yelp 
	$('.result-selected').each(function(index, value) {
		if(count != 0) { categoryString +=","; catFilterString += ","; } 	// adds , BUT NO SPACE except before first and after last
		catFilterString += value.getAttribute('data-alias');
		categoryString += value.innerHTML;
		count++;
	});
	return [categoryString, catFilterString];
}



/* ********* SET UP LIST MANAGEMENT *********** */
function createDestroyListButtonListener() {
	$(document).on("click", ".btn-close", function(e) {	
			e.preventDefault();
			var $element = $(this).parent().parent();
			$listName = $element.data("list-name");
			model.deleteList($listName);
			var message = $listName + " successfully deleted!";
			// generate success message
			var error = generateNoty("error", message);    
			// SET NOTIFICATION TIMEOUTS  
			setTimeout(function() {
		      $.noty.setText(error.options.id, 'I\'m closing now!'); // same as alert.setText('Text Override')
		    }, 14000);
		    setTimeout(function() {
		      $.noty.close(error.options.id);
		    }, 2000);
			$(this).parent().parent().fadeOut();

	});
}
function createToggleListItemsListener() {
	$(document).on("click", ".btn-minimize", function(e) {	
		e.preventDefault();
		var $target = $(this).parent().parent().next('.box-content');
		if($target.is(':visible')) $('i',$(this)).removeClass('icon-chevron-up').addClass('icon-chevron-down');
		else 					   $('i',$(this)).removeClass('icon-chevron-down').addClass('icon-chevron-up');
		$target.slideToggle();
	});	
}
function createListEditListener() {
	$(document).on("click", ".btn-setting", function(e) {	
	// $('.btn-setting').click(function(e){
		e.preventDefault();
		// $(this).parent().parent().addInputBar;
	});	
}

/* ********* SET UP INDIVIDUAL BOOKMARKS MANAGEMENT *********** */
function createDestroyMarkButtonListener() {
	$(document).on("click", ".btn-close-mark", function(e) {	
			e.preventDefault();
			var $element = $(this).parent().parent();
			var $markName = $element.data("mark-name");
			var $listName = $element.data("list-name");
			model.deleteBookmark($markName, $listName);
			var message = $markName + " successfully deleted!";
			// generate success message
			var error = generateNoty("error", message);    
			// SET NOTIFICATION TIMEOUTS  
			setTimeout(function() {
		      $.noty.setText(error.options.id, 'I\'m closing now!'); // same as alert.setText('Text Override')
		    }, 14000);
		    setTimeout(function() {
		      $.noty.close(error.options.id);
		    }, 2000);
			$(this).parent().parent().fadeOut();
	});
}

// set timer to make given notification disappear after a certain number of milliseconds
function setNotyTimeout(notyObject) {
	setTimeout(function() {
      $.noty.setText(notyObject.options.id, 'I\'m closing now!'); // same as alert.setText('Text Override')
    }, 14000);
    setTimeout(function() {
      $.noty.close(notyObject.options.id);
    }, 2000);
}

