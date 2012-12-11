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
	

	/* ************ TOOLTIPS AND POPOVERS *************** */
	// $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({"placement":"bottom",delay: { show: 400, hide: 200 }});
	// $('[rel="popover"],[data-rel="popover"]').popover();
	// tooltip demo
    $('.tooltip-demo').tooltip({
      selector: "a[rel=tooltip]"
    })
    $('.tooltip-test').tooltip()
    $('.popover-anchor').popover()
    // popover demo
    $("a[rel=popover]")
      .popover()
      .click(function(e) {
        e.preventDefault()		// prevents browser from moving window to top of page (because of href="#")
      })
      

/* STRINGIFY AND PRINT OUT JSON */
var str = JSON.stringify(data, undefined, 2);
			$("#native-json").append(str);