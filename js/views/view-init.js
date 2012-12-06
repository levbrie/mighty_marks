
/* 
 * Sets the font style to normal when "Price" is displayed on main filters button group
 * and to italic otherwise (so "expensive", for example, will be in italics)
 */
function changeTargetFont() {
	var textTarget = document.getElementById('mouseover-target');
	if (textTarget.innerHTML == 'Price') {
		textTarget.style.fontStyle = "normal";
	} else {
		textTarget.style.fontStyle = "italic";
	}
}

$(document).ready(function() {

	/* ---------- Star Rating ---------- */
	$('#raty').raty({
		// cancel : true,
		// cancelOff : 'cancel-off-big.png',
		// cancelOn  : 'cancel-on-big.png',
		number : 4, // number of stars to present
		hints : ['cheap', 'inexpensive', 'expensive', 'very expensive'],
		// cancelHint : 'Price',
		click : function(score, evt) {
			$(this).fadeOut(function() {
				$(this).fadeIn();
			});
			changeTargetFont();
		},
		targetKeep : true,
		starOn : 'ratings/dollar-on-green-lt.png', // star on is a dollar in this case
		starOff : 'ratings/dollar-off-gray.png', // star off is off dollar
		space : false, // no space between icons
		target : '#mouseover-target',
		targetText : 'Price'
	});

});
