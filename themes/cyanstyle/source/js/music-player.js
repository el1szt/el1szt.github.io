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

(function() {
  'use strict';

  var audio = document.getElementById('site-audio');
  var play = document.getElementById('music-play');
  var progress = document.getElementById('music-progress');
  var time = document.getElementById('music-time');
  var back = document.getElementById('music-back');
  var forward = document.getElementById('music-forward');
  var status = document.getElementById('music-status');

  if (!audio || !play || !progress || !time ||
      !back || !forward || !status) return;

  var seeking = false;
  var playPending = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

    var total = Math.floor(seconds);
    return Math.floor(total / 60) + ':' +
      String(total % 60).padStart(2, '0');
  }

  function hasDuration() {
    return Number.isFinite(audio.duration) && audio.duration > 0;
  }

  function updateTime() {
    var duration = hasDuration() ? audio.duration : 0;
    var current = seeking && duration
      ? Number(progress.value) / 1000 * duration
      : audio.currentTime;

    time.textContent =
      formatTime(current) + ' / ' + formatTime(duration);

    progress.disabled = !duration;
    back.disabled = !duration;
    forward.disabled = !duration;

    if (!seeking) {
      progress.value = duration
        ? String(Math.round(audio.currentTime / duration * 1000))
        : '0';
    }

    progress.setAttribute(
      'aria-valuetext',
      formatTime(current) + '，总时长 ' + formatTime(duration)
    );
  }

  function updatePlay() {
    var paused = audio.paused;
    play.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
    play.setAttribute('aria-label', paused ? '播放' : '暂停');
    play.title = paused ? '播放' : '暂停';
  }

  play.addEventListener('click', async function() {
    if (playPending) return;

    status.textContent = '';

    if (!audio.paused) {
      audio.pause();
      return;
    }

    playPending = true;
    play.disabled = true;

    try {
      await audio.play();
    } catch (error) {
      status.textContent = '播放失败，请检查音频地址或网络后重试。';
      console.warn('Music playback failed:', error);
    } finally {
      playPending = false;
      play.disabled = false;
      updatePlay();
    }
  });

  progress.addEventListener('input', function() {
    seeking = true;
    updateTime();
  });

  progress.addEventListener('change', function() {
    if (hasDuration()) {
      audio.currentTime =
        Number(progress.value) / 1000 * audio.duration;
    }
    seeking = false;
    updateTime();
  });

  function cancelSeekPreview() {
    seeking = false;
    updateTime();
  }

  progress.addEventListener('pointercancel', cancelSeekPreview);
  progress.addEventListener('blur', cancelSeekPreview);

  function skip(seconds) {
    if (!hasDuration()) return;

    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration, audio.currentTime + seconds)
    );

    updateTime();
  }

  back.addEventListener('click', function() { skip(-10); });
  forward.addEventListener('click', function() { skip(10); });

  ['loadedmetadata', 'durationchange', 'timeupdate', 'emptied']
    .forEach(function(eventName) {
      audio.addEventListener(eventName, updateTime);
    });

  ['play', 'pause', 'ended'].forEach(function(eventName) {
    audio.addEventListener(eventName, updatePlay);
  });

  audio.addEventListener('playing', function() {
    status.textContent = '';
  });

  audio.addEventListener('error', function() {
    status.textContent = '音频加载失败，请检查音乐文件是否已上传。';
    updatePlay();
  });

  updateTime();
  updatePlay();
})();
