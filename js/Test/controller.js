
$('.yourclass').click(function{
	alert(this.id);
});


// return all bookmarks and display on load:

bookmarks_onload();

function bookmarks_onload(){

	// Get list index
	var model = new Model();
	index = model.getListNames();

	// Init. resultsData as array
	resultsData = [];

	// Loop through and get each of the lists' bookmarks
	for(var i in index){  
	 	list = model.getlist(index[i]);
		bookmarks = list.bookmarks;

		// Push each bookmark into results array
		for(var j in bookmarks){
			resultsData.push(bookmarks[j]);
		}

	}

	console.log(resultsData);
	bookmarks_printer(resultsData);
}	


function bookmarks_printer(resultsData){
	
	alert("here");
	
	for(var i in resultsData){ 
		$("#bookmarks").append(resultsData[i].name+"</br>");
		//$('.inner').append('<p>Test</p>');
	}
}