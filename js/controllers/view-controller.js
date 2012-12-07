/*
 * This is our primary view controller.  It sets up listeners for the page, 
 * responds to requests, and asks the models for the info it needs.
 */

var yelpObjects = []; 		// we store a list of all current YelpObject objects on the page
							// so that any change of view that does not require a new query
							// to the database or Yelp can be handled directly by the controller
var currentView = "grid"; 	// we always start the program in grid view 
var views = ['grid', 'list', 'map', 'map-list'];	// the 4 views handled by this controller 
													// on this page (there could be others)

function addListeners() {
	var buttonToggleMap = document.getElementById('');
	buttonToggleMap.addEventListener('click', false) {
		
	}
}

/*
 * takes an arbitrary number of arguments as parameters,
 * most of which should be Category or MightyMark Objects
 */
function print_args() {
    for(var i=0; i<arguments.length; i++)
        console.log(arguments[i])
}

var yelpObjects
function fetchCurrentYelpObjects() {
	
}

function performSearch() {
	
}
