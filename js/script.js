/* Author: C. Scott Ananian
 */
WebFontConfig = {
    google: {
	families: [ 'Tangerine:bold', 'Crushed' ]
    },
    // relayout after web fonts are loaded.
    active: function() {
	setTimeout(function() {
	    jQuery('#menu').isotope('reLayout');
	}, 100);
    }
};

// remap jQuery to $
(function($){
    var quiet=true;
    $(document).ready(function(){
            var menu = $('#menu');
	    // set up isotope
            menu.isotope({
		itemSelector: '.item',
		layoutMode : 'fitRows',
	    });

	    $('#pleasewait').hide();
	    // use https://developer.mozilla.org/en/DOM/window.onhashchange
	    // to update physics when we switch pages.
	    var oldsignal = {};
	    $(window).hashchange( function() {
		// filter the top menu based on the hash portion
		var hash = window.location.hash;
		var tophash = hash.replace('#','.').replace(/-.*/, '');
		if (!tophash) tophash="#willnotmatch";
		menu.isotope({ filter: ".top, "+tophash });
		// highlight the proper menu entry
		$('.item a').removeClass('selected');
		$('.item a[href="'+hash+'"]').addClass('selected');
		// rotate the ambigram (but not on first page load)
		if (!quiet)
		    $('.ambigram').toggleClass('upsidedown');
            });
	    // redirect if no # target
	    if (window.location.hash=='' ||
		window.location.hash=='#')
		window.location.hash = '#welcome';
	    else
	    // Trigger the event (useful on page load).
		$(window).hashchange();

	    setTimeout(function() {
		// only animate the ambigram after initial delay
		quiet = false;
	    }, 2000);
	});
})(this.jQuery);

// load webfont (note that WebFontConfig must be defined first)
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();
