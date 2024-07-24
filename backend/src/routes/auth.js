// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../middlewares/auth'); // Ruta correcta

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;