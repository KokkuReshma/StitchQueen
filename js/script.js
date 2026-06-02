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
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
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
    if (!form) return true;

    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.style.borderColor = '#e91e63';
            isValid = false;
        } else {
            input.style.borderColor = '#2a2a2a';
        }
    });

    return isValid;
}

// Handle form submission
function handleFormSubmit(event, formId) {
    event.preventDefault();

    if (!validateForm(formId)) {
        alert('Please fill in all required fields');
        return;
    }

    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Send to backend
    fetch('http://localhost:5000/api/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Form submitted successfully!');
            form.reset();
        } else {
            alert('Error submitting form: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting form. Please try again.');
    });
}

// Format phone number
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    
    if (value.length > 6) {
        value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
    } else if (value.length > 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    }
    
    input.value = value;
}

// Format email with validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Price calculator for custom orders
function calculatePrice() {
    const fabricCost = parseFloat(document.getElementById('fabricCost')?.value || 0);
    const embroideryHours = parseFloat(document.getElementById('embroideryHours')?.value || 0);
    const laborRate = 50; // Per hour
    
    const total = fabricCost + (embroideryHours * laborRate);
    
    const resultElement = document.getElementById('priceResult');
    if (resultElement) {
        resultElement.textContent = `Estimated Total: $${total.toFixed(2)}`;
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Image preview for uploads
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// Add to cart or booking
function addToBooking(itemName, itemPrice) {
    const booking = {
        name: itemName,
        price: itemPrice,
        date: new Date().toISOString()
    };
    
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    alert(`${itemName} added to booking!`);
}

// Get bookings from localStorage
function getBookings() {
    return JSON.parse(localStorage.getItem('bookings')) || [];
}

// Clear all bookings
function clearBookings() {
    if (confirm('Are you sure you want to clear all bookings?')) {
        localStorage.removeItem('bookings');
        alert('Bookings cleared!');
        location.reload();
    }
}

// Count bookings
function getBookingCount() {
    return getBookings().length;
}

// Update booking counter in navbar
function updateBookingCounter() {
    const count = getBookingCount();
    const counterElement = document.getElementById('bookingCounter');
    if (counterElement) {
        counterElement.textContent = count;
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Get measurements from localStorage
function getMeasurements() {
    return JSON.parse(localStorage.getItem('measurements')) || {};
}

// Save measurements to localStorage
function saveMeasurements(measurements) {
    localStorage.setItem('measurements', JSON.stringify(measurements));
    alert('Measurements saved successfully!');
}

// Get date range (for filtering)
function getDateRange(days) {
    const end = new Date();
    const start = new Date(end.getTime() - (days * 24 * 60 * 60 * 1000));
    return { start, end };
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Debounce function for search
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Search functionality
const searchFunction = debounce(function(query) {
    console.log('Searching for:', query);
    // Implement search logic here
}, 300);

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in global scope
window.formatPhoneNumber = formatPhoneNumber;
window.validateEmail = validateEmail;
window.calculatePrice = calculatePrice;
window.scrollToSection = scrollToSection;
window.previewImage = previewImage;
window.togglePasswordVisibility = togglePasswordVisibility;
window.addToBooking = addToBooking;
window.getBookings = getBookings;
window.clearBookings = clearBookings;
window.getBookingCount = getBookingCount;
window.updateBookingCounter = updateBookingCounter;
window.formatCurrency = formatCurrency;
window.getMeasurements = getMeasurements;
window.saveMeasurements = saveMeasurements;
window.formatDate = formatDate;
window.handleFormSubmit = handleFormSubmit;
window.showNotification = showNotification;
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
