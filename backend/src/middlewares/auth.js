// middleware/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../database/models'); // Asegúrate de que la ruta es correcta

// Registrar Usuario
exports.register = async (req, res) => {
    const { username, password, numero_vendedor, } = req.body; // Incluye numero_vendedor
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword); // Información de depuración
        const newUser = await User.create({ username, password: hashedPassword, numero_vendedor, }); // Pasa numero_vendedor al crear el usuario
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Iniciar Sesión
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials: user not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials: incorrect password' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, numero_vendedor: user.numero_vendedor,});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Middleware para proteger rutas
exports.protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};