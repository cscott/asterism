/* Author: C. Scott Ananian
 */

// remap jQuery to $
(function($){
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
            });
	    // redirect if no # target
	    if (window.location.hash=='' ||
		window.location.hash=='#')
		window.location.hash = '#welcome';
	    else
	    // Trigger the event (useful on page load).
		$(window).hashchange();

	    // setup mouse handlers
	    //var main = $('#main');
	    //main.mouseenter(function(e) { physics_mouseenter(e); });
	});
})(this.jQuery);
