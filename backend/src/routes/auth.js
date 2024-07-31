// src/routes/auth.js
const express = require('express');
const router = express.Router();
const { protect, register, login, getMe } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // Asegúrate de proteger esta ruta
// router.post('/refresh-token', refreshToken); // Asegúrate de que esta línea esté presente

module.exports = router;



// // routes/auth.js
// const express = require('express');
// const router = express.Router();
// const authController = require('../middlewares/auth'); // Ruta correcta

// router.post('/register', authController.register);
// router.post('/login', authController.login);
// // router.post('/refresh-token', authController.refreshToken);

// module.exports = router;