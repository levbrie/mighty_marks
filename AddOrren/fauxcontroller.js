

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

function list(listname){
	
	alert("new!");
	
	this.name = listname;
	this.bookmarks = [];
	
	this.addBookmark = function(object){
		this.bookmarks.push(object);
	}
	
	this.removeBookmark = function (object) { 
	     //??? how do i do this....
	};
	
	this.getBookmarks = function () { 
	     return this.bookmarks;
	};
}

// LIST TESTER: 
/*
  list1 = new list("list1");
  list1.addBookmark("some bookmark");
  bookmarks1 = list1.getBookmarks();
  alert(bookmarks1[0]);
*/

function add_bookmark(object, list_name){
	
	alert("add");
	
	list = MM_retrieve(list_name);
	if(list){
		alert("found!");
		alert(list.bookmarks[1]); //should be .name for a full object!@!
	}
	else{
		alert("none");
		alert(list_name);
		// Create a new list and add bookmark as first item.
		newlist = new list(list_name);
		newlist.addBookmark(object);
		bookmarks1 = newlist.getBookmarks();
		alert(bookmarks1[0]);
		// Store in datastore with name as key.
		MM_store(list_name, newlist);
	}	
}
/*
model = new model;
//model.addbookmark("some stuff!", "list2");
model.search(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);
//model.bookmark("dog");
//alert(model.getInfo("g"));        // Call Method
*/


/**** Controlller ****/

$('#submit').live('click',function(){
	alert("click");
	search($('#search').val());
});

function search(value){
	
	alert("yes");
	// Set query params to search string
	var terms = $('#search').val();

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
	
	// Do something with the response.. e.g. store in dataStore, retrieve, and alert name #6
	
	var i = 0;
	while(i<=19){
		$('#biz').append("<div class='result' id='"+i+"'>"+data.businesses[i].name+"</div>")
		i++;
	}
	results = data;

//	console.log(JSON.stringify(data));
	
}

