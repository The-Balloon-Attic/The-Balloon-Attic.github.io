// The Balloon Attic - JavaScript Functionality

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initializeScrollReveal();
    initializeImageGallery();
    initializeCurrentYear();
    initializeLazyLoading();
    initializeSmoothScrolling();
});

// Scroll Reveal Animation using Intersection Observer
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with reveal-on-scroll class
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Folder-Scoped Gallery — one balloon "highlight" per occasion, each opening
// the lightbox on just its own photos. There's no separate "browse everything"
// view; this *is* the gallery, matching how Instagram highlights work.
function initializeImageGallery() {
    // Gallery state
    let folderImages = {};          // category slug -> ordered image list (newest first)
    let modalImageList = [];        // The list the open modal is currently navigating
    let modalCategory = '';         // category slug for the open modal, used to build image paths
    let modalCategoryLabel = '';    // Human-readable category name, used for modal alt text
    let modalCurrentIndex = 0;

    // Category folders shown as balloon "highlights". Order here doesn't drive
    // display order (the HTML/CSS does) — it's only used to validate the manifest.
    const CATEGORY_SLUGS = [
        'birthdays', 'christenings', 'special-days', 'events',
        'weddings', 'easter', 'christmas', 'halloween'
    ];

    const ALLOWED_EXTENSIONS = new Set(['jpeg', 'jpg', 'png', 'webp', 'gif', 'avif']);

    // DOM elements
    const modal = document.getElementById('image-modal');
    const modalContent = modal ? modal.querySelector('.modal-content') : null;
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.querySelector('.modal-close');
    const modalPrevBtn = document.getElementById('modal-prev');
    const modalNextBtn = document.getElementById('modal-next');
    const modalIndicators = document.getElementById('modal-indicators');
    const modalGridToggle = document.getElementById('modal-grid-toggle');
    const folderBalloons = document.querySelectorAll('.folder-balloon[data-category]');

    // Content that sits behind the modal — made inert while it's open so
    // background text/links are excluded from tab order and the
    // accessibility tree (rather than just visually obscured), matching how
    // a true modal dialog should behave.
    const backgroundContent = [
        document.querySelector('main'),
        document.querySelector('footer'),
        document.querySelector('.whatsapp-floating-btn'),
    ].filter(Boolean);

    // Category grid view — one shared overlay (#category-grid-modal) reused by
    // every folder highlight; it always reflects whatever category is
    // currently open in the lightbox above, rather than being rebuilt per
    // category in markup or code.
    const gridModal = document.getElementById('category-grid-modal');
    const gridModalClose = document.getElementById('grid-modal-close');
    const gridContainer = document.getElementById('grid-container');
    let gridTransitioning = false;

    // "Fly" open transition (shared-element/FLIP) from a clicked folder
    // balloon into the centered lightbox — see flyModalOpen() below. Tracked
    // here so closeModal() can cancel a flight that's still in progress
    // (e.g. Escape pressed immediately after opening) and updateModalImage()
    // can avoid resizing the box out from under the flight animation.
    let cancelActiveFlight = null;
    let pendingImageReveal = null;
    let shimmerDelayTimer = null;

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function isImageFilename(name) {
        if (typeof name !== 'string') return false;
        const ext = name.split('.').pop()?.toLowerCase();
        return !!ext && ALLOWED_EXTENSIONS.has(ext);
    }

    // Sort by the numeric part of the filename, newest (highest number) first.
    function sortByImageNumber(list) {
        return [...list].sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
            const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
            return numB - numA;
        });
    }

    function normalizeManifest(data) {
        // Backward compatibility: an older flat-array manifest means nothing
        // is categorized yet — every folder balloon stays hidden.
        const manifest = Array.isArray(data) ? {} : (data || {});
        const result = {};
        CATEGORY_SLUGS.forEach((slug) => {
            const list = Array.isArray(manifest[slug]) ? manifest[slug] : [];
            result[slug] = list.filter(isImageFilename);
        });
        return result;
    }

    // Load the auto-generated manifest (see scripts/generate-manifest.js).
    // Returns { [categorySlug]: string[] }.
    //
    // Primary source: window.__GALLERY_MANIFEST__, set by the auto-generated
    // <script src="assets/images/manifest.js">. Being a plain script tag (not
    // a fetch()'d JSON file), it loads the same way whether index.html is
    // opened directly via file://, from a local server, or on GitHub Pages —
    // Chrome and other browsers block fetch()/XHR of file:// URLs, but not
    // <script src> of them, so this is what lets the gallery work with zero
    // local server.
    //
    // Fallback: fetch assets/images/manifest.json, in case manifest.js failed
    // to load for some other reason (e.g. aggressive script blocking). If
    // neither is available, every category comes back empty and simply stays
    // out of the highlights row.
    async function loadManifest() {
        if (window.__GALLERY_MANIFEST__ && typeof window.__GALLERY_MANIFEST__ === 'object') {
            const result = normalizeManifest(window.__GALLERY_MANIFEST__);
            const total = Object.values(result).reduce((sum, list) => sum + list.length, 0);
            console.log(`🎨 Loaded ${total} categorized images across ${CATEGORY_SLUGS.length} folders (inline manifest)`);
            return result;
        }

        try {
            const response = await fetch('assets/images/manifest.json', { cache: 'no-cache' });

            if (!response.ok) {
                throw new Error(`Manifest fetch failed with status ${response.status}`);
            }

            const result = normalizeManifest(await response.json());
            const total = Object.values(result).reduce((sum, list) => sum + list.length, 0);
            console.log(`🎨 Loaded ${total} categorized images across ${CATEGORY_SLUGS.length} folders (fetched manifest)`);
            return result;
        } catch (error) {
            console.warn('⚠️ Could not load the gallery manifest — folder highlights will stay hidden until it can be reached.', error);
            const result = {};
            CATEGORY_SLUGS.forEach((slug) => { result[slug] = []; });
            return result;
        }
    }

    // Initialize gallery
    loadGalleryImages();

    async function loadGalleryImages() {
        const manifest = await loadManifest();

        folderImages = {};
        CATEGORY_SLUGS.forEach((slug) => {
            folderImages[slug] = sortByImageNumber(manifest[slug] || []);
        });

        populateFolderHighlights();
        setupEventListeners();
    }

    // Wire up the folder-highlight balloons: set their thumbnail and open the
    // modal scoped to just that folder's images when clicked. A category with
    // no photos yet is removed from the row entirely — no placeholder shown.
    function populateFolderHighlights() {
        folderBalloons.forEach((button) => {
            const category = button.getAttribute('data-category');
            const images = folderImages[category] || [];
            const listItem = button.closest('.folder-highlights-item');
            const labelEl = button.querySelector('.folder-balloon-label');
            const label = labelEl ? labelEl.textContent.trim() : category;

            if (images.length === 0) {
                if (listItem) listItem.hidden = true;
                return;
            }

            if (listItem) listItem.hidden = false;
            button.classList.add('has-photos');
            button.setAttribute('aria-label', `${label} — ${images.length} photo${images.length === 1 ? '' : 's'}`);

            const thumb = button.querySelector('.folder-balloon-thumb');
            if (thumb) {
                thumb.addEventListener('load', () => thumb.classList.add('thumb-loaded'), { once: true });
                thumb.src = `assets/images/${category}/${images[0]}`;
            }

            const shape = button.querySelector('.folder-balloon-shape');

            button.addEventListener('click', () => {
                // Quick squash-and-settle on the balloon itself, echoing the
                // balloon motif and giving instant click feedback while the
                // lightbox flies open. Restart-safe for rapid re-clicks.
                if (shape && !prefersReducedMotion()) {
                    shape.classList.remove('popping');
                    void shape.offsetWidth; // force reflow so the animation restarts
                    shape.classList.add('popping');
                    shape.addEventListener('animationend', () => {
                        shape.classList.remove('popping');
                    }, { once: true });
                }

                openModal(0, images, category, label, { shape, thumb });
            });
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Keyboard navigation only matters while the lightbox is open — there's
        // no page-level carousel to drive with arrow keys anymore.
        document.addEventListener('keydown', handleKeyDown);

        // Modal close
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });

            // Touch/swipe events for modal
            modal.addEventListener('touchstart', handleModalTouchStart, { passive: true });
            modal.addEventListener('touchmove', handleModalTouchMove, { passive: false });
            modal.addEventListener('touchend', handleModalTouchEnd, { passive: true });
        }

        // Modal navigation buttons
        if (modalPrevBtn) {
            modalPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateModalPrev();
            });
        }
        if (modalNextBtn) {
            modalNextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateModalNext();
            });
        }

        // Category grid view
        if (modalGridToggle) {
            modalGridToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                openCategoryGrid();
            });
        }
        if (gridModalClose) {
            gridModalClose.addEventListener('click', closeCategoryGrid);
        }
        if (gridModal) {
            gridModal.addEventListener('click', (e) => {
                if (e.target === gridModal) {
                    closeCategoryGrid();
                }
            });
        }
    }

    // Modal touch/swipe handling
    let modalStartX = 0;
    let modalCurrentX = 0;

    function handleModalTouchStart(e) {
        modalStartX = e.touches[0].clientX;
        modalCurrentX = modalStartX;
    }

    function handleModalTouchMove(e) {
        if (modalStartX === 0) return;

        modalCurrentX = e.touches[0].clientX;
        const diffX = modalStartX - modalCurrentX;

        if (Math.abs(diffX) > 10) {
            e.preventDefault();
        }
    }

    function handleModalTouchEnd() {
        if (modalStartX === 0) return;

        const diffX = modalStartX - modalCurrentX;

        // Minimum swipe distance
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swiped left, go to next
                navigateModalNext();
            } else {
                // Swiped right, go to previous
                navigateModalPrev();
            }
        }

        // Reset
        modalStartX = 0;
        modalCurrentX = 0;
    }

    // Keyboard navigation — the grid view sits on top of the lightbox, so it
    // takes priority (Escape closes it first, back to the lightbox) before
    // falling through to the lightbox's own prev/next/close handling.
    function handleKeyDown(e) {
        if (gridModal && gridModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeCategoryGrid();
            }
            return;
        }

        if (!modal.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                navigateModalPrev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateModalNext();
                break;
        }
    }

    // Modal functionality with navigation, always scoped to one folder's photos.
    // `origin` (optional) is the { shape, thumb } elements of the folder
    // balloon that was clicked, used to fly the lightbox open from that
    // balloon's actual on-screen position instead of just fading in centered.
    function openModal(index, imageList, category, categoryLabel, origin) {
        modalImageList = imageList;
        modalCategory = category;
        modalCategoryLabel = categoryLabel;
        modalCurrentIndex = index;
        buildModalIndicators();
        modal.setAttribute('aria-label', `${categoryLabel} photos`);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        backgroundContent.forEach((el) => { el.inert = true; });

        updateModalImage({ isInitialOpen: true });

        const originRect = origin && origin.shape ? origin.shape.getBoundingClientRect() : null;
        const thumbSrc = origin && origin.thumb && origin.thumb.currentSrc
            ? origin.thumb.currentSrc
            : (origin && origin.thumb ? origin.thumb.src : null);

        if (originRect && originRect.width > 0 && thumbSrc && !prefersReducedMotion()) {
            flyModalOpen(originRect, thumbSrc);
        } else {
            // Fallback: plain fade/scale entrance (CSS keyframes), used when
            // there's no click origin to fly from, or motion is reduced.
            modal.classList.add('enter-fade');
            if (modalContent) modalContent.classList.add('enter-scale');
        }

        // Focus the close button for accessibility
        if (modalClose) modalClose.focus();
    }

    // Shared-element ("FLIP") open transition: the lightbox's image box
    // starts exactly at the clicked balloon's position/size/roundness,
    // showing that balloon's own thumbnail photo, then animates to the
    // lightbox's centered position. Since the balloon thumbnail is always
    // the same file as photo index 0 (see populateFolderHighlights), what's
    // "flying" is genuinely the same image the lightbox is opening to — no
    // placeholder swap, no seam once the real <img> takes over.
    function flyModalOpen(originRect, thumbSrc) {
        if (!modalContent) return;

        modal.classList.add('flying');
        // Suppresses the shimmer's own background-position keyframe (it would
        // otherwise keep animating — and winning — over the inline
        // background photo set below, since running CSS animations take
        // priority over inline styles for the properties they animate).
        modalContent.classList.add('flying');

        // Target = wherever modal-content is already laid out right now
        // (the fixed-size shimmer box from updateModalImage(), or a
        // previously-settled image size) — a known, stable rect to animate
        // toward without waiting on the full-size image to load.
        const targetRect = modalContent.getBoundingClientRect();
        if (targetRect.width === 0 || targetRect.height === 0) {
            modal.classList.remove('flying');
            modal.classList.add('enter-fade');
            modalContent.classList.add('enter-scale');
            return;
        }

        const dx = (originRect.left + originRect.width / 2) - (targetRect.left + targetRect.width / 2);
        const dy = (originRect.top + originRect.height / 2) - (targetRect.top + targetRect.height / 2);
        const scaleX = originRect.width / targetRect.width;
        const scaleY = originRect.height / targetRect.height;

        modalContent.style.transition = 'none';
        modalContent.style.transformOrigin = 'center center';
        modalContent.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
        // Matches .folder-balloon-shape's rounding, so the box reads as the
        // same object as it morphs into a plain rectangle.
        modalContent.style.borderRadius = '50% 50% 50% 50% / 35% 35% 65% 65%';
        modalContent.style.background = `center / cover no-repeat url("${thumbSrc}")`;
        modalContent.style.filter = 'blur(5px)';

        // Force a reflow so the "from" state above actually paints before
        // switching to the transitioned "to" state below.
        void modalContent.offsetWidth;

        modalContent.style.transition =
            'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.5s ease-out, filter 0.4s ease-out';
        modalContent.style.transform = 'translate(0, 0) scale(1, 1)';
        modalContent.style.borderRadius = '';
        modalContent.style.filter = 'blur(0px)';

        let safetyTimer = null;

        const finishFlight = () => {
            if (!cancelActiveFlight) return; // already finished via the other path
            clearTimeout(safetyTimer);
            modalContent.style.transition = '';
            modalContent.style.transform = '';
            modalContent.style.transformOrigin = '';
            modalContent.style.borderRadius = '';
            modalContent.style.background = '';
            modalContent.style.filter = '';
            modalContent.removeEventListener('transitionend', onTransitionEnd);
            modalContent.classList.remove('flying');
            modal.classList.remove('flying');
            cancelActiveFlight = null;

            // The image may have finished loading mid-flight (e.g. it was
            // already cached) — updateModalImage() deferred revealing it
            // until now so it didn't resize/crossfade underneath the flight.
            if (pendingImageReveal) {
                const reveal = pendingImageReveal;
                pendingImageReveal = null;
                reveal();
            }
        };

        function onTransitionEnd(e) {
            if (e.target !== modalContent || e.propertyName !== 'transform') return;
            finishFlight();
        }
        modalContent.addEventListener('transitionend', onTransitionEnd);

        // Safety net in case transitionend never fires (tab backgrounded,
        // element removed, etc.) so the lightbox can't get stuck mid-flight.
        safetyTimer = setTimeout(finishFlight, 650);
        cancelActiveFlight = finishFlight;
    }

    // Builds the dot-indicator row once per modal open (the image list only
    // changes when a different folder is opened) — one dot per photo, so it
    // reads as "the amount of pictures and which one I'm on," matching the
    // dot indicators from the site's original single-view carousel. The row
    // wraps (see .modal-indicators CSS) rather than being capped, so it works
    // the same way regardless of how many photos a category has.
    function buildModalIndicators() {
        if (!modalIndicators) return;

        modalIndicators.innerHTML = '';
        const total = modalImageList.length;

        if (total <= 1) {
            modalIndicators.hidden = true;
            return;
        }

        modalIndicators.hidden = false;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'modal-indicator';
            dot.setAttribute('aria-label', `Go to photo ${i + 1} of ${total}`);
            dot.addEventListener('click', () => {
                modalCurrentIndex = i;
                updateModalImage();
            });
            fragment.appendChild(dot);
        }
        modalIndicators.appendChild(fragment);
    }

    function updateModalIndicators() {
        if (modalIndicators && !modalIndicators.hidden) {
            modalIndicators.querySelectorAll('.modal-indicator').forEach((dot, i) => {
                dot.classList.toggle('active', i === modalCurrentIndex);
            });
        }
    }

    // Loads each image behind a shimmer skeleton (reinstated from the site's
    // original single-view carousel, .single-image-item.loading) instead of
    // just leaving a blank gap while it fetches, then fades the real photo in
    // once it's actually decoded. The shimmer lives on .modal-content (the
    // fixed-size wrapper) rather than the <img> itself, so there's always a
    // visible placeholder box instead of a collapsing/jumping layout.
    //
    // `direction` (-1 prev, 1 next, 0 non-directional) makes the incoming
    // photo slide in from the side it was navigated from, echoing the swipe
    // gesture, instead of a generic scale-in — used for prev/next only, not
    // the very first photo shown or a jump to an arbitrary index (indicator
    // dots / grid view), where "left" or "right" wouldn't mean anything.
    //
    // `isInitialOpen` is only true for the very first call from openModal():
    // that path needs the fixed-size shimmer skeleton in place synchronously
    // so flyModalOpen() can measure a real target rect. Every later call
    // (prev/next/dots/grid) instead holds modal-content at whatever size
    // it's already showing and only actually reveals the shimmer if loading
    // takes long enough to be visible — combined with the neighbor
    // preloading below, most navigations resolve well under that delay and
    // skip the loading state entirely.
    function updateModalImage(options = {}) {
        if (modalImageList.length === 0) return;
        const { isInitialOpen = false, direction = 0 } = options;

        const filename = modalImageList[modalCurrentIndex];
        const targetSrc = `assets/images/${modalCategory}/${filename}`;
        const alreadyLoaded = modalImage.src.endsWith(targetSrc) && modalImage.complete;

        clearTimeout(shimmerDelayTimer);

        modalImage.classList.remove('loaded');
        modalImage.style.transform = direction !== 0
            ? `translateX(${direction * 36}px) scale(0.98)`
            : '';

        if (modalContent) {
            if (isInitialOpen) {
                modalContent.classList.add('loading');
            } else if (!alreadyLoaded) {
                const lockedRect = modalContent.getBoundingClientRect();
                modalContent.style.width = `${lockedRect.width}px`;
                modalContent.style.height = `${lockedRect.height}px`;
                shimmerDelayTimer = setTimeout(() => {
                    modalContent.classList.add('loading');
                }, 120);
            }
        }

        const reveal = () => {
            clearTimeout(shimmerDelayTimer);
            if (modalContent) {
                modalContent.classList.remove('loading');
                modalContent.style.width = '';
                modalContent.style.height = '';
            }
            modalImage.style.transform = '';
            modalImage.classList.add('loaded');
        };

        // If the fly-open transition (flyModalOpen) is still animating
        // modal-content's size/position, defer revealing the settled image
        // until it finishes — otherwise the shimmer box's dimensions would
        // resize out from under the flight transform mid-animation.
        const onReady = () => {
            if (modal.classList.contains('flying')) {
                pendingImageReveal = reveal;
            } else {
                reveal();
            }
        };

        if (alreadyLoaded) {
            // Already-loaded image (e.g. navigating back to one just viewed) —
            // still soft-load it in for a consistent feel, via rAF so the
            // "loading" state has a frame to apply before we remove it.
            requestAnimationFrame(onReady);
        } else {
            modalImage.addEventListener('load', onReady, { once: true });
        }

        modalImage.src = targetSrc;
        modalImage.alt = `${modalCategoryLabel} balloon arrangement ${modalCurrentIndex + 1} of ${modalImageList.length}`;
        updateModalIndicators();
        preloadModalNeighbors();
    }

    // Fetches the adjacent photos in the background so that by the time
    // someone actually clicks prev/next, they're usually already in the
    // browser's HTTP cache — the shimmer-delay above then has nothing to
    // wait out and navigation feels instant.
    function preloadModalNeighbors() {
        const total = modalImageList.length;
        if (total <= 1) return;

        const nextIndex = (modalCurrentIndex + 1) % total;
        const prevIndex = (modalCurrentIndex - 1 + total) % total;
        [nextIndex, prevIndex].forEach((i) => {
            const preloadImg = new Image();
            preloadImg.src = `assets/images/${modalCategory}/${modalImageList[i]}`;
        });
    }

    function navigateModalPrev() {
        if (modalImageList.length === 0) return;

        // Wrap around to last image
        if (modalCurrentIndex === 0) {
            modalCurrentIndex = modalImageList.length - 1;
        } else {
            modalCurrentIndex--;
        }
        updateModalImage({ direction: -1 });
    }

    function navigateModalNext() {
        if (modalImageList.length === 0) return;

        // Wrap around to first image
        if (modalCurrentIndex === modalImageList.length - 1) {
            modalCurrentIndex = 0;
        } else {
            modalCurrentIndex++;
        }
        updateModalImage({ direction: 1 });
    }

    function closeModal() {
        // Cancel a fly-open transition still in progress (e.g. Escape hit
        // immediately after opening) so it can't keep animating, or leave
        // modal-content's inline styles, behind a closed lightbox.
        if (cancelActiveFlight) cancelActiveFlight();
        pendingImageReveal = null;
        clearTimeout(shimmerDelayTimer);

        modal.classList.remove('active', 'enter-fade', 'flying');
        if (modalContent) {
            modalContent.classList.remove('loading', 'enter-scale', 'flying');
            modalContent.style.width = '';
            modalContent.style.height = '';
        }
        modalImage.classList.remove('loaded');
        modalImage.style.transform = '';
        modalImage.src = '';
        modalImage.alt = '';
        document.body.style.overflow = '';
        backgroundContent.forEach((el) => { el.inert = false; });

        // Safety net: never leave the grid view stranded open (or the
        // lightbox marked inert) behind a closed lightbox — e.g. Escape
        // pressed twice quickly.
        modal.inert = false;
        if (gridModal && gridModal.classList.contains('active')) {
            gridModal.classList.remove('active', 'visible', 'closing');
        }
    }

    // ---- Category Grid View ----------------------------------------------
    // Reused by every folder highlight: always builds from whatever
    // modalImageList/modalCategory is currently open, so there is exactly one
    // implementation shared across all 8 categories rather than one per
    // category. Reinstates the site's original grid view (thumbnail grid,
    // staggered entrance, shimmer-loading thumbnails), scoped to one folder's
    // photos instead of the whole gallery.

    function buildCategoryGrid() {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        const fragment = document.createDocumentFragment();
        modalImageList.forEach((filename, index) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item loading';

            const img = document.createElement('img');
            img.loading = 'lazy';
            img.decoding = 'async';
            img.alt = `${modalCategoryLabel} photo ${index + 1} of ${modalImageList.length}`;
            img.addEventListener('load', () => {
                gridItem.classList.remove('loading');
                gridItem.classList.add('loaded');
            }, { once: true });
            img.src = `assets/images/${modalCategory}/${filename}`;

            gridItem.appendChild(img);

            const selectThisPhoto = () => {
                modalCurrentIndex = index;
                updateModalImage();
                closeCategoryGrid();
            };

            gridItem.addEventListener('click', selectThisPhoto);
            gridItem.setAttribute('tabindex', '0');
            gridItem.setAttribute('role', 'button');
            gridItem.setAttribute('aria-label', `View photo ${index + 1} of ${modalImageList.length}`);
            gridItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectThisPhoto();
                }
            });

            fragment.appendChild(gridItem);
        });
        gridContainer.appendChild(fragment);
    }

    function openCategoryGrid() {
        if (!gridModal || gridTransitioning) return;

        buildCategoryGrid();
        gridModal.classList.add('active');
        gridModal.setAttribute('aria-label', `All ${modalCategoryLabel} photos`);
        // The lightbox is still open underneath, visually and in the DOM —
        // make its own controls (close/prev/next) inert while the grid
        // overlay has focus, instead of leaving them reachable by Tab.
        if (modal) modal.inert = true;

        requestAnimationFrame(() => {
            gridModal.classList.add('visible');

            const items = gridContainer.querySelectorAll('.grid-item');
            items.forEach((item, index) => {
                item.classList.remove('visible');
                setTimeout(() => item.classList.add('visible'), index * 30);
            });
        });

        if (gridModalClose) gridModalClose.focus();
    }

    function closeCategoryGrid() {
        if (!gridModal || gridTransitioning) return;
        gridTransitioning = true;

        gridModal.classList.remove('visible');
        gridModal.classList.add('closing');

        setTimeout(() => {
            gridModal.classList.remove('active', 'closing');
            gridTransitioning = false;
            // The lightbox is still open underneath — restore it and return
            // focus there.
            if (modal) modal.inert = false;
            if (modalClose) modalClose.focus();
        }, 400);
    }
}

// Set current year in footer
function initializeCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.addEventListener('load', function () {
                        img.classList.add('loaded');
                    });

                    // If image is already loaded (cached)
                    if (img.complete) {
                        img.classList.add('loaded');
                    }

                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Handle empty hash or just #
            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                const offsetTop = targetElement.offsetTop;
                const headerHeight = 0; // Adjust if you have a fixed header

                window.scrollTo({
                    top: offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility Functions

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();

        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add performance monitoring
function initializePerformanceMonitoring() {
    // Report Web Vitals if available
    if ('web-vitals' in window) {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = window['web-vitals'];

        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
    }
}

// Error handling
window.addEventListener('error', function (e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function (e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeScrollReveal,
        initializeImageGallery,
        initializeCurrentYear,
        initializeLazyLoading,
        initializeSmoothScrolling,
        debounce,
        throttle,
        isInViewport
    };
}