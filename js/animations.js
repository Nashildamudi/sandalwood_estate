/**
 * Premium Animations and Interactions
 * Sandalwood Estate - Enhanced User Experience
 */

(function () {
    'use strict';

    // ========================================
    // LOADING SCREEN
    // ========================================
    window.addEventListener('load', function () {
        const loader = document.querySelector('.loading-screen');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 600);
            }, 800);
        }
    });

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Animate counters if this element has them
                const counters = entry.target.querySelectorAll('[data-countup]');
                counters.forEach(counter => {
                    if (!counter.classList.contains('counted')) {
                        animateCounter(counter);
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all elements with reveal class
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Also observe pillar cards, testimonial boxes, and other key elements
    document.querySelectorAll('.pillar-card, .box, .sustainability-card, .cert-badge').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // ========================================
    // ANIMATED COUNTERS
    // ========================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-countup'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        element.classList.add('counted');

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // ========================================
    // PARALLAX EFFECT
    // ========================================
    const parallaxElements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Add parallax to home section background
    const homeSection = document.querySelector('.home');
    if (homeSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            homeSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }

    // ========================================
    // LAZY LOADING IMAGES
    // ========================================
    // First, mark all existing images with src as loaded (not lazy loaded)
    document.querySelectorAll('img[src]:not([data-src])').forEach(img => {
        img.classList.add('loaded');
    });

    // Then handle lazy loaded images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // ========================================
    // MAGNETIC BUTTONS
    // ========================================
    const magneticButtons = document.querySelectorAll('.magnetic-btn');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ========================================
    // SCROLL INDICATOR (for hero section)
    // ========================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }

    // ========================================
    // VIDEO CONTROLS ENHANCEMENT
    // ========================================
    // const videoContainers = document.querySelectorAll('.intro-video');
    // videoContainers.forEach(container => {
    //     const video = container.querySelector('video');
    //     if (video) {
    //         // Add custom play button overlay if it doesn't exist
    //         if (!container.querySelector('.video-overlay')) {
    //             const overlay = document.createElement('div');
    //             overlay.className = 'video-overlay';
    //             overlay.innerHTML = '<i class="fas fa-play"></i>';
    //             container.appendChild(overlay);

    //             overlay.addEventListener('click', () => {
    //                 if (video.paused) {
    //                     video.play();
    //                     overlay.classList.add('playing');
    //                 } else {
    //                     video.pause();
    //                     overlay.classList.remove('playing');
    //                 }
    //             });

    //             video.addEventListener('play', () => {
    //                 overlay.classList.add('playing');
    //             });

    //             video.addEventListener('pause', () => {
    //                 overlay.classList.remove('playing');
    //             });
    //         }
    //     }
    // });

    // ========================================
    // ENHANCED HOVER STATES FOR CARDS
    // ========================================
    const interactiveCards = document.querySelectorAll('.pillar-card, .sustainability-card, .testimonials-section .box');

    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ========================================
    // FLOATING ANIMATION FOR DECORATIVE ELEMENTS
    // ========================================
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
    });

    // ========================================
    // WHATSAPP BUTTON ANIMATION
    // ========================================
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        // Show after scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                whatsappBtn.classList.add('visible');
            } else {
                whatsappBtn.classList.remove('visible');
            }
        });
    }

    // ========================================
    // TESTIMONIAL SLIDER ENHANCEMENT
    // ========================================
    // Add stagger animation to testimonial slides if Swiper is present
    if (typeof Swiper !== 'undefined') {
        const reviewSlider = document.querySelector('.review-slider');
        if (reviewSlider) {
            reviewSlider.addEventListener('mouseenter', function () {
                this.classList.add('paused');
            });
            reviewSlider.addEventListener('mouseleave', function () {
                this.classList.remove('paused');
            });
        }
    }

    // ========================================
    // TEXT REVEAL ANIMATION
    // ========================================
    const splitText = (element) => {
        const text = element.textContent;
        element.innerHTML = '';

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${index * 0.03}s`;
            span.className = 'char';
            element.appendChild(span);
        });
    };

    // Apply to specific headings if desired
    document.querySelectorAll('.animate-text').forEach(splitText);

    // ========================================
    // IMAGE GALLERY ENHANCEMENT (if gallery exists)
    // ========================================
    const galleryImages = document.querySelectorAll('.gallery img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function () {
            this.classList.toggle('zoomed');
        });
    });

    // ========================================
    // CONSOLE MESSAGE (Easter Egg)
    // ========================================
    console.log('%c🌿 Sandalwood Estate - Premium Coffee from Coorg',
        'color: #8B4513; font-size: 16px; font-weight: bold; padding: 10px;');
    console.log('%cWebsite crafted with care ☕',
        'color: #6F4E37; font-size: 12px; font-style: italic;');

})();
