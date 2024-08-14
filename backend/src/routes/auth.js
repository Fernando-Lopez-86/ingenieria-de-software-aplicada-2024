
const express = require('express');
const router = express.Router();
const { protect, register, login, getMe } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); 

module.exports = router;



