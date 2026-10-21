(function() {
    'use strict';
    var dispose = function() {};

    function initializeReading() {
        dispose();
        var page = document.getElementById('page');
        var article = page && page.querySelector('.reading-post .entry-content');
        var sidebar = page && page.querySelector('#secondary');
        var panel = document.getElementById('music-panel');
        var bubble = document.getElementById('music-toggle');
        var frame = 0;
        var toc;
        var observer;
        var links = [];
        var headings = article ? Array.from(article.querySelectorAll('h2, h3, h4')).filter(function(heading) {
            return heading.textContent.trim() && !heading.closest('pre, figure, [hidden]');
        }) : [];
        var mobile = window.matchMedia('(max-width: 959px)');
        var cleanups = [];

        function listen(target, type, handler, options) {
            target.addEventListener(type, handler, options);
            cleanups.push(function() { target.removeEventListener(type, handler, options); });
        }
        function update() {
            frame = 0;
            var occupied = 0;
            [panel, bubble, document.getElementById('music-progress'), document.getElementById('music-status')].forEach(function(element) {
                if (!element || !element.getClientRects().length) return;
                occupied = Math.max(occupied, innerHeight - element.getBoundingClientRect().top);
            });
            document.documentElement.style.setProperty('--reading-bottom', Math.max(0, Math.ceil(occupied)) + 'px');
            if (!links.length) return;
            var current = 0;
            headings.forEach(function(heading, index) {
                if (heading.getBoundingClientRect().top <= 32) current = index;
            });
            links.forEach(function(link, index) {
                if (index === current) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        }
        function schedule() {
            if (!frame) frame = requestAnimationFrame(update);
        }
        listen(window, 'resize', schedule);
        listen(window, 'scroll', schedule, {passive: true});
        var resize = new ResizeObserver(schedule);
        [panel, bubble, document.getElementById('music-status')].forEach(function(element) {
            if (element) resize.observe(element);
        });

        if (headings.length >= 2 && sidebar) {
            // Preserve authored Unicode anchors; only repair missing or colliding IDs.
            var reserved = new Set();
            document.querySelectorAll('[id]').forEach(function(element) {
                if (headings.indexOf(element) === -1) reserved.add(element.id);
            });
            headings.forEach(function(heading, index) {
                var base = heading.id || heading.textContent.trim().replace(/\s+/g, '-');
                var id = base || 'section-' + (index + 1);
                var suffix = 2;
                while (reserved.has(id)) id = base + '-' + suffix++;
                reserved.add(id);
                heading.id = id;
            });
            toc = document.createElement('nav');
            toc.className = 'reading-toc';
            toc.setAttribute('aria-label', '文章目录');
            var title = document.createElement('p');
            title.className = 'reading-toc-title';
            title.textContent = '文章目录';
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'reading-toc-toggle';
            button.textContent = '文章目录';
            button.setAttribute('aria-expanded', 'false');
            var list = document.createElement('ol');
            list.className = 'reading-toc-list';
            var listId = 'reading-toc-list';
            while (document.getElementById(listId)) listId += '-nav';
            list.id = listId;
            button.setAttribute('aria-controls', list.id);
            headings.forEach(function(heading) {
                var item = document.createElement('li');
                var link = document.createElement('a');
                link.href = '#' + encodeURIComponent(heading.id);
                link.textContent = heading.textContent.trim();
                item.className = 'toc-level-' + heading.tagName.slice(1);
                item.appendChild(link);
                list.appendChild(item);
                links.push(link);
                listen(link, 'click', function(event) {
                    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    setOpen(false);
                    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
                    heading.focus({preventScroll: true});
                    // Keep native fragment navigation and the existing PJAX history handling.
                    schedule();
                });
            });
            toc.append(title, button, list);
            function setOpen(open) {
                toc.classList.toggle('is-open', open);
                button.setAttribute('aria-expanded', String(open));
            }
            function place() {
                var focused = toc.contains(document.activeElement);
                setOpen(false);
                if (mobile.matches) document.body.appendChild(toc);
                else sidebar.prepend(toc);
                if (focused) (mobile.matches ? button : links[0]).focus({preventScroll: true});
                schedule();
            }
            listen(button, 'click', function() { setOpen(!toc.classList.contains('is-open')); });
            listen(document, 'keydown', function(event) {
                if (event.key === 'Escape' && mobile.matches && toc.classList.contains('is-open')) {
                    event.preventDefault();
                    setOpen(false);
                    button.focus({preventScroll: true});
                }
            });
            listen(toc, 'focusout', function(event) {
                if (event.relatedTarget && !toc.contains(event.relatedTarget)) setOpen(false);
            });
            listen(mobile, 'change', place);
            page.classList.add('has-reading-toc');
            document.body.classList.add('has-reading-toc');
            place();
            observer = new IntersectionObserver(schedule, {rootMargin: '0px 0px -65% 0px'});
            headings.forEach(function(heading) { observer.observe(heading); });
        }
        update();
        dispose = function() {
            cleanups.forEach(function(cleanup) { cleanup(); });
            resize.disconnect();
            if (observer) observer.disconnect();
            cancelAnimationFrame(frame);
            if (toc) toc.remove();
            if (page) page.classList.remove('has-reading-toc');
            document.body.classList.remove('has-reading-toc');
        };
    }
    initializeReading();
    document.addEventListener('cyan:page-ready', initializeReading);
})();
