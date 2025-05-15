/**
 * Contact.js - JrdBuilders Contact Page Scripts
 * Contains functionality for the contact page including form validation,
 * FAQ accordion, and map interaction
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form validation
    initContactForm();
    
    // Initialize FAQ accordion
    initFaqAccordion();
    
    // Initialize animations
    initAnimations();
    
    // Initialize smooth scroll for CTA links
    initSmoothScroll();
});

/**
 * Initialize contact form validation and submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm(contactForm)) {
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (in a real-world scenario, this would be an AJAX call)
            setTimeout(function() {
                // Reset form
                contactForm.reset();
                
                // Show success message
                showFormMessage('Your message has been sent successfully. We\'ll get back to you soon!', 'success');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
    
    // Add input event listeners for real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

/**
 * Validate the entire form
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate a single form field
 */
function validateField(field) {
    // Check if field is required
    if (field.hasAttribute('required')) {
        if (field.value.trim() === '') {
            setFieldError(field, 'This field is required');
            return false;
        }
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            setFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation (optional)
    if (field.id === 'phone' && field.value.trim() !== '') {
        const phoneRegex = /^[\d\s\-+()]{7,20}$/;
        if (!phoneRegex.test(field.value.trim())) {
            setFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Clear any error
    clearFieldError(field);
    return true;
}

/**
 * Set error state and message for a field
 */
function setFieldError(field, message) {
    // Remove any existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('is-invalid');
    
    // Create and append error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    // Insert after the field
    field.parentNode.appendChild(errorMessage);
}

/**
 * Clear error state and message for a field
 */
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    
    // Remove any existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Show form message (success/error)
 */
function showFormMessage(message, type) {
    const contactForm = document.getElementById('contactForm');
    
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    
    // Insert at the top of the form
    contactForm.insertBefore(messageElement, contactForm.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        messageElement.classList.add('fade-out');
        setTimeout(function() {
            messageElement.remove();
        }, 500);
    }, 5000);
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    // Open the first FAQ item by default
    faqItems[0].classList.add('active');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Toggle active class
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // If it wasn't active, make it active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
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
    
    // Contact info animation
    gsap.from('.contact-info', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-container',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
    
    // Contact form animation
    gsap.from('.contact-form', {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-container',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
    
    // Map frame animation
    gsap.from('.map-frame', {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.map-container',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
    
    // Location info animation
    gsap.from('.location-info', {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.map-container',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
    
    // FAQ items animation
    gsap.from('.faq-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.faq-container',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        }
    });
}

/**
 * Initialize smooth scroll for CTA links
 */
function initSmoothScroll() {
    const ctaBtn = document.querySelector('.cta-btn');
    
    if (!ctaBtn) return;
    
    ctaBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Calculate position to scroll to
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            // Smooth scroll to target
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Focus the first input field
            setTimeout(function() {
                const firstInput = targetElement.querySelector('input, textarea');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 800);
        }
    });
} 