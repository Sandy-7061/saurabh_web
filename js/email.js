/**
 * Email.js - EmailJS integration
 * Handles sending emails through EmailJS service
 */

// Send email using EmailJS
function sendEmail(formData) {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded');
        return Promise.reject(new Error('EmailJS is not loaded'));
    }

    // Prepare template parameters
    const templateParams = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        message: formData.message,
        project_type: formData.projectType || 'Not specified'
    };

    // EmailJS service information
    const serviceID = 'service_jrdbuilders'; // Replace with your EmailJS service ID
    const templateID = 'template_contact_form'; // Replace with your EmailJS template ID
    
    // Send the email
    return emailjs.send(serviceID, templateID, templateParams)
        .then(response => {
            console.log('Email sent successfully:', response);
            return response;
        })
        .catch(error => {
            console.error('Failed to send email:', error);
            throw error;
        });
}

// Initialize EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Check if EmailJS is loaded and initialized
    if (typeof emailjs !== 'undefined' && !emailjs.init.mock) {
        // EmailJS is properly initialized in contact.html
        console.log('EmailJS is ready');
    } else {
        console.warn('EmailJS is not properly initialized. Contact form will use fallback functionality.');
    }
});

// Helper function to validate email address format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to create a fallback email link
function createMailtoLink(formData) {
    if (!formData || !formData.email || !isValidEmail(formData.email)) {
        return null;
    }
    
    const subject = `Contact Request from ${formData.name} - JrdBuilders`;
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Project Type: ${formData.projectType || 'Not specified'}

Message:
${formData.message}
    `;
    
    return `mailto:info@jrdbuilders.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Fallback function if EmailJS fails
function emailFallback(formData) {
    // Create mailto link
    const mailtoLink = createMailtoLink(formData);
    
    if (mailtoLink) {
        // Notify user about fallback
        const fallbackMsg = 'Our email service is currently experiencing issues. Please click OK to open your email client and send the message manually.';
        
        if (confirm(fallbackMsg)) {
            window.location.href = mailtoLink;
            return Promise.resolve({ success: true, fallback: true });
        } else {
            return Promise.reject(new Error('User cancelled fallback email'));
        }
    } else {
        return Promise.reject(new Error('Could not create fallback email'));
    }
} 