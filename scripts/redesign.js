// The Balloon Attic - redesign extras: header shadow on scroll. The gallery itself is still driven by main.js.
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
})();
