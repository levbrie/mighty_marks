
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
				jtext += "<option class='opt-cat-level1'>" + val.title + "</option>";	
				$.each(val.category, function(k, v) {
					if (v.category) {
						jtext += "<option class='opt-cat-level2'>" + v.title + "</option>";
						$.each(v.category, function(thirdKey, thirdVal) {
							jtext += "<option class='opt-single-cat'>" + thirdVal.title + "</option>";
						});
					} else {
						jtext += "<option class='opt-single-cat'>" + v.title + "</option>";
					}
				});		
			});
		
			$(".chzn-select").html(jtext);
			$(".chzn-select").chosen();
			$(".chzn-choices").addClass("search-query span4");
			// jQuery(function($) {			
				$('#searchButton').click(function(jQEvent) { // jQEvent added for isotope
					// isotope stuff 
					var $container = $('#grid-wrapper');
					$container.isotope({
						itemSelector : '.element'
					}); 
					// end isotope
					// var selector = $(this).attr('data-option-value');
					var selector = ".nature";
					// isotope stuff
					var $removable = $container.find(selector);
					$container.isotope('remove', $removable);
					jQEvent.preventDefault(); 
					// end isotope stuff
					alert("WORKING");
					$('.result-selected').each(function(index, value) { 	// loop through each element of class .result-selected
						alert("ALERT " + value.innerHTML);					// print whatever element holds
						alert("SEARCH FOR: " + searchTermToUse);				
					});
					search(searchTermToUse);
				});
			// });
			// search when user hits return
			// jQuery(function($) {
				$(".default").keypress(function(event) {
					if (event.which == 13) {
						$('.result-selected').each(function(index, value) {
							alert("ALERT " + value.innerHTML);
						});
						search(searchTermToUse);
						return false;
					}
	
	
				}); 
			// });
		});
	});
});


/** Model Class **/
function model(){
	
	this.bookmark = function(object){
		alert(object);

		var animal = {};

        animal.sayHello = function() {
            alert("Hello, my name is " + object);
        }
		animal.sayHello();
		
		return animal;
	};
	
	this.search = function(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long){
			yelp_api_caller(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);
			//function for searching through bookmarks?
	};
	
	this.addbookmark = function(object, list_name){
		alert("addbook!");
		add_bookmark(object, list_name);
	};
	
	this.deletebookmark = function(object, listname){
		
	};
	
	this.createlist = function(object, listname){
		//check if there is an object or not, if not just create an empty list
	};
	
	this.deletelist = function(listname){
		
	};
	
}


/** Helper Function for Model Class **/

function yelp_api_caller(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long){
	
	// Set standard location
	var near = 'New_York';
	
	// Call api
	yelp_api_get(terms, near, offset, sort, category_filter, radius_filter, tl_lat, tl_long, br_lat, br_long, yelp_result_handler);
	
}

// function list(listname){
// 	
	// alert("new!");
// 	
	// this.name = listname;
	// this.bookmarks = [];
// 	
	// this.addBookmark = function(object){
		// this.bookmarks.push(object);
	// }
// 	
	// this.removeBookmark = function (object) { 
	     // //??? how do i do this....
	// };
// 	
	// this.getBookmarks = function () { 
	     // return this.bookmarks;
	// };
// }

// LIST TESTER: 
/*
  list1 = new list("list1");
  list1.addBookmark("some bookmark");
  bookmarks1 = list1.getBookmarks();
  alert(bookmarks1[0]);
*/

// function add_bookmark(object, list_name){
// 	
	// alert("add");
// 	
	// list = MM_retrieve(list_name);
	// if(list){
		// alert("found!");
		// alert(list.bookmarks[1]); //should be .name for a full object!@!
	// }
	// else{
		// alert("none");
		// alert(list_name);
		// // Create a new list and add bookmark as first item.
		// newlist = new list(list_name);
		// newlist.addBookmark(object);
		// bookmarks1 = newlist.getBookmarks();
		// alert(bookmarks1[0]);
		// // Store in datastore with name as key.
		// MM_store(list_name, newlist);
	// }	
// }
/*
model = new model;
//model.addbookmark("some stuff!", "list2");
model.search(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);
//model.bookmark("dog");
//alert(model.getInfo("g"));        // Call Method
*/


/**** Controller ****/
// listener for search 
// $('#submit').live('click',function(){
	// alert("click");
	// search($('#search').val());
// });

function search(values){
	// Set query params to search string
	// var terms = $('#search').val();
	var terms = values;
	// Optional: only added to query if set to new value
	var offset = 0; // # of result to start from, for pagination (need to add automatic pagination in sets of 20)
	var sort = 0; // 0 = best matched, 1 = distance, 2 = highest rated
	var category_filter = "";// can be a list of comma delimited categories
	var radius_filter = ""; // search radius in meters.
	var tl_lat = ""; //mapBounds.getSouthWest().lat() 
	var tl_long = ""; //mapBounds.getSouthWest().lng() 
	var br_lat = ""; //mapBounds.getNorthEast().lat()
	var br_long = ""; //mapBounds.getNorthEast().lng()

	model = new model;
	model.search(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);

}

function yelp_result_handler(data){
	resultsData = data;
	displayView(currentView);
}
