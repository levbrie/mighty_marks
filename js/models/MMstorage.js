

/* Stores a bookmarks list */ 
function MM_store(list_name, list){

	console.log(list);

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

function addList_toIndex(listname){
	
	// Get list index from storage and check it 
	index = localStorage.getItem("list_index");
	if(index){ // if index exists
		index = JSON.parse(index);
		index.push(listname);
		localStorage.setItem("list_index", JSON.stringify(index));
	}
	else{
		// Create array with list as first item
		listarray = [];
		listarray.push(listname);
		
		// Create index with list_index as key, index array as value 
		localStorage.setItem("list_index", JSON.stringify(listarray));
	}
}

function getList(listname){
	list = localStorage.getItem(listname);
	list = JSON.parse(list);
	return list;
}


