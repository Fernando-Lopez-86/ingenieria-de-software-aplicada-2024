import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import SideBar from './components/SideBar';
import ContentWrapper from './components/ContentWrapper';
import useIdleTimer from './components/useIdleTimer'; // Importa el hook personalizado
import { UserProvider } from './components/UserContext'; // Importa el UserProvider
import PrivateLayout from './components/PrivateLayout';

import Pedidos from './components/Pedidos';
import PedidosNew from './components/PedidosNew';
import PedidosEdit from './components/PedidosEdit';
import PedidosCheck from './components/PedidosCheck';
import PedidosEditApprove from './components/PedidosEditApprove';
import Logout from './components/Logout';

import './assets/css/app.css';
import './assets/css/style2.css';

function App() {

    const handleIdle = () => {
        // Acción a tomar cuando el usuario está inactivo (cerrar sesión)
        localStorage.removeItem('token');
        localStorage.removeItem('user'); 
        window.location.href = '/login';
    };

    // Configura el temporizador de inactividad con un tiempo de espera de 15 minutos (900000 ms)
    useIdleTimer(handleIdle, 900000);

    return (

        <UserProvider>
        <div id="wrapper">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<div>No autorizado</div>} />

                {/* Rutas accesibles para admin, vendedor, y control */}
                <Route element={<PrivateRoute allowedRoles={['admin', 'vendedor', 'control']} />}>
                    <Route path="/" element={<PrivateLayout />}>
                        <Route index element={<ContentWrapper />} />
                    </Route>
                </Route>

                {/* Rutas accesibles para vendedor y admin */}
                <Route element={<PrivateRoute allowedRoles={['admin', 'vendedor']} />}>
                    <Route path="new" element={<PrivateLayout />}>
                        <Route index element={<PedidosNew />} />
                    </Route>
                    <Route path="edit" element={<PrivateLayout />}>
                        <Route index element={<PedidosEdit />} />
                    </Route>
                </Route>

                {/* Rutas accesibles para control y admin */}
                <Route element={<PrivateRoute allowedRoles={['admin', 'control']} />}>
                    <Route path="check" element={<PrivateLayout />}>
                        <Route index element={<PedidosCheck />} />
                    </Route>
                    <Route path="/check/approve" element={<PrivateLayout />}>
                        <Route index element={<PedidosEditApprove />} />
                    </Route>
                </Route>

                {/* Redirección por defecto a login si la ruta no es encontrada */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    </UserProvider>
    );
}

export default App;
