
/*** This function handles all the API stuff. It takes in terms and a location 
	 as inputs and returns a JSONP object as output.                  ***/

function yelp_api_get(terms, near, offset, sort, category_filter, radius_filter, tl_lat, tl_long, br_lat, br_long, callback){
	
	var respo = [];
	var auth = { 
			
	  // Set #1	
	   consumerKey: "02S2W1qbJK7NPYyckezZxw", 
	   consumerSecret: "tLlCcTEp71HMQq9RKDrc282_0oQ",
	   accessToken: "8Eer0PGIp4OfmATqsblPJGsO-v1oBdPC",
	   accessTokenSecret: "ZmNZIytfkbyAS4aUUFwB6ZmoFl4", 
	  
	  // Set #2
	  //consumerKey: "fKqvDvDUVAv371YEG9dEYQ", 
	  //consumerSecret: "I2TkNzqCMmgoIZGkjwIrQyHE9i8",
	  //accessToken: "uH9VOjPKzdryWW8SPuJdzGPseml4gotI",
	  //accessTokenSecret: "Attj9cutGfOpaC8Je13sqdssJO8",
	
	  serviceProvider: { 
	    signatureMethod: "HMAC-SHA1"
	  }
	};

	var accessor = {
	  consumerSecret: auth.consumerSecret,
	  tokenSecret: auth.accessTokenSecret
	};

	var parameters = [];
	parameters.push(['term', terms]);
	parameters.push(['location', near]);
	// Check optional params
	if(offset!=0){
		parameters.push(['offset', offset]);
	}
	if(sort!=0){
		parameters.push(['sort', sort]);
	}
	if(category_filter!=""){
		parameters.push(['category_filter', category_filter]);
	}
	if(radius_filter!=""){
		parameters.push(['radius_filter', radius_filter]);
	}
	if(tl_lat!=""){
		parameters.push(['tl_lat', tl_lat]);
		parameters.push(['tl_long', tl_lat]);
		parameters.push(['br_lat', br_lat]);
		parameters.push(['br_long', br_lat]);
	}
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

	var message = { 
	  'action': 'http://api.yelp.com/v2/search',
	  'method': 'GET',
	  'parameters': parameters 
	};

	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);

	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
	console.log(parameterMap);

	$.ajax({
	  'url': message.action,
	  'data': parameterMap,
	  'cache': true,
	  'dataType': 'jsonp',
	  //'jsonpCallback': 'cb',
	  'success': callback,	
	   error: function(request,error) {
		      	alert('An error occurred');
		        // console.log(request, error);
		      }
	});

	return true;	
}







