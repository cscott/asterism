/* Author: C. Scott Ananian
 */

// remap jQuery to $
(function($){
    $(document).ready(function(){
	    $('#pleasewait').hide();
	    // use https://developer.mozilla.org/en/DOM/window.onhashchange
	    // to update physics when we switch pages.
	    var oldsignal = {};
	    $(window).hashchange( function() {
                    /*
		    // stop old physics world
		    oldsignal.stop = true;
		    */

		    // fade in new content
		    //$('#content').hide().fadeIn();

		    /*
		    // start up new physics world after a short delay (to
		    // allow css relayout to occur)

		    window.setTimeout(function() {
			    oldsignal = page_init($);
			}, 1);
                    */
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
