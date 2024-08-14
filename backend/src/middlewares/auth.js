
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Vendedores } = require('../database/models'); // Asegúrate de que la ruta es correcta


// curl -k -X POST https://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"username": "fer", "password": "123", "numero_vendedor": "016", "rol": "vendedor"}'
exports.register = async (req, res) => {
    const { username, password, numero_vendedor, rol} = req.body; // Incluye numero_vendedor
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword); // Información de depuración
        const newUser = await User.create({ username, password: hashedPassword, numero_vendedor, rol }); // Pasa numero_vendedor al crear el usuario
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials: user not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials: incorrect password' });

        const token = jwt.sign({ id: user.id, rol: user.rol, numero_vendedor: user.numero_vendedor }, process.env.JWT_SECRET, { expiresIn: '3h' });

        const vendedor = await Vendedores.findOne({ where: { NUMERO: user.numero_vendedor } });
        if (!vendedor) return res.status(401).json({ message: 'Vendedor no encontrado' });

        res.status(200).json({ 
            message: 'Login successful', 
            token,
            user: { 
                id: user.id, 
                username: user.username, 
                numero_vendedor: user.numero_vendedor, 
                rol: user.rol,
                nombre_vendedor: vendedor.APEYNOM,
            } 
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'No estás autorizado para acceder a esta ruta' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id);
        if (!req.user) {
            return res.status(401).json({ message: 'No estás autorizado para acceder a esta ruta' });
        }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Tu token ha expirado. Por favor, inicia sesión de nuevo.' });
        } else {
            res.status(401).json({ message: 'No estás autorizado para acceder a esta ruta' });
        }
    }
};


exports.verifyRole = (roles) => {
    return (req, res, next) => {
        
        console.log("Rol del usuario:", req.user.rol);
        console.log("Roles permitidos por la ruta:", roles); 

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
        }
        next();
    };
};


exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'numero_vendedor', 'rol'],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const vendedor = await Vendedores.findOne({ where: { NUMERO: user.numero_vendedor } });
        if (!vendedor) return res.status(401).json({ message: 'Vendedor no encontrado' });

        const userWithVendedor = {
            ...user.toJSON(), 
            nombre_vendedor: vendedor.APEYNOM
        };

        res.status(200).json({ user: userWithVendedor });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};








