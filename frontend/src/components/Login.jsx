// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Asegúrate de instalar react-icons
import logo from '../assets/images/logo.png'; // Asegúrate de que la ruta sea correcta
import '../assets/css/login.css'; // Agrega una hoja de estilos específica para el login

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setUser(data.user);
                setMessage('Login successful');

                // Redirigir según el rol del usuario
                if (data.user.rol === 'admin' || data.user.rol === 'vendedor') {
                    navigate('/');
                } else if (data.user.rol === 'control') {
                    navigate('/check');
                }

            } else {
                console.error('Inicio de sesión fallido:', data.message);
                setError('Usuario o contraseña incorrecta'); 
            }
        } catch (err) {
            console.error('Error en el inicio de sesión:', err);
            setError('Error de conexión, por favor inténtalo de nuevo');
        }
    };



    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <img src={logo} alt="Logo 1" className="logo" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label>Usuario:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="login-field">
                        <label>Contraseña:</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"} // Mostrar texto si showPassword es true
                                // type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                    type="button"
                                    className="eye-button"
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseLeave={() => setShowPassword(false)} // Para asegurarse de que el texto se oculte si el mouse sale del botón
                            >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login-button">Iniciar Sesión</button>
                </form>
                {message && <p className="login-message">{message}</p>}
                {error && <p className="login-error">{error}</p>} {/* Mostrar mensaje de error */}
            </div>
        </div>
    );
};

export default Login;