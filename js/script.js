// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeContactForm();
    initializeScrollToTop();
});

// Navigation Toggle Functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll('.service-card, .about-content, .contact-content, .hero-content');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Validate form
        if (validateForm(formObject)) {
            // Simulate form submission
            submitForm(formObject);
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Form Validation
function validateForm(data) {
    let isValid = true;
    const form = document.getElementById('contact-form');
    
    // Clear previous errors
    clearFormErrors(form);
    
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone (optional, but if provided should be valid)
    if (data.phone && data.phone.trim() !== '') {
        const phoneRegex = /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){10,}$/;
        if (!phoneRegex.test(data.phone)) {
            showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    // Validate message
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
            }
            break;
        case 'phone':
            if (value !== '') {
                const phoneRegex = /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){10,}$/;
                if (!phoneRegex.test(value)) {
                    showFieldError(fieldName, 'Please enter a valid phone number');
                }
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters');
            }
            break;
    }
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    field.classList.add('error');
    
    // Create error message
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    formGroup.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    field.classList.remove('error');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Clear all form errors
function clearFormErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    const errorFields = form.querySelectorAll('.error');
    
    errorMessages.forEach(error => error.remove());
    errorFields.forEach(field => field.classList.remove('error'));
}

// Submit form (simulation)
function submitForm(data) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Log form data (in real app, this would be sent to server)
        console.log('Form submitted:', data);
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    // Remove existing success message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.innerHTML = `
        <div style="background-color: #10b981; color: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; text-align: center;">
            <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
        </div>
    `;
    
    // Insert before form
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(successMessage, form);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Scroll to Top Functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '↑';
    scrollToTopButton.classList.add('scroll-to-top');
    scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
    
    // Style the button
    Object.assign(scrollToTopButton.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        opacity: '0',
        visibility: 'hidden',
        transition: 'all 0.3s ease',
        zIndex: '1000',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });
    
    document.body.appendChild(scrollToTopButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollToTopButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'var(--primary-dark)';
        this.style.transform = 'scale(1.1)';
    });
    
    scrollToTopButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'var(--primary-color)';
        this.style.transform = 'scale(1)';
    });
}

// Utility Functions

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll event listeners
window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

// Handle window resize for mobile menu
window.addEventListener('resize', function() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Add error styles to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
`;
document.head.appendChild(style);