/**
 * Handles toggling the navigation menu for small screens and
 * accessibility for submenu items.
 */
(function() {
	function initializeNavigation() {
	var nav = document.getElementById('site-navigation'),
		button, menu;
	if (!nav) {
		return;
	}
	button = nav.getElementsByTagName('button')[0];
	menu = nav.getElementsByTagName('ul')[0];
	if (!button) {
		return;
	}
	// Hide button if menu is missing or empty.
	if (!menu || !menu.childNodes.length) {
		button.style.display = 'none';
		return;
	}
	button.onclick = function() {
		if (-1 === menu.className.indexOf('nav-menu')) {
			menu.className = 'nav-menu';
		}
		if (-1 !== button.className.indexOf('toggled-on')) {
			button.className = button.className.replace(' toggled-on', '');
			menu.className = menu.className.replace(' toggled-on', '');
		} else {
			button.className += ' toggled-on';
			menu.className += ' toggled-on';
		}
		button.setAttribute('aria-expanded', String(menu.classList.contains('toggled-on')));
	};
	button.setAttribute('aria-controls', menu.id);
	button.setAttribute('aria-expanded', String(menu.classList.contains('toggled-on')));
	}
	initializeNavigation();
	document.addEventListener('cyan:page-ready', initializeNavigation);
})();
// Better focus for hidden submenu items for accessibility.
(function($) {
	$(document).on('focusin.twentytwelve focusout.twentytwelve', '.main-navigation a', function(event) {
		$(this).parents('.menu-item, .page_item').toggleClass('focus', event.type === 'focusin');
	});
	if ('ontouchstart' in window) {
		$('body').on('touchstart.twentytwelve', '.menu-item-has-children > a, .page_item_has_children > a', function(e) {
			var el = $(this).parent('li');
			if (!el.hasClass('focus')) {
				e.preventDefault();
				el.toggleClass('focus');
				el.siblings('.focus').removeClass('focus');
			}
		});
	}
})(jQuery);
