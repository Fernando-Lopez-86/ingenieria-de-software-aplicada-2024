// routes/secureRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../middleware/auth');

router.get('/protected', authController.protect, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

module.exports = router;