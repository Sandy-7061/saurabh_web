/**
 * Cursor.js - Custom JCB bulldozer cursor functionality
 * Creates an interactive cursor that follows mouse movements with construction-themed effects
 */

document.addEventListener('DOMContentLoaded', function() {
    initCustomCursor();
    initParticlesEffect();
});

// Initialize custom cursor functionality
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorImg = document.querySelector('#cursor-img');
    
    if (!cursor || !cursorImg) return;
    
    // Create cursor follower element if it doesn't exist
    let follower = cursor.querySelector('.cursor-follower');
    if (!follower) {
        follower = document.createElement('div');
        follower.className = 'cursor-follower';
        cursor.appendChild(follower);
    }
    
    // Create cursor dot element if it doesn't exist
    let cursorDot = cursor.querySelector('.cursor-dot');
    if (!cursorDot) {
        cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        cursor.appendChild(cursorDot);
    }
    
    // Create cursor particles container if it doesn't exist
    let particlesContainer = cursor.querySelector('.cursor-particles');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'cursor-particles';
        cursor.appendChild(particlesContainer);
    }
    
    // Get initial cursor position from mouse position or center of screen
    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;
    
    // Initialize all positions to the same starting point to prevent jumping
    let mouseX = initialX;
    let mouseY = initialY;
    let currentScale = 1;
    let rotation = 0;
    
    // Track if cursor is visible and active
    let isVisible = true;
    let isActive = true;
    let lastMoveTime = Date.now();
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    
    // Make sure all cursor elements are visible
    makeVisible();
    
    // Update cursor position directly without smoothing
    function updateCursorPosition(e) {
        if (!isActive) return;
        
        // Store previous position for movement direction
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        
        // Update mouse position
        mouseX = e ? e.clientX : mouseX;
        mouseY = e ? e.clientY : mouseY;
        
        // Calculate movement direction for rotation
        const dx = mouseX - lastMouseX;
        const movement = Math.abs(dx);
        
        // Only update rotation if there's significant movement
        if (movement > 2) {
            // Calculate rotation based on movement direction
            rotation = Math.min(Math.max(dx * 0.1, -15), 15);
        }
        
        // Update cursor position directly
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        // Update JCB image rotation based on movement direction
        cursorImg.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${currentScale})`;
        
        // Record last movement time
        lastMoveTime = Date.now();
        
        // Add moving class for animation
        cursor.classList.add('moving');
        
        // Create dust particles occasionally
        if (Math.random() > 0.7) {
            createDustParticle(mouseX, mouseY);
        }
    }
    
    // Helper function to make cursor visible
    function makeVisible() {
        isVisible = true;
        cursor.classList.add('visible');
        cursor.style.opacity = '1';
        cursor.style.visibility = 'visible';
        cursor.style.display = 'block';
        
        // Make sure all cursor elements are also visible
        cursorImg.style.display = 'block';
        cursorImg.style.visibility = 'visible';
        cursorImg.style.opacity = '1';
        
        follower.style.display = 'block';
        follower.style.visibility = 'visible';
        follower.style.opacity = '1';
        
        cursorDot.style.display = 'block';
        cursorDot.style.visibility = 'visible';
        cursorDot.style.opacity = '1';
    }
    
    // Mouse move event - directly update cursor position
    document.addEventListener('mousemove', function(e) {
        updateCursorPosition(e);
        
        // Make cursor visible if it wasn't already
        if (!isVisible) {
            makeVisible();
        }
        
        // Ensure cursor is active
        isActive = true;
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause cursor updates
            isActive = false;
        } else {
            // Page is visible again, resume cursor updates
            isActive = true;
            makeVisible();
        }
    });
    
    // Ensure cursor stays visible when mouse enters window
    document.addEventListener('mouseenter', function(e) {
        updateCursorPosition(e);
        isActive = true;
        makeVisible();
    });
    
    // Handle cursor when mouse leaves window
    document.addEventListener('mouseleave', function() {
        // Don't hide the cursor, just keep it where it is
        isActive = true;
    });
    
    // Cursor interactions for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, select, [role="button"]');
    
    interactiveElements.forEach(el => {
        // Mouse enter interactive element
        el.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-active');
            currentScale = 1.2;
            // Update the transform to apply the new scale
            cursorImg.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${currentScale})`;
        });
        
        // Mouse leave interactive element
        el.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-active');
            currentScale = 1;
            // Update the transform to apply the new scale
            cursorImg.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${currentScale})`;
        });
    });
    
    // Create dust particles effect on movement
    function createDustParticle(x, y) {
        // Limit the rate of particle creation
        if (Math.random() > 0.3) return;
        
        const particles = cursor.querySelector('.cursor-particles');
        if (!particles) return;
        
        // Create a new particle
        const particle = document.createElement('div');
        particle.className = 'dust-particle';
        
        // Random position around cursor
        const offsetX = Math.random() * 20 - 10;
        const offsetY = Math.random() * 20;  // More particles below cursor
        
        // Set particle styles
        particle.style.left = `${offsetX}px`;
        particle.style.top = `${offsetY}px`;
        particle.style.opacity = Math.random() * 0.5 + 0.5;
        particle.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        
        // Add particle to DOM
        particles.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            if (particles.contains(particle)) {
                particles.removeChild(particle);
            }
        }, 1000);
    }
    
    // Show cursor effect on click
    document.addEventListener('mousedown', function(e) {
        cursor.classList.add('cursor-click');
        
        // Create click splash effect
        const splash = document.createElement('div');
        splash.className = 'cursor-splash';
        splash.style.left = `${e.clientX}px`;
        splash.style.top = `${e.clientY}px`;
        document.body.appendChild(splash);
        
        // Create additional particles for click
        for (let i = 0; i < 5; i++) {
            createDustParticle(mouseX, mouseY);
        }
        
        // Remove splash after animation completes
        setTimeout(() => {
            if (document.body.contains(splash)) {
                document.body.removeChild(splash);
            }
        }, 700);
    });
    
    document.addEventListener('mouseup', function() {
        cursor.classList.remove('cursor-click');
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Add fallback for touch devices
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }
    
    // Failsafe: Check cursor visibility periodically
    setInterval(() => {
        if (!cursor.classList.contains('visible') || 
            cursor.style.opacity !== '1' || 
            cursor.style.visibility !== 'visible') {
            makeVisible();
        }
        
        // Remove moving class if no movement for a while
        if (Date.now() - lastMoveTime > 150) {
            cursor.classList.remove('moving');
        }
    }, 500);
    
    // Handle window resize - reposition cursor to prevent it from getting lost
    window.addEventListener('resize', function() {
        // Only reset position if the cursor might be off-screen
        if (mouseX > window.innerWidth || mouseY > window.innerHeight) {
            mouseX = window.innerWidth / 2;
            mouseY = window.innerHeight / 2;
            updateCursorPosition();
        }
    });
    
    // Initial cursor position update
    updateCursorPosition();
}

// Initialize particles.js for background particles
function initParticlesEffect() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('login-3d-scene', {
            particles: {
                number: {
                    value: 50,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffcc00'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffcc00',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 3,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
} 