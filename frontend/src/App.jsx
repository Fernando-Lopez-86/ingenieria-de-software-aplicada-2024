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
        <UserProvider> {/* Envolvemos toda la aplicación con UserProvider */}
            <div id="wrapper">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/unauthorized" element={<div>No autorizado</div>} />
                    <Route element={<PrivateRoute allowedRoles={['admin', 'vendedor']} />}>
                        <Route path="/" element={<PrivateLayout />}>
                            <Route index element={<ContentWrapper />} />
                            <Route path="/new" element={<PedidosNew />} />
                            <Route path="/edit" element={<PedidosEdit />} />
                        </Route>
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={['admin', 'user', 'control']} />}>
                        <Route path="/check" element={<PrivateLayout />}>
                            <Route index element={<PedidosCheck />} />
                            <Route path="/check/approve" element={<PedidosEditApprove />} />
                        </Route>
                    </Route> 
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </UserProvider>
    );
}

export default App;
