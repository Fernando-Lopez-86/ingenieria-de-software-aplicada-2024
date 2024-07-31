// routes/auth.js
const express = require('express');
const router = express.Router();
const { protect, getMe } = require('../../middlewares/auth');

router.get('/me', protect, getMe);

module.exports = router;