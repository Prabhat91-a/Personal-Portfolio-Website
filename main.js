import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
    });
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

// Animation
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

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

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
