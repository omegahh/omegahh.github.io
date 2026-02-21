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
		navigateToSection(null); // Show homepage
		$(this).addClass('active');
		$("#menu-container .homepage").slideDown('slow');
		return false;
	});

	$(".main-menu a.aboutbutton").click(function(){
		navigateToSection('about-section');
		$(this).addClass('active');
		return false;
	});

	$(".main-menu a.projectbutton").click(function(){
		navigateToSection('project-section');
		$(this).addClass('active');
		return false;
	});

	$(".main-menu a.blogbutton").click(function(){
		navigateToSection('blog-section');
		$(this).addClass('active');
		return false;
	});

	$(".main-menu a.contactbutton").click(function(){
		$(this).addClass('active');
		$("#menu-container .content").fadeOut();
		navigateToSection('contact-section');
		$(this).addClass('active');
		return false;
	});

	$('a.toggle-nav').click(function(){
		$('.menu-responsive').slideToggle();
	});

	$('.menu-responsive a').click(function() {
		$('.menu-responsive').slideToggle().hide();
	});

	// Contact form submission handler
	$('#contact-form').on('submit', function(e) {
		e.preventDefault();

		var form = $(this);
		var formData = new FormData(this);
		var statusDiv = $('#form-status');

		// Disable submit button during submission
		form.find('button[type="submit"]').prop('disabled', true).text('Sending...');

		$.ajax({
			url: form.attr('action'),
			method: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			dataType: 'json',
			success: function(response) {
				statusDiv.css({
					'display': 'block',
					'background-color': '#00d4aa',
					'color': '#fff'
				}).text('Thank you! Your message has been sent successfully.');
				form[0].reset();
			},
			error: function(xhr, status, error) {
				statusDiv.css({
					'display': 'block',
					'background-color': '#d00',
					'color': '#fff'
				}).text('Sorry, there was an error sending your message. Please try again or email directly.');
			},
			complete: function() {
				form.find('button[type="submit"]').prop('disabled', false).text('Submit Message');
			}
		});
	});

});

