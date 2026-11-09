// The Balloon Attic - redesign extras: header shadow on scroll and the
// Christmas elf pop-up. The gallery itself is still driven by main.js.
(function () {
    'use strict';

    // Header gets a soft shadow once the page has scrolled.
    var header = document.querySelector('.ba-header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Christmas elf arrivals pop-up: shown once per visit, a moment after load
    // so the homepage is seen first. Close with the x, Escape or the backdrop.
    var overlay = document.getElementById('elfOverlay');
    var closeBtn = document.getElementById('elfClose');
    if (!overlay || !closeBtn) return;

    var seen = false;
    try { seen = !!sessionStorage.getItem('elfPopupSeen'); } catch (e) { /* storage blocked */ }
    if (seen) { overlay.remove(); return; }

    var previousFocus = null;

    function closePopup() {
        document.removeEventListener('keydown', onKey);
        overlay.remove();
        if (previousFocus && previousFocus.focus) previousFocus.focus();
    }

    function onKey(e) {
        if (e.key === 'Escape') closePopup();
    }

    setTimeout(function () {
        previousFocus = document.activeElement;
        overlay.hidden = false;
        try { sessionStorage.setItem('elfPopupSeen', 'yes'); } catch (e) { /* ignore */ }
        closeBtn.focus();
        document.addEventListener('keydown', onKey);
    }, 1800);

    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closePopup();
    });
})();
