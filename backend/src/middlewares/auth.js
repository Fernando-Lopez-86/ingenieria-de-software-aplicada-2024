// middleware/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Vendedores } = require('../database/models'); // Asegúrate de que la ruta es correcta

// Registrar Usuario
// curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"username": "fer", "password": "123", "numero_vendedor": "016"}'
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


// Iniciar Sesión
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials: user not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials: incorrect password' });

        const token = jwt.sign({ id: user.id, rol: user.rol, numero_vendedor: user.numero_vendedor }, process.env.JWT_SECRET, { expiresIn: '3h' });
        //const refreshToken = jwt.sign({ id: user.id, rol: user.rol, numero_vendedor: user.numero_vendedor }, process.env.JWT_REFRESH_SECRET, { expiresIn: '4m' });

        const vendedor = await Vendedores.findOne({ where: { NUMERO: user.numero_vendedor } });
        if (!vendedor) return res.status(401).json({ message: 'Vendedor no encontrado' });
        // console.log("vendedor: ", vendedor)

        // res.status(200).json({ message: 'Login successful', token, numero_vendedor: user.numero_vendedor, nombre_vendedor: vendedor.APEYNOM, rol: user.rol });
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

// Middleware para verificar roles
exports.verifyRole = (roles) => {
    return (req, res, next) => {
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

        // Añadir la información del vendedor al objeto usuario
        const userWithVendedor = {
            ...user.toJSON(), // Convierte la instancia de Sequelize a JSON
            nombre_vendedor: vendedor.APEYNOM
        };

        res.status(200).json({ user: userWithVendedor });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};


// Middleware para proteger rutas
// exports.protect = async (req, res, next) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     if (!token) {
//         return res.status(401).json({ message: 'Access denied, no token provided' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         if (error.name === 'TokenExpiredError') {
//             const refreshToken = req.header('x-refresh-token');
//             if (!refreshToken) {
//                 return res.status(401).json({ message: 'Access denied, no refresh token provided' });
//             }
//             try {
//                 const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//                 const user = await User.findByPk(decodedRefreshToken.id); // Encuentra el usuario por el ID en el refresh token
//                 if (!user) {
//                     return res.status(401).json({ message: 'User not found' });
//                 }
//                 // Genera un nuevo token y continúa con la solicitud original
//                 const newToken = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
//                 res.setHeader('Authorization', `Bearer ${newToken}`);
//                 req.user = decodedRefreshToken;
//                 next();
//             } catch (refreshError) {
//                 return res.status(401).json({ message: 'Invalid refresh token' });
//             }
//         } else {
//             return res.status(400).json({ message: 'Invalid token' });
//         }
//     }
// };


// Renovar Access Token
// exports.refreshToken = (req, res) => {
//     const { refreshToken } = req.body;
//     if (!refreshToken) {
//         return res.status(401).json({ message: 'Refresh token is required' });
//     }

//     try {
//         jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
//             if (err) {
//                 return res.status(403).json({ message: 'Invalid refresh token' });
//             }

//             const newAccessToken = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
//             res.json({ accessToken: newAccessToken });
//         });
//     } catch (error) {
//         console.error('Error verifying refresh token:', error);
//         res.sendStatus(403);
//     }
// };



