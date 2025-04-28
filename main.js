import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Remove ES module imports since we're using CDN
// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

document.addEventListener('mousedown', () => {
    gsap.to(cursor, { scale: 0.5, duration: 0.2 });
    gsap.to(cursorFollower, { scale: 0.8, duration: 0.2 });
});

document.addEventListener('mouseup', () => {
    gsap.to(cursor, { scale: 1, duration: 0.2 });
    gsap.to(cursorFollower, { scale: 1, duration: 0.2 });
});

// Three.js Scene
const canvas = document.getElementById('canvas3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create a more complex geometry
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material = new THREE.MeshPhongMaterial({
    color: 0x2563eb,
    shininess: 100,
    transparent: true,
    opacity: 0.8,
    wireframe: true
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Add more lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x3b82f6, 0.5);
pointLight2.position.set(-5, -5, -5);
scene.add(pointLight2);

camera.position.z = 5;

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.005;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.005;
});

// Mobile menu functionality
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Close mobile menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Performance optimization for Three.js
let isMobile = window.innerWidth <= 768;
let animationFrameId;

// Optimize Three.js for mobile
if (isMobile) {
    geometry = new THREE.TorusKnotGeometry(1, 0.3, 50, 8); // Reduced complexity
    material.opacity = 0.6;
    renderer.setPixelRatio(1); // Lower pixel ratio for mobile
}

// Animation function
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth mouse movement
    targetX = mouseX;
    targetY = mouseY;
    
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    
    // Add mouse influence
    torusKnot.rotation.x += (targetY - torusKnot.rotation.x) * 0.05;
    torusKnot.rotation.y += (targetX - torusKnot.rotation.y) * 0.05;
    
    // Pulsing effect
    const time = Date.now() * 0.001;
    torusKnot.scale.x = 1 + Math.sin(time) * 0.1;
    torusKnot.scale.y = 1 + Math.sin(time) * 0.1;
    torusKnot.scale.z = 1 + Math.sin(time) * 0.1;
    
    renderer.render(scene, camera);
}

// Start the animation
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Cleanup function
function cleanup() {
    cancelAnimationFrame(animationFrameId);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    scene.remove(torusKnot);
    
    // Remove event listeners
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mouseup', handleMouseUp);
}

// Add cleanup on page unload
window.addEventListener('unload', cleanup);

// GSAP Animations
gsap.from('.hero h1', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
});

gsap.from('.hero p', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 1,
    ease: 'power3.out'
});

// Scroll animations
gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: target,
                offsetY: 70
            },
            ease: 'power2.inOut'
        });
    });
});

// Project card animations
const projectCards = document.querySelectorAll('.project-card');

// Animate project cards on scroll
projectCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out',
        onComplete: () => {
            card.classList.add('animate');
        }
    });
});

// Add hover effect for project cards
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add hover effect to links
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
        cursorFollower.style.borderColor = 'var(--accent-color)';
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
        cursorFollower.style.borderColor = 'var(--primary-color)';
    });
});

// Copy button functionality
document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
        const textToCopy = button.getAttribute('data-text');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    });
});

// Form Validation and Submission
const contactForm = document.getElementById('contact-form');
const formGroups = contactForm.querySelectorAll('.form-group');

// Validation patterns
const patterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    subject: /^[\w\s-]{5,100}$/,
    message: /^[\w\s.,!?-]{10,500}$/
};

// Error messages
const errorMessages = {
    name: 'Please enter a valid name (2-50 characters, letters only)',
    email: 'Please enter a valid email address',
    subject: 'Please enter a valid subject (5-100 characters)',
    message: 'Please enter a message (10-500 characters)'
};

// Validate form fields
function validateField(input) {
    const field = input.id;
    const value = input.value.trim();
    const errorElement = input.nextElementSibling;
    
    if (!patterns[field].test(value)) {
        input.classList.add('error');
        errorElement.textContent = errorMessages[field];
        errorElement.classList.add('visible');
        return false;
    }
    
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
    return true;
}

// Add validation on input
formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    input.addEventListener('input', () => validateField(input));
    input.addEventListener('blur', () => validateField(input));
});

// Handle form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) return;
    
    // Add loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    contactForm.classList.add('loading');
    
    try {
        // Collect form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API call (replace with actual API endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        contactForm.reset();
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            input.classList.remove('error');
            const errorElement = input.nextElementSibling;
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
        });
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Remove loading state
        submitBtn.disabled = false;
        contactForm.classList.remove('loading');
    }
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Copy email functionality
const copyBtn = document.querySelector('.copy-btn');
copyBtn.addEventListener('click', () => {
    const email = copyBtn.previousElementSibling.textContent;
    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy email.', 'error');
    });
});

// Location button functionality
const locationBtn = document.querySelector('.location-btn');
locationBtn.addEventListener('click', () => {
    const location = 'Raipur, Chhattisgarh, India';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
}); 
