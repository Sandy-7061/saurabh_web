/**
 * Home.js - Home page specific functionality
 * Includes sliders, carousels, and interactive elements for the home page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize home page specific features
    if (document.querySelector('.hero')) {
        initTaglineRotator();
        initProjectSlider();
        initTestimonialCarousel();
        initTimeline();
        initServiceCards();
    }
});

// Tagline rotator in about section
function initTaglineRotator() {
    const taglines = document.querySelectorAll('.tagline-rotator .tagline');
    if (taglines.length === 0) return;
    
    let currentTagline = 0;
    
    // Set interval to rotate taglines
    setInterval(() => {
        // Remove active class from current tagline
        taglines[currentTagline].classList.remove('active');
        
        // Update current tagline index
        currentTagline = (currentTagline + 1) % taglines.length;
        
        // Add active class to new tagline
        taglines[currentTagline].classList.add('active');
    }, 3000);
}

// Featured projects slider
function initProjectSlider() {
    const sliderContainer = document.querySelector('.project-slider');
    const slides = document.querySelectorAll('.project-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    if (!sliderContainer || slides.length === 0) return;
    
    let currentSlide = 0;
    let slideWidth = slides[0].offsetWidth;
    let autoplayInterval;
    
    // Update slide width on window resize
    window.addEventListener('resize', () => {
        slideWidth = slides[0].offsetWidth;
        goToSlide(currentSlide);
    });
    
    // Function to go to a specific slide
    function goToSlide(index) {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        currentSlide = index;
        
        // Update slider position with smooth transition
        sliderContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Event listeners for navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetAutoplay();
        });
    }
    
    // Add click event to dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoplay();
        });
    });
    
    // Touch events for mobile swiping
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, go to next slide
            goToSlide(currentSlide + 1);
            resetAutoplay();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, go to previous slide
            goToSlide(currentSlide - 1);
            resetAutoplay();
        }
    }
    
    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Initialize autoplay
    startAutoplay();
}

// Testimonial carousel
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.testimonial-dots .t-dot');
    
    if (!carousel || cards.length === 0) return;
    
    let currentCard = 0;
    let autoplayInterval;
    
    // Function to show a specific testimonial
    function showTestimonial(index) {
        if (index < 0) {
            index = cards.length - 1;
        } else if (index >= cards.length) {
            index = 0;
        }
        
        // Update current card index
        currentCard = index;
        
        // Hide all cards first
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.zIndex = '0';
        });
        
        // Show the current card with a fade-in effect
        cards[currentCard].style.opacity = '1';
        cards[currentCard].style.transform = 'translateY(0)';
        cards[currentCard].style.zIndex = '1';
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentCard);
        });
    }
    
    // Event listeners for navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showTestimonial(currentCard - 1);
            resetAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showTestimonial(currentCard + 1);
            resetAutoplay();
        });
    }
    
    // Add click event to dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showTestimonial(i);
            resetAutoplay();
        });
    });
    
    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            showTestimonial(currentCard + 1);
        }, 6000); // Change testimonial every 6 seconds
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Initialize first testimonial and autoplay
    showTestimonial(0);
    startAutoplay();
}

// Timeline animation
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length === 0) return;
    
    // Function to check if an element is in viewport and add animation
    function checkTimelineVisibility() {
        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
            );
            
            if (isVisible) {
                item.classList.add('animate');
            }
        });
    }
    
    // Check visibility on scroll
    window.addEventListener('scroll', debounce(checkTimelineVisibility, 10));
    
    // Initial check
    checkTimelineVisibility();
}

// Service cards hover effect
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
            
            // Add floating animation to icon
            const icon = this.querySelector('.service-icon i');
            if (icon) {
                icon.style.animation = 'float 2s ease-in-out infinite';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
            
            // Reset icon animation
            const icon = this.querySelector('.service-icon i');
            if (icon) {
                icon.style.animation = '';
            }
        });
    });
}

// Debounce function to limit frequency of execution (from main.js)
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