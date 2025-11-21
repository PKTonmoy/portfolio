// API Base URL
const API_BASE = '/api';

// Global state
let currentContent = null;
let editingCardId = null;
let editingProjectId = null;

// Check authentication on load
document.addEventListener('DOMContentLoaded', async () => {
    const authResponse = await fetch(`${API_BASE}/auth/check`);
    const authData = await authResponse.json();

    if (authData.authenticated) {
        showDashboard();
    } else {
        showLogin();
    }
});

// Show/Hide Pages
function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadContent();
    loadMessages();
}

// Login Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('loginMessage');

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            showDashboard();
        } else {
            messageEl.textContent = data.message;
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
        }
    } catch (error) {
        messageEl.textContent = 'Login failed. Please try again.';
        messageEl.className = 'message error';
        messageEl.style.display = 'block';
    }
});

// Logout Handler
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    showLogin();
});

// Navigation
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.dataset.section;

        // Update active link
        document.querySelectorAll('.sidebar-nav a').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');

        // Show section
        document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
        document.getElementById(`section-${section}`).classList.remove('hidden');

        // Load section data
        if (section === 'messages') {
            loadMessages();
        }
    });
});

// Load Content
async function loadContent() {
    try {
        const response = await fetch(`${API_BASE}/content`);
        currentContent = await response.json();

        // Update stats
        document.getElementById('stat-cards').textContent = currentContent.cards.length;
        document.getElementById('stat-projects').textContent = currentContent.projects.length;

        // Load sections
        loadHeroSection();
        loadCardsSection();
        loadProjectsSection();
        loadFooterSection();
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Hero Section
function loadHeroSection() {
    document.getElementById('hero-heading').value = currentContent.hero.heading;
    document.getElementById('hero-subheading').value = currentContent.hero.subheading;
    document.getElementById('hero-cta').value = currentContent.hero.ctaText;
    document.getElementById('hero-image').value = currentContent.hero.imageUrl;
}

document.getElementById('heroForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const heroData = {
        heading: document.getElementById('hero-heading').value,
        subheading: document.getElementById('hero-subheading').value,
        ctaText: document.getElementById('hero-cta').value,
        imageUrl: document.getElementById('hero-image').value
    };

    try {
        const response = await fetch(`${API_BASE}/content/hero`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(heroData)
        });

        const data = await response.json();
        showMessage('hero-message', data.message, 'success');
        loadContent();
    } catch (error) {
        showMessage('hero-message', 'Failed to update hero section', 'error');
    }
});

// Cards Section
function loadCardsSection() {
    const container = document.getElementById('cardsList');
    container.innerHTML = '';

    currentContent.cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'list-item';
        cardEl.innerHTML = `
      <div class="list-item-content">
        <h4>${card.icon} ${card.title}</h4>
        <p>${card.description}</p>
      </div>
      <div class="actions">
        <button class="btn btn-small btn-secondary" onclick="editCard('${card.id}')">Edit</button>
        <button class="btn btn-small btn-danger" onclick="deleteCard('${card.id}')">Delete</button>
      </div>
    `;
        container.appendChild(cardEl);
    });
}

document.getElementById('addCardBtn').addEventListener('click', () => {
    editingCardId = null;
    document.getElementById('cardModalTitle').textContent = 'Add Card';
    document.getElementById('cardForm').reset();
    document.getElementById('card-id').value = '';
    document.getElementById('cardModal').classList.add('active');
});

function editCard(id) {
    const card = currentContent.cards.find(c => c.id === id);
    if (!card) return;

    editingCardId = id;
    document.getElementById('cardModalTitle').textContent = 'Edit Card';
    document.getElementById('card-id').value = id;
    document.getElementById('card-icon').value = card.icon;
    document.getElementById('card-title').value = card.title;
    document.getElementById('card-description').value = card.description;
    document.getElementById('cardModal').classList.add('active');
}

async function deleteCard(id) {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
        const response = await fetch(`${API_BASE}/content/cards/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (data.success) {
            loadContent();
        }
    } catch (error) {
        alert('Failed to delete card');
    }
}

function closeCardModal() {
    document.getElementById('cardModal').classList.remove('active');
}

document.getElementById('cardForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cardData = {
        icon: document.getElementById('card-icon').value,
        title: document.getElementById('card-title').value,
        description: document.getElementById('card-description').value
    };

    const cardId = document.getElementById('card-id').value;
    const method = cardId ? 'PUT' : 'POST';
    const url = cardId ? `${API_BASE}/content/cards/${cardId}` : `${API_BASE}/content/cards`;

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cardData)
        });

        const data = await response.json();
        if (data.success) {
            closeCardModal();
            loadContent();
        }
    } catch (error) {
        alert('Failed to save card');
    }
});

// Projects Section
function loadProjectsSection() {
    const container = document.getElementById('projectsList');
    container.innerHTML = '';

    currentContent.projects.forEach(project => {
        const projectEl = document.createElement('div');
        projectEl.className = 'list-item';
        projectEl.innerHTML = `
      <div class="list-item-content">
        <h4>${project.title}</h4>
        <p>${project.description}</p>
        <p style="font-size: 0.85rem; color: #4169E1;">
          <a href="${project.link}" target="_blank">${project.link}</a>
        </p>
      </div>
      <div class="actions">
        <button class="btn btn-small btn-secondary" onclick="editProject('${project.id}')">Edit</button>
        <button class="btn btn-small btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
      </div>
    `;
        container.appendChild(projectEl);
    });
}

document.getElementById('addProjectBtn').addEventListener('click', () => {
    editingProjectId = null;
    document.getElementById('projectModalTitle').textContent = 'Add Project';
    document.getElementById('projectForm').reset();
    document.getElementById('project-id').value = '';
    document.getElementById('projectModal').classList.add('active');
});

function editProject(id) {
    const project = currentContent.projects.find(p => p.id === id);
    if (!project) return;

    editingProjectId = id;
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    document.getElementById('project-id').value = id;
    document.getElementById('project-title').value = project.title;
    document.getElementById('project-description').value = project.description;
    document.getElementById('project-link').value = project.link;
    document.getElementById('project-image').value = project.image;
    document.getElementById('projectModal').classList.add('active');
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        const response = await fetch(`${API_BASE}/content/projects/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (data.success) {
            loadContent();
        }
    } catch (error) {
        alert('Failed to delete project');
    }
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
}

document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectData = {
        title: document.getElementById('project-title').value,
        description: document.getElementById('project-description').value,
        link: document.getElementById('project-link').value,
        image: document.getElementById('project-image').value
    };

    const projectId = document.getElementById('project-id').value;
    const method = projectId ? 'PUT' : 'POST';
    const url = projectId ? `${API_BASE}/content/projects/${projectId}` : `${API_BASE}/content/projects`;

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });

        const data = await response.json();
        if (data.success) {
            closeProjectModal();
            loadContent();
        }
    } catch (error) {
        alert('Failed to save project');
    }
});

// Messages Section
async function loadMessages() {
    try {
        const response = await fetch(`${API_BASE}/messages`);
        const messages = await response.json();

        // Update stat
        document.getElementById('stat-messages').textContent = messages.length;

        const container = document.getElementById('messagesList');
        container.innerHTML = '';

        if (messages.length === 0) {
            container.innerHTML = '<div class="admin-card"><p>No messages yet.</p></div>';
            return;
        }

        messages.reverse().forEach(msg => {
            const msgEl = document.createElement('div');
            msgEl.className = 'list-item';
            msgEl.innerHTML = `
        <div class="list-item-content">
          <h4>${msg.name} - ${msg.email}</h4>
          <p>${msg.message}</p>
          <p style="font-size: 0.85rem; color: #999;">
            ${new Date(msg.timestamp).toLocaleString()}
          </p>
        </div>
        <div class="actions">
          <button class="btn btn-small btn-danger" onclick="deleteMessage('${msg.id}')">Delete</button>
        </div>
      `;
            container.appendChild(msgEl);
        });
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
        const response = await fetch(`${API_BASE}/messages/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (data.success) {
            loadMessages();
        }
    } catch (error) {
        alert('Failed to delete message');
    }
}

// Footer Section
function loadFooterSection() {
    document.getElementById('footer-copyright').value = currentContent.footer.copyrightText;

    const container = document.getElementById('socialLinksContainer');
    container.innerHTML = '';

    currentContent.footer.socialLinks.forEach((link, index) => {
        const linkEl = document.createElement('div');
        linkEl.className = 'form-grid';
        linkEl.style.marginBottom = '1rem';
        linkEl.innerHTML = `
      <div class="form-group">
        <label>Social Link ${index + 1} Name</label>
        <input type="text" class="social-name" value="${link.name}" placeholder="GitHub">
      </div>
      <div class="form-group">
        <label>URL</label>
        <input type="url" class="social-url" value="${link.url}" placeholder="https://github.com/username">
      </div>
    `;
        container.appendChild(linkEl);
    });
}

document.getElementById('footerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const socialLinks = [];
    const nameInputs = document.querySelectorAll('.social-name');
    const urlInputs = document.querySelectorAll('.social-url');

    nameInputs.forEach((input, index) => {
        if (input.value && urlInputs[index].value) {
            socialLinks.push({
                name: input.value,
                url: urlInputs[index].value,
                icon: input.value.toLowerCase()
            });
        }
    });

    const footerData = {
        copyrightText: document.getElementById('footer-copyright').value,
        socialLinks
    };

    try {
        const response = await fetch(`${API_BASE}/content/footer`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(footerData)
        });

        const data = await response.json();
        showMessage('footer-message', data.message, 'success');
        loadContent();
    } catch (error) {
        showMessage('footer-message', 'Failed to update footer', 'error');
    }
});

// Utility function to show messages
function showMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = `message ${type}`;
    el.style.display = 'block';

    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
