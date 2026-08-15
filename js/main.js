// Ka CmWY Studio - Main JavaScript
// Rich animations and interactions

(function() {
    'use strict';

    // ===== DOM Elements =====
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const animatedElements = document.querySelectorAll('.scroll-animate');
    const heroCuteAnimals = document.querySelectorAll('.cute-animal');

    // ===== Navbar Scroll Effect =====
    let lastScrollTop = 0;
    
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }

    // ===== Mobile Navigation Toggle =====
    function toggleMobileNav() {
        if (navLinks) {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        }
    }

    // ===== Scroll Animations =====
    function handleScrollAnimations() {
        const windowHeight = window.innerHeight;
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('visible');
                
                // Add specific animation classes based on data attributes
                const animationType = element.dataset.animation;
                if (animationType) {
                    element.classList.add(`animate-${animationType}`);
                }
            }
        });
    }

    // ===== Parallax Effect for Cute Animals =====
    function handleParallax() {
        const scrollY = window.pageYOffset;
        
        heroCuteAnimals.forEach((animal, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrollY * speed;
            animal.style.transform = `translateY(${yPos}px)`;
        });
    }

    // ===== Hero Background Animation =====
    function createHeroBackground() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'hero-canvas';
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.3;';
        
        const existingCanvas = hero.querySelector('#hero-canvas');
        if (existingCanvas) existingCanvas.remove();
        
        hero.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 3 + 1,
                    color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5
                });
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });

            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        createParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }

    // ===== Counter Animation =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            if (counter.dataset.animated) return;
            
            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                counter.dataset.animated = 'true';
                
                const target = parseInt(counter.dataset.target) || parseInt(counter.textContent);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
            }
        });
    }

    // ===== Card Hover Effects =====
    function initializeCardEffects() {
        const cards = document.querySelectorAll('.service-card, .app-item, .ad-type-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function(e) {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function(e) {
                this.style.transform = 'translateY(0) scale(1)';
            });

            // Add tilt effect
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });
    }

    // ===== Button Ripple Effect =====
    function createRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .btn-submit');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    left: ${x}px;
                    top: ${y}px;
                    width: 100px;
                    height: 100px;
                    margin-left: -50px;
                    margin-top: -50px;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ===== Smooth Scroll to Sections =====
    function initializeSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile nav if open
                    if (navLinks) {
                        navLinks.classList.remove('active');
                        if (navToggle) navToggle.classList.remove('active');
                    }
                }
            });
        });
    }

    // ===== Form Validation and Submission =====
    function initializeContactForm() {
        const form = document.querySelector('.contact-form form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff4444';
                } else {
                    input.style.borderColor = '#e0e0e0';
                }
            });

            if (isValid) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.innerHTML = `
                    <div style="padding: 20px; background: #00D4AA; color: white; border-radius: 15px; text-align: center; margin-top: 20px;">
                        <p style="margin: 0; font-size: 1.1rem;">🎉 Thank you for your message! We'll get back to you soon.</p>
                    </div>
                `;
                form.appendChild(successMsg);
                
                // Reset form
                form.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => successMsg.remove(), 5000);
            }
        });
    }

    // ===== Loading Animation =====
    function showLoadingAnimation() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;
        
        loader.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 80px; height: 80px; margin: 0 auto 20px; animation: bounce 1s infinite;">
                    <svg viewBox="0 0 100 100" fill="white">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="5" opacity="0.3"/>
                        <path d="M50 10 A40 40 0 0 1 50 90" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/>
                    </svg>
                </div>
                <p style="color: white; font-size: 1.2rem; font-weight: 600;">Loading Ka CmWY Studio...</p>
            </div>
            <style>
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.body.appendChild(loader);
        
        // Hide loader when page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }, 500);
        });
    }

    // ===== Mouse Follower Effect =====
    function initializeMouseFollower() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const follower = document.createElement('div');
        follower.id = 'mouse-follower';
        follower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(follower);

        document.addEventListener('mousemove', (e) => {
            follower.style.left = e.clientX - 10 + 'px';
            follower.style.top = e.clientY - 10 + 'px';
        });
    }

    // ===== Scroll Progress Indicator =====
    function initializeScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #0066FF, #00D4AA);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // ===== Intersection Observer for Lazy Loading =====
    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ===== Add CSS for ripple animation =====
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .nav-links.active {
                display: flex !important;
                position: absolute;
                top: 80px;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 40px;
                gap: 30px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }
            
            .nav-links.active a {
                font-size: 1.3rem;
            }
            
            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }
            
            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .nav-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px);
            }
        `;
        document.head.appendChild(style);
    }

    // ===== Initialize All Functions =====
    function init() {
        // Show loading animation
        showLoadingAnimation();
        
        // Add global styles
        addGlobalStyles();
        
        // Initialize navbar scroll effect
        window.addEventListener('scroll', handleNavbarScroll);
        handleNavbarScroll();
        
        // Mobile navigation
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileNav);
        }
        
        // Scroll animations
        window.addEventListener('scroll', handleScrollAnimations);
        handleScrollAnimations();
        
        // Parallax effect
        window.addEventListener('scroll', handleParallax);
        
        // Hero background animation
        createHeroBackground();
        
        // Counter animation
        window.addEventListener('scroll', animateCounters);
        animateCounters();
        
        // Card effects
        initializeCardEffects();
        
        // Ripple effect
        createRippleEffect();
        
        // Smooth scroll
        initializeSmoothScroll();
        
        // Contact form
        initializeContactForm();
        
        // Mouse follower
        initializeMouseFollower();
        
        // Scroll progress
        initializeScrollProgress();
        
        // Lazy loading
        initializeLazyLoading();

        console.log('🐾 Ka CmWY Studio website initialized successfully!');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
