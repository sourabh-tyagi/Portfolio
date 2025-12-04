// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // In a real application, you would send this data to a server
        // For now, we'll just show an alert
        alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
        
        // Reset the form
        contactForm.reset();
    });
}

// Animation on scroll for skills bars
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-level');
    
    skillBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (barPosition < screenPosition) {
            // The width is already set in the HTML with inline styles
            // The CSS transition will handle the animation
        }
    });
};

// Initialize animations on scroll
window.addEventListener('scroll', animateSkillBars);
document.addEventListener('DOMContentLoaded', animateSkillBars);

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements when they come into view
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    document.querySelectorAll('.project-card, .timeline-item, .stat-item, .skill-item').forEach(el => {
        observer.observe(el);
    });
});

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) backToTop.style.display = 'inline-flex';
        else backToTop.style.display = 'none';
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Small typewriter-like role subtitle cycle (progressive, optional)
const subtitleEl = document.querySelector('.hero-subtitle');
if (subtitleEl) {
    const roles = ['Software Engineer', 'Backend • Microservices', 'Full‑Stack Developer'];
    let idx = 0;
    setInterval(() => {
        idx = (idx + 1) % roles.length;
        subtitleEl.style.opacity = 0;
        setTimeout(() => { subtitleEl.textContent = roles[idx]; subtitleEl.style.opacity = 1; }, 350);
    }, 4000);
}

// Page visit counter: increment and fetch total visits from server
const visitCountEl = document.getElementById('visitCount');
const incrementVisit = async () => {
    try {
        const res = await fetch('/api/hit', { method: 'POST' });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        if (visitCountEl) visitCountEl.textContent = data.count.toLocaleString();
    } catch (err) {
        if (visitCountEl) visitCountEl.textContent = '—';
        console.warn('Visit counter failed:', err);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Fire-and-forget increment; update UI when response arrives
    incrementVisit();
});