(function() {
    'use strict';
    var player = document.getElementById('site-music-player');
    if (!player) return;
    var toggle = document.getElementById('music-toggle');
    var panel = document.getElementById('music-panel');
    var close = document.getElementById('music-close');

    function syncButtons() {
        document.querySelectorAll('[data-music-open]').forEach(function(button) {
            button.setAttribute('aria-expanded', String(!panel.hidden));
        });
    }
    function setOpen(open) {
        panel.hidden = !open;
        toggle.hidden = open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? '收起音乐播放器' : '展开音乐播放器');
        document.body.classList.toggle('music-is-open', open);
        syncButtons();
        (open ? close : toggle).focus({preventScroll: true});
    }
    toggle.addEventListener('click', function() { setOpen(true); });
    close.addEventListener('click', function() { setOpen(false); });
    player.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !panel.hidden) {
            event.preventDefault();
            setOpen(false);
        }
    });
    document.addEventListener('click', function(event) {
        if (event.target.closest('[data-music-open]')) setOpen(true);
    });
    document.addEventListener('cyan:page-ready', syncButtons);
})();
