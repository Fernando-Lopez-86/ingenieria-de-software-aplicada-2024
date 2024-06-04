import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Pedidos from './Pedidos'
import PedidosNew from './PedidosNew'
// import Usuarios from './Usuarios'
// import Categorias from './Categorias'
// import CardCountProductos from './CardCountProductos'

function Content(){
    return(
        <div className="content">
            <Routes>
                <Route path="/" exact={true} element={ <Pedidos /> } />
                <Route path="/new" exact={true} element={ <PedidosNew /> } />
            </Routes>
        </div>
    );
}

export default Content;