// The Balloon Attic - JavaScript Functionality

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
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

    const observer = new IntersectionObserver(function(entries) {
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

// Image Gallery with Modal Functionality and Horizontal Scrolling
function initializeImageGallery() {
    // Gallery state
    let currentPage = 0;
    let totalPages = 0;
    let itemsPerPage = getItemsPerPage(); // Dynamic based on screen size
    let allImages = [];
    let isTransitioning = false;
    
    // Touch/swipe variables
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTime = 0;
    
    // DOM elements
    const galleryTrack = document.getElementById('gallery-track');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const indicatorsContainer = document.getElementById('gallery-indicators');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.querySelector('.modal-close');

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
                'IMG_5258.jpeg',  // 1st position - your best photo
                'IMG_5366.jpeg',  // 2nd position
                'IMG_5369.jpeg',  // 3rd position  
                'IMG_5414.jpeg',  // 4th position
                'IMG_4801.jpeg'   // 5th position
            ],
            
            // � ORDERING OPTIONS for non-featured images:
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
            'IMG_4520.jpeg',
            'IMG_4764.jpeg',
            'IMG_4772.jpeg',
            'IMG_4801.jpeg',
            'IMG_4875.jpeg',
            'IMG_4927.jpeg',
            'IMG_4982.jpeg',
            'IMG_5049.jpeg',
            'IMG_5180.jpeg',
            'IMG_5249.jpeg',
            'IMG_5258.jpeg',
            'IMG_5268.jpeg',
            'IMG_5272.jpeg',
            'IMG_5306.jpeg',
            'IMG_5366.jpeg',
            'IMG_5369.jpeg',
            'IMG_5369.jpg',
            'IMG_5375.jpeg',
            'IMG_5413.jpeg',
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
        
        console.log(`� Found ${allImages.length} images`);
        return allImages.sort();
    }

    // Initialize gallery
    loadGalleryImages();

    // Function to load gallery images dynamically
    async function loadGalleryImages() {
        const loadingElement = galleryTrack.querySelector('.gallery-loading');
        
        // Auto-discover all images first
        const discoveredImages = await discoverImages();
        
        // Get gallery configuration
        const galleryConfig = createGalleryConfig();
        
        // Add discovered images to config
        galleryConfig.allImages = discoveredImages;

        // Smart image ordering
        allImages = organizeImages(galleryConfig);

        // Update items per page based on current screen size
        itemsPerPage = getItemsPerPage();
        totalPages = Math.ceil(allImages.length / itemsPerPage);

        // Clear loading message
        if (loadingElement) {
            loadingElement.remove();
        }

        // Create all gallery items
        createGalleryItems();
        createIndicators();
        updateGallery();
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

    // Utility function to easily reorder gallery (for future use)
    function reorderGallery(newFeatured = null, newOrderBy = null) {
        const config = createGalleryConfig();
        if (newFeatured) config.featured = newFeatured;
        if (newOrderBy) config.orderBy = newOrderBy;
        
        allImages = organizeImages(config);
        totalPages = Math.ceil(allImages.length / itemsPerPage);
        
        createGalleryItems();
        createIndicators();
        currentPage = 0; // Reset to first page
        updateGallery();
    }

    // Create gallery items
    function createGalleryItems() {
        galleryTrack.innerHTML = '';
        
        allImages.forEach((filename, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-index', index);
            
            const img = document.createElement('img');
            img.src = `assets/images/${filename}`;
            img.alt = `Balloon arrangement ${index + 1}`;
            img.loading = 'eager'; // Load all images immediately
            
            galleryItem.appendChild(img);
            galleryTrack.appendChild(galleryItem);
        });
        
        // Reset transform to start position
        galleryTrack.style.transform = 'translateX(0px)';
    }

    // Create page indicators
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'gallery-indicator';
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => goToPage(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    // Update gallery display
    function updateGallery() {
        // Calculate the transform offset based on viewport width
        // Move by exactly the width of the viewport (which shows exactly itemsPerPage items)
        let viewportWidth;
        
        if (window.innerWidth <= 480) {
            // Small mobile: 3 items * 140px + 2 gaps * 12px = 444px
            viewportWidth = 3 * 140 + 2 * 12;
        } else if (window.innerWidth <= 768) {
            // Tablet: 4 items * 160px + 3 gaps * 12px = 676px
            viewportWidth = 4 * 160 + 3 * 12;
        } else {
            // Desktop: 4 items * 200px + 3 gaps * 16px = 848px
            viewportWidth = 4 * 200 + 3 * 16;
        }
        
        const translateX = -currentPage * viewportWidth;
        
        // Apply transform to move the track
        galleryTrack.style.transform = `translateX(${translateX}px)`;

        // Update navigation buttons
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;

        // Update indicators
        document.querySelectorAll('.gallery-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentPage);
        });

        // Re-initialize reveal animations and event listeners for visible items
        initializeScrollReveal();
        setupGalleryItemListeners();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Navigation buttons
        prevBtn.addEventListener('click', goToPrevPage);
        nextBtn.addEventListener('click', goToNextPage);

        // Touch/swipe events
        galleryTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
        galleryTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
        galleryTrack.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Mouse events for desktop drag
        galleryTrack.addEventListener('mousedown', handleMouseDown);
        galleryTrack.addEventListener('mousemove', handleMouseMove);
        galleryTrack.addEventListener('mouseup', handleMouseUp);
        galleryTrack.addEventListener('mouseleave', handleMouseUp);

        // Prevent context menu on long press
        galleryTrack.addEventListener('contextmenu', (e) => {
            if (isDragging) e.preventDefault();
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
        
        // Window resize handler
        window.addEventListener('resize', handleResize);
    }
    
    // Handle window resize
    function handleResize() {
        // Recalculate items per page
        const newItemsPerPage = getItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            totalPages = Math.ceil(allImages.length / itemsPerPage);
            
            // Reset to first page if current page is now out of bounds
            if (currentPage >= totalPages) {
                currentPage = totalPages - 1;
            }
            
            // Recreate indicators
            createIndicators();
        }
        
        // Recalculate and update gallery on resize
        updateGallery();
    }

    // Setup event listeners for gallery items (modal functionality)
    function setupGalleryItemListeners() {
        const allItems = galleryTrack.querySelectorAll('.gallery-item');
        
        allItems.forEach(item => {
            // Remove existing listeners to prevent duplicates
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
        });

        // Re-get items after cloning
        const freshItems = galleryTrack.querySelectorAll('.gallery-item');
        
        freshItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (!isDragging) {
                    const img = this.querySelector('img');
                    if (img) {
                        openModal(img.src, img.alt);
                    }
                }
            });

            // Add keyboard navigation
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const img = this.querySelector('img');
                    if (img) {
                        openModal(img.src, img.alt);
                    }
                }
            });

            // Make gallery items focusable
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Open image in modal');
        });
    }

    // Navigation functions
    function goToPrevPage() {
        if (currentPage > 0 && !isTransitioning) {
            currentPage--;
            updateGallery();
        }
    }

    function goToNextPage() {
        if (currentPage < totalPages - 1 && !isTransitioning) {
            currentPage++;
            updateGallery();
        }
    }

    function goToPage(pageIndex) {
        if (pageIndex >= 0 && pageIndex < totalPages && !isTransitioning) {
            currentPage = pageIndex;
            updateGallery();
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
                // Swiped left, go to next page
                goToNextPage();
            } else {
                // Swiped right, go to previous page
                goToPrevPage();
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
                // Dragged left, go to next page
                goToNextPage();
            } else {
                // Dragged right, go to previous page
                goToPrevPage();
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
        if (modal.classList.contains('active')) return; // Don't interfere with modal
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                goToPrevPage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                goToNextPage();
                break;
        }
    }

    // Modal functionality
    function openModal(imageSrc, imageAlt) {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus the close button for accessibility
        modalClose.focus();
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalImage.src = '';
        modalImage.alt = '';
    }

    // Setup modal event listeners
    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }
    });
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
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.addEventListener('load', function() {
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
        link.addEventListener('click', function(e) {
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
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
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