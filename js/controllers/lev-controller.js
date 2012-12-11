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
			// jQuery(function($) {			
				$('#searchButton').click(function(jQEvent) { // jQEvent added for isotope
					jQEvent.preventDefault(); 
					alert("WORKING");
					var catFilterString = "";
					var categoryString = "";
					var count = 0;
					$('.result-selected').each(function(index, value) {
						if(count != 0) { categoryString +=","; catFilterString += "," } 	// adds , BUT NO SPACE!! except before first and after last
						alert("ALERT " + value.innerHTML + " ATTRIBUTE ALIAS: " + value.getAttribute('data-alias'));		// print whatever element holds
						catFilterString += value.getAttribute('data-alias');
						categoryString += value.innerHTML;
						count++;
					});
					alert("SEARCHING " + searchTermToUse);
					init_search(searchTermToUse, catFilterString);
					alert("SEARCHED");
					updateBreadcrumbs(categoryString, searchTermToUse);
				});
			// });
			// search when user hits return
			// jQuery(function($) {
				$(".default").keypress(function(event) {				
					if (event.which == 13) {
						var categoryString = "";
						var count = 0;
						$('.result-selected').each(function(index, value) {
							if(count != 0) { categoryString +="," } 	// adds , BUT NO SPACE except before first and after last
							alert("ALERT " + value.innerHTML + " ATTRIBUTE ALIAS: " + value.getAttribute('data-alias'));		// print whatever element holds
							categoryString += value.getAttribute('data-alias');
							count++;
						});
						init_search(searchTermToUse, categoryString);
						updateBreadcrumbs(categoryString, searchTermToUse);
						return false;
					}
				}); 
			// });
		});
	});
});



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



	/* get index tester */
	//console.log(model.getlist_index());
