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
/* from smart bootstrap */
/* ------------------ Image Overlay ----------------- */

jQuery(document).ready(function() {

	$('.picture a').hover(function() {
		$(this).find('.image-overlay-zoom, .image-overlay-link').stop().fadeTo('fast', 1);
	}, function() {
		$(this).find('.image-overlay-zoom, .image-overlay-link').stop().fadeTo('fast', 0);
	});

});

/* -------------------- Isotope --------------------- */

jQuery(document).ready(function() {

	$('#portfolio-wrapper').imagesLoaded(function() {

		var $container = $('#portfolio-wrapper');
		$select = $('#filters select');

		// initialize Isotope
		$container.isotope({
			// options...
			resizable : false, // disable normal resizing
			// set columnWidth to a percentage of container width
			masonry : {
				columnWidth : $container.width() / 12
			}
		});

		// update columnWidth on window resize
		$(window).smartresize(function() {

			$container.isotope({
				// update columnWidth to a percentage of container width
				masonry : {
					columnWidth : $container.width() / 12
				}
			});
		});

		$container.isotope({
			itemSelector : '.portfolio-item'
		});

		$select.change(function() {

			var filters = $(this).val();

			$container.isotope({
				filter : filters
			});

		});

		var $optionSets = $('#filters .option-set'), $optionLinks = $optionSets.find('a');

		$optionLinks.click(function() {

			var $this = $(this);
			// don't proceed if already selected
			if ($this.hasClass('selected')) {
				return false;
			}
			var $optionSet = $this.parents('.option-set');
			$optionSet.find('.selected').removeClass('selected');
			$this.addClass('selected');

			// make option object dynamically, i.e. { filter: '.my-filter-class' }
			var options = {}, key = $optionSet.attr('data-option-key'), value = $this.attr('data-option-value');
			// parse 'false' as false boolean
			value = value === 'false' ? false : value;
			options[key] = value;
			if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
				// changes in layout modes need extra logic
				changeLayoutMode($this, options)
			} else {
				// otherwise, apply new options
				$container.isotope(options);
			}

			return false;

		});

	});

});





