import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Pedidos from './Pedidos';
import PedidosNew from './PedidosNew';
import PedidosEdit from './PedidosEdit';
import PedidosCheck from './PedidosCheck';
import PedidosEditApprove from './PedidosEditApprove';

function Content(){
    return(
        <div className="content">
            <Routes>
                <Route path="/" exact={true} element={ <Pedidos /> } />
                <Route path="/check" exact={true} element={ <PedidosCheck /> } />
                <Route path="/new" exact={true} element={ <PedidosNew /> } />
                <Route path="/edit/:NROPED" element={<PedidosEdit />} />
                <Route path="/check/:NROPED" element={<PedidosEditApprove />} />
            </Routes>
        </div>
    );
}

export default Content;