import React from 'react';
import { useState, useEffect } from 'react';

function Pedidos(){
    const [pedidos, setPedidos] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/api/pedidos")
        .then(response => {
            return response.json()
        })
        .then(pedidos => {
            setPedidos(pedidos.data)
        })
    }, [])

    return (
        <table className="table table-hover mt-5">
            <thead> 
                <tr>
                    <td className="bg-primary text-white" align="center" colspan="11"><b>PEDIDOS</b></td>
                </tr>
                <tr>
                    <th>ID</th>
                    <th>SKU</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Descripción</th>
                    <th>Ancho</th>
                    <th>Alto</th>
                    <th>Profundidad</th>
                    <th>Peso</th>
                    <th>Marca</th>
                    <th>Categoría</th>
                </tr>
            </thead>
            <tbody>
                {pedidos.map(pedido => (
                    <tr>
                        <td>{pedido.id}</td>
                        <td>{pedido.sku}</td>
                        <td>{pedido.nombre}</td>
                        <td>{pedido.precio}</td>
                        <td>{pedido.descripcion}</td>
                        <td>{pedido.ancho}</td>
                        <td>{pedido.alto}</td>
                        <td>{pedido.profundidad}</td>
                        <td>{pedido.peso}</td>
                        <td>{pedido.marcas.marca}</td>
                        <td>{pedido.categorias.categoria}</td>
                    </tr>
                ))}
            </tbody> 
        </table>
    ); 
}

export default Pedidos;

