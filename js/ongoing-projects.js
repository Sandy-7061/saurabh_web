/**
 * Ongoing-Projects.js - Ongoing projects page specific functionality
 * Includes carousel, countdown timers, progress tracking, and modal interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize ongoing projects page specific features
    if (document.querySelector('.ongoing-projects')) {
        initProjectsCarousel();
        initCountdownTimers();
        initProjectsModal();
        init3DContainers();
    }
});

// Projects carousel functionality
function initProjectsCarousel() {
    const carousel = document.querySelector('.projects-carousel');
    const cards = document.querySelectorAll('.ongoing-project-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (!carousel || cards.length === 0) return;
    
    let currentCard = 0;
    let cardWidth = cards[0].offsetWidth;
    let autoplayInterval;
    
    // Update card width on window resize
    window.addEventListener('resize', () => {
        cardWidth = cards[0].offsetWidth;
        goToCard(currentCard);
    });
    
    // Function to go to a specific card
    function goToCard(index) {
        if (index < 0) {
            index = cards.length - 1;
        } else if (index >= cards.length) {
            index = 0;
        }
        
        currentCard = index;
        
        // Use GSAP for smooth transitions if available
        if (typeof gsap !== 'undefined') {
            gsap.to(carousel, {
                x: -currentCard * cardWidth,
                duration: 0.8,
                ease: 'power2.out'
            });
        } else {
            // Fallback to standard transition
            carousel.style.transform = `translateX(-${currentCard * cardWidth}px)`;
        }
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentCard);
        });
    }
    
    // Event listeners for navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToCard(currentCard - 1);
            resetAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToCard(currentCard + 1);
            resetAutoplay();
        });
    }
    
    // Add click event to dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToCard(i);
            resetAutoplay();
        });
    });
    
    // Touch events for mobile swiping
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, go to next card
            goToCard(currentCard + 1);
            resetAutoplay();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, go to previous card
            goToCard(currentCard - 1);
            resetAutoplay();
        }
    }
    
    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToCard(currentCard + 1);
        }, 7000); // Change card every 7 seconds
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Initialize autoplay
    startAutoplay();
    
    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        startAutoplay();
    });
}

// Countdown timers functionality
function initCountdownTimers() {
    const countdownElements = document.querySelectorAll('.countdown-timer');
    
    if (countdownElements.length === 0) return;
    
    countdownElements.forEach(element => {
        const daysRemaining = parseInt(element.getAttribute('data-days'), 10);
        
        if (isNaN(daysRemaining)) return;
        
        // Use GSAP for counting animation if available
        if (typeof gsap !== 'undefined') {
            gsap.to(element, {
                innerText: daysRemaining,
                duration: 2,
                snap: { innerText: 1 }, // Snap to whole numbers
                ease: 'power2.out',
                delay: 0.5
            });
        } else {
            // Fallback to simple display
            element.textContent = daysRemaining;
        }
        
        // Add color class based on days remaining
        if (daysRemaining <= 60) {
            element.classList.add('urgent');
        } else if (daysRemaining <= 120) {
            element.classList.add('approaching');
        } else {
            element.classList.add('on-schedule');
        }
    });
}

// Project modal functionality
function initProjectsModal() {
    const viewButtons = document.querySelectorAll('.view-details-btn');
    const modal = document.querySelector('.project-details-modal');
    const modalContent = document.querySelector('.project-details-modal .modal-content');
    const modalClose = document.querySelector('.project-details-modal .modal-close');
    const modalOverlay = document.querySelector('.project-details-modal .modal-overlay');
    
    if (!modal || !modalContent || viewButtons.length === 0) return;
    
    // Function to open modal with project details
    function openProjectModal(projectCard) {
        // Get project data from the card
        const projectTitle = projectCard.querySelector('h3').textContent;
        const projectType = projectCard.querySelector('.project-type').textContent;
        const projectProgress = projectCard.querySelector('.progress-percentage').textContent;
        const projectImage = projectCard.querySelector('.project-image-container img').getAttribute('src');
        const projectSpecs = projectCard.querySelector('.project-specs').innerHTML;
        const projectTimeline = projectCard.querySelector('.project-timeline').cloneNode(true);
        
        // Create modal content
        const content = document.createElement('div');
        content.className = 'project-detail-content';
        
        content.innerHTML = `
            <div class="project-detail-header">
                <h2>${projectTitle}</h2>
                <span class="project-category">${projectType}</span>
                <div class="project-status">
                    <span>Current Progress: ${projectProgress}</span>
                </div>
            </div>
            <div class="project-detail-images">
                <img src="${projectImage}" alt="${projectTitle}" class="main-image">
            </div>
            <div class="project-detail-info">
                <div class="project-specs">
                    ${projectSpecs}
                </div>
                <div class="project-description">
                    <h3>Project Overview</h3>
                    <p>This ${projectType} is currently in progress with an overall completion rate of ${projectProgress}. The project is being executed with the highest standards of quality and craftsmanship that JRD Constructions & Builders is known for.</p>
                    <h3>Current Stage</h3>
                    <div class="project-timeline-container"></div>
                    <h3>Upcoming Milestones</h3>
                    <p>Follow our progress updates for the latest developments and upcoming milestones for this project.</p>
                </div>
            </div>
        `;
        
        // Clear previous content and add new content
        modalContent.innerHTML = '';
        modalContent.appendChild(content);
        
        // Add timeline to the container
        const timelineContainer = modalContent.querySelector('.project-timeline-container');
        timelineContainer.appendChild(projectTimeline);
        
        // Show modal with animation
        if (typeof gsap !== 'undefined') {
            gsap.to(modal, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out',
                onStart: function() {
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        } else {
            modal.style.display = 'flex';
            modal.style.opacity = 1;
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Function to close project modal
    function closeProjectModal() {
        if (typeof gsap !== 'undefined') {
            gsap.to(modal, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: function() {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        } else {
            modal.style.opacity = 0;
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }
    
    // Add click event to all view buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.ongoing-project-card');
            openProjectModal(projectCard);
        });
    });
    
    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }
    
    // Close modal on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeProjectModal);
    }
    
    // Close modal on ESC key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeProjectModal();
        }
    });
}

// Initialize 3D visualization containers
function init3DContainers() {
    const project1Container = document.getElementById('project1-3d');
    const project2Container = document.getElementById('project2-3d');
    const project3Container = document.getElementById('project3-3d');
    
    // Use the three-scene.js functionality if available
    if (typeof initProjectScene === 'function') {
        if (project1Container) initProjectScene(project1Container, 'project1');
        if (project2Container) initProjectScene(project2Container, 'project2');
        if (project3Container) initProjectScene(project3Container, 'project3');
    } else {
        // Fallback to simple visualization
        if (project1Container) createBasicVisualization(project1Container, 'Sunrise Towers');
        if (project2Container) createBasicVisualization(project2Container, 'Oakwood Residence');
        if (project3Container) createBasicVisualization(project3Container, 'Metro Business Hub');
    }
}

// Fallback simple visualization
function createBasicVisualization(container, projectName) {
    // Create a canvas for a basic visualization
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = 150;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw a construction-themed gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#f9b000');
    gradient.addColorStop(0.5, '#e74c3c');
    gradient.addColorStop(1, '#2c3e50');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw project name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${projectName} Construction View`, canvas.width / 2, canvas.height / 2);
    
    // Draw a simple building outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Building base
    const baseX = canvas.width / 2 - 40;
    const baseY = canvas.height - 30;
    const baseWidth = 80;
    const baseHeight = 60;
    
    // Draw floors
    for (let i = 0; i < 5; i++) {
        ctx.rect(baseX, baseY - (i * 10), baseWidth, 10);
    }
    
    // Draw crane
    ctx.moveTo(baseX + baseWidth + 10, baseY);
    ctx.lineTo(baseX + baseWidth + 10, baseY - 70);
    ctx.lineTo(baseX + baseWidth + 50, baseY - 70);
    
    ctx.stroke();
} 