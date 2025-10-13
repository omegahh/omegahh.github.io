jQuery(document).ready(function($) {

	$(".main-menu a").click(function(){
		var id =  $(this).attr('class');
		id = id.split('-');
		$('a.active').removeClass('active');
    	$(this).addClass('active');

		// Stop fractal animation when leaving contact section
		if (typeof window.stopFractalAnimation === 'function') {
			window.stopFractalAnimation();
		}

		$("#menu-container .content").slideUp('slow');
		$("#menu-container #menu-"+id[1]).slideDown('slow');
		$("#menu-container .homepage").slideUp('slow');
		return false;
	});


	$(".main-menu a.homebutton").click(function(){
		// Stop fractal animation when leaving contact section
		if (typeof window.stopFractalAnimation === 'function') {
			window.stopFractalAnimation();
		}
		$("#menu-container .content").slideUp('slow');
		$("#menu-container .homepage").slideDown('slow');
		return false;
	});

	$(".main-menu a.aboutbutton").click(function(){
		// Stop fractal animation when leaving contact section
		if (typeof window.stopFractalAnimation === 'function') {
			window.stopFractalAnimation();
		}
		$("#menu-container .content").slideUp('slow');
		$("#menu-container .about-section").slideDown('slow');
		return false;
	});

	$(".main-menu a.projectbutton").click(function(){
		// Stop fractal animation when leaving contact section
		if (typeof window.stopFractalAnimation === 'function') {
			window.stopFractalAnimation();
		}
		$("#menu-container .content").slideUp('slow');
		$("#menu-container .project-section").slideDown('slow');
		return false;
	});

	$(".main-menu a.blogbutton").click(function(){
		// Stop fractal animation when leaving contact section
		if (typeof window.stopFractalAnimation === 'function') {
			window.stopFractalAnimation();
		}
		$("#menu-container .content").slideUp('slow');
		$("#menu-container .blog-section").slideDown('slow');
		return false;
	});

	$(".main-menu a.contactbutton").click(function(){
		$("#menu-container .content").fadeOut();
		$("#menu-container .contact-section").slideDown('slow', function() {
			// Start fractal animation when contact section is fully visible
			if (typeof window.startFractalAnimation === 'function') {
				window.startFractalAnimation();
			}
		});
		return false;
	});

	$('a.toggle-nav').click(function(){
		$('.menu-responsive').slideToggle();
	});

	$('.menu-responsive a').click(function() {
		$('.menu-responsive').slideToggle().hide();
	});

	$(".message-button").click(function(){
		alert("Error: Not Support Yet!")
	});

});

