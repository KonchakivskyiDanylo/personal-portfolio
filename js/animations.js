// Animation Controller for Danylo's Portfolio

class AnimationController {
    constructor() {
        this.observers = [];
        this.animatedElements = new Set();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    init() {
        if (this.isReducedMotion) {
            console.log('Reduced motion detected - animations disabled');
            return;
        }

        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupParallaxEffects();
        this.setupMathematicalAnimations();
        this.setupProgressBars();
        this.setupFormAnimations();

        console.log('🎬 Animation Controller initialized');
    }

    // Intersection Observer for scroll-triggered animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.triggerAnimation(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll(`
            .reveal, .reveal-left, .reveal-right, .reveal-scale,
            .scroll-animate, .timeline-item, .skill-item,
            .form-group, .project-card, .about-text, .education-item
        `);

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = this.getInitialTransform(el);
            this.observer.observe(el);
        });
    }

    getInitialTransform(element) {
        if (element.classList.contains('reveal-left')) return 'translateX(-50px)';
        if (element.classList.contains('reveal-right')) return 'translateX(50px)';
        if (element.classList.contains('reveal-scale')) return 'scale(0.8)';
        if (element.classList.contains('timeline-item')) {
            const index = Array.from(element.parentNode.children).indexOf(element);
            return index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        }
        return 'translateY(50px)';
    }

    triggerAnimation(element) {
        const delay = parseInt(element.dataset.delay) || 0;

        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translate(0) scale(1)';
            element.classList.add('animate', 'in-view');

            // Trigger specific animations based on element type
            if (element.classList.contains('skill-item')) {
                this.animateSkillProgress(element);
            }

            if (element.classList.contains('project-card')) {
                this.animateProjectCard(element);
            }
        }, delay);
    }

    // Skill progress bar animation
    animateSkillProgress(skillElement) {
        const progressBar = skillElement.querySelector('.skill-progress');
        if (progressBar) {
            const targetWidth = progressBar.dataset.progress || '0%';
            setTimeout(() => {
                progressBar.style.width = targetWidth;
                progressBar.classList.add('animate');
            }, 300);
        }
    }

    // Project card entrance animation
    animateProjectCard(cardElement) {
        const image = cardElement.querySelector('.project-image img');
        const content = cardElement.querySelector('.project-content');
        const technologies = cardElement.querySelectorAll('.tech-tag');

        if (image) {
            setTimeout(() => {
                image.style.transform = 'scale(1)';
                image.style.opacity = '1';
            }, 200);
        }

        if (content) {
            setTimeout(() => {
                content.style.transform = 'translateY(0)';
                content.style.opacity = '1';
            }, 400);
        }

        technologies.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'scale(1)';
                tag.style.opacity = '1';
            }, 600 + (index * 100));
        });
    }

    // Scroll-based animations
    setupScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Parallax mathematical equations
            this.updateMathEquations(scrollY);

            // Navbar background opacity
            this.updateNavbarOpacity(scrollY);

            // Hero elements parallax
            this.updateHeroParallax(scrollY);

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, {passive: true});
    }

    updateNavbarOpacity(scrollY) {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            const opacity = Math.min(1, scrollY / 100);
            navbar.style.background = `rgba(26, 26, 46, ${0.7 + (opacity * 0.3)})`;
        }
    }

    updateHeroParallax(scrollY) {
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual && scrollY < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    }

    // Hover animations setup
    setupHoverAnimations() {
        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            this.setupCardHover(card);
        });

        // Buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            this.setupButtonHover(button);
        });

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            this.setupNavLinkHover(link);
        });
    }

    setupCardHover(card) {
        const overlay = card.querySelector('.project-overlay');
        const image = card.querySelector('.project-image img');

        card.addEventListener('mouseenter', () => {
            if (overlay) overlay.style.opacity = '1';
            if (image) image.style.transform = 'scale(1.1)';
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            if (overlay) overlay.style.opacity = '0';
            if (image) image.style.transform = 'scale(1)';
            card.style.transform = 'translateY(0) scale(1)';
        });
    }

    setupButtonHover(button) {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            if (button.classList.contains('btn-primary')) {
                button.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.4)';
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '';
        });

        // Ripple effect
        button.addEventListener('click', (e) => {
            this.createRipple(e, button);
        });
    }

    setupNavLinkHover(link) {
        link.addEventListener('mouseenter', () => {
            link.style.color = 'var(--accent-cyan)';
        });

        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                link.style.color = '';
            }
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Parallax effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element');

        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const viewportHeight = window.innerHeight;

            parallaxElements.forEach(element => {
                const elementTop = element.offsetTop;
                const elementHeight = element.offsetHeight;
                const elementBottom = elementTop + elementHeight;

                // Check if element is in viewport
                if (elementBottom >= scrolled && elementTop <= scrolled + viewportHeight) {
                    const speed = element.dataset.speed || 0.5;
                    const yPos = -(scrolled - elementTop) * speed;
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });
        }, {passive: true});
    }


    // Progress bar animations
    setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');

        progressBars.forEach(bar => {
            const fill = bar.querySelector('.progress-fill');
            if (fill) {
                const targetWidth = fill.dataset.width || '0%';

                // Animate when in view
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                fill.style.width = targetWidth;
                                fill.classList.add('animate');
                            }, 500);
                            observer.unobserve(entry.target);
                        }
                    });
                });

                observer.observe(bar);
            }
        });
    }

    // Form animations
    setupFormAnimations() {
        const formGroups = document.querySelectorAll('.form-group');

        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';

            // Stagger animation
            setTimeout(() => {
                group.style.transition = 'all 0.6s ease';
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
                group.classList.add('animate');
            }, index * 100);
        });

        // Input focus animations
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    // Typewriter effect
    createTypewriter(element, texts, speed = 100, delay = 2000) {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentText = texts[textIndex];

            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 500);
                    return;
                }
            } else {
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(type, delay);
                    return;
                }
            }

            setTimeout(type, isDeleting ? 50 : speed);
        };

        type();
    }

    // Timeline animation
    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
                item.classList.add('animate');
            }, index * 200);
        });
    }

    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.observers.forEach(observer => observer.disconnect());
        this.animatedElements.clear();
    }
}

// Initialize animation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
        window.animationController = new AnimationController();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}