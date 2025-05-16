/**
 * Main.js - Core functionality for JRD Constructions & Builders website
 * Includes navigation, theme toggle, loading animation, and shared utilities
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initializeWebsite();
    
    // Redirect from login page since it's not required
    if (window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }

    ensureCustomCursor();
});

// Main initialization function
function initializeWebsite() {
    // Handle loading screen - only show on homepage
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/') || 
                       window.location.pathname === '';
    
    if (isHomePage) {
        // Show loading screen only on homepage
        const loadingDelay = 2000; // 2s delay to ensure loading is visible
        
        // Immediately set the loading bar to 0% first (ensure it's visible)
        const loadingBar = document.querySelector('.loading-bar');
        if (loadingBar) {
            loadingBar.style.width = '0%';
            
            // Force a reflow to ensure the initial width is applied
            loadingBar.offsetWidth;
            
            // Simple fixed increments for reliability
            setTimeout(() => { loadingBar.style.width = '20%'; }, 200);
            setTimeout(() => { loadingBar.style.width = '40%'; }, 600);
            setTimeout(() => { loadingBar.style.width = '60%'; }, 1000);
            setTimeout(() => { loadingBar.style.width = '80%'; }, 1400);
            setTimeout(() => { loadingBar.style.width = '100%'; }, 1800);
        }
        
        // Add a failsafe to always hide the loading screen after a certain time
        // regardless of whether the page fully loads or not
        const maxLoadingTime = 3000; // 3s maximum waiting time
        setTimeout(hideLoadingScreen, maxLoadingTime);
        
        // Regular loading completion detection 
        window.addEventListener('load', function() {
            setTimeout(hideLoadingScreen, loadingDelay);
        });
        
        // Also listen for when the document is already ready (in case 'load' doesn't fire)
        if (document.readyState === 'complete') {
            setTimeout(hideLoadingScreen, loadingDelay);
        }
    } else {
        // Immediately hide loading screen on other pages
        document.body.classList.remove('loading');
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    // Function to hide the loading screen
    function hideLoadingScreen() {
        // Check if loading screen is already hidden
        const loadingScreen = document.querySelector('.loading-screen');
        if (!loadingScreen || loadingScreen.style.display === 'none') return;
        
        // Remove loading class from body
        document.body.classList.remove('loading');
        
        // Add hidden class to loading screen
        loadingScreen.classList.add('hidden');
        
        // After animation, set display to none
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }

    // Mobile menu toggle
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuIcon && mobileMenu) {
        mobileMenuIcon.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Theme toggle functionality
    initThemeToggle();

    // Back to top button
    initBackToTop();

    // Initialize accordions if they exist
    initAccordions();

    // Initialize smooth scroll
    initSmoothScroll();
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme if available
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Default to light theme
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add transition class
            document.documentElement.classList.add('theme-transition');
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
            }, 1000);
        });
    }
}

// Back to top button
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show button when user scrolls down 300px
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Scroll to top when button is clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Accordion functionality
function initAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('.accordion-icon i');
                
                // Toggle active class
                item.classList.toggle('active');
                
                // Toggle icon
                if (icon) {
                    icon.classList.toggle('fa-plus');
                    icon.classList.toggle('fa-minus');
                }
                
                // Toggle content visibility
                if (item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = null;
                }
            });
        });
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // 100px offset to account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function to limit frequency of execution
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Ensure custom cursor is available on all pages
function ensureCustomCursor() {
    // Check if cursor element exists
    if (!document.querySelector('.custom-cursor')) {
        // Create the custom cursor if it doesn't exist
        const cursorHTML = `
            <div class="custom-cursor visible">
                <img src="assets/jcb-cursor.png" alt="JCB Cursor" id="cursor-img">
                <div class="cursor-follower"></div>
                <div class="cursor-dot"></div>
                <div class="cursor-particles"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', cursorHTML);
        
        // Initialize cursor after a short delay
        setTimeout(() => {
            if (typeof initCustomCursor === 'function') {
                initCustomCursor();
            }
        }, 100);
    }
} 