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

// this should be changed into a listener for when a user submits 
// a search
function performSearch() {
	var searchElement = document.getElementById('chosen-select');
	alert("Alert: " + searchElement.value);
}


jQuery(function($) {
	$('#search-button').click(function() {
		alert("WORKING");
		$('.result-selected').each(function() {
			alert("ALERT " + $(this).value);
		});
	});
}


// update the view with results from query
function updateResults(yelpResponseText, mightyResponseText) {
	
}

// temp method to choose update yelp results
function updateYelpResults(yelpResponseText) {
	var resultsDiv = document.getElementById("grid-wrapper");
	resultsDiv.innerHTML = yelpResponseText;
	var reults = JSON.parse(yelpResponseText);
	for(var i=0; i < results.length; i++) {
		var result = results[i];
		var div = document.createElement("div");
		div.setAttribute("class", "portfolio-item");
		div.innerHTML = result.name;
		resultsDiv.appendChild(div);
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
