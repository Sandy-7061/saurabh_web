/**
 * Animations.js - GSAP animations and scroll effects
 * Creates smooth animations and scroll-triggered effects throughout the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations if GSAP is loaded
    if (typeof gsap !== 'undefined') {
        // Initialize animations with a slight delay to ensure DOM is fully ready
        setTimeout(() => {
            initHeaderAnimations();
            initHeroAnimations();
            initScrollAnimations();
            initTextAnimations();
            initHoverAnimations();
        }, 100);
    }
});

// Header animations
function initHeaderAnimations() {
    // Animate header elements on page load
    gsap.from('.header-container', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
    });
    
    gsap.from('.nav-links li', {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.8
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        
        if (!header) return;
        
        // Add shadow and background to header on scroll
        if (currentScrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollTop > lastScrollTop && currentScrollTop > 200) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = currentScrollTop;
    });
}

// Hero section animations
function initHeroAnimations() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Animate hero content
    gsap.from('.hero-content h1', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 1
    });
    
    gsap.from('.hero-content p', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.3
    });
    
    gsap.from('.hero-buttons .btn', {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.5
    });
    
    // Animate hero 3D container
    gsap.from('#hero-3d-container', {
        opacity: 0,
        scale: 0.9,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.8
    });
    
    // Text typing animation for hero heading
    const animatedText = document.querySelector('.animated-text');
    if (animatedText) {
        const text = animatedText.textContent;
        animatedText.textContent = '';
        
        // Create spans for each character
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.opacity = '0';
            animatedText.appendChild(span);
        }
        
        // Animate each character
        gsap.to('.animated-text span', {
            opacity: 1,
            stagger: 0.05,
            duration: 0.1,
            delay: 1.2,
            ease: 'none'
        });
    }
}

// Scroll-triggered animations
function initScrollAnimations() {
    // Register ScrollTrigger plugin if available
    if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // About section
        gsap.from('.about-content', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.3
        });
        
        // Services section
        gsap.from('.service-card', {
            scrollTrigger: {
                trigger: '.services',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Featured Projects section
        gsap.from('.project-slide', {
            scrollTrigger: {
                trigger: '.featured-projects',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            scale: 0.9,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });
        
        // Testimonials section
        gsap.from('.testimonial-card', {
            scrollTrigger: {
                trigger: '.testimonials',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Timeline section
        gsap.from('.timeline-item', {
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 60%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: function(i) {
                // Alternate between left and right
                return i % 2 === 0 ? -50 : 50;
            },
            stagger: 0.3,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Call to action section
        gsap.from('.cta-content', {
            scrollTrigger: {
                trigger: '.cta',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Team members (if on team page)
        gsap.from('.team-member', {
            scrollTrigger: {
                trigger: '.team-grid',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            scale: 0.8,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });
        
        // Contact form (if on contact page)
        gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // FAQ accordion (if on contact page)
        gsap.from('.accordion-item', {
            scrollTrigger: {
                trigger: '.faq-section',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            y: 20,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Ongoing projects (if on ongoing-projects page)
        gsap.from('.ongoing-project', {
            scrollTrigger: {
                trigger: '.ongoing-projects-grid',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Animate progress bars (if on ongoing-projects page)
        const progressBars = document.querySelectorAll('.progress-bar .filled');
        
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-progress') + '%';
            
            gsap.fromTo(bar, 
                { width: '0%' },
                {
                    scrollTrigger: {
                        trigger: bar,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    width: targetWidth,
                    duration: 1.5,
                    ease: 'power2.out'
                }
            );
        });
    }
}

// Text animations and effects
function initTextAnimations() {
    // Section headers animation
    gsap.from('.section-header', {
        scrollTrigger: {
            trigger: '.section-header',
            start: 'top 80%',
            toggleActions: 'play none none none',
            markers: false
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2
    });
    
    // Shimmer effect animation for images
    const shimmerImages = document.querySelectorAll('.shimmer-effect');
    
    shimmerImages.forEach(image => {
        // Add shimmer overlay
        const shimmerOverlay = document.createElement('div');
        shimmerOverlay.className = 'shimmer-overlay';
        
        // Only add if parent can have relative positioning
        if (image.parentElement && getComputedStyle(image.parentElement).position !== 'static') {
            image.parentElement.appendChild(shimmerOverlay);
            
            // Animate shimmer on hover
            image.parentElement.addEventListener('mouseenter', () => {
                gsap.to(shimmerOverlay, {
                    x: '100%',
                    duration: 1,
                    ease: 'power2.out'
                });
            });
            
            image.parentElement.addEventListener('mouseleave', () => {
                gsap.to(shimmerOverlay, {
                    x: '-100%',
                    duration: 1,
                    ease: 'power2.in'
                });
            });
        }
    });
}

// Hover animations
function initHoverAnimations() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
    });
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-slide, .project-card');
    
    projectCards.forEach(card => {
        const image = card.querySelector('img');
        const info = card.querySelector('.project-info');
        
        if (image && info) {
            card.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                gsap.to(info, {
                    y: -10,
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                gsap.to(info, {
                    y: 0,
                    opacity: 0.9,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        }
    });
    
    // Team member card flip effect (if on team page)
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const front = member.querySelector('.team-member-front');
        const back = member.querySelector('.team-member-back');
        
        if (front && back) {
            member.addEventListener('mouseenter', () => {
                gsap.to(front, {
                    rotationY: 180,
                    duration: 0.6,
                    ease: 'power2.out'
                });
                
                gsap.to(back, {
                    rotationY: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
            
            member.addEventListener('mouseleave', () => {
                gsap.to(front, {
                    rotationY: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
                
                gsap.to(back, {
                    rotationY: -180,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        }
    });
} 