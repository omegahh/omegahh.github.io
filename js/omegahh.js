jQuery(document).ready(function($) {

	// Unified navigation handler
	function navigateToSection(sectionClass) {
		// Update active state
		$('a.active').removeClass('active');

		// Stop fractal animation when navigating away from contact
		if (typeof window.stopFractalAnimation === 'function') {
			window.stopFractalAnimation();
		}

		// Hide all sections
		$("#menu-container .content").slideUp('slow');
		$("#menu-container .homepage").slideUp('slow');

		// Show the requested section
		if (sectionClass) {
			$("#menu-container ." + sectionClass).slideDown('slow', function() {
				// Start fractal animation if navigating to contact section
				if (sectionClass === 'contact-section' && typeof window.startFractalAnimation === 'function') {
					window.startFractalAnimation();
				}
			});
		}
	}

	// Navigation button handlers
	$(".main-menu a.homebutton").click(function(){
		$(this).addClass('active');
		navigateToSection(null); // Show homepage
		$("#menu-container .homepage").slideDown('slow');
		return false;
	});

	$(".main-menu a.aboutbutton").click(function(){
		$(this).addClass('active');
		navigateToSection('about-section');
		return false;
	});

	$(".main-menu a.projectbutton").click(function(){
		$(this).addClass('active');
		navigateToSection('project-section');
		return false;
	});

	$(".main-menu a.blogbutton").click(function(){
		$(this).addClass('active');
		navigateToSection('blog-section');
		return false;
	});

	$(".main-menu a.contactbutton").click(function(){
		$(this).addClass('active');
		$("#menu-container .content").fadeOut();
		navigateToSection('contact-section');
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

