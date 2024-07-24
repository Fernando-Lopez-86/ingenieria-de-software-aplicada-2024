
import React, { useContext } from 'react';
import { UserContext } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="header">
            {user && (
                <div className="user-info">
                    <span>Hola, {user.username}</span>
                </div>
            )}
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
        // <button onClick={handleLogout} className="logout-button">
        //     Cerrar sesión
        // </button>
    );
};

export default LogoutButton;