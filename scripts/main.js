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

// Image Gallery with Modal Functionality and Grid Modal
function initializeImageGallery() {
    // Gallery state
    let currentIndex = 0;
    let allImages = [];
    let isTransitioning = false;
    let gridPopulated = false;
    let modalCurrentIndex = 0;
    let modalOpenedFromGrid = false;

    // Touch/swipe variables
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTime = 0;

    // DOM elements
    const singleView = document.getElementById('single-view');
    const singleContainer = document.getElementById('single-container');
    const gridContainer = document.getElementById('grid-container');
    const singlePrevBtn = document.getElementById('single-prev');
    const singleNextBtn = document.getElementById('single-next');
    const singleIndicators = document.getElementById('single-indicators');
    const gridToggleBtn = document.getElementById('grid-toggle');
    const gridModal = document.getElementById('grid-modal');
    const gridModalClose = document.getElementById('grid-modal-close');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.querySelector('.modal-close');
    const modalPrevBtn = document.getElementById('modal-prev');
    const modalNextBtn = document.getElementById('modal-next');

    // Get items per page based on screen size
    function getItemsPerPage() {
        if (window.innerWidth <= 480) {
            return 3; // Small mobile
        } else {
            return 4; // Desktop and tablet
        }
    }

    // Gallery Configuration Helper
    function createGalleryConfig() {
        return {
            // 🌟 FEATURED IMAGES (Edit these to change your top 5)
            // These will always appear first, in this exact order
            featured: [
                'IMG_7427.jpeg', // 1st position
                'IMG_7212.jpeg', // 2nd 
                'IMG_7147.jpeg', // 3rd
                'IMG_7202.jpeg', // 4th 
                'IMG_6649.jpeg', // 5th 
            ],

            // 📋 ORDERING OPTIONS for non-featured images:
            // 'filename' - alphabetical by filename
            // 'date' - by number in filename (IMG_4520 comes before IMG_5180)
            // 'random' - random order each page load
            orderBy: 'date'
        };
    }

    // Get all images from the folder - simple and direct approach
    function getAllImages() {
        // List of ALL images in your assets/images folder
        // Add new images here when you upload them, or the system will auto-discover most
        return [
            'IMG_7787.jpeg',
            'IMG_7881.jpeg',
            'IMG_7913.jpeg',
            'IMG_8020.jpeg',
            'IMG_8359.jpeg',
            'IMG_8587.jpeg',
            'IMG_7427.jpeg',
            'IMG_4520.jpeg',
            'IMG_4764.jpeg',
            'IMG_4772.jpeg',
            'IMG_7212.jpeg',
            'IMG_7202.jpeg',
            'IMG_6649.jpeg',
            'IMG_7147.jpeg',
            'IMG_4875.jpeg',
            'IMG_4927.jpeg',
            'IMG_4982.jpeg',
            'IMG_5049.jpeg',
            'IMG_5180.jpeg',
            'IMG_5249.jpeg',
            'IMG_5268.jpeg',
            'IMG_5272.jpeg',
            'IMG_5306.jpeg',
            'IMG_5366.jpeg',
            'IMG_5369.jpeg',
            'IMG_5375.jpeg',
            'IMG_5414.jpeg',
            'IMG_5416.jpeg',
            'IMG_5420.jpeg',
            'IMG_7323.jpeg',
            'IMG_7324.jpeg',
            'IMG_7325.jpeg',
            'IMG_7326.jpeg'
        ];
    }

    // Automatically discover additional images (for future expansion)
    async function discoverImages() {
        // Start with our known complete list
        const allImages = getAllImages();

        console.log(`🎨 Found ${allImages.length} images`);
        return allImages.sort();
    }

    // Initialize gallery
    loadGalleryImages();

    // Function to load gallery images dynamically
    async function loadGalleryImages() {
        const loadingElement = singleContainer.querySelector('.gallery-loading');

        // Auto-discover all images first
        const discoveredImages = await discoverImages();

        // Get gallery configuration
        const galleryConfig = createGalleryConfig();

        // Add discovered images to config
        galleryConfig.allImages = discoveredImages;

        // Smart image ordering
        allImages = organizeImages(galleryConfig);

        // Clear loading message
        if (loadingElement) {
            loadingElement.remove();
        }

        // Create gallery views
        createSingleView();
        createGridView();
        createIndicators();
        updateSingleView();
        setupEventListeners();
    }

    // Smart image organization function
    function organizeImages(config) {
        const { featured, allImages, orderBy } = config;
        const organized = [];
        const remaining = [...allImages];
        const missingFeatured = [];

        // Add featured images first (in specified order)
        featured.forEach(featuredImg => {
            if (remaining.includes(featuredImg)) {
                organized.push(featuredImg);
                remaining.splice(remaining.indexOf(featuredImg), 1);
            } else {
                missingFeatured.push(featuredImg);
            }
        });

        // Warn about missing featured images
        if (missingFeatured.length > 0) {
            console.warn('⚠️ Featured images not found:', missingFeatured);
        }

        // Order remaining images based on configuration
        let orderedRemaining = [];
        switch (orderBy) {
            case 'filename':
                orderedRemaining = remaining.sort();
                break;
            case 'date':
                // Extract numbers from filename for chronological ordering
                orderedRemaining = remaining.sort((a, b) => {
                    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                    return numA - numB;
                });
                break;
            case 'random':
                orderedRemaining = remaining.sort(() => Math.random() - 0.5);
                break;
            case 'manual':
                // Keep the order as specified in allImages
                orderedRemaining = remaining;
                break;
            default:
                orderedRemaining = remaining.sort();
        }

        // Combine featured + remaining
        const finalOrder = [...organized, ...orderedRemaining];

        // Log the final order for verification
        console.log('🎨 Gallery Order:', {
            featured: organized.length,
            remaining: orderedRemaining.length,
            total: finalOrder.length,
            orderBy: orderBy,
            firstFive: finalOrder.slice(0, 5),
            featuredImages: organized
        });

        return finalOrder;
    }

    // Create single image view
    function createSingleView() {
        // Single view shows one image at a time
        updateSingleImage();
    }

    // Update single image display
    function updateSingleImage() {
        if (allImages.length === 0) return;

        const filename = allImages[currentIndex];
        
        // Create new image item
        const singleItem = document.createElement('div');
        singleItem.className = 'single-image-item loading';

        const img = document.createElement('img');
        img.alt = `Balloon arrangement ${currentIndex + 1}`;
        
        // Handle image load
        img.onload = () => {
            singleItem.classList.remove('loading');
            singleItem.classList.add('loaded');
        };
        
        img.onerror = () => {
            singleItem.classList.remove('loading');
            singleItem.classList.add('error');
        };
        
        // Set src after onload handler
        img.src = `assets/images/${filename}`;

        singleItem.appendChild(img);
        
        // Clear and add new content
        singleContainer.innerHTML = '';
        singleContainer.appendChild(singleItem);

        // Add click handler to open modal (full size)
        singleItem.addEventListener('click', () => {
            if (!isDragging) {
                openModal(currentIndex);
            }
        });

        // Add keyboard support
        singleItem.setAttribute('tabindex', '0');
        singleItem.setAttribute('role', 'button');
        singleItem.setAttribute('aria-label', 'Open image in modal');
        singleItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(currentIndex);
            }
        });
        
        // Update navigation buttons (never disable for infinite scroll)
        if (singlePrevBtn) singlePrevBtn.disabled = false;
        if (singleNextBtn) singleNextBtn.disabled = false;
    }

    // Create grid view with proper lazy loading using Intersection Observer
    function createGridView() {
        gridContainer.innerHTML = '';

        allImages.forEach((filename, index) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item loading';
            gridItem.setAttribute('data-index', index);
            gridItem.setAttribute('data-src', `assets/images/${filename}`);
            
            const img = document.createElement('img');
            img.alt = `Balloon arrangement ${index + 1}`;
            
            // Handle image load
            img.onload = () => {
                gridItem.classList.remove('loading');
                gridItem.classList.add('loaded');
            };
            
            img.onerror = () => {
                gridItem.classList.remove('loading');
                gridItem.classList.add('error');
            };
            
            // Don't set src yet - will be set by Intersection Observer
            
            gridItem.appendChild(img);
            gridContainer.appendChild(gridItem);

            // Add click handler to open modal (from grid)
            gridItem.addEventListener('click', () => {
                openModal(index, true);
            });

            // Add keyboard support
            gridItem.setAttribute('tabindex', '0');
            gridItem.setAttribute('role', 'button');
            gridItem.setAttribute('aria-label', `Open image ${index + 1} in modal`);
            gridItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(index);
                }
            });
        });
        
        // Setup lazy loading observer for grid items
        setupGridLazyLoading();
    }
    
    // Lazy loading for grid images using Intersection Observer
    function setupGridLazyLoading() {
        const gridItems = gridContainer.querySelectorAll('.grid-item[data-src]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const gridItem = entry.target;
                    const img = gridItem.querySelector('img');
                    const src = gridItem.getAttribute('data-src');
                    
                    if (src && img && !img.src) {
                        img.src = src;
                        gridItem.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(gridItem);
                }
            });
        }, {
            root: document.querySelector('.grid-modal-content'),
            rootMargin: '100px',
            threshold: 0
        });
        
        gridItems.forEach(item => observer.observe(item));
    }

    // Create page indicators for single view
    function createIndicators() {
        singleIndicators.innerHTML = '';

        allImages.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'gallery-indicator';
            if (index === 0) indicator.classList.add('active');

            indicator.addEventListener('click', () => goToImage(index));
            singleIndicators.appendChild(indicator);
        });
    }

    // Update single view display
    function updateSingleView() {
        updateSingleImage();

        // Never disable buttons for infinite scroll
        if (singlePrevBtn) singlePrevBtn.disabled = false;
        if (singleNextBtn) singleNextBtn.disabled = false;

        // Update indicators
        document.querySelectorAll('.gallery-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Grid modal toggle button
        if (gridToggleBtn) {
            gridToggleBtn.addEventListener('click', openGridModal);
        }

        // Grid modal close button
        if (gridModalClose) {
            gridModalClose.addEventListener('click', closeGridModal);
        }

        // Close grid modal on backdrop click
        if (gridModal) {
            gridModal.addEventListener('click', (e) => {
                if (e.target === gridModal) {
                    closeGridModal();
                }
            });
        }

        // Single view navigation buttons
        if (singlePrevBtn) {
            singlePrevBtn.addEventListener('click', goToPrevImage);
        }
        if (singleNextBtn) {
            singleNextBtn.addEventListener('click', goToNextImage);
        }

        // Touch/swipe events for single view
        if (singleContainer) {
            singleContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
            singleContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
            singleContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

            // Mouse events for desktop drag
            singleContainer.addEventListener('mousedown', handleMouseDown);
            singleContainer.addEventListener('mousemove', handleMouseMove);
            singleContainer.addEventListener('mouseup', handleMouseUp);
            singleContainer.addEventListener('mouseleave', handleMouseUp);
        }

        // Keyboard navigation
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
    }
    
    // Modal touch/swipe handling
    let modalStartX = 0;
    let modalCurrentX = 0;
    let modalIsDragging = false;
    
    function handleModalTouchStart(e) {
        modalStartX = e.touches[0].clientX;
        modalCurrentX = modalStartX;
        modalIsDragging = false;
    }
    
    function handleModalTouchMove(e) {
        if (modalStartX === 0) return;
        
        modalCurrentX = e.touches[0].clientX;
        const diffX = modalStartX - modalCurrentX;
        
        if (Math.abs(diffX) > 10) {
            modalIsDragging = true;
            e.preventDefault();
        }
    }
    
    function handleModalTouchEnd(e) {
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
        setTimeout(() => {
            modalIsDragging = false;
        }, 100);
    }

    // Open grid modal
    function openGridModal() {
        if (isTransitioning) return;
        
        // Populate grid if not already done
        if (!gridPopulated) {
            createGridView();
            gridPopulated = true;
        }

        // Show modal
        gridModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Trigger entrance animation
        requestAnimationFrame(() => {
            gridModal.classList.add('visible');
            
            // Animate grid items with stagger
            const gridItems = gridContainer.querySelectorAll('.grid-item');
            gridItems.forEach((item, index) => {
                item.classList.remove('visible');
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 30);
            });
        });
    }

    // Close grid modal
    function closeGridModal() {
        if (isTransitioning) return;
        isTransitioning = true;

        gridModal.classList.remove('visible');
        gridModal.classList.add('closing');

        setTimeout(() => {
            gridModal.classList.remove('active', 'closing');
            document.body.style.overflow = '';
            isTransitioning = false;
        }, 400);
    }

    // Navigation functions with infinite scroll (wrap around)
    function goToPrevImage() {
        if (isTransitioning || allImages.length === 0) return;
        
        // Wrap around to last image if at the beginning
        if (currentIndex === 0) {
            currentIndex = allImages.length - 1;
        } else {
            currentIndex--;
        }
        updateSingleView();
    }

    function goToNextImage() {
        if (isTransitioning || allImages.length === 0) return;
        
        // Wrap around to first image if at the end
        if (currentIndex === allImages.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateSingleView();
    }

    function goToImage(index) {
        if (index >= 0 && index < allImages.length && !isTransitioning) {
            currentIndex = index;
            updateSingleView();
        }
    }

    // Touch/swipe handling
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        currentX = startX;
        startTime = Date.now();
        isDragging = false;
    }

    function handleTouchMove(e) {
        if (startX === 0) return;

        currentX = e.touches[0].clientX;
        const diffX = startX - currentX;

        if (Math.abs(diffX) > 10) {
            isDragging = true;
            e.preventDefault(); // Prevent scrolling
        }
    }

    function handleTouchEnd(e) {
        if (startX === 0) return;

        const diffX = startX - currentX;
        const diffTime = Date.now() - startTime;
        const velocity = Math.abs(diffX) / diffTime;

        // Determine if it's a swipe (minimum distance and velocity)
        if (Math.abs(diffX) > 50 || velocity > 0.5) {
            if (diffX > 0) {
                // Swiped left, go to next
                goToNextImage();
            } else {
                // Swiped right, go to previous
                goToPrevImage();
            }
        }

        // Reset
        startX = 0;
        currentX = 0;
        setTimeout(() => {
            isDragging = false;
        }, 100);
    }

    // Mouse drag handling (for desktop)
    function handleMouseDown(e) {
        startX = e.clientX;
        currentX = startX;
        startTime = Date.now();
        isDragging = false;
        e.preventDefault(); // Prevent text selection
    }

    function handleMouseMove(e) {
        if (startX === 0) return;

        currentX = e.clientX;
        const diffX = startX - currentX;

        if (Math.abs(diffX) > 10) {
            isDragging = true;
        }
    }

    function handleMouseUp(e) {
        if (startX === 0) return;

        const diffX = startX - currentX;
        const diffTime = Date.now() - startTime;
        const velocity = Math.abs(diffX) / diffTime;

        // Determine if it's a drag (minimum distance and velocity)
        if (Math.abs(diffX) > 50 || velocity > 0.3) {
            if (diffX > 0) {
                // Dragged left, go to next
                goToNextImage();
            } else {
                // Dragged right, go to previous
                goToPrevImage();
            }
        }

        // Reset
        startX = 0;
        currentX = 0;
        setTimeout(() => {
            isDragging = false;
        }, 100);
    }

    // Keyboard navigation
    function handleKeyDown(e) {
        // Handle image modal navigation and escape
        if (modal.classList.contains('active')) {
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
            return;
        }

        // Handle grid modal escape
        if (gridModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeGridModal();
            }
            return;
        }

        // Single view navigation
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                goToPrevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                goToNextImage();
                break;
        }
    }

    // Modal functionality with navigation
    function openModal(index, fromGrid = false) {
        modalCurrentIndex = index;
        modalOpenedFromGrid = fromGrid;
        updateModalImage();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus the close button for accessibility
        if (modalClose) modalClose.focus();
    }
    
    function updateModalImage() {
        if (allImages.length === 0) return;
        
        const filename = allImages[modalCurrentIndex];
        modalImage.src = `assets/images/${filename}`;
        modalImage.alt = `Balloon arrangement ${modalCurrentIndex + 1}`;
    }
    
    function navigateModalPrev() {
        if (allImages.length === 0) return;
        
        // Wrap around to last image
        if (modalCurrentIndex === 0) {
            modalCurrentIndex = allImages.length - 1;
        } else {
            modalCurrentIndex--;
        }
        updateModalImage();
    }
    
    function navigateModalNext() {
        if (allImages.length === 0) return;
        
        // Wrap around to first image
        if (modalCurrentIndex === allImages.length - 1) {
            modalCurrentIndex = 0;
        } else {
            modalCurrentIndex++;
        }
        updateModalImage();
    }

    function closeModal() {
        modal.classList.remove('active');
        modalImage.src = '';
        modalImage.alt = '';
        
        // If opened from grid, keep grid modal open
        if (modalOpenedFromGrid && gridModal.classList.contains('active')) {
            document.body.style.overflow = 'hidden'; // Keep overflow hidden for grid
        } else {
            document.body.style.overflow = '';
        }
        
        modalOpenedFromGrid = false;
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