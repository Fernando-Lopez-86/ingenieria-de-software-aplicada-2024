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
        <div className="pedidos">
        <table className="table table-hover mt-5">
            <thead> 
                <tr>
                    <td className="bg-primary text-white" align="center" colspan="11"><b>PEDIDOS</b></td>
                </tr>
                <tr>
                    <th>Fecha</th>
                    <th>Nro Pedido</th>
                    <th>Nro Cliente</th>
                    <th>Cliente</th>
                    <th>Articulo</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                {pedidos.map(pedido => (
                    <tr>
                        <td>{pedido.FECEMISION}</td>
                        <td>{pedido.NROPED}</td>
                        <td>{pedido.CLIENTE}</td>
                        <td>{pedido.RAZONSOC}</td>
                        <td>{pedido.pedidositem.DESCART}</td>
                        <td>{pedido.pedidositem.BULTPED}</td>
                        <td>{pedido.pedidositem.PRECIO}</td>
                    </tr>
                ))}
            </tbody> 
        </table>
        </div>
    ); 
}

export default Pedidos;

