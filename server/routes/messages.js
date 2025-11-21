const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAuth } = require('./auth');

const messagesPath = path.join(__dirname, '../data/messages.json');

// Helper function to read messages
function readMessages() {
    const data = fs.readFileSync(messagesPath, 'utf8');
    return JSON.parse(data);
}

// Helper function to write messages
function writeMessages(messages) {
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
}

// Submit contact message (public)
router.post('/', (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const messages = readMessages();
        const newMessage = {
            id: `msg-${Date.now()}`,
            name,
            email,
            message,
            timestamp: new Date().toISOString(),
            read: false
        };

        messages.push(newMessage);
        writeMessages(messages);

        res.json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error sending message'
        });
    }
});

// Get all messages (admin only)
router.get('/', requireAuth, (req, res) => {
    try {
        const messages = readMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reading messages'
        });
    }
});

// Mark message as read (admin only)
router.put('/:id/read', requireAuth, (req, res) => {
    try {
        const messages = readMessages();
        const messageIndex = messages.findIndex(m => m.id === req.params.id);

        if (messageIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        messages[messageIndex].read = true;
        writeMessages(messages);

        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating message'
        });
    }
});

// Delete message (admin only)
router.delete('/:id', requireAuth, (req, res) => {
    try {
        const messages = readMessages();
        const filteredMessages = messages.filter(m => m.id !== req.params.id);

        writeMessages(filteredMessages);

        res.json({
            success: true,
            message: 'Message deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting message'
        });
    }
});

module.exports = router;
