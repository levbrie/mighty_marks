

/*** Model Class ***/

function model(){
	
	this.search = function(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long){
			yelp_api_caller(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);
			//function for searching through bookmarks?
	};
	
	this.addbookmark = function(object, list_name){
		add_bookmark(object, list_name);
	};
	
	this.deletebookmark = function(object, listname){
		
	};
	
	this.createlist = function(object, listname){
		//check if there is an object or not, if not just create an empty list
	};
	
	this.deletelist = function(listname){
		
	};
	
	this.getlist = function(listname){
		return getList(listname);
	}
	
	this.getlist_index = function(){ //need to support an empty response in controller!!!
		return getList("list_index");	
	}
	
}


/** Helper Functions for Model Class **/

function yelp_api_caller(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long){
	
	// Set standard location
	var near = 'New_York';
	
	// Call api
	yelp_api_get(terms, near, offset, sort, category_filter, radius_filter, tl_lat, tl_long, br_lat, br_long, yelp_result_handler);
	
}

// List constructor
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
	
	/* List methods */
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

function add_bookmark(object, list_name){
 	
	// Get the list from storage and reinstantiate it as a List object
	list = MM_retrieve(list_name);
	if(list){
		list = new List(list_name, list);
		list.addBookmark(object);
		MM_store(list_name, list);
	}
	else{ // if it's not there:	
		// Create a new list and add bookmark as first item.
		newlist = new List(list_name, "");
		newlist.addBookmark(object);
		console.log(newlist);

		// Store in datastore with name as key.
		MM_store(list_name, newlist);

	 }	
}

/*** TESTER FUNCTIONS ***/

// LIST TESTER: 
/*
  list1 = new list("list1");
  list1.addBookmark("some bookmark");
  bookmarks1 = list1.getBookmarks();
  alert(bookmarks1[0]);
*/

// SEARCH TESTER: 
//model = new model;
//model.search(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);

// STORAGE CLEANER:
//localStorage.clear();

// MODEL METHOD TESTERs:
model = new model;
	
	/* search tester */
	//model.search(terms, category_filter, offset, sort, radius_filter, tl_lat, tl_long, br_lat, br_long);
	
	/* add bookmark and get list testers */
	//model.addbookmark("what stuff?", "list3");
	//list = model.getlist("list3");
	//console.log(list);

	/* get index tester */
	//console.log(model.getlist_index());



/*** CONTROLLER STUFF ***/

function search(values){
	
	alert("yes");
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
	
	// Do something with the response.. e.g. store in dataStore, retrieve, and alert name #6
	
	// var i = 0;
	// while(i<=19){
		// $('#biz').append("<div class='result' id='"+i+"'>"+data.businesses[i].name+"</div>")
		// i++;
	// }
	// results = data;
		// var gridDiv = document.getElementById("portfolio-wrapper");
		// gridDiv.innerHTML = "";
		var businesses = data.businesses;
		var divText = "";
		
        // var selector = ".portfolio-item";
        // var $removable = $container.find( selector );
        // $container.isotope( 'remove', $removable );

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
		
		// try inserting items using isotope so they can then be filtered and sorted:
		
		// $.each(data, function(key, bus) {
			// jtext += "<div class='span3 portfolio-item'>";
			// jtext += "<div class='picture'>";			
			// jtext += "<a href='project.html' title='Title'>"
			// jtext += "<img src='" + bus.image_url + "' alt=''/>";
			// jtext += "<div class='image-overlay-link'></div>";
			// jtext += "</a>";		
			// jtext += "<div class='item-description alt'>";
			// jtext += "<h5><a href='project.html'>Despaña</a></h5>";
			// if(bus.categories) {
				// jtext += "<h2>Categories: ";
				// $.each(bus.categories, function(k, v) {
					// jtext += v[0] + ", ";
				// });
				// jtext += "</h2>";		
			// }
			// jtext += "<p>This is a full-service, fully-stocked gourmet Spanish food store...</p>";
			// jtext += "</div>";
			// jtext += "<div class='post-meta'>";
			// jtext += "<span><i class='mini-ico-calendar'></i>1 June 2011</span><span><i class='mini-ico-user'></i> <a href='#'>lucas</a></span><span><i class='mini-ico-comment'></i><a href='#'>89 comments</a></span>";
			// jtext += "</div>";
			// // jtext += " CATEGORY: " + val.title + " ";
			// // jtext += " ALIAS: " + val.alias + " ";
			// jtext += "</div><!-- end picture -->";
			// jtext += "</div><!-- end portfolio-item -->";
// 
		// });
		// $("#portfolio-wrapper").html(jtext); 


//	console.log(JSON.stringify(data));
	
}

// function addIsotopeItems(text) {
	// var $newItems = $(divText);
		// $('#portfolio-wrapper').isotope( 'insert', $newItems );
// }
