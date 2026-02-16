/* ============================================
   LESSON ZERO - MAIN JAVASCRIPT
   Shared JavaScript functionality
   ============================================ */

/* ============================================
   NAVIGATION - Mobile Menu & Scroll Effect
   ============================================ */

const mainNav = document.querySelector('.main-nav');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const navMenu = document.querySelector('.nav-menu');

// Mobile menu toggle
if (mobileMenuToggle && navMenu) {
    // Open menu
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu with close button
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    }

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        }
    });

    // Close menu when clicking on nav links
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Navigation scroll effect (transparent to solid)
// Only on homepage - check if hero section exists
if (document.querySelector('.hero')) {
    // Start transparent
    mainNav.classList.add('transparent');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            mainNav.classList.remove('transparent');
            mainNav.classList.add('solid');
        } else {
            mainNav.classList.remove('solid');
            mainNav.classList.add('transparent');
        }
    }, { passive: true });
} else {
    // On other pages, always solid
    mainNav.classList.add('solid');
}

/* ============================================
   SCROLL-BASED FADE EFFECT (Homepage only)
   Fades out the grid overlay and brightens video as user scrolls
   ============================================ */

// Only run if we're on the homepage (elements exist)
if (document.querySelector('.hero')) {
    // Get references to DOM elements we'll manipulate
    // querySelector finds the FIRST element matching the CSS selector
    const gridBg = document.querySelector('.grid-bg');               // Blue grid overlay
    const heroOverlay = document.querySelector('.hero-overlay');     // Dark gradient over video
    const heroVideo = document.querySelector('.hero-video');         // Background video element
    const heroSection = document.querySelector('.hero');             // Hero section container
    const scrollIndicator = document.querySelector('.scroll-indicator'); // "Scroll" text + line

    // This function runs every time the user scrolls
    function handleScroll() {
        // Get current scroll position (0 = top of page)
        const scrollY = window.scrollY;

        // Get height of hero section in pixels
        const heroHeight = heroSection.offsetHeight;

        // Calculate fade progress (0 to 1)
        // When scrollY = 0 (top), fadeProgress = 0 (no fade)
        // When scrollY = 50% of heroHeight, fadeProgress = 1 (fully faded)
        // Math.min ensures value never exceeds 1
        const fadeProgress = Math.min(scrollY / (heroHeight * 0.5), 1);

        // Apply fade to elements
        // opacity = 1 - fadeProgress means:
        //   - At top (fadeProgress = 0): opacity = 1 (fully visible)
        //   - At 50% scroll (fadeProgress = 1): opacity = 0 (invisible)
        gridBg.style.opacity = 1 - fadeProgress;
        heroOverlay.style.opacity = 1 - fadeProgress;

        // For scroll indicator, use CSS custom property to override animation
        scrollIndicator.style.setProperty('--scroll-indicator-opacity', 1 - fadeProgress);

        // Brighten video when more than 50% faded
        if (fadeProgress > 0.5) {
            heroVideo.classList.add('bright');    // Adds .bright class (brighter filter)
        } else {
            heroVideo.classList.remove('bright'); // Removes .bright class
        }
    }

    // Listen for scroll events and run handleScroll function
    // passive: true = tells browser we won't prevent scrolling (improves performance)
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ============================================
   INTERSECTION OBSERVER - Content Fade-In Animations
   Watches content blocks and fades them in when scrolled into view
   ============================================ */

// Configuration for the observer
const observerOptions = {
    root: null,              // null = watch relative to viewport
    rootMargin: '-10% 0px -10% 0px', // Trigger when element is 10% into viewport
                                     // Format: 'top right bottom left' (like CSS margin)
    threshold: 0.1           // Trigger when 10% of element is visible
};

// Create an Intersection Observer
// This watches elements and runs a callback when they enter/exit the viewport
const observer = new IntersectionObserver((entries) => {
    // entries = array of all observed elements that changed visibility
    entries.forEach(entry => {
        // entry.isIntersecting = true when element enters viewport
        if (entry.isIntersecting) {
            // Add 'visible' class to trigger CSS fade-in animation
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Find all elements with data-animate attribute and observe them
// querySelectorAll returns ALL matching elements (unlike querySelector)
// forEach loops through each element
document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);  // Start watching this element
});

/* ============================================
   VIDEO PERFORMANCE OPTIMIZATION
   Pauses videos when off-screen to save resources
   ============================================ */

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target; // The video element being observed

        if (entry.isIntersecting) {
            // Video is visible - play it
            // .catch(() => {}) prevents errors if autoplay is blocked by browser
            video.play().catch(() => {});
        } else {
            // Video is off-screen - pause it to save CPU/battery
            video.pause();
        }
    });
}, { threshold: 0.1 }); // Trigger when 10% of video is visible

// Find all videos in video cards and observe them
document.querySelectorAll('.video-card video').forEach(video => {
    videoObserver.observe(video);
});

/* ============================================
   VIDEO LIGHTBOX
   Opens YouTube videos in a modal overlay
   ============================================ */

const videoThumbs = document.querySelectorAll('.video-thumb');

if (videoThumbs.length > 0) {
    const videoModal = document.getElementById('videoModal');
    const videoModalIframe = document.getElementById('videoModalIframe');
    const videoModalBackdrop = videoModal.querySelector('.video-modal-backdrop');
    const videoModalClose = videoModal.querySelector('.video-modal-close');
    let lastFocusedElement = null;

    function openVideoModal(videoId) {
        lastFocusedElement = document.activeElement;
        videoModalIframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
        videoModal.classList.add('active');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        videoModalClose.focus();
    }

    function closeVideoModal() {
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
        setTimeout(function() {
            videoModalIframe.src = '';
        }, 400);
    }

    videoThumbs.forEach(function(thumb) {
        thumb.addEventListener('click', function() {
            var videoId = thumb.dataset.videoId;
            if (videoId) openVideoModal(videoId);
        });

        thumb.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                var videoId = thumb.dataset.videoId;
                if (videoId) openVideoModal(videoId);
            }
        });
    });

    videoModalClose.addEventListener('click', closeVideoModal);
    videoModalBackdrop.addEventListener('click', closeVideoModal);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
}
