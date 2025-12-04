// ========================================
// Part5 Pro Landing Page - JavaScript
// ========================================

// Initialize loading screen first
initLoadingScreen();

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCarousel();
    initFixedHeader();
    initFAQ();
    initCountUp();
    initParallax();
    initScrollProgress();
    initTypingAnimation();
    initCustomCursor();
    initParticles();
});




// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
}

// ========================================
// Screenshot Carousel
// ========================================
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let slideWidth = 0;
    let visibleSlides = 1;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `スライド ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function calculateDimensions() {
        const containerWidth = track.parentElement.offsetWidth;
        const slideElement = slides[0];
        slideWidth = slideElement.offsetWidth + parseInt(getComputedStyle(track).gap);

        // Determine visible slides based on viewport
        if (window.innerWidth >= 1024) {
            visibleSlides = 3;
        } else if (window.innerWidth >= 640) {
            visibleSlides = 2;
        } else {
            visibleSlides = 1;
        }
    }

    function updateCarousel() {
        const maxIndex = Math.max(0, slides.length - visibleSlides);
        currentIndex = Math.min(currentIndex, maxIndex);

        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update button states
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    }

    function goToSlide(index) {
        const maxIndex = Math.max(0, slides.length - visibleSlides);
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }

    function nextSlide() {
        const maxIndex = Math.max(0, slides.length - visibleSlides);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Initialize and handle resize
    calculateDimensions();
    updateCarousel();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calculateDimensions();
            updateCarousel();
        }, 100);
    });
}

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Fixed Header
// ========================================
function initFixedHeader() {
    const header = document.getElementById('fixedHeader');
    const hero = document.querySelector('.hero');

    if (!header || !hero) return;

    const heroHeight = hero.offsetHeight;
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;

        // Show header after scrolling past hero section
        if (currentScrollY > heroHeight * 0.5) {
            header.classList.add('visible');
        } else {
            header.classList.remove('visible');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
}

// ========================================
// FAQ Accordion
// ========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('open');
            question.setAttribute('aria-expanded', !isOpen);
        });
    });
}

// ========================================
// Count Up Animation
// ========================================
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    if (statNumbers.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.count);
                animateCount(element, target);
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    statNumbers.forEach(el => observer.observe(el));
}

function animateCount(element, target) {
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = t => t * (2 - t);

    let frame = 0;
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(target * progress);

        element.textContent = currentCount.toLocaleString();

        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = target.toLocaleString();
        }
    }, frameDuration);
}

// ========================================
// Parallax Effect
// ========================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;

        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;

            // Only apply parallax when element is in view
            if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
                const parallaxOffset = (scrollY - elementTop) * 0.15;
                element.style.transform = `translateY(${parallaxOffset}px)`;
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

// ========================================
// Loading Screen
// ========================================
function initLoadingScreen() {
    window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 800);
        }
    });
}

// ========================================
// Scroll Progress Bar
// ========================================
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');

    if (!progressBar) return;

    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;

        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

// ========================================
// Typing Animation
// ========================================
function initTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    const cursor = document.querySelector('.typing-cursor');

    if (!typingElement) return;

    const lines = [
        { text: 'Part 5を、', isGradient: false },
        { text: '極める。', isGradient: true }
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;
    const lineBreakPause = 300;

    function type() {
        const currentLine = lines[lineIndex];

        if (!isDeleting) {
            // Typing
            if (charIndex <= currentLine.text.length) {
                let displayText = '';

                // Build text from all completed lines + current progress
                for (let i = 0; i < lineIndex; i++) {
                    if (lines[i].isGradient) {
                        displayText += `<span class="gradient-char">${lines[i].text}</span>`;
                    } else {
                        displayText += lines[i].text;
                    }
                    if (i < lines.length - 1) displayText += '<br>';
                }

                // Add current line progress
                const currentText = currentLine.text.substring(0, charIndex);
                if (currentLine.isGradient) {
                    displayText += `<span class="gradient-char">${currentText}</span>`;
                } else {
                    displayText += currentText;
                }

                typingElement.innerHTML = displayText;
                charIndex++;

                setTimeout(type, typingSpeed);
            } else {
                // Finished current line
                if (lineIndex < lines.length - 1) {
                    // Move to next line
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(type, lineBreakPause);
                } else {
                    // Finished all lines, pause then hide cursor
                    isPaused = true;
                    if (cursor) cursor.classList.add('hidden');
                    // Animation complete - don't restart
                }
            }
        }
    }

    // Start typing after loading screen
    setTimeout(() => {
        type();
    }, 1200);
}

// ========================================
// Custom Cursor
// ========================================
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const follower = document.getElementById('cursorFollower');

    if (!cursor || !follower) return;

    // Check if it's a touch device
    if ('ontouchstart' in window) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .cta-button, .faq-question, .carousel-btn');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
}

// ========================================
// Background Particles
// ========================================
function initParticles() {
    const container = document.getElementById('particles');

    if (!container) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 20;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = left + '%';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';

    container.appendChild(particle);

    // Recreate particle after animation
    particle.addEventListener('animationend', () => {
        particle.remove();
        createParticle(container);
    });
}
