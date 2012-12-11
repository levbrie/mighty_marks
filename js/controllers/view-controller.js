/*
 * This is our primary view controller.  It sets up listeners for the page, 
 * responds to requests, and asks the models for the info it needs.
 */

			var currentView = "grid";		// set current view to the default view, which is grid
			jQuery(function($) {			// using failsafe $ alias to ensure jQuery loading
				// listeners for view choice buttons
				document.getElementById("display-grid").onclick = function() {
					if(currentView != "grid") {
						deleteView(currentView);
						currentView = "grid";
						displayView("grid");
					}					
				};
				document.getElementById("display-list").onclick = function() {
					if(currentView != "list") {
						deleteView(currentView);
						currentView = "list";
						displayView("list");
					}					
				};
				document.getElementById("display-map").onclick = function() {
					if(currentView != "map") {						
						deleteView(currentView);
						currentView = "map";
						displayView("map");
					}					
				};
			});
			
			function deleteView(view) {
				switch(view) {
					case "list": 
						document.getElementById('list-wrapper').innerHTML = "";
						break;
					case "grid":
						document.getElementById('grid-wrapper').innerHTML = "";
						break;
					case "map":
						document.getElementById('map-wrapper').innerHTML = "";
						break;
					default: 
						document.getElementById('map-wrapper').innerHTML = "";
				}				
			}
			
			function displayView(view) {
				switch(view) {
					case "list": 
						displayList();
						break;
					case "grid":
						displayGrid();
						break;
					case "map":
						displayMap()
						break;
					default: 
						displayGrid();
				}				
			}

			function displayGrid() {
				var businesses = resultsData.businesses;
				var divText = "";

				for(var i = 0; i < businesses.length; i++) {
					var yelpObject = businesses[i];
					divText += "<div class='span3 grid-item'><div class='picture'>";			
					divText += "<a href='" + yelpObject.url + "' title='Title'>";
					divText += "<img src='" + yelpObject.image_url + "' alt=''/>";
					divText += "<div class='image-overlay-link'></div>";
					divText += "</a>";		
					divText += "<div class='item-description alt'>";
					divText += "<h5><a href='project.html'>" + yelpObject.name + "</a></h5>";
					divText += catsToHTML(yelpObject);
					divText += reviewToHTML(yelpObject.snippet_text);
					// divText += "<p>" + yelpObject.snippet_text + "</p>";
					divText += "</div>";
					divText += "<div class='post-meta'>";
					divText += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count + " Reviews</span><span><i class='mini-icoNN-iphone'></i> <a href='#'>  " + yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> " + "  No tags yet!!" + "</a></span>";
					divText += "</div>";
					divText += "</div><!-- end picture --></div><!-- end grid-item -->";	
				}
				// addIsotopeItems(divText);
				// var $newItems = $(divText);
				// $('#grid-wrapper').isotope( 'insert', $newItems );

				// now wire click events for each
				// for(i = 0; i<20; i++) {
					// var currimg = i+1;
					// var imgId = "image-" + currimg;
					// alert("imgId - " + imgId);
					// var elem = document.getElementById(imgId)
					// alert("elem: " + elem.innerHTML);
					// elem.onclick = function(evt) { displaySliderWith(currimg); };
				// }
				document.getElementById('grid-wrapper').innerHTML = divText;
			}
			
			function displayList() {
				var businesses = resultsData.businesses;
				var divText = "";

				for(var i = 0; i < businesses.length; i++) {
					var yelpObject = businesses[i];
					divText += "<div class='list-item row'>";			
					divText += "<div class='span2'><img src='" + yelpObject.image_url + "' alt=''/></div>";
					divText += "<div class='image-overlay-link'></div>";	
					divText += "<div class='span8'><h5>";
					divText += "<a href='" + yelpObject.url + "' title='" + yelpObject.name + "'>";
					divText += yelpObject.name + "</a></h5>";
					divText += catsToHTML(yelpObject);
					divText += reviewToHTML(yelpObject.snippet_text);
					divText += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count;
					divText += " Reviews</span><span><i class='mini-icoNN-iphone'></i> <a href='#'>  ";
					divText += yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> ";
					divText += "  No tags yet!!" + "</a></span>";
					divText += "<span>" + createBookmarkPopover(i) + "</span>";
					divText += "</div>";
					divText += "<div class='span1 pull-right'><a class='btn collapsed' href='#'>More <span class='caret'></span></a></div>";
					divText += "</div><!-- end list-item -->";	
				}
				document.getElementById('list-wrapper').innerHTML = divText;
			}
			
			function catsToHTML(obj) {
				if(obj.categories) {
					var cats = obj.categories;
					var text = "<h6>Categories: ";
					for(var j = 0; j < cats.length; cats++) {
						text += cats[j][0] + " ";
					}
					text += "</h6>";		
					return text;
				}
			}
			
			// converts the review snippet to html to hold review in a nice content bubble
			function reviewToHTML(snippet) {
				var text = "<div class='review-container'>";
				text += "<div class='review'><p>";
				text += snippet;
				text += "</p></div>";
				text += "<div class='review-bg'></div>";
				text += "<div class='review-author'>Anonymous Yelp Reviewer</div>";
				text += "</div>";
				return text;
			}
			
			function createBookmarkPopover(yelpid) {
				var text = "<a class='btn' data-content='<form class='form-inline'>";
				text += "'<input type='text' data-yelpid='" + yelpid + "' class='popover-input' placeholder='Start a new MightyList...'>";
				text += "<!-- <button type='submit' class='btn'>Add</button> -->";
				text += "</form>";
				text += createPopoverList(yelpid);
				text += "rel='popover' href='#' data-original-title='Add a bookmark:'";
				text += " data-html='true'>Click to toggle popover</a>";
				return text;
			}
			
			function createPopoverList(yelpid) {
				var text = "";
				var listNames = model.getListNames();
				for(var i=0; i < listNames.length; i++) {
					text += "<a href='#' class='popover-item' href='levbrie.com' data-list-name='";
					text += listNames[i] + "' data-yelpid='" + yelpid + "' title=''><span>";
					text += listNames[i] + "</span></a>";
				}
				return text;
			}
			
			
			// updates Breadcrumb with new categories and search terms
			function updateBreadcrumbs(catString, searchTerms) {
				var div = document.getElementById('breadcrumb');
				var text = "<ul class='breadcrumb'>";
				alert("CATSTRING " + catString);
				text += parseCatsToBreadcrumbs(catString);
				text += "<li class='active'>Search Terms: ";
				text += searchTerms + "</li>";
				text += "</ul>";
				div.innerHTML = text;
			}
			
			// parses comma-delimited string of categories and separates them into formatted breadcrumbs
			function parseCatsToBreadcrumbs(catsCommas) {
				var catsArray = catsCommas.split(',');
				alert("CATS ARRAY 0 " + catsArray[0]);
				var text = "";
				for(var i=0; i < catsArray.length; i++) {
					text += "<li><a href='#'>";
					text += catsArray[i];
					text += "</a><span class='divider'>/</span></li>"
				}
				return text;
			}

