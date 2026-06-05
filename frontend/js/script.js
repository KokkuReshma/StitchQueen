/* ========================================
   STITCH QUEEN - JAVASCRIPT
   ======================================== */

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle menu on hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    // Update active nav link based on current page
    updateActiveNavLink();
    
    // Add scroll animations
    addScrollAnimations();

    // Initialize gallery filters
    initializeGalleryFilter();

    // Initialize bridal slider on home page
    initializeBridalSlider();
});

function initializeBridalSlider() {
    const slider = document.querySelector('.bridal-slider');
    if (!slider) return;

    const slidesContainer = slider.querySelector('.slides');
    const slides = slider.querySelectorAll('.slide');
    const prev = slider.querySelector('.slider-arrow.prev');
    const next = slider.querySelector('.slider-arrow.next');
    let current = 0;
    const total = slides.length;
    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 4500;

    function goTo(index) {
        current = (index + total) % total;
        slidesContainer.style.transform = `translateX(-${current * 100}%)`;
    }

    function nextSlide() { goTo(current + 1); }
    function prevSlide() { goTo(current - 1); }

    next?.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    prev?.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    // autoplay
    function startAutoplay() {
        if (autoplayInterval) return;
        autoplayInterval = setInterval(() => { nextSlide(); }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        if (!autoplayInterval) return;
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Pause on hover
    const wrapper = slider.querySelector('.slides-wrapper');
    wrapper?.addEventListener('mouseenter', stopAutoplay);
    wrapper?.addEventListener('mouseleave', startAutoplay);

    // Touch support: basic swipe
    let touchStartX = 0;
    wrapper?.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; stopAutoplay(); });
    wrapper?.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
            if (dx < 0) nextSlide(); else prevSlide();
        }
        resetAutoplay();
    });

    // initialize
    goTo(0);
    startAutoplay();
}

function initializeGalleryFilter() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.dataset.filter;

            galleryItems.forEach(card => {
                const cardCategory = card.dataset.category;
                const shouldShow = filterValue === 'all' || cardCategory === filterValue;

                card.style.display = shouldShow ? 'block' : 'none';
            });
        });
    });
}


// Update active navigation link
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all trend cards and review cards
    const animateElements = document.querySelectorAll(
        '.trend-card, .review-card, .maggam-item'
    );
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        const value = field.value.trim();
        const parent = field.closest('.form-group');

        if (!value) {
            field.style.borderColor = '#e91e63';
            if (parent) parent.classList.add('invalid');
            isValid = false;
        } else if (field.type === 'email' && !validateEmail(value)) {
            field.style.borderColor = '#e91e63';
            if (parent) parent.classList.add('invalid');
            isValid = false;
        } else {
            field.style.borderColor = '#2a2a2a';
            if (parent) parent.classList.remove('invalid');
        }
    });

    return isValid;
}

function showFormMessage(formId, message, success = true) {
    const form = document.getElementById(formId);
    if (!form) return;

    let messageBox = form.querySelector('.form-message');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.className = 'form-message';
        form.prepend(messageBox);
    }

    messageBox.textContent = message;
    messageBox.classList.toggle('success', success);
    messageBox.classList.toggle('error', !success);
    messageBox.classList.remove('hidden');
}

function clearFormMessage(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const messageBox = form.querySelector('.form-message');
    if (messageBox) {
        messageBox.classList.add('hidden');
    }
}

// Handle form submission
function handleFormSubmit(event, formId) {
    event.preventDefault();

    const form = document.getElementById(formId);
    if (!form) return;

    clearFormMessage(formId);

    if (!validateForm(formId)) {
        showFormMessage(formId, 'Please complete all required fields correctly.', false);
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const endpoint = '/api/submit-form';

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showFormMessage(formId, 'Your request has been submitted successfully. We will contact you soon.');
            form.reset();
        } else {
            showFormMessage(formId, result.error || 'Unable to submit the form right now. Please try again later.', false);
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showFormMessage(formId, 'Network error. Please try again later.', false);
    });
}

// Format phone number
function formatPhoneNumber(input) {
    if (!input) return;

    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);

    if (value.length > 5) {
        value = value.slice(0, 5) + ' ' + value.slice(5);
    }

    input.value = value;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const observer = new IntersectionObserver((entries, observerRef) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observerRef.unobserve(img);
            }
        });
    }, { rootMargin: '80px 0px' });

    images.forEach(img => observer.observe(img));
}

// Export functions for use in global scope
window.formatPhoneNumber = formatPhoneNumber;
window.validateEmail = validateEmail;
window.scrollToSection = scrollToSection;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleFormSubmit = handleFormSubmit;
window.showFormMessage = showFormMessage;
window.clearFormMessage = clearFormMessage;
window.lazyLoadImages = lazyLoadImages;

/* ========================================
   DESIGNS PAGE - IMAGE MODAL
   ======================================== */
function initializeDesignModal() {
    const modal = document.getElementById('designModal');
    if (!modal) return;
    const modalImage = document.getElementById('designModalImage');
    const closeBtn = modal.querySelector('.design-modal-close');
    const backdrop = modal.querySelector('.design-modal-backdrop');

    function open(src, alt) {
        modalImage.src = src;
        modalImage.alt = alt || '';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // focus close for accessibility
        closeBtn.focus();
    }

    function close() {
        modal.setAttribute('aria-hidden', 'true');
        modalImage.src = '';
        document.body.style.overflow = '';
    }

    // Click handlers on design cards
    document.querySelectorAll('.design-card').forEach(card => {
        const img = card.querySelector('.design-img');
        card.addEventListener('click', () => {
            // if image not yet loaded, use data-src
            const src = img.currentSrc || img.getAttribute('src') || img.dataset.src;
            open(src, img.alt);
        });
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const src = img.currentSrc || img.getAttribute('src') || img.dataset.src;
                open(src, img.alt);
            }
        });
    });

    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
    });
}

// Initialize designs modal and lazy load when DOM is ready (separate listener)
document.addEventListener('DOMContentLoaded', function() {
    initializeDesignModal();
    lazyLoadImages();
});

