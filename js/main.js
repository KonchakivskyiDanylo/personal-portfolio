// Main JavaScript for Danylo's Portfolio

// DOM Elements
const elements = {
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('nav-menu'),
    navHamburger: document.getElementById('nav-hamburger'),
    navLinks: document.querySelectorAll('.nav-link'),
    typewriter: document.getElementById('typewriter'),
    loadingScreen: document.getElementById('loading-screen'),
    contactForm: document.getElementById('contact-form'),
    graphNetwork: document.getElementById('graph-network')
};

// Configuration
const config = {
    typewriterTexts: [
        'AI Developer & Researcher',
        'Mathematics Enthusiast',
        'Machine Learning Engineer',
        'Problem Solver',
        'Innovation Driver'
    ],
    typewriterSpeed: 100,
    typewriterDelay: 2000
};

// State
let currentTypewriterIndex = 0;
let isScrolling = false;
let currentSection = 'home';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    console.log('🚀 Initializing Danylo\'s Portfolio...');

    // Initialize core features
    initializeNavigation();
    initializeTypewriter();
    initializeScrollEffects();
    initializeLoadingScreen();
    initializeGraphNetwork();
    initializeContactForm();
    initializeAnimations();
    initializeBackToTop();

    console.log('✅ Portfolio initialized successfully!');
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    if (elements.navHamburger) {
        elements.navHamburger.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scrolling for navigation links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);

    // Active section highlighting
    window.addEventListener('scroll', throttle(updateActiveSection, 100));
}

// Mobile menu toggle
function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
    elements.navHamburger.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

// Handle navigation link clicks
function handleNavLinkClick(e) {
    e.preventDefault();

    const targetId = e.target.getAttribute('href');

    if (targetId.endsWith('.html')) {
        window.location.href = targetId;
        return;
    }

    const targetSection = document.querySelector(targetId);

    if (targetSection) {
        // Close mobile menu if open
        elements.navMenu.classList.remove('active');
        elements.navHamburger.classList.remove('active');
        document.body.classList.remove('menu-open');

        // Smooth scroll to section
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Update active link
        updateActiveNavLink(targetId.substring(1));
    }
}

// Handle navbar scroll effects
function handleNavbarScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    currentSection = sectionId;
}

// Update active section based on scroll position
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            if (currentSection !== sectionId) {
                updateActiveNavLink(sectionId);
            }
        }
    });
}

// Typewriter effect
function initializeTypewriter() {
    if (!elements.typewriter) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentText = config.typewriterTexts[textIndex];

        if (isDeleting) {
            elements.typewriter.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % config.typewriterTexts.length;
                setTimeout(typeWriter, 500);
                return;
            }
        } else {
            elements.typewriter.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeWriter, config.typewriterDelay);
                return;
            }
        }

        setTimeout(typeWriter, isDeleting ? 50 : config.typewriterSpeed);
    }

    // Start typewriter effect
    setTimeout(typeWriter, 1000);
}

// Loading screen
function initializeLoadingScreen() {
    if (!elements.loadingScreen) return;

    // Simulate loading time
    setTimeout(() => {
        elements.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// Graph network visualization using Three.js
function initializeGraphNetwork() {
    if (!elements.graphNetwork) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: elements.graphNetwork,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create nodes and connections
    const nodes = [];
    const connections = [];
    const nodeCount = 50;

    // Node geometry and material
    const nodeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8
    });

    // Connection material
    const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.3
    });

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        node.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        );
        nodes.push(node);
        scene.add(node);
    }

    // Create connections between nearby nodes
    function createConnections() {
        // Clear existing connections
        connections.forEach(connection => scene.remove(connection));
        connections.length = 0;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].position.distanceTo(nodes[j].position);
                if (distance < 2) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        nodes[i].position,
                        nodes[j].position
                    ]);
                    const line = new THREE.Line(geometry, connectionMaterial);
                    connections.push(line);
                    scene.add(line);
                }
            }
        }
    }

    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Move nodes
        nodes.forEach(node => {
            node.position.add(node.velocity);

            // Bounce off boundaries
            if (Math.abs(node.position.x) > 5) node.velocity.x *= -1;
            if (Math.abs(node.position.y) > 5) node.velocity.y *= -1;
            if (Math.abs(node.position.z) > 5) node.velocity.z *= -1;
        });

        // Update connections every few frames
        if (Math.random() < 0.1) {
            createConnections();
        }

        // Rotate scene slightly
        scene.rotation.y += 0.001;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Scroll effects and animations
function initializeScrollEffects() {

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Contact form handling
function initializeContactForm() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener('submit', handleContactFormSubmit);
}

const EMAILJS_CONFIG = {
    serviceID: 'service_53lvgle',
    templateID: 'template_rm4cmfu',
    publicKey: 'CvFywMvQbzPIibdFQ'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

// Handle contact form submission
async function handleContactFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(elements.contactForm);
    const templateParams = {
        name: formData.get('name'),
        from_email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Add loading state
    const submitButton = elements.contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParams
        );

        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        elements.contactForm.reset();

    } catch (error) {
        console.error('EmailJS error:', error);
        showNotification('Failed to send message. Please try again or contact me directly.', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Initialize animations
function initializeAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons');

    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';

        setTimeout(() => {
            element.style.transition = 'all 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
    });
}

// Utility function: throttle
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}


// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Projects data
const projectsData = [
    {
        id: 1,
        title: "Ukrainian Air Alert System",
        description: "Real-time air alert monitoring system for Ukraine with 80% accuracy in threat detection.",
        technologies: ["Python", "Machine Learning", "AWS", "API Integration"],
        github: "https://github.com/KonchakivskyiDanylo/PythonForDs",
        demo: "#",
        featured: true,
        status: "ML Project"
    },
    {
        id: 2,
        title: "Legal Assistant Telegram Chatbot",
        description: "AI-powered legal assistant providing consultation and document analysis.",
        technologies: ["Python", "Telegram Bot", "OpenAI API", "UpWork", "Heroku"],
        github: "https://github.com/KonchakivskyiDanylo/law-tg-bot",
        demo: "#",
        featured: true,
        status: "UpWork Project"
    },
    {
        id: 3,
        title: "Volleyball Team Management Platform",
        description: "Production team management system with automated scheduling, voting workflows, and payment processing for active users.",
        technologies: ["Python", "Telegram Bot", "MongoDB", "Heroku", "Workflow Automation"],
        github: "https://github.com/KonchakivskyiDanylo/volleyball-tg-bot",
        demo: "#",
        featured: true,
        status: "In Production"
    }

];

// Generate project cards
function generateProjectCards() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    const projectCards = projectsData.map(project => `
        <div class="project-card ${project.featured ? 'featured' : ''}" data-project-id="${project.id}">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-status">${project.status}</span>
            </div>
            <div class="project-content">
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <a href="projects/${project.id === 1 ? 'air-alert-system' :
        project.id === 2 ? 'legal-bot' :
            project.id === 3 ? 'volleyball' : 'default'}.html" class="btn btn-primary">
                        View Details
                    </a>
                    <a href="${project.github}" class="btn btn-secondary" target="_blank">
                        <i class="icon-github"></i>
                        GitHub
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    const viewAllButton = `
        <div class="view-all-projects">
            <a href="../projects.html" class="btn btn-outline">
                <span>View All Projects</span>
                <i class="icon-arrow-right"></i>
            </a>
        </div>
    `;

    projectsGrid.innerHTML = projectCards + viewAllButton;
}

// Back to Top Button functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    // Show/hide button based on scroll position
    const toggleBackToTopButton = () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    };

    // Smooth scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Event listeners
    window.addEventListener('scroll', throttle(toggleBackToTopButton, 100));
    backToTopButton.addEventListener('click', scrollToTop);

    console.log('✅ Back to Top button initialized');
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    generateProjectCards();
});

// Export functions for potential use in other files
window.PortfolioApp = {
    showNotification,
    updateActiveNavLink,
    projectsData
};