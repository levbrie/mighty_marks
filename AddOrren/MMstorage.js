



//better to use object.id to spot the object in list.
function delete_bookmark(object, list_name){
	list = MM_retrieve(list_name);
	//find object
	//remove from list???
	MM_store(list, list_name);
}


/* Stores a bookmarks list */ 
function MM_store(list_name, list){

	alert("store");

	//Turn into string and store
	localStorage.setItem(list_name, JSON.stringify(list));

	alert("stored!");
	
	return true;
}

/* Retrieves a bookmarks list */ 
function MM_retrieve(list_name){
	
	alert("retrieve");

	// Retrieve the object from storage and destringify
	var retrievedObject = localStorage.getItem(list_name);
	if(retrievedObject == null){
		return false;
	}
	else{
		var object = JSON.parse(retrievedObject);	
		return object;	
	}
}


//size function
/*
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
*/

