// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../components/UserContext';

const PrivateRoute = ({  allowedRoles }) => {

    const { user, loading } = useContext(UserContext);
    const token = localStorage.getItem('token');

    console.log("Current user:", user); // Agregar log
    console.log("Allowed roles:", allowedRoles); // Agregar log

    if (loading) {
        return <div>Loading...</div>; // O algún componente de carga
    }

    if (!token || !user) {
        console.error('Redirigiendo a /login porque falta token o usuario');
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        console.error('Redirigiendo a /unauthorized porque el rol no está permitido');
        return <Navigate to="/unauthorized" />;
    }

    // return children;
    return <Outlet />;
};

export default PrivateRoute;