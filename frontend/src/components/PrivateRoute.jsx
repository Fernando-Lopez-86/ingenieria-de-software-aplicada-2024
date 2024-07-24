// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';

const PrivateRoute = ({ children }) => {

    const { user, loading } = useContext(UserContext);
    const token = localStorage.getItem('token');

    if (loading) {
        return <div>Loading...</div>; // O algún componente de carga
    }

    if (!token || !user) {
        console.error('Redirigiendo a /login porque falta token o usuario');
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;