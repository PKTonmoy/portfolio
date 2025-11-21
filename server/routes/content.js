const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAuth } = require('./auth');

const contentPath = path.join(__dirname, '../data/content.json');

// Helper function to read content
function readContent() {
    const data = fs.readFileSync(contentPath, 'utf8');
    return JSON.parse(data);
}

// Helper function to write content
function writeContent(content) {
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
}

// Get all content (public)
router.get('/', (req, res) => {
    try {
        const content = readContent();
        res.json(content);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error reading content' });
    }
});

// Update hero section (admin only)
router.put('/hero', requireAuth, (req, res) => {
    try {
        const content = readContent();
        content.hero = { ...content.hero, ...req.body };
        writeContent(content);
        res.json({ success: true, message: 'Hero section updated', data: content.hero });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating hero section' });
    }
});

// Add new card (admin only)
router.post('/cards', requireAuth, (req, res) => {
    try {
        const content = readContent();
        const newCard = {
            id: `card-${Date.now()}`,
            ...req.body
        };
        content.cards.push(newCard);
        writeContent(content);
        res.json({ success: true, message: 'Card added', data: newCard });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding card' });
    }
});

// Update card (admin only)
router.put('/cards/:id', requireAuth, (req, res) => {
    try {
        const content = readContent();
        const cardIndex = content.cards.findIndex(c => c.id === req.params.id);

        if (cardIndex === -1) {
            return res.status(404).json({ success: false, message: 'Card not found' });
        }

        content.cards[cardIndex] = { ...content.cards[cardIndex], ...req.body };
        writeContent(content);
        res.json({ success: true, message: 'Card updated', data: content.cards[cardIndex] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating card' });
    }
});

// Delete card (admin only)
router.delete('/cards/:id', requireAuth, (req, res) => {
    try {
        const content = readContent();
        content.cards = content.cards.filter(c => c.id !== req.params.id);
        writeContent(content);
        res.json({ success: true, message: 'Card deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting card' });
    }
});

// Add new project (admin only)
router.post('/projects', requireAuth, (req, res) => {
    try {
        const content = readContent();
        const newProject = {
            id: `project-${Date.now()}`,
            ...req.body
        };
        content.projects.push(newProject);
        writeContent(content);
        res.json({ success: true, message: 'Project added', data: newProject });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding project' });
    }
});

// Update project (admin only)
router.put('/projects/:id', requireAuth, (req, res) => {
    try {
        const content = readContent();
        const projectIndex = content.projects.findIndex(p => p.id === req.params.id);

        if (projectIndex === -1) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        content.projects[projectIndex] = { ...content.projects[projectIndex], ...req.body };
        writeContent(content);
        res.json({ success: true, message: 'Project updated', data: content.projects[projectIndex] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating project' });
    }
});

// Delete project (admin only)
router.delete('/projects/:id', requireAuth, (req, res) => {
    try {
        const content = readContent();
        content.projects = content.projects.filter(p => p.id !== req.params.id);
        writeContent(content);
        res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting project' });
    }
});

// Update footer (admin only)
router.put('/footer', requireAuth, (req, res) => {
    try {
        const content = readContent();
        content.footer = { ...content.footer, ...req.body };
        writeContent(content);
        res.json({ success: true, message: 'Footer updated', data: content.footer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating footer' });
    }
});

module.exports = router;
