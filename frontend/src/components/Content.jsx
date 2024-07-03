import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Pedidos from './Pedidos';
import PedidosNew from './PedidosNew';
import PedidosEdit from './PedidosEdit';

function Content(){
    return(
        <div className="content">
            <Routes>
                <Route path="/" exact={true} element={ <Pedidos /> } />
                <Route path="/new" exact={true} element={ <PedidosNew /> } />
                <Route path="/edit/:NROPED" element={<PedidosEdit />} />
            </Routes>
        </div>
    );
}

export default Content;