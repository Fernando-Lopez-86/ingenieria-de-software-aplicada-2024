
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa los estilos de react-confirm-alert

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [pedidosItems, setPedidosItems] = useState([]);
    const [selectedNROPED, setSelectedNROPED] = useState(null);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        // Convertir la cadena de fecha a un objeto Date
        const date = new Date(dateString);

        // Obtener los componentes de fecha
        const day = date.getUTCDate().toString().padStart(2, '0'); // Día con dos dígitos
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Mes con dos dígitos
        const year = date.getUTCFullYear(); // Año completo

        // Devolver la fecha formateada en el formato deseado
        return `${day}/${month}/${year}`;
    };


    useEffect(() => {
        fetch("http://localhost:3000/api/pedidos")
            .then(response => response.json())
            .then(data => setPedidos(data.data));
    }, []);


    useEffect(() => {
        if (selectedNROPED !== null) {
            fetch(`http://localhost:3000/api/pedidos/items/${selectedNROPED}`)
                .then(response => response.json())
                .then(data => setPedidosItems(data.data));
        }
    }, [selectedNROPED]);


    const handleRowClick = (nroPed) => {
        setSelectedNROPED(nroPed);
        console.log("NROPEDDD:"+selectedNROPED)
    };


    const handleDelete = (nroPed) => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: `¿Está seguro de que desea eliminar el pedido ${nroPed}?`,
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        fetch(`http://localhost:3000/api/pedidos/${nroPed}`, {
                            method: 'DELETE',
                        })
                        .then(response => {
                            if (response.ok) {
                                // Actualizar la lista de pedidos después de eliminar REVISAR!!!!!!!
                                const updatedPedidos = pedidos.filter(pedido => pedido.NROPED !== nroPed);
                                setPedidos(updatedPedidos);
                                
                                // Actualizar pedidosItems si el pedido eliminado 
                                if (selectedNROPED === nroPed) {
                                    setPedidosItems([]);
                                    setSelectedNROPED(null);
                                }
                            } else {
                                console.error(`Error al eliminar el pedido ${nroPed}`);
                            }
                        })
                        .catch(error => console.error(`Error de red: ${error}`));
                    }
                },
                {
                    label: 'No',
                    onClick: () => console.log('Cancelado')
                }
            ]
        });
    };


    const handleModify = (nroPed) => {
        navigate(`/edit/${nroPed}`);   // Redirigir a la ruta de edición
    };


    return (
        <div className="pedidos-container">
            <div className="pedidos">
                <div className="bg-primary text-white" align="center" colSpan="11"><b>PEDIDOS</b></div>
                <table className="table table-hover table-pedidos">
                    <thead>
                        <tr>
                            <th>Nro Pedido</th>
                            <th>Fecha</th>
                            <th>Nro Cliente</th>
                            <th>Cliente</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.NROPED} onClick={() => handleRowClick(pedido.NROPED)}>
                                <td>{pedido.NROPED}</td>
                                <td>{formatDate(pedido.FECEMISION)}</td>
                                <td>{pedido.CLIENTE}</td>
                                <td>{pedido.RAZONSOC}</td>
                                <td className="p-1" align="center">
                                    <button
                                        className="btn btn-sm btn-outline-danger mr-1"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(pedido.NROPED); }}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={(e) => { e.stopPropagation(); handleModify(pedido.NROPED); }}
                                    >
                                        Modificar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pedidos-items">
                <table className="table table-hover table-pedidos-items">
                    <div className="bg-primary text-white" align="center" colSpan="11"><b>PEDIDOS ITEMS</b></div>
                    <thead>
                        <tr>
                            <th>Nro Pedido</th>
                            <th>Cliente</th>
                            <th>Item</th>
                            <th>Articulo</th>
                            <th>Bultos</th>
                            <th>Precio</th>
                            <th>Descuento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosItems.map(item => (
                            <tr key={`${item.NROPED}-${item.ITEM}`}>
                                <td>{item.NROPED}</td>
                                <td>{item.CLIENTE}</td>
                                <td>{item.ITEM}</td>
                                <td>{item.DESCART}</td>
                                <td>{item.CANTPED}</td>
                                <td>{item.PRECIO}</td>
                                <td>{item.DESCUENTO}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Pedidos;
