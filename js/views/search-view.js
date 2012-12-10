			jQuery(function($) {// !!IMPORTANT: using failsafe $ alias to ensure jQuery loading
				jQuery(document).ready(function() {
					// let's add in all of the yelp categories to our select box
					// (in the future let's use mustache templates)
					$.getJSON('./json/category.json', function(data) {
						var str = JSON.stringify(data, undefined, 2);
						$("#native-json").append(str);
						var jtext = "<option value=''></option>";
						$.each(data, function(key, val) {
							jtext += "<option class='opt-cat-level1'>" + val.title + "</option>";
							// jtext += " CATEGORY: " + val.title + " ";
							// jtext += " ALIAS: " + val.alias + " ";

							$.each(val.category, function(k, v) {
								if (v.category) {
									jtext += "<option class='opt-cat-level2'>" + v.title + "</option>";
									$.each(v.category, function(thirdKey, thirdVal) {
										jtext += "<option class='opt-single-cat'>" + thirdVal.title + "</option>";
									});
								} else {
									jtext += "<option class='opt-single-cat'>" + v.title + "</option>";
								}
							});
							// jtext += "</optgroup>";

						});
						$(".chzn-select").html(jtext);
						$(".chzn-select").chosen();
						$(".chzn-choices").addClass("search-query span4");

			
			
			// had to place here so everything could load and then we could create listeners
			// must move soon!!
			// var butt = document.getElementById("searchButton");
			// alert("THERE");
			// function handleSearchSubmit() {
				// alert("BUTTON CLICKED");
			// }
// 
// 
			// butt.onclick = handleSearchSubmit;
// 			
// 
			// $('#searchButton').live('click', function() {
				// alert("click");
				// // search($('#search').val());
			// });

			jQuery(function($) {			
				$('#searchButton').click(function(jQEvent) { // jQEvent added for isotope
					// isotope stuff 
					var $container = $('#grid-wrapper');
					$container.isotope({
						itemSelector : '.element'
					}); 
					// end isotope
					// var selector = $(this).attr('data-option-value');
					var selector = ".nature";
					// isotope stuff
					var $removable = $container.find(selector);
					$container.isotope('remove', $removable);
					jQEvent.preventDefault(); 
					// end isotope stuff
					alert("WORKING");
					$('.result-selected').each(function(index, value) { 	// loop through each element of class .result-selected
						alert("ALERT " + value.innerHTML);					// print whatever element holds
						alert("SEARCH FOR: " + searchTermToUse);				
					});
					search(searchTermToUse);
				});
			});
			// search when user hits return
			jQuery(function($) {
				$(".default").keypress(function(event) {
					if (event.which == 13) {
						$('.result-selected').each(function(index, value) {
							alert("ALERT " + value.innerHTML);
						});
						(searchTermToUse);
						return false;
					}
				}); 
			});
			
// 
      // $('#removable a').click( function( jQEvent ) {
        // var selector = $(this).attr('data-option-value');
        // var $removable = $container.find( selector );
        // $container.isotope( 'remove', $removable );
        // jQEvent.preventDefault();
      // });

					});

					// $(".chzn-select").chosen();
					// // start chosen for enable multi-select in search form
					// $(".chzn-choices").addClass("search-query span4");


					// test class to parse json and print it
					// $.getJSON('./json/category.json', function(data) {
						// var str = JSON.stringify(data, undefined, 2);
						// $("#native-json").append(str);
						// var jtext = "";
						// $.each(data, function(key, val) {
							// console.log("key=" + key + " " + "val=" + val);
							// jtext += "key=" + key + " " + "val=" + val;
							// jtext += " CATEGORY: " + val.title + " ";
							// jtext += " ALIAS: " + val.alias + " ";
							// $.each(val.category, function(k, v) {
								// jtext += " SUB-CATEGORY: " + v.title + " ";
								// jtext += " SUB-ALIAS: " + v.alias + " ";
								// if (v.category) {
									// $.each(v.category, function(thirdKey, thirdVal) {
										// jtext += " THIRD-CATEGORY: " + thirdVal.title + " ";
										// jtext += " THIRD-ALIAS: " + thirdVal.alias + " ";
										// if (thirdVal.category) {
											// jtext += " OBJECT: " + thirdVal.category + " ";
											// $.each(thirdVal.category, function(fourthKey, fourthVal) {// shouldn't be a fourth level
												// jtext += " FOURTH-CATEGORY: " + fourthVal.title + " ";
												// jtext += " FOURTH-ALIAS: " + fourthVal.alias + " ";
											// });
										// }
									// });
								// }
							// });
						// });
// 
						// document.getElementById('json-holder').innerHTML = jtext;
					// });

				})
			});