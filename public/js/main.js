// API Base URL
const API_BASE = '/api';

// Fetch and load all content
async function loadContent() {
    try {
        const response = await fetch(`${API_BASE}/content`);
        const content = await response.json();

        // Load Hero Section
        loadHero(content.hero);

        // Load Cards
        loadCards(content.cards);

        // Load Projects
        loadProjects(content.projects);

        // Load Footer
        loadFooter(content.footer);

    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Load Hero Section
function loadHero(hero) {
    document.getElementById('hero-heading').textContent = hero.heading;
    document.getElementById('hero-subheading').textContent = hero.subheading;
    document.getElementById('hero-cta').textContent = hero.ctaText;
    document.getElementById('hero-image').src = hero.imageUrl;
}

// Load Cards
function loadCards(cards) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';

    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.style.animationDelay = `${index * 0.1}s`;
        cardEl.innerHTML = `
      <span class="card-icon">${card.icon}</span>
      <h3>${card.title}</h3>
      <p>${card.description}</p>
    `;
        container.appendChild(cardEl);
    });
}

// Load Projects
function loadProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    projects.forEach((project, index) => {
        const projectEl = document.createElement('div');
        projectEl.className = 'project-card';
        projectEl.style.animationDelay = `${index * 0.1}s`;
        projectEl.innerHTML = `
      <div class="project-image-wrapper">
        <img src="${project.image}" alt="${project.title}" class="project-image">
      </div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank" class="project-link">
          View Project →
        </a>
      </div>
    `;
        container.appendChild(projectEl);
    });
}

// Load Footer
function loadFooter(footer) {
    const socialLinksContainer = document.getElementById('social-links');
    const copyrightEl = document.getElementById('copyright');

    socialLinksContainer.innerHTML = '';
    footer.socialLinks.forEach(link => {
        const linkEl = document.createElement('a');
        linkEl.href = link.url;
        linkEl.className = 'social-link';
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';
        linkEl.textContent = link.name.charAt(0);
        linkEl.title = link.name;
        socialLinksContainer.appendChild(linkEl);
    });

    copyrightEl.textContent = footer.copyrightText;
}

// Contact Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('.submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        const originalText = buttonText.textContent;

        // Disable button and show loading
        submitButton.disabled = true;
        buttonText.innerHTML = '<span class="loading"></span>';
        formMessage.style.display = 'none';

        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        try {
            const response = await fetch(`${API_BASE}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                form.reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            formMessage.textContent = 'Failed to send message. Please try again.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        } finally {
            submitButton.disabled = false;
            buttonText.textContent = originalText;
        }
    });

    // Load content on page load
    loadContent();

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
