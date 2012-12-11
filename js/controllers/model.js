

/*--------- Model Class ----------*/


function Model(){
	
	/*---- Model Methods: Search ----*/
	
	this.doYelpSearch = function(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long){
			
			// Searches Yelp and sends results to yelp_result_handler()
			yelp_api_caller(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);
			
			// Function for searching through bookmarks. Need to add qualifiers, e.g. if offset = 0.
			//
	};
	
	this.doMMSearch = function(terms, category_filter){
	
		bookmark_search(terms, category_filter);
	}
	/*---- Model Methods: Create, Edit and Retrieve Lists and Bookmarks ----*/
	 
	this.addBookmark = function(object, listname){
		add_bookmark(object, listname);
	};
	
	this.deleteBookmark = function(markname, listname){
		delete_bookmark(markname, listname);
	};
	
	this.createList = function(listname){ 		 
		// Create an empty list and store it
		list = new List(listname, "");
		console.log(list);
		MM_store(listname, list);
	};
	
	this.deleteList = function(listname){ 
		
		// Delete old entry from storage
		localStorage.removeItem(listname); 
	
		// Delete old entry from list index
		index = JSON.parse(localStorage.getItem("list_index"));
		index.splice(index.indexOf(listname), 1);
		localStorage.setItem("list_index", JSON.stringify(index));
	};
	
	this.renameList = function(listname, newname){ 
		
		// Retrieve list
		list = MM_retrieve(listname);
		// Re.init. as List object and change name
		console.log(list);
		newlist = new List(newname, list);
		newlist.rename(newname);
		//  Re-store under new name
		MM_store(newname, newlist);

		// Delete old entry
		this.deleteList(listname);
	}
	
	this.getlist = function(listname){
		return getList(listname);
	}
	
	this.getLists = function(){
		
		// Get list names
		index = model.getListNames();

		// Init. lists as array
		lists = [];

		// Loop through and get each of the lists' bookmarks
		for(var i in index){  
		 	list = model.getlist(index[i]);
			lists.push(list);
		}
		console.log(lists);
		return lists;
	}
	
	this.getListNames = function(){ 
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
	
	this.rename = function(newname){
		this.name = newname;
	}
	
	this.addBookmark = function(object){
		this.bookmarks.push(object);
	}

	this.removeBookmark = function (markname) { 
	
		// Loop through bookmarks array
		for(var j in list.bookmarks){
			
			// Check bookmark name for object name, and if there's a match:
			var name = list.bookmarks[j].name;
			if(name.indexOf(markname) != -1) {
		
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

function delete_bookmark(markname, listname){
	
	// Get the list from storage and reinstantiate it as a List object
	list = MM_retrieve(listname);
	if(list){
		list = new List(listname, list);
		// Find the bookmark and delete it from the list
		list.removeBookmark(markname);
		// Re-store the list
		MM_store(listname, list);
	}	
}

/* Bookmark Searcher */
function bookmark_search(terms, category_filter){ 
	
	// Init. results and searchterm array
	var results = [];
	var something = [];
	var newsome = [];
	
	// Check if 'terms' contains multiple search terms
	var split = terms.indexOf(" ");
	if(split == -1){ // If not, just push terms into searchterms array
		var searchterms = [];
		searchterms.push(terms);
	}
	else{
		var searchterms = termsplitter(terms, " ", something);
		console.log(searchterms);
	}	
	
	// If there's a category filter
	if(category_filter != ""){
			
			// Check if 'category_filter' contains multiple search filters
			var split = category_filter.indexOf(",");
			if(split == -1){ // If not, just push terms into searchterms array
				var category_filters = [];
				category_filters.push(category_filter);
			}
			else{
				var category_filters = termsplitter(category_filter, ",", newsome);
				console.log(category_filters);
			}
	}
	
	// Get list index, loop through lists
	index = getList("list_index");
	for(var i in index){  
		var list = getList(index[i]);
		console.log(list);
		// Loop through bookmarks array
		for(var j in list.bookmarks){

			// Check bookmark name 
			var name = list.bookmarks[j].name;

			// Looking through each searchterm:
			for(k in searchterms){

				terms = searchterms[k];

				if(name.toLowerCase().indexOf(terms.toLowerCase()) != -1) {

					// Check if it's already in the results array and add it if it isn't 
					var found = $(results).filter(function(){
					        if(this[1] !== undefined && this[1].name !== undefined){
								return this[1].name == list.bookmarks[j].name;
							}
					        else{return false};
						});
					if(found.length <= 0){
						results.push([index[i], list.bookmarks[j]]);
					}
				}

				// Check bookmark snippet for search term, and if there's a match:
				var snippet = list.bookmarks[j].snippet_text;
				if(snippet.toLowerCase().indexOf(terms.toLowerCase()) != -1) {
					if($.inArray(list.bookmarks[j], results) == -1){

						// Check if it's already in the results array and add it if it isn't 
						var found = $(results).filter(function(){
						        if(this[1] !== undefined && this[1].name !== undefined){
									return this[1].name == list.bookmarks[j].name;
								}
						        else{return false};
							});
						if(found.length <= 0){
							results.push([index[i], list.bookmarks[j]]);
						}
					}
				}
			}
			
			// Looking through each category filter:
			for(var l in category_filters){
				
					// Loop through categories
					for(var m in list.bookmarks[j].categories){
						cats = list.bookmarks[j].categories[m];
						for(var z in cats){
							
							
							// If there's a match:
							if(cats[z].toLowerCase().indexOf(category_filters[l].toLowerCase()) != -1) {

								// Check if it's already in the results array and add it if it isn't 
								var found = $(results).filter(function(){
										if(this[1] !== undefined && this[1].name !== undefined){
											return this[1].name == list.bookmarks[j].name;
										}
								        else{return false};
									});
									
								if(found.length <= 0){
									results.push([index[i], list.bookmarks[j]]);
								}
							}
							
						}
					}	
			}
				
		}
			
	}	

	console.log(results); 
	MM_result_handler(results);

}
//TESTER:
//bookmark_search("eclectic luscious with indian noodles","thai,indian");

function termsplitter(terms, marker, result){
	
	// If there is an instance of the marker
	console.log(terms.indexOf(marker)+"!!?");
	if(terms.indexOf(marker) > -1){

		result.push(terms.substring(0, terms.indexOf(marker)));
		terms = terms.substring(terms.indexOf(marker)+1);

		if(terms.indexOf(marker) > -1){
			termsplitter(terms, marker, result);
			return result;
		}
		else{
			result.push(terms);
			return result;
		}
	}
	else{
		return result;
	}	
	
}


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

	model.doYelpSearch(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);

}
//TESTER:
// init_search("indian+food+upper+east+side", "");




/* Handles Yelp Search Results */
function yelp_result_handler(data){
	resultsData = data;
	displayView(currentView);
}

function MM_result_handler(data) {
	mightyData = data;
	// displayMightyData(currentView);
	// FORMAT OF ARRAY: ["nameoflist", [bookmarks array]]
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
	//model.addBookmark("what stuff?", "list3"); 
	//list = model.getlist("list3");
	//console.log(list);

	/* get index tester */
	//console.log(model.getListNames());
	
	/* rename tester */
	//console.log(model.getListNames());
	//model.renameList("list2", "mylist");
	//console.log(model.getListNames());
	
	/* delete list tester */
	//console.log(model.getListNames());
	//model.deleteList("somelist");
	//console.log(model.getListNames());
	
	