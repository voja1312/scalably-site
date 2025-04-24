/**
 * Optimal Spine Chiropractic JavaScript
 * Version: 1.1
 * Description: Main JavaScript file for Optimal Spine Chiropractic website
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize all components
    initPreloader();
    initAOS();
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initTestimonialSlider();
    initFaqAccordion();
    initCounterAnimation();
    initBeforeAfterSlider();
    initBackToTop();
    initMultiStepForm();
    initFormValidation();
    initCurrentYear();

    // Fix for service icons to prevent them from being cut in half
    fixServiceIcons();
});

/**
 * Preloader Animation
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    if (!preloader) return;

    // Hide preloader after page loads
    setTimeout(function() {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';

        // Add a class to body for additional animations
        document.body.classList.add('loaded');

        // Remove preloader from DOM after fade out
        setTimeout(function() {
            preloader.remove();
        }, 500);
    }, 800);
}

/**
 * AOS (Animate On Scroll) Initialization with better mobile handling
 */
function initAOS() {
    if (typeof AOS === 'undefined') return;

    // Check if we're on mobile to disable animations
    const isMobile = window.innerWidth < 768;

    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100,
        disable: isMobile ? true : false
    });

    // Refresh AOS on window resize
    window.addEventListener('resize', function() {
        AOS.refresh();
    });
}

/**
 * Sticky Header with improved performance
 */
function initStickyHeader() {
    const header = document.getElementById('header');

    if (!header) return;

    const headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    // Use requestAnimationFrame for better performance
    let lastScrollTop = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
        lastScrollTop = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (lastScrollTop > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });

            ticking = true;
        }
    });

    // Initial check on page load
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }
}

/**
 * Mobile Menu with improved accessibility and animations
 */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');

        // Update ARIA attributes
        const isExpanded = navMenu.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);

        // Change the icon based on the state with animation
        if (isExpanded) {
            mobileToggle.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
            mobileToggle.classList.add('active');
        } else {
            mobileToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
            mobileToggle.classList.remove('active');
        }

        // Prevent body scrolling when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) &&
            !mobileToggle.contains(e.target) &&
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle navigation links in mobile menu
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Smooth Scroll for Anchor Links with improved behavior
 */
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Get the height of the header for offset
                const headerHeight = document.querySelector('#header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20; // Added extra 20px padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without jumping
                history.pushState(null, null, targetId);

                // Set focus to the target for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const testimonialWrapper = document.querySelector('.testimonial-wrapper');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');

    if (!testimonialWrapper || testimonialSlides.length === 0) return;

    let currentSlide = 0;
    const slideCount = testimonialSlides.length;
    let slideInterval;

    // Function to go to a specific slide
    function goToSlide(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;

        // Remove active class from all slides
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true');
        });

        // Add active class to current slide
        testimonialSlides[index].classList.add('active');
        testimonialSlides[index].setAttribute('aria-hidden', 'false');

        // Update current slide index
        currentSlide = index;

        // Update pagination dots
        paginationDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-selected', i === index);
        });
    }

    // Initialize the slider
    testimonialSlides.forEach((slide, index) => {
        slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    });

    // Initial slide
    goToSlide(0);

    // Event listeners for pagination dots
    if (paginationDots.length > 0) {
        paginationDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });

            // Add keyboard accessibility
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(index);
                    resetInterval();
                }
            });
        });
    }

    // Event listeners for prev/next buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetInterval();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetInterval();
        });
    }

    // Auto-advance slides
    function startInterval() {
        slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    // Start the auto-advance interval
    startInterval();

    // Pause auto-advance on hover
    testimonialWrapper.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    testimonialWrapper.addEventListener('mouseleave', () => {
        startInterval();
    });

    // Keyboard navigation
    testimonialWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentSlide - 1);
            resetInterval();
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentSlide + 1);
            resetInterval();
        }
    });

    // Make wrapper focusable for keyboard navigation
    testimonialWrapper.setAttribute('tabindex', '0');

    // Swipe support for touch devices
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left
            goToSlide(currentSlide + 1);
            resetInterval();
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right
            goToSlide(currentSlide - 1);
            resetInterval();
        }
    }
}

/**
 * FAQ Accordion with improved accessibility
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');
        const faqContent = item.querySelector('.faq-content');

        // Set initial ARIA attributes
        const isActive = item.classList.contains('active');
        header.setAttribute('aria-expanded', isActive);

        // Get the id of the content area
        const contentId = body.id;

        // Set ARIA attributes for the header
        header.setAttribute('aria-controls', contentId);

        header.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(faq => {
                if (faq !== item && faq.classList.contains('active')) {
                    faq.classList.remove('active');
                    const faqHeader = faq.querySelector('.faq-header');
                    faqHeader.setAttribute('aria-expanded', 'false');
                    const faqBody = faq.querySelector('.faq-body');
                    faqBody.style.height = '0';
                }
            });

            // Toggle current item
            const isExpanded = item.classList.toggle('active');
            header.setAttribute('aria-expanded', isExpanded);

            // Set dynamic height for smooth animation
            if (isExpanded) {
                body.style.height = faqContent.offsetHeight + 'px';
            } else {
                body.style.height = '0';
            }
        });

        // Handle keyboard interaction
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });

        // Make header focusable
        header.setAttribute('tabindex', '0');

        // Set initial height for active item
        if (isActive) {
            body.style.height = faqContent.offsetHeight + 'px';
        }

        // Recalculate heights on window resize
        window.addEventListener('resize', () => {
            if (item.classList.contains('active') && faqContent) {
                body.style.height = faqContent.offsetHeight + 'px';
            }
        });
    });
}

/**
 * Counter Animation with improved performance
 */
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length === 0) return;

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const frameRate = 60; // frames per second
        const framesTotal = duration / 1000 * frameRate;
        const increment = target / framesTotal;
        let current = 0;
        let frame = 0;

        function updateFrame() {
            frame++;
            current += increment;

            if (current >= target || frame >= framesTotal) {
                el.textContent = target;
                return;
            }

            el.textContent = Math.floor(current);
            requestAnimationFrame(updateFrame);
        }

        requestAnimationFrame(updateFrame);
    }

    // Use Intersection Observer for counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

/**
 * Before/After Slider
 */
function initBeforeAfterSlider() {
    const sliderContainers = document.querySelectorAll('.before-after-container');

    if (sliderContainers.length === 0) return;

    sliderContainers.forEach(container => {
        const handle = container.querySelector('.slider-handle');
        const afterImage = container.querySelector('.after-image');

        if (!handle || !afterImage) return;

        // Initial position (50%)
        let sliderPosition = 50;
        updateSliderPosition(sliderPosition);

        function updateSliderPosition(position) {
            // Ensure position is between 0 and 100
            position = Math.max(0, Math.min(100, position));

            handle.style.left = `${position}%`;
            afterImage.style.width = `${position}%`;
        }

        // Mouse events
        handle.addEventListener('mousedown', startDrag);
        window.addEventListener('mouseup', stopDrag);

        // Touch events
        handle.addEventListener('touchstart', startDrag, { passive: false });
        window.addEventListener('touchend', stopDrag);

        function startDrag(e) {
            if (e.type === 'touchstart') {
                e.preventDefault();
            }
            window.addEventListener('mousemove', drag);
            window.addEventListener('touchmove', drag, { passive: false });
        }

        function stopDrag() {
            window.removeEventListener('mousemove', drag);
            window.removeEventListener('touchmove', drag);
        }

        function drag(e) {
            e.preventDefault();
            let position;

            if (e.type === 'touchmove') {
                const touch = e.touches[0];
                position = ((touch.clientX - container.getBoundingClientRect().left) / container.offsetWidth) * 100;
            } else {
                position = ((e.clientX - container.getBoundingClientRect().left) / container.offsetWidth) * 100;
            }

            updateSliderPosition(position);
        }

        // Keyboard accessibility
        handle.setAttribute('tabindex', '0');
        handle.setAttribute('role', 'slider');
        handle.setAttribute('aria-valuemin', '0');
        handle.setAttribute('aria-valuemax', '100');
        handle.setAttribute('aria-valuenow', sliderPosition);
        handle.setAttribute('aria-label', 'Before-after image comparison slider');

        handle.addEventListener('keydown', (e) => {
            let newPosition = sliderPosition;

            // Handle arrow keys
            switch (e.key) {
                case 'ArrowLeft':
                    newPosition -= 5;
                    break;
                case 'ArrowRight':
                    newPosition += 5;
                    break;
                case 'Home':
                    newPosition = 0;
                    break;
                case 'End':
                    newPosition = 100;
                    break;
                default:
                    return;
            }

            e.preventDefault();
            sliderPosition = Math.max(0, Math.min(100, newPosition));
            updateSliderPosition(sliderPosition);
            handle.setAttribute('aria-valuenow', sliderPosition);
        });
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');

    if (!backToTopBtn) return;

    // Show button after scrolling down
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Multi-step Form
 */
function initMultiStepForm() {
    const form = document.getElementById('appointment-form');

    if (!form) return;

    const formSteps = form.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtns = form.querySelectorAll('.next-step');
    const prevBtns = form.querySelectorAll('.prev-step');

    let currentStep = 0;

    // Initialize steps
    formSteps.forEach((step, index) => {
        step.dataset.step = index;
        step.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    });

    // Update progress bar
    const progressBar = document.querySelector('.form-progress');
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', 1);
    }

    // Go to next step
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Validate current step before proceeding
            if (!validateStep(currentStep)) {
                return;
            }

            // Hide current step
            formSteps[currentStep].classList.remove('active');
            formSteps[currentStep].setAttribute('aria-hidden', 'true');

            // Update progress steps
            if (progressSteps[currentStep]) {
                progressSteps[currentStep].classList.add('completed');
            }

            // Increment current step
            currentStep++;

            // Show next step
            if (formSteps[currentStep]) {
                formSteps[currentStep].classList.add('active');
                formSteps[currentStep].setAttribute('aria-hidden', 'false');

                // Update progress bar
                if (progressBar) {
                    progressBar.setAttribute('aria-valuenow', currentStep + 1);
                }

                // Update active step
                progressSteps.forEach((step, index) => {
                    step.classList.toggle('active', index === currentStep);
                });

                // Scroll to top of form
                const formTop = form.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: formTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Go to previous step
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Hide current step
            formSteps[currentStep].classList.remove('active');
            formSteps[currentStep].setAttribute('aria-hidden', 'true');

            // Decrement current step
            currentStep--;

            // Show previous step
            if (formSteps[currentStep]) {
                formSteps[currentStep].classList.add('active');
                formSteps[currentStep].setAttribute('aria-hidden', 'false');

                // Remove completed status
                if (progressSteps[currentStep]) {
                    progressSteps[currentStep].classList.remove('completed');
                }

                // Update progress bar
                if (progressBar) {
                    progressBar.setAttribute('aria-valuenow', currentStep + 1);
                }

                // Update active step
                progressSteps.forEach((step, index) => {
                    step.classList.toggle('active', index === currentStep);
                });

                // Scroll to top of form
                const formTop = form.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: formTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Submit form
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate final step
        if (!validateStep(currentStep)) {
            return;
        }

        // Show success message or submit form data
        alert('Thank you for your appointment request! We will contact you shortly to confirm your appointment.');

        // Reset form
        form.reset();

        // Go back to first step
        formSteps.forEach(step => step.classList.remove('active'));
        formSteps[0].classList.add('active');

        progressSteps.forEach(step => {
            step.classList.remove('active');
            step.classList.remove('completed');
        });

        progressSteps[0].classList.add('active');

        currentStep = 0;

        // In a real implementation, you would submit the form data via AJAX here
    });

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value.trim()) {
                return;
            }

            // Simple email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Success message
            alert('Thank you for subscribing to our newsletter!');

            // Reset form
            this.reset();
        });
    }
}

/**
 * Form Validation
 */
function initFormValidation() {
    const form = document.getElementById('appointment-form');

    if (!form) return;

    // Validate a single step
    window.validateStep = function(stepIndex) {
        const step = form.querySelector(`.form-step[data-step="${stepIndex}"]`);

        if (!step) return true;

        // Get required fields in current step
        const requiredFields = step.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            // Remove previous error message
            const errorElement = document.getElementById(`${field.id}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('visible');
            }

            // Check if field is empty
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
                field.classList.add('is-invalid');
            } else {
                // Additional validation based on field type
                if (field.type === 'email' && !validateEmail(field.value)) {
                    isValid = false;
                    showError(field, 'Please enter a valid email address');
                    field.classList.add('is-invalid');
                } else if (field.type === 'tel' && !validatePhone(field.value)) {
                    isValid = false;
                    showError(field, 'Please enter a valid phone number (e.g., 555-123-4567)');
                    field.classList.add('is-invalid');
                } else if (field.type === 'checkbox' && !field.checked) {
                    isValid = false;
                    showError(field, 'You must agree to the terms and conditions');
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            }
        });

        return isValid;
    };

    // Show error message
    function showError(field, message) {
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
    }

    // Email validation
    function validateEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    // Phone validation
    function validatePhone(phone) {
        const pattern = /^\d{3}-\d{3}-\d{4}$/;
        return pattern.test(phone);
    }

    // Add input event listeners to clear error messages when user types
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(`${this.id}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('visible');
            }
            this.classList.remove('is-invalid');
        });
    });

    // Check for date inputs to ensure future dates only
    const dateInputs = form.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Set min attribute to today's date
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // January is 0
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = yyyy + '-' + mm + '-' + dd;
        input.setAttribute('min', formattedToday);

        // Validate on change
        input.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            if (selectedDate < today) {
                showError(this, 'Please select a future date');
                this.classList.add('is-invalid');
            } else {
                const errorElement = document.getElementById(`${this.id}-error`);
                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.classList.remove('visible');
                }
                this.classList.remove('is-invalid');
            }
        });
    });
}

/**
 * Fix for service icons to prevent them from being cut in half
 */
function fixServiceIcons() {
    const serviceIcons = document.querySelectorAll('.service-icon i, .benefit-icon i');

    serviceIcons.forEach(icon => {
        // Center the icon within its container
        icon.style.display = 'flex';
        icon.style.justifyContent = 'center';
        icon.style.alignItems = 'center';
        icon.style.width = '100%';
        icon.style.height = '100%';

        // Add a slight margin to ensure it's fully visible
        icon.style.margin = '0';

        // Ensure the icon container has proper sizing
        const iconContainer = icon.parentElement;
        if (iconContainer) {
            iconContainer.style.overflow = 'visible';
            iconContainer.style.display = 'flex';
            iconContainer.style.justifyContent = 'center';
            iconContainer.style.alignItems = 'center';
        }
    });
}

/**
 * Update current year in copyright notice
 */
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}