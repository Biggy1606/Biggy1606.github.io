$(document).ready(function() {
	var NavY = $('.bar-menu').offset().top;
	
	var stickyNav = function() {
		var ScrollY = $(window).scrollTop();
		if (ScrollY > NavY) {
			$('.bar-menu').addClass('sticky');
			$('.fill').addClass('show-fill');
		}
		else {
			$('.bar-menu').removeClass('sticky');
			$('.fill').removeClass('show-fill');
		}
	};
	
	stickyNav();
	
	$(window).scroll(function() {
		stickyNav();
	});
});
