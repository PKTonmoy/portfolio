const express = require('express');
const router = express.Router();
const config = require('../data/config.json');

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === config.admin.username && password === config.admin.password) {
        req.session.isAuthenticated = true;
        req.session.user = username;
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Logout failed' });
        } else {
            res.json({ success: true, message: 'Logout successful' });
        }
    });
});

// Check authentication status
router.get('/check', (req, res) => {
    if (req.session.isAuthenticated) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});

// Middleware to protect routes
function requireAuth(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Authentication required' });
    }
}

module.exports = router;
module.exports.requireAuth = requireAuth;
