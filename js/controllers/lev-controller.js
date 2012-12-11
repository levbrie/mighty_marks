// this holds the results of the latest search so they can be retrieved 
// for changing views, adding bookmarks, etc.
var resultsData;

// initializes chosen with all the yelp categories 
// and then sets up listeners for search bar
jQuery(function($) {// !!IMPORTANT: using failsafe $ alias to ensure jQuery loading
	jQuery(document).ready(function() {
		// let's add in all of the yelp categories to our select box
		// (in the future let's use mustache templates)
		$.getJSON('./json/category.json', function(data) {
			var str = JSON.stringify(data, undefined, 2);
			$("#native-json").append(str);
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
			
			$(".chzn-select").html(jtext);							// add the parsed categories to the chosen.js dropdown
			$(".chzn-select").chosen();								// initialize chosen
			$(".chzn-choices").addClass("search-query span4");		// add classes to chosen.js ul tag in order to size search bar

			// set up listener for search click
			$('#searchButton').click(function(jQEvent) { // jQEvent added for isotope
				jQEvent.preventDefault(); 							
				var parsedCategories = parseCategoryStrings();
				var categoryString = parsedCategories[0];
				var catFilterString = parsedCategories[1];
				init_search(searchTermToUse, catFilterString);
				updateBreadcrumbs(categoryString, searchTermToUse);
			});

			// set up listener for user return in search bar
			// currently this causes issues with chosen because there is also return for found categories
			$(".default").keypress(function(event) {				
				if (event.which == 13) {
					var parsedCategories = parseCategoryStrings();  
					init_search(searchTermToUse, parsedCategories[1]);
					updateBreadcrumbs(parsedCategories[0], searchTermToUse);
					return false;
				}
			}); 
			
			// LISTENER: ADD NEW LIST IN POPOVER 
			$(".popover-input").keypress(function(event) {				
				if (event.which == 13) {
					alert(this.value);
					var listName = this.value;
					var objectIndex = this.getAttribute('yelpid');
					model.addbookmark(businesses[objectIndex], listName);
				}
			}); 
					
		});
	});
});

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


/*--------- Model Class ----------*/


function Model(){
	
	/*---- Model Methods: Search ----*/
	
	this.dosearch = function(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long){
			
			// Searches Yelp and sends results to yelp_result_handler()
			yelp_api_caller(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);
			
			// Function for searching through bookmarks. Need to add qualifiers, e.g. if offset = 0.
			//bookmark_search(terms, category_filter);
	};
	
	/*---- Model Methods: Create, Edit and Retrieve Lists and Bookmarks ----*/
	 
	this.addbookmark = function(object, listname){
		add_bookmark(object, list_name);
	};
	
	this.deletebookmark = function(object, listname){
		delete_bookmark(object, listname);
	};
	
	this.createlist = function(listname){ 
		 
		// Create an empty list and store it
		list = new List();
		MM_store(list, listname);
	};
	
	this.deletelist = function(listname){ 
		
		// Delete old entry from storage
		localStorage.removeItem(listname); 
	
		// Delete old entry from list index
		index = JSON.parse(localStorage.getItem("list_index"));
		index.splice(index.indexOf(listname), 1);
		localStorage.setItem("list_index", JSON.stringify(index));
	};
	
	this.renamelist = function(listname, newname){ 
		
		// Retrieve list and re-store under new name
		list = MM_retrieve(listname);
		MM_store(newname, list);

		// Delete old entry
		this.deletelist(listname);
	}
	
	this.getlist = function(listname){
		return getList(listname);
	}
	
	this.getlist_index = function(){ 
		return getList("list_index");	
	}
	
}


/*--------- Helper Functions for Model Class ----------*/

/*---- Yelp Helper Functions ----*/

function yelp_api_caller(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long){
	
	// Set standard location
	var near = 'New_York';
	
	// Call Yelp API
	yelp_api_get(terms, near, offset, sort, category_filter, radius_filter, tl_lat, tl_long, br_lat, br_long, yelp_result_handler);
	
}

/*--- Might Marks Helper Functions ---*/

/* List Constructor */
function List(listname, list){

	// Set name
	this.name = listname;
	
	// If it's a new list
	if(list == ""){
	this.bookmarks = [];
	}
	
	// If reinstantiating a previous list
	else{
		this.bookmarks = list.bookmarks;
	}
	
	// List methods:
	
	this.addBookmark = function(object){
		this.bookmarks.push(object);
	}

	this.removeBookmark = function (object) { 
	
		// Loop through bookmarks array
		for(var j in list.bookmarks){
			
			// Check bookmark name for object name, and if there's a match:
			var name = list.bookmarks[j].name;
			if(name.indexOf(object.name) != -1) {
		
				// Delete entry from bookmarks array
				this.bookmarks.splice(j, 1);
				return true;
			}
		}	
	};

	this.getBookmarks = function () { 
	     return this.bookmarks; 
	};
}

/* Bookmark Adder */
function add_bookmark(object, listname){
 	
	// Get the list from storage and reinstantiate it as a List object
	list = MM_retrieve(listname);
	if(list){
		list = new List(listname, list);
		// Add bookmark to list and store it
		list.addBookmark(object);
		MM_store(listname, list);
	}
	else{ // If it doesn't exist:	
		// Create a new list and add bookmark as first item.
		newlist = new List(listname, "");
		newlist.addBookmark(object);

		// Store in datastore with name as key.
		MM_store(listname, newlist);

	 }	
}

function delete_bookmark(object, listname){
	
	// Get the list from storage and reinstantiate it as a List object
	list = MM_retrieve(listname);
	if(list){
		list = new List(listname, list);
		// Find the bookmark and delete it from the list
		list.removeBookmark(object);
		// Re-store the list
		MM_store(listname, list);
	}	
}

/* Bookmark Searcher */
function bookmark_search(terms, category_filter){ 
	
	// Init. results array
	var results = [];
	
	// Get list index, loop through lists
	index = getList("list_index");
	for(var i in index){  
		var list = getList(index[i]);
		
		// Loop through bookmarks array
		for(var j in list.bookmarks){
			
			// Check bookmark name for search term, and if there's a match:
			var name = list.bookmarks[j].name;
			if(name.toLowerCase().indexOf(terms.toLowerCase()) != -1) {
				
				// Check if it's already in the results array and add it if it isn't 
				var found = $(results).filter(function(){
				        return this.name == list.bookmarks[j].name;
					});
				if(found.length <= 0){
					results.push(list.bookmarks[j]);
				}
			}
			
			// Check bookmark snippet for search term, and if there's a match:
			var snippet = list.bookmarks[j].snippet_text;
			if(snippet.toLowerCase().indexOf(terms.toLowerCase()) != -1) {
				if($.inArray(list.bookmarks[j], results) == -1){
					
					// Check if it's already in the results array and add it if it isn't 
					var found = $(results).filter(function(){
					        return this.name == list.bookmarks[j].name;
						});
					if(found.length <= 0){
						results.push(list.bookmarks[j]);
					}
				}
			}
			
			// Check bookmark categories for category filter if it exists. And if there's a match:
			if(category_filter != ""){
				//can probably use grep, filter, or in array for this since it should be an exact match
				// with the categories array content.
				//var cat = list.bookmarks[j].name;
				//if(name.toLowerCase().indexOf(terms.toLowerCase()) != -1) {
				//}
			}	
		}
	}	
	
	console.log(results); /* Notes to self:
	// send return results objects to MM_result_handler, which needs to be written
	// do cat match: .categories[0], which contains an array of cats, so need to check each... 
	// also requires seperating out any cats by commas
	// need to support multiple search terms, categories */

}
//TESTER:
//bookmark_search("dining","thai");



/*--------- Local Storage Helper Functions for Model Class ----------*/

/* Stores a bookmarks list */ 
function MM_store(list_name, list){

	// Turn into string and store
	localStorage.setItem(list_name, JSON.stringify(list));
	
	// Add listname to list index in storage
	addList_toIndex(list_name);
	
	return true;
}

/* Retrieves a bookmarks list */ 
function MM_retrieve(list_name){

	// Retrieve the object from storage and destringify
	var retrievedObject = localStorage.getItem(list_name);
	var object = JSON.parse(retrievedObject);	
	return object;	
	
}

/* Adds new lists to list index */
function addList_toIndex(listname){

	// Get list index from storage and check it 
	index = localStorage.getItem("list_index");
	if(index){ // If index exists
		index = JSON.parse(index);
		// Check index for list name, and add it if it's not in the index
		if($.inArray(listname, index) == -1){
			index.push(listname);
			localStorage.setItem("list_index", JSON.stringify(index));
		}
	}
	else{
		// Create array with list as first item
		listarray = [];
		listarray.push(listname);
		
		// Create index with list_index as key, index array as value 
		localStorage.setItem("list_index", JSON.stringify(listarray));
	}
}

/* List Retriever */
function getList(listname){
	list = JSON.parse(localStorage.getItem(listname));
	return list;
}



/*** CONTROLLER STUFF ***/

function init_search(values, categories) { 		//@levbrie added categories parameter for search with category_filter
	
	// Set query params to search string
	// var terms = $('#search').val();
	var terms = values;
	// Optional: only added to query if set to new value
	var offset = 0; 					// # of result to start from, for pagination (need to add automatic pagination in sets of 20)
	var sort = 0; 						// 0 = best matched, 1 = distance, 2 = highest rated
	var category_filter = categories; 	// can be a list of comma delimited categories
	var radius_filter = ""; 			// search radius in meters.
	var tl_lat = ""; 					//mapBounds.getSouthWest().lat() 
	var tl_long = ""; 					//mapBounds.getSouthWest().lng() 
	var br_lat = ""; 					//mapBounds.getNorthEast().lat()
	var br_long = ""; 					//mapBounds.getNorthEast().lng()

	model = new Model;
	model.dosearch(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);

}

function yelp_result_handler(data){
	resultsData = data;
	displayView(currentView);
}


/******* TESTER FUNCTIONS ********/

// LIST TESTER: 
/*
  list1 = new list("list1");
  list1.addBookmark("some bookmark");
  bookmarks1 = list1.getBookmarks();
  alert(bookmarks1[0]);
*/

// SEARCH TESTER: 
//model = new Model;
//model.search(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);

// STORAGE CLEANER:
//localStorage.clear();

// MODEL METHOD TESTERS:

	//model = new Model;
	
	/* search tester */
	//model.search(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);
	
	/* add bookmark and get list testers */
	//model.addbookmark("what stuff?", "list3"); 
	//list = model.getlist("list3");
	//console.log(list);

	/* get index tester */
	//console.log(model.getlist_index());
