/**
 * Login.js - Login, signup, and password reset functionality
 * Handles user authentication and account management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login page functionality
    if (document.getElementById('loginForm')) {
        initLoginForm();
        initPasswordToggle();
        initModals();
    }
});

// Initialize login form functionality
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const signupForm = document.getElementById('signupForm');
    
    // Success and error messages
    const loginSuccess = document.getElementById('loginSuccess');
    const loginError = document.getElementById('loginError');
    const resetSuccess = document.getElementById('resetSuccess');
    const resetError = document.getElementById('resetError');
    const signupSuccess = document.getElementById('signupSuccess');
    const signupError = document.getElementById('signupError');
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            
            // Validate inputs
            if (!validateEmail(email)) {
                showMessage(loginError, 'Please enter a valid email address.');
                return;
            }
            
            if (password.length < 6) {
                showMessage(loginError, 'Password must be at least 6 characters.');
                return;
            }
            
            // Simulate login API call
            simulateApiCall('login', { email, password, rememberMe })
                .then(response => {
                    // Show success message
                    showMessage(loginSuccess, 'Login successful! Redirecting to dashboard...');
                    
                    // Store login state if remember me is checked
                    if (rememberMe) {
                        localStorage.setItem('JRD Constructions & Builders_email', email);
                        localStorage.setItem('JRD Constructions & Builders_logged_in', 'true');
                    } else {
                        sessionStorage.setItem('JRD Constructions & Builders_logged_in', 'true');
                    }
                    
                    // Redirect to dashboard after delay
                    setTimeout(() => {
                        // For demo purposes, redirect to home page
                        window.location.href = 'index.html';
                    }, 2000);
                })
                .catch(error => {
                    // Show error message
                    showMessage(loginError, error.message);
                });
        });
    }
    
    // Handle forgot password form submission
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form input
            const email = document.getElementById('resetEmail').value;
            
            // Validate email
            if (!validateEmail(email)) {
                showMessage(resetError, 'Please enter a valid email address.');
                return;
            }
            
            // Simulate API call
            simulateApiCall('resetPassword', { email })
                .then(response => {
                    // Show success message
                    showMessage(resetSuccess, 'Password reset link sent! Please check your email.');
                    
                    // Reset form
                    forgotPasswordForm.reset();
                    
                    // Close modal after delay
                    setTimeout(() => {
                        closeModal('forgotPasswordModal');
                    }, 3000);
                })
                .catch(error => {
                    // Show error message
                    showMessage(resetError, error.message);
                });
        });
    }
    
    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('terms').checked;
            
            // Validate inputs
            if (fullName.length < 3) {
                showMessage(signupError, 'Please enter your full name.');
                return;
            }
            
            if (!validateEmail(email)) {
                showMessage(signupError, 'Please enter a valid email address.');
                return;
            }
            
            if (password.length < 8) {
                showMessage(signupError, 'Password must be at least 8 characters.');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage(signupError, 'Passwords do not match.');
                return;
            }
            
            if (!agreeTerms) {
                showMessage(signupError, 'You must agree to the Terms of Service.');
                return;
            }
            
            // Simulate API call
            simulateApiCall('signup', { fullName, email, password })
                .then(response => {
                    // Show success message
                    showMessage(signupSuccess, 'Account created successfully! You can now log in.');
                    
                    // Reset form
                    signupForm.reset();
                    
                    // Close modal after delay
                    setTimeout(() => {
                        closeModal('signupModal');
                    }, 3000);
                })
                .catch(error => {
                    // Show error message
                    showMessage(signupError, error.message);
                });
        });
    }
    
    // Function to validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Function to show message
    function showMessage(element, message) {
        if (element) {
            // If element has a <p> child, update its text
            const messageElement = element.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
            
            // Show the message element
            element.style.display = 'flex';
            
            // Hide error messages after 5 seconds
            if (element.id.includes('Error')) {
                setTimeout(() => {
                    element.style.display = 'none';
                }, 5000);
            }
        }
    }
}

// Initialize password toggle functionality
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle password visibility
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Initialize modal functionality
function initModals() {
    // Modal elements
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const signupLink = document.getElementById('signupLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const signupModal = document.getElementById('signupModal');
    const closeButtons = document.querySelectorAll('.modal-close, .modal-overlay');
    
    // Open forgot password modal
    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(forgotPasswordModal);
        });
    }
    
    // Open signup modal
    if (signupLink && signupModal) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(signupModal);
        });
    }
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.active');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
    
    // Function to open modal
    function openModal(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            
            // Hide any visible messages
            const messages = modal.querySelectorAll('.modal-message');
            messages.forEach(message => {
                message.style.display = 'none';
            });
        }
    }
}

// Function to close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Reset form if modal contains one
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        
        // Hide any visible messages
        const messages = modal.querySelectorAll('.modal-message');
        messages.forEach(message => {
            message.style.display = 'none';
        });
    }
}

// Simulate API calls for login, signup, and password reset
function simulateApiCall(action, data) {
    return new Promise((resolve, reject) => {
        // Add delay to simulate network request
        setTimeout(() => {
            // For demo purposes, we'll just simulate success and failure scenarios
            
            switch (action) {
                case 'login':
                    // Demo login logic - in a real app, this would call a backend API
                    if (data.email === 'admin@JRD Constructions & Builders.com' && data.password === 'admin123') {
                        resolve({ success: true, user: { name: 'Admin User' } });
                    } else if (data.email === 'demo@example.com' && data.password === 'password') {
                        resolve({ success: true, user: { name: 'Demo User' } });
                    } else {
                        reject(new Error('Invalid email or password.'));
                    }
                    break;
                    
                case 'signup':
                    // Demo signup logic
                    if (data.email === 'admin@JRD Constructions & Builders.com') {
                        reject(new Error('Email is already in use.'));
                    } else {
                        resolve({ success: true });
                    }
                    break;
                    
                case 'resetPassword':
                    // Demo password reset logic
                    resolve({ success: true });
                    break;
                    
                default:
                    reject(new Error('Unknown action.'));
            }
        }, 1500); // 1.5 second delay
    });
} 