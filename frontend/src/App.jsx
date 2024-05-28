import React from 'react';
import { Routes, Route  } from "react-router-dom"
import Home from './components/Home';
import Pedidos from './components/Pedidos';
// import Usuarios from './components/Usuarios';
// import Categorias from './components/Categorias';
import './assets/css/app.css';

function App() {
  return (
    <Routes>
        <Route path="/" exact={true} element={ <Home /> } />
        <Route path="pedidos" exact={true} element={ <Pedidos /> } />
    </Routes>
  );
}

export default App;
