(function() {
    'use strict';
    if (!window.fetch || !window.AbortController || !window.history.pushState) return;
    var page = document.getElementById('page');
    if (!page) return;
    var controller;
    var sequence = 0;
    var renderedURL = new URL(location.href);
    var entry = 0;
    var positions = new Map();
    var transitioning = false;
    var restoring = false;
    var metadata = 'meta[name="description"], meta[name="keywords"], meta[name="robots"], ' +
        'meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"], ' +
        'meta[property^="twitter:"], link[rel="canonical"], link[rel="prev"], link[rel="next"]';

    function stateWithPosition(id) {
        return Object.assign({}, history.state, {cyanNavigation: {id: id, x: scrollX, y: scrollY}});
    }
    history.replaceState(stateWithPosition(entry), '', location.href);
    history.scrollRestoration = 'manual';
    function rememberPosition() {
        if (transitioning || restoring) return;
        positions.set(entry, {x: scrollX, y: scrollY});
    }
    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function(type) {
        window.addEventListener(type, function() { restoring = false; }, {passive: true});
    });
    window.addEventListener('scroll', rememberPosition, {passive: true});
    window.addEventListener('pagehide', function() {
        history.replaceState(stateWithPosition(entry), '', location.href);
    });

    function cancelPending() {
        sequence++;
        if (controller) controller.abort();
        page.removeAttribute('aria-busy');
    }
    function moveTo(url, position, focus) {
        var target = document.getElementById('content');
        if (url.hash) {
            var name;
            try { name = decodeURIComponent(url.hash.slice(1)); }
            catch (error) { name = url.hash.slice(1); }
            target = document.getElementById(name) || document.getElementsByName(name)[0] || target;
        }
        if (focus && target && !document.getElementById('site-music-player')?.contains(document.activeElement)) {
            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({preventScroll: true});
        }
        if (position) window.scrollTo(position.x, position.y);
        else if (url.hash && target) target.scrollIntoView();
        else window.scrollTo(0, 0);
    }
    function internalHTML(url) {
        return url.origin === location.origin && /^https?:$/.test(url.protocol) &&
            !url.username && !url.password &&
            !/\/(?:music|images|downloads|css|js|fancybox)(?:\/|$)/i.test(url.pathname) &&
            !/\.(?!html?$)[^/]+$/i.test(url.pathname);
    }
    async function navigate(url, state, isPop) {
        if (!transitioning) rememberPosition();
        cancelPending();
        transitioning = true;
        var request = sequence;
        controller = new AbortController();
        var signal = controller.signal;
        var timeout = setTimeout(function() { controllerForRequest.abort(); }, 12000);
        var controllerForRequest = controller;
        page.setAttribute('aria-busy', 'true');
        try {
            var response = await fetch(url.href, {signal: signal, credentials: 'same-origin', headers: {Accept: 'text/html'}});
            if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
                throw new Error('Not an HTML page');
            }
            var destination = new URL(response.url);
            destination.hash = url.hash;
            if (!internalHTML(destination) || (isPop && destination.pathname !== url.pathname)) {
                throw new Error('Unexpected navigation redirect');
            }
            var doc = new DOMParser().parseFromString(await response.text(), 'text/html');
            var next = doc.getElementById('page');
            if (!next || doc.querySelectorAll('#page').length !== 1 || !next.querySelector('#content') ||
                !next.querySelector('#site-navigation') || !doc.querySelector('title') || doc.querySelector('base') ||
                next.querySelector('script, #site-audio, #site-music-player, .ds-thread') ||
                !doc.querySelector('script[src$="/js/page-navigation.js"]')) {
                throw new Error('Page needs a full navigation');
            }
            if (request !== sequence) return;
            if (window.jQuery && window.jQuery.fancybox) window.jQuery.fancybox.close(true);
            if (!isPop) {
                if (location.pathname === renderedURL.pathname && location.search === renderedURL.search) {
                    history.replaceState(stateWithPosition(entry), '', location.href);
                }
                entry = Date.now() + Math.random();
                history.pushState({cyanNavigation: {id: entry, x: 0, y: 0}}, '', destination.href);
            } else {
                entry = state.id;
            }
            var previous = page;
            previous.replaceWith(next);
            page = next;
            if (window.jQuery) window.jQuery(previous).remove();
            document.title = doc.title;
            document.head.querySelectorAll(metadata).forEach(function(node) { node.remove(); });
            doc.head.querySelectorAll(metadata).forEach(function(node) {
                document.head.appendChild(document.importNode(node, true));
            });
            renderedURL = destination;
            transitioning = false;
            document.dispatchEvent(new CustomEvent('cyan:page-ready'));
            var position = isPop ? (positions.get(entry) || state) : null;
            restoring = Boolean(position);
            moveTo(destination, position, true);
            // Images can change page height after history restoration.
            page.querySelectorAll('img').forEach(function(image) {
                image.addEventListener('load', function() {
                    if (request === sequence && restoring && position) {
                        window.scrollTo(position.x, position.y);
                    }
                }, {once: true});
            });
        } catch (error) {
            if (request !== sequence) return;
            console.warn('Internal navigation falling back to a full page load:', error.message);
            location.assign(url.href);
        } finally {
            clearTimeout(timeout);
            if (request === sequence) page.removeAttribute('aria-busy');
        }
    }
    document.addEventListener('click', function(event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        var link = event.target.closest('a[href]');
        if (!link || link.hasAttribute('target') || link.hasAttribute('download') ||
            link.hasAttribute('ping') || link.relList.contains('external') ||
            link.closest('#site-music-player, .fancybox, [data-fancybox], [data-no-navigation], [contenteditable="true"]')) return;
        var href = link.getAttribute('href');
        if (!href) return;
        var url = new URL(href, renderedURL.href);
        if (!internalHTML(url)) return;
        if (url.pathname === renderedURL.pathname && url.search === renderedURL.search && url.hash) {
            if (location.pathname !== renderedURL.pathname || location.search !== renderedURL.search) {
                event.preventDefault();
                navigate(url, null, false);
                return;
            }
            rememberPosition();
            cancelPending();
            transitioning = false;
            return;
        }
        event.preventDefault();
        navigate(url, null, false);
    });
    window.addEventListener('popstate', function(event) {
        rememberPosition();
        var url = new URL(location.href);
        var state = event.state && event.state.cyanNavigation;
        if (url.pathname === renderedURL.pathname && url.search === renderedURL.search) {
            cancelPending();
            transitioning = false;
            if (state) {
                entry = state.id;
                moveTo(url, positions.get(entry) || state, false);
            } else {
                entry = Date.now() + Math.random();
                moveTo(url, null, false);
                history.replaceState(stateWithPosition(entry), '', location.href);
            }
            renderedURL = url;
            return;
        }
        if (!state) { location.reload(); return; }
        navigate(url, state, true);
    });
})();
