/*
 * This is our primary view controller.  It sets up listeners for the page, 
 * responds to requests, and asks the models for the info it needs.
 */

			var currentView = "grid";		// set current view to the default view, which is grid
			jQuery(function($) {			// using failsafe $ alias to ensure jQuery loading
				// listeners for view choice buttons
				document.getElementById("display-grid").onclick = function() {
					if(currentView != "grid") {
						$("#list-wrapper").toggle();
						$("#grid-wrapper").toggle();
						//deleteView(currentView);
						//currentView = "grid";
						currentView = "grid";
						//displayView("grid");
					}					
				};
				document.getElementById("display-list").onclick = function() {
					if(currentView != "list") {
						$("#grid-wrapper").toggle();
						$("#list-wrapper").toggle();
						//deleteView(currentView);
						//currentView = "list";
						currentView = "list";
						//displayView("list");
					}					
				};
				
				// map listener awaiting implementation
				// document.getElementById("display-map").onclick = function() {
					// if(currentView != "map") {						
						// deleteView(currentView);
						// currentView = "map";
						// displayView("map");
					// }					
				// };
				
				//@ORRENKT: added grid item listener for triggering bookmarking
				
				
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
					divText += "<div class='span3 grid-item' id='gridYelpObject_"+i+"'>";     //@ORRENKT: added an id marker for referencing later
																				// @LEVBRIE added distinguishing name which will need parsing
					// if(business_search(yelpObject.name, "").length != 0) { 	// @MODEL need to search for businesses and return array if found
						// divText += "<div class='picture-highlighted'>";
					// }
					// else {
						divText += "<div class='picture'>";
					// }			
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
					// create bottom line
					divText += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count;
					divText += " Reviews</span><span><i class='mini-icoNN-iphone'></i> <a href='#'>  ";
					divText += yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> ";
					divText += "  No tags yet!!" + "</a></span>";
					divText += "<span><i class='mini-ico-plus'></i>" + createMightyDropdown(i) + "</span>";
					// divText += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count + " Reviews</span><span><i class='mini-icoNN-iphone'></i> <a href='#'>  " + yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> " + "  No tags yet!!" + "</a></span>";
					divText += "</div>";
					divText += "</div><!-- end picture --></div><!-- end grid-item -->";	
				}

				document.getElementById('grid-wrapper').innerHTML = divText;
				
				// AFTER ADDING NEW POPOVERS WE MUST SETUP POPOVER LISTENERS FROM BOOTSTRAP AGAIN LIKE SO 
				// refreshPopovers();
				searchTermToUse = "";
				$('.dropdown-menu').find('input').click(function (e) {
			    	e.stopPropagation();
			  	});
			}
			
			function displayList() {
				var businesses = resultsData.businesses;
				var divText = "";

				for(var i = 0; i < businesses.length; i++) {
					var yelpObject = businesses[i];			
					divText += "<div class='list-item row"
					// if(business_search(yelpObject.name, "").length != 0) { 	// @MODEL need to search for businesses and return array if found
						// divText += " highlighted";
					// }
					divText += "' id='gridYelpObject_"+i+"'>";     //@ORRENKT: added an id marker for referencing later
																							// @LEVBRIE added distinguishing name which will need parsing
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
					divText += "<span class='clear'><i class='mini-ico-plus'></i>" + createMightyDropdown(i) + "</span>";
					divText += "</div>";
					//divText += "<div class='span1 pull-right'><a class='btn collapsed' href='#'>More <span class='caret'></span></a></div>";
					divText += "</div><!-- end list-item -->";	
				}
								
				document.getElementById('list-wrapper').innerHTML = divText;
				// AFTER ADDING NEW POPOVERS WE MUST SETUP POPOVER LISTENERS FROM BOOTSTRAP AGAIN LIKE SO 
				refreshPopovers();
				searchTermToUse = "";
				$('.dropdown-menu').find('input').click(function (e) {
			    	e.stopPropagation();
			  	});
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
			
			function createPopoverList(yelpid) {
				var text = "";
				var listNames = model.getListNames();
			
				if (listNames) {						// make sure listNames is not null
					for (var i = 0; i < listNames.length; i++) {
						text += "<a href='#' class='popover-item' href='levbrie.com' data-list-name='";
						text += listNames[i] + "' data-yelpid='" + yelpid + "' title=''><span>";
						text += listNames[i] + "</span></a>";
					}
				}
				return text;
			}
			
			function createMightyDropdown(yelpid) {
				var text = "<div class='dropdown'>";
				text += "<a class='dropdown-toggle' data-toggle='dropdown' href='#'>Add to MightyMarks!</a>";
				text += "<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu'>";
				text += "<li><input type='text' data-yelpid='" + yelpid + "' name='mightyDropInput" + yelpid + "'";
				text += " class='mightyDropInput' placeholder='Start a new MightyList...'></li>"; 
				text += "<li class='divider'></li>";
				text += createDropdownList(yelpid);
				text += "</ul></div>";
				return text;
			}
			
			function createDropdownList(yelpid) {
				var text = "";
				// var listNames = model.getListNames();		
				var listOfLists = model.getLists();	
				if (listOfLists) {						// make sure listNames is not null
					for (var i = 0; i < listOfLists.length; i++) {
						text += " <li><a tabindex='-1' href='#' class='dropdown-bookmark-item' data-list-name='";
						text += listOfLists[i].name + "' data-yelpid='" + yelpid + "' title=''><span>";
						text += listOfLists[i].name + "</span></a></li>";
					}
				}
				return text;
			}
			
			
			// updates Breadcrumb with new categories and search terms
			function updateBreadcrumbs(catString, searchTerms) {
				var div = document.getElementById('breadcrumb');
				var text = "<ul class='breadcrumb'>";
				// alert("CATSTRING " + catString);
				text += parseCatsToBreadcrumbs(catString);
				text += "<li class='active'>Search Terms: ";
				text += searchTerms + "</li>";
				text += "</ul>";
				div.innerHTML = text;
			}
			
			// parses comma-delimited string of categories and separates them into formatted breadcrumbs
			function parseCatsToBreadcrumbs(catsCommas) {
				var catsArray = catsCommas.split(',');
				// alert("CATS ARRAY 0 " + catsArray[0]);
				var text = "";
				for(var i=0; i < catsArray.length; i++) {
					text += "<li><a href='#'>";
					text += catsArray[i];
					text += "</a><span class='divider'>/</span></li>"
				}
				return text;
			}

			function refreshPopovers() {
				$('.popover-anchor').popover()
				// popover demo
				$("a[rel=popover]").popover().click(function(e) {
					e.preventDefault()	// prevents browser from moving window to top of page (because of href="#")
				})
			}

			// generate custom notification 
			function generateNoty(notyType, message) {
				var n = noty({
					text : message,
					type : notyType,
					dismissQueue : false,
					layout : 'top',
					theme : 'defaultTheme'
				});
				console.log(notyType + ' - ' + n.options.id);
   	 			return n;
			}

			function displayAllMightyMarks() {
				mightyData = model.getLists();
				displayMightyData();
			}
			
			function displayManagerModal() {
				
			}
			
			function displayListsForManagement() {	
				var modalBody = document.getElementById('modalBody');
				modalBody.innerHTML = "";			
				var text = "";				
				// var listNames = model.getListNames();	
				var listOfLists = model.getLists();
				for(var i=0; i < listOfLists.length; i++) {
				// $.each(listOfLists, function(key, val) {
						text += createListEditBox("box-header", listOfLists[i].name, listOfLists[i].name);
						// text+= "<div class='box-header' data-list-name='";
						// text += listOfLists[i].name + "'>";
						// text+= "<h2><i class='icon-list'></i><span class='break'></span>";
						// text+= listOfLists[i].name;
						// text+= "</h2>";
						// text+= "<div class='box-icon'>";
						// text+= "<a class='btn-setting' href='#'>";
						// text+= "<i class='icon-wrench'></i>";
						// text+= "</a>";
						// text+= "<a class='btn-minimize' href='#'>";
						// text+= "<i class='icon-chevron-down'></i>";
						// text+= "</a>";
						// text+= "<a class='btn-close' href='#'>";
						// text+= "<i class='icon-minus-sign'></i>";
						// text+= "</a>";
						// text+= "</div>";
						// text+= "</div>";
						text+= "<div class='box-content' style='display:none;'>";
						var bookmarks = listOfLists[i].bookmarks;
						if(bookmarks.length < 1) {
							text += "<div class='alert alert-info'>";
							text += "<button type='button' class='close' data-dismiss='alert'>×</button>";
							text += "<strong>I'm waiting for MightyMarks!</strong> You still haven't added anything to this MightyList.";
							text += "</div>";
						} else {
							for(var j=0; j < bookmarks.length; j++) {
								text += createListEditBox("box-inner", bookmarks[j].name, listOfLists[i].name);
							}							
						}
	
						text+= "</div>";
				// });	
				}	
				modalBody.innerHTML =  text;
			}

			function createListEditBox(className, editName, listName) {
				var text = "";
				text+= "<div class='" + className;
				if(className == "box-header") {
					text += "' data-list-name='";
				} else {
					text += "' data-list-name='" + listName + "'";			// give it a list name so we know what list
					text += "' data-mark-name='";
				}
				text += editName + "'>";
				if(className == "box-header") {
					text+= "<h2><i class='icon-list'></i><span class='break'></span>";
				} else {
					text+= "<h2><i class='icon-bookmark'></i><span class='break'></span>";
				}			
				text+= editName;
				text+= "</h2>";
				text+= "<div class='box-icon'>";
				if(className == "box-header") {
					text+= "<a class='btn-setting' href='#'>";
					text+= "<i class='icon-wrench'></i>";
					text+= "</a>";
					text+= "<a class='btn-minimize' href='#'>";
					text+= "<i class='icon-chevron-down'></i>";
					text+= "</a>";
					text+= "<a class='btn-close' href='#'>";
					text+= "<i class='icon-minus-sign'></i>";
					text+= "</a>";
				} else {					
					text+= "<a class='btn-close-mark' href='#'>";
					text+= "<i class='icon-minus-sign'></i>";
					text+= "</a>";					
				}
				text+= "</div>";
				text+= "</div>";
				return text;
			}
			
			function displayMightyData() {


				var divText = "";
				var divText2 = "";

				console.log(searchTarget);
				
				// If this is an MM search
				if(searchTarget == "MightyMarks"){
						console.log(mightyData);
						for(i in mightyData) {
							var listName = mightyData[i][0];
							var yelpObject = mightyData[i][1];
							
								divText += "<div class='span3 grid-item' id='gridMightyObject_"+i+"'>";     
								divText += "<div class='picture'>";			
								divText += "<a href='" + yelpObject.url + "' title='Title'>";
								divText += "<img src='" + yelpObject.image_url + "' alt=''/>";
								divText += "<div class='image-overlay-link'></div>";
								divText += "</a>";		
								divText += "<div class='item-description alt'>";
								divText += "<h5><a href='project.html'>" + yelpObject.name + "</a></h5>";
								divText += catsToHTML(yelpObject);
								divText += "<h6>MightyList: " + listName + "</h6>";
								divText += reviewToHTML(yelpObject.snippet_text);
								// divText += "<p>" + yelpObject.snippet_text + "</p>";
								divText += "</div>";
								divText += "<div class='post-meta'>";
								// create bottom line
								divText += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count;
								divText += " Reviews</span><span><i class='mini-icoNN-iphone'></i> <a href='#'>  ";
								divText += yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> ";
								divText += "  No tags yet!!" + "</a></span>";
								divText += "<span><i class='mini-ico-plus'></i>" + createMightyDropdown(i) + "</span>";
								// divText += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count + " Reviews</span><span><i class='mini-icoNN-iphone'></i> <a href='#'>  " + yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> " + "  No tags yet!!" + "</a></span>";
								divText += "</div>";
								divText += "</div><!-- end picture --></div><!-- end grid-item -->";

								// OKT: Add bookmarks to list view as well
								divText2 += "<div class='list-item row";
								// if(business_search(yelpObject.name, "").length != 0) { 	// @MODEL need to search for businesses and return array if found
									// divText += " highlighted";
								// }
								divText2 += "' id='gridYelpObject_"+i+"'>";     //@ORRENKT: added an id marker for referencing later
																										// @LEVBRIE added distinguishing name which will need parsing
								divText2 += "<div class='span2'><img src='" + yelpObject.image_url + "' alt=''/></div>";
								divText2 += "<div class='image-overlay-link'></div>";	
								divText2 += "<div class='span8'><h5>";
								divText2 += "<a href='" + yelpObject.url + "' title='" + yelpObject.name + "'>";
								divText2 += yelpObject.name + "</a></h5>";
								divText2 += catsToHTML(yelpObject);
								divText2 += reviewToHTML(yelpObject.snippet_text);
								divText2 += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count;
								divText2 += " Reviews</span><span><i class='mini-icoNN-iphone'></i> <a href='#'>  ";
								divText2 += yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> ";
								divText2 += "  No tags yet!!" + "</a></span>";
								divText2 += "<span class='clear'><i class='mini-ico-plus'></i>" + createMightyDropdown(i) + "</span>";
								divText2 += "</div>";
								//divText2 += "<div class='span1 pull-right'><a class='btn collapsed' href='#'>More <span class='caret'></span></a></div>";
								divText2 += "</div><!-- end list-item -->";
							
						}

						document.getElementById('grid-wrapper').innerHTML = divText;				
						document.getElementById('list-wrapper').innerHTML = divText2;

						// AFTER ADDING NEW POPOVERS WE MUST SETUP POPOVER LISTENERS FROM BOOTSTRAP AGAIN LIKE SO 
						 refreshPopovers();
						searchTermToUse = "";
						$('.dropdown-menu').find('input').click(function (e) {
					    	e.stopPropagation();
					  	});
								
					}		
					
					// If it's a bookmarks load
					else{
						
						// Empty breadcrumbs 	
						$('#breadcrumb').html('');
						
						for(var i = 0; i < mightyData.length; i++) {
							var listName = mightyData[i].name;
							var bookmarks = mightyData[i].bookmarks;
							for(var j=0; j<bookmarks.length; j++) {		
								var yelpObject = bookmarks[j];
								divText += "<div class='span3 grid-item' id='gridMightyObject_"+i+"'>";     
								divText += "<div class='picture'>";			
								divText += "<a href='" + yelpObject.url + "' title='Title'>";
								divText += "<img src='" + yelpObject.image_url + "' alt=''/>";
								divText += "<div class='image-overlay-link'></div>";
								divText += "</a>";		
								divText += "<div class='item-description alt'>";
								divText += "<h5><a href='project.html'>" + yelpObject.name + "</a></h5>";
								divText += catsToHTML(yelpObject);
								divText += "<h6>MightyList: " + listName + "</h6>";
								divText += reviewToHTML(yelpObject.snippet_text);
								// divText += "<p>" + yelpObject.snippet_text + "</p>";
								divText += "</div>";
								divText += "<div class='post-meta'>";
								// create bottom line
								divText += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count;
								divText += " Reviews</span><span><i class='mini-icoNN-iphone'></i> <a href='#'>  ";
								divText += yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> ";
								divText += "  No tags yet!!" + "</a></span>";
								divText += "<span><i class='mini-ico-plus'></i>" + createMightyDropdown(i) + "</span>";
								// divText += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count + " Reviews</span><span><i class='mini-icoNN-iphone'></i> <a href='#'>  " + yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> " + "  No tags yet!!" + "</a></span>";
								divText += "</div>";
								divText += "</div><!-- end picture --></div><!-- end grid-item -->";

								// OKT: Add bookmarks to list view as well
								divText2 += "<div class='list-item row";
								// if(business_search(yelpObject.name, "").length != 0) { 	// @MODEL need to search for businesses and return array if found
									// divText += " highlighted";
								// }
								divText2 += "' id='gridYelpObject_"+i+"'>";     //@ORRENKT: added an id marker for referencing later
																										// @LEVBRIE added distinguishing name which will need parsing
								divText2 += "<div class='span2'><img src='" + yelpObject.image_url + "' alt=''/></div>";
								divText2 += "<div class='image-overlay-link'></div>";	
								divText2 += "<div class='span8'><h5>";
								divText2 += "<a href='" + yelpObject.url + "' title='" + yelpObject.name + "'>";
								divText2 += yelpObject.name + "</a></h5>";
								divText2 += catsToHTML(yelpObject);
								divText2 += reviewToHTML(yelpObject.snippet_text);
								divText2 += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count;
								divText2 += " Reviews</span><span><i class='mini-icoNN-iphone'></i> <a href='#'>  ";
								divText2 += yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> ";
								divText2 += "  No tags yet!!" + "</a></span>";
								divText2 += "<span class='clear'><i class='mini-ico-plus'></i>" + createMightyDropdown(i) + "</span>";
								divText2 += "</div>";
								//divText2 += "<div class='span1 pull-right'><a class='btn collapsed' href='#'>More <span class='caret'></span></a></div>";
								divText2 += "</div><!-- end list-item -->";
							}
						}

						document.getElementById('grid-wrapper').innerHTML = divText;				
						document.getElementById('list-wrapper').innerHTML = divText2;

						// AFTER ADDING NEW POPOVERS WE MUST SETUP POPOVER LISTENERS FROM BOOTSTRAP AGAIN LIKE SO 
						 refreshPopovers();
						searchTermToUse = "";
						$('.dropdown-menu').find('input').click(function (e) {
					    	e.stopPropagation();
					  	});
							
					}
		}		
