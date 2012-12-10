

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




/*--------- Controller Functions (Unrelated to Model!) ----------*/


/* Initiates a Search */
function init_search(searchterms, categories){ //@levbrie added categories parameter for search with category_filter
	
	// Set query params to search string
	// var terms = $('#search').val();
	var terms = searchterms;
	// Optional: only added to query if set to new value
	var offset = 0; // # of result to start from, for pagination (need to add automatic pagination in sets of 20)
	var sort = 0; // 0 = best matched, 1 = distance, 2 = highest rated
	var category_filter = categories;// can be a list of comma delimited categories
	var radius_filter = ""; // search radius in meters.
	var tl_lat = ""; //mapBounds.getSouthWest().lat() 
	var tl_long = ""; //mapBounds.getSouthWest().lng() 
	var br_lat = ""; //mapBounds.getNorthEast().lat()
	var br_long = ""; //mapBounds.getNorthEast().lng()

	model = new Model;
	model.dosearch(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);

}
//TESTER:
//init_search("thai+food+upper+east+side", "");


/* Handles Yelp Search Results */
function yelp_result_handler(data){
	
		var businesses = data.businesses;
		var divText = "";

		for(var i = 0; i < businesses.length; i++) {
			var yelpObject = businesses[i];
			// alert("PAST BUSINESS " + i);
			// var div = document.createElement("div");
			// div.setAttribute("class", "span3 portfolio-item");
			divText += "<div class='span3 portfolio-item'><div class='picture'>";			
			divText += "<a href='" + yelpObject.url + "' title='Title'>"
			divText += "<img src='" + yelpObject.image_url + "' alt=''/>";
			divText += "<div class='image-overlay-link'></div>";
			divText += "</a>";		
			divText += "<div class='item-description alt'>";
			divText += "<h5><a href='project.html'>" + yelpObject.name + "</a></h5>";
			if(yelpObject.categories) {
				var cats = yelpObject.categories;
				divText += "<h6>Categories: ";
				for(var j = 0; j < cats.length; cats++) {
					divText += cats[j][0] + " ";
				}
				divText += "</h6>";		
			}
			divText += "<p>" + yelpObject.snippet_text + "</p>";
			divText += "</div>";
			divText += "<div class='post-meta'>";
			divText += "<span><i class='mini-ico-comment'></i>  " + yelpObject.review_count + " Reviews</span><span><i class='mini-ico-iphone'></i> <a href='#'>  " + yelpObject.phone + "  " + " </a></span><span><i class='mini-ico-tags'></i> <a href='#'> " + "  No tags yet!!" + "</a></span>";
			divText += "</div>";
			// jtext += " CATEGORY: " + val.title + " ";
			// jtext += " ALIAS: " + val.alias + " ";
			divText += "</div><!-- end picture --></div><!-- end portfolio-item -->";
			// div.innerHTML = divText;
			// gridDiv.appendChild(div);		
		}
		alert("ALL PARSED");
		// addIsotopeItems(divText);
		var $newItems = $(divText);
		$('#portfolio-wrapper').isotope( 'insert', $newItems );
	
}


/*--------- Model Tester Functions ----------*/

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
	
	/* rename tester */
	//console.log(model.getlist_index());
	//model.renamelist("list2", "mylist");
	//console.log(model.getlist_index());
	
	/* delete list tester */
	//console.log(model.getlist_index());
	//model.deletelist("somelist");
	//console.log(model.getlist_index());
	
	