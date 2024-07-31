// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import logo from '../assets/images/logo.png'; // Asegúrate de que la ruta sea correcta
import '../assets/css/login.css'; // Agrega una hoja de estilos específica para el login

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch('http://localhost:3000/auth/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ username, password }),
    //         });

    //         const data = await response.json();
    //         if (response.ok) {
    //             localStorage.setItem('token', data.token);
    //             localStorage.setItem('refreshToken', data.refreshToken);
    //             setUser(data.user);
    //             setMessage('Login successful');
    //             navigate('/');
    //         } else {
    //             alert(data.message);
    //         }
    //     } catch (error) {
    //         console.error('Error logging in:', error);
    //     }
    // };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setUser(data.user);
                setMessage('Login successful');
                navigate('/');
            } else {
                console.error('Login failed:', data.message);
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    };















    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const res = await fetch('http://localhost:3000/auth/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ username, password }),
    //         });

    //         if (!res.ok) {
    //             throw new Error('Login failed');
    //         }

    //         const data = await res.json();
    //         localStorage.setItem('token', data.token);
    //         setUser(data.user);
    //         setMessage('Login successful');
    //         navigate('/');
    //     } catch (error) {
    //         setMessage('Error logging in');
    //     }
    // };

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
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-button">Iniciar Sesión</button>
                </form>
                {message && <p className="login-message">{message}</p>}
            </div>
        </div>
    );
};

export default Login;



// // src/components/Login.jsx
// import React, { useState } from 'react';

// const Login = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [message, setMessage] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await fetch("http://localhost:3000/auth/login", {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ username, password }),
//             });

//             if (!res.ok) {
//                 throw new Error('Login failed');
//             }

//             const data = await res.json();
//             localStorage.setItem('token', data.token);
//             setMessage('Login successful');
//             window.location.href = '/'; // Redirige a la página principal después del login
//         } catch (error) {
//             setMessage('Error logging in');
//         }
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Username:</label>
//                     <input
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>
//                 <button type="submit">Login</button>
//             </form>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };

// export default Login;