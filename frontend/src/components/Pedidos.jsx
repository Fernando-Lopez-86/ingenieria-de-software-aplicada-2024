// import React from 'react';
// import { useState, useEffect } from 'react';

// function Pedidos(){
//     const [pedidos, setPedidos] = useState([])

//     useEffect(() => {
//         fetch("http://localhost:3000/api/pedidos")
//         .then(response => {
//             return response.json()
//         })
//         .then(pedidos => {
//             setPedidos(pedidos.data)
//         })
//     }, [])

//     return (
//         <div className="pedidos">
//         <table className="table table-hover mt-5">
//             <thead> 
//                 <tr>
//                     <td className="bg-primary text-white" align="center" colspan="11"><b>PEDIDOS</b></td>
//                 </tr>
//                 <tr>
//                     <th>Fecha</th>
//                     <th>Nro Pedido</th>
//                     <th>Nro Cliente</th>
//                     <th>Cliente</th>
//                     <th>Articulo</th>
//                     <th>Cantidad</th>
//                     <th>Precio</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {pedidos.map(pedido => (
//                     <tr>
//                         <td>{pedido.FECEMISION}</td>
//                         <td>{pedido.NROPED}</td>
//                         <td>{pedido.CLIENTE}</td>
//                         <td>{pedido.RAZONSOC}</td>
//                         <td>{pedido.pedidositem.DESCART}</td>
//                         <td>{pedido.pedidositem.BULTPED}</td>
//                         <td>{pedido.pedidositem.PRECIO}</td>
//                     </tr>
//                 ))}
//             </tbody> 
//         </table>
//         </div>
//     ); 
// }

// export default Pedidos;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa los estilos de react-confirm-alert


function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [pedidosItems, setPedidosItems] = useState([]);
    const [selectedNROPED, setSelectedNROPED] = useState(null);
    const navigate = useNavigate();

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

    // const handleDelete = (nroPed) => {
    //     // Lógica para eliminar el pedido
    //     console.log(`Eliminar pedido: ${nroPed}`);
    // };


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
                                setSelectedNROPED(nroPed);
                                // setPedidos(pedidos.filter(pedido => pedido.NROPED !== nroPed));
                                // setPedidosItems([]);
                                // if (nroPed === selectedNROPED) {
                                //     setSelectedNROPED(null);
                                // }
                                console.log(`Pedido ${nroPed} eliminado`);
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
        // Redirigir a la ruta de edición
        navigate(`/edit/${nroPed}`);
    };

   
   
    
    // const handleModify = (nroPed) => {
    //     // Lógica para modificar el pedido
    //     console.log(`Modificar pedido: ${nroPed}`);
    // };

    // const filteredItems = selectedNROPED
    //     ? pedidosItems.filter(item => item.NROPED === selectedNROPED)
    //     : [];

    return (
        <div className="pedidos-container">
            <div className="pedidos">
                <div className="bg-primary text-white" align="center" colSpan="11"><b>PEDIDOS</b></div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Nro Pedido</th>
                            <th>Nro Cliente</th>
                            <th>Cliente</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.NROPED} onClick={() => handleRowClick(pedido.NROPED)}>
                                <td>{pedido.FECEMISION}</td>
                                <td>{pedido.NROPED}</td>
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
                <table className="table table-hover">
                    <div className="bg-primary text-white" align="center" colSpan="11"><b>PEDIDOS ITEMS</b></div>
                    <thead>
                        <tr>
                            <th>Nro Pedido</th>
                            <th>Cliente</th>
                            <th>Tipo</th>
                            <th>Item</th>
                            <th>Articulo</th>
                            <th>Cantidad Pedida</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosItems.map(item => (
                            <tr key={`${item.NROPED}-${item.ITEM}`}>
                                <td>{item.NROPED}</td>
                                <td>{item.CLIENTE}</td>
                                <td>{item.TIPO}</td>
                                <td>{item.ITEM}</td>
                                <td>{item.ARTICULO}</td>
                                <td>{item.CANTPED}</td>
                                <td>{item.PRECIO}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Pedidos;
