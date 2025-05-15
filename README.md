# JrdBuilders Website

A modern, responsive, and interactive website for JrdBuilders construction company, featuring 3D animations, custom cursor effects, and more.

## Features

- Responsive design optimized for desktop, tablet, and mobile
- 3D animations and models using Three.js
- Custom JCB bulldozer cursor follower with interactive effects
- Smooth scrolling and page transitions
- Multiple HTML pages for different sections
- Contact form with email functionality
- Dark/light theme toggle
- Shimmer effects, click effects, and particle animations

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local server (VS Code Live Server, Python's http.server, etc.)

### Installation

1. Clone or download this repository
2. Host the files on a local server:
   - Using Python: `python -m http.server`
   - Using VS Code: Install Live Server extension and click "Go Live"
3. Open `index.html` in your browser

### Email Configuration

To enable the contact form functionality:

1. Sign up for EmailJS (https://www.emailjs.com/)
2. Update the EmailJS credentials in `js/email.js` with your own:
   ```javascript
   const emailConfig = {
     serviceID: 'YOUR_SERVICE_ID',
     templateID: 'YOUR_TEMPLATE_ID',
     userID: 'YOUR_USER_ID'
   };
   ```

## Project Structure

- `/` - Root directory containing HTML files
- `/css` - Stylesheets
- `/js` - JavaScript files
- `/assets` - Images and other assets

## Pages

- Home (`index.html`)
- Projects (`projects.html`)
- Ongoing Projects (`ongoing-projects.html`)
- Team (`team.html`)
- Contact (`contact.html`)
- Login (`login.html`)

## Libraries Used

- Three.js - For 3D models and animations
- GSAP - For advanced animations
- EmailJS - For contact form functionality
- Particles.js - For particle effects 