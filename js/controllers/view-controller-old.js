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
	// Runs search on enter
	// $("#search-button").keypress(function(event) {
		// $('.result-selected').each(function() {
			// alert("ALERT " + $(this).value);
		// });
	// });
});


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
		div.setAttribute("class", "grid-item");
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


			function createBookmarkDropdown(yelpid) {
				var text = "<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu'>";
				text += "<li><a tabindex='-1' href='#'>Action</a></li>";
				text += "<li class='divider'></li>"
 
  // <li><a tabindex='-1' href='#'>Something else here</a></li>
//   
  // <li><a tabindex='-1' href='#'>Separated link</a></li>
// </ul>
				var text = "<td>Popover</td><td><a class='btn popover-anchor' data-content=\""; 			// begin data-content (where popover content goes)
				text += buildDataContent(yelpid);
				text += "\" "; 											// end of data-content
				text += "rel=\"popover\" href=\"#\" data-original-title=\"Add a bookmark:\"";
				text += " data-html=\"true\">Click to toggle popover</a></td>";
				return text;
			}
			
			function buildDataContent(yelpid) {
				var text = "<form action='' name='";
				text += "popoverform_" + yelpid + "' class='form-inline' id='popoverForm_";
				text += yelpid + "'>";				
				text += "<input type='text' data-yelpid='" + yelpid + "' class='popover-input' placeholder='Start a new MightyList...'>";
				text += "<button type='submit' class='btn popover-btn'>Add</button>";
				text += "</form><a class='popover-item' href='levbrie.com' title=''>List 1</a>";
				text += createPopoverList(yelpid);
				return text;
			}
			
			function createDropdownList(yelpid) {
				var text = "";
				var listNames = model.getListNames();
			
				if (listNames) {						// make sure listNames is not null
					for (var i = 0; i < listNames.length; i++) {
						text += " <li><a tabindex='-1' href='#' class='popover-item' data-list-name='";
						text += listNames[i] + "' data-yelpid='" + yelpid + "' title=''><span>";
						text += listNames[i] + "</span></a></li>";
					}
				}
				return text;

			}
