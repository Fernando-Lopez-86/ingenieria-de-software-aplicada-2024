import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Pedidos from './Pedidos';
import PedidosNew from './PedidosNew';
import PedidosEdit from './PedidosEdit';
import PedidosCheck from './PedidosCheck';
import PedidosEditApprove from './PedidosEditApprove';
import Login from './Login';
import PrivateRoute from './PrivateRoute';

function Content(){
    return(
        <div className="content">
            <Routes>
                {/* Rutas accesibles para admin, vendedor y control */}
                <Route element={<PrivateRoute allowedRoles={['admin', 'vendedor']} />}>
                    <Route path="/" element={<Pedidos />} />
                </Route>

                <Route element={<PrivateRoute allowedRoles={['admin', 'vendedor']} />}>
                    <Route path="/" element={<Pedidos />} />
                    <Route path="/new" element={<PedidosNew />} />
                    <Route path="/edit" element={<PedidosEdit />} />
                </Route>

                <Route element={<PrivateRoute allowedRoles={['admin', 'control']} />}>
                    <Route path="/check" element={<PedidosCheck />} />
                    <Route path="/check/approve" element={<PedidosEditApprove />} />
                </Route>
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default Content;