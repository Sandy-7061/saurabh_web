/**
 * Team.js - JrdBuilders Team Page Scripts
 * Contains functionality for the team page including department tabs, animations,
 * and other interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize department tabs
    initDepartmentTabs();
    
    // Initialize animations
    initAnimations();
    
    // Initialize team stats counter
    initStatsCounter();
    
    // Initialize parallax effect
    initParallaxEffect();
});

/**
 * Initialize department tabs functionality
 */
function initDepartmentTabs() {
    const tabs = document.querySelectorAll('.department-tab');
    const contents = document.querySelectorAll('.department-content');
    
    if (!tabs.length || !contents.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get department from data attribute
            const department = this.getAttribute('data-department');
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all content sections
            contents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected content
            const targetContent = document.getElementById(department + '-team');
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Animate team members when tab is clicked
                animateTeamMembers(targetContent);
            }
        });
    });
}

/**
 * Animate team members when department tab is changed
 */
function animateTeamMembers(container) {
    if (!container || typeof gsap === 'undefined') return;
    
    const members = container.querySelectorAll('.team-member');
    
    gsap.fromTo(members, 
        { 
            y: 30, 
            opacity: 0 
        },
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.5, 
            stagger: 0.1, 
            ease: 'power2.out'
        }
    );
}

/**
 * Initialize GSAP animations
 */
function initAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Leadership cards animation
    gsap.from('.leader-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.leadership-grid',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
    
    // Culture content animation
    gsap.from('.culture-content', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.culture-section',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
    
    // Culture gallery animation
    gsap.from('.gallery-item', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.culture-gallery',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
    
    // Job cards animation
    gsap.from('.job-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.jobs-grid',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
}

/**
 * Initialize team stats counter animation
 */
function initStatsCounter() {
    const statValues = document.querySelectorAll('.stat-value');
    
    if (!statValues.length) return;
    
    // Animate number counters
    statValues.forEach(stat => {
        const target = parseInt(stat.textContent);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        // Clone the Node to get a clean element without the "+" added by CSS
        const countUp = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(countUp);
            } else {
                stat.textContent = target;
            }
        };
        
        // Start counter animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

/**
 * Initialize parallax effect on hero section
 */
function initParallaxEffect() {
    const heroParallax = document.querySelector('.hero-parallax');
    
    if (!heroParallax) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        // Apply parallax effect
        heroParallax.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
    });
    
    // Mouse move parallax effect
    const heroSection = document.querySelector('.team-hero');
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            
            heroParallax.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
} 