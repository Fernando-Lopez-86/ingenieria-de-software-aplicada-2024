
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa los estilos de react-confirm-alert

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [pedidosItems, setPedidosItems] = useState([]);
    const [selectedNROPED, setSelectedNROPED] = useState(null);
    const { user } = useContext(UserContext);
    const numero_vendedor = user.numero_vendedor;
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

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



    const fetchPedidos = async () => {
        try {
            let token = localStorage.getItem('token');
            // const refreshToken = localStorage.getItem('refreshToken');
            const response = await fetch(`${API_URL}/api/pedidos?numero_vendedor=${user.numero_vendedor}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPedidos(data.data);
            } else if (response.status === 401 ) {
                // if (token) {
                //     fetchPedidos(false);
                // }
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                throw new Error(`Error fetching pedidos: ${response.status}`);
            }
        } catch (error) {
            console.error("Error al obtener los pedidos:", error);
        }
    };

    const fetchPedidosItems = async (nroPed, retry = true) => {
        try {
            let token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/pedidos/items/${nroPed}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPedidosItems(data.data);
            } else if (response.status === 401) {
                // if (token) {
                //     fetchPedidosItems(nroPed, false);
                // }
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                throw new Error(`Error fetching pedidos items: ${response.status}`);
            }
        } catch (error) {
            console.error("Error al obtener los items de pedidos:", error);
        }
    };

    useEffect(() => {
        if (user && user.numero_vendedor) {
            fetchPedidos();
        } else {
            console.error("El usuario no tiene un numero_vendedor definido.");
        }
    }, [user]);

    useEffect(() => {
        if (selectedNROPED !== null) {
            fetchPedidosItems(selectedNROPED);
        }
    }, [selectedNROPED]);



    // const fetchPedidos = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await fetch(`http://localhost:3000/api/pedidos?numero_vendedor=${user.numero_vendedor}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             setPedidos(data.data);
    //         } else {
    //             throw new Error(`Error fetching pedidos: ${response.status}`);
    //         }
    //     } catch (error) {
    //         console.error("Error al obtener los pedidos:", error);
    //     }
    // };

    // const fetchPedidosItems = async (nroPed) => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await fetch(`http://localhost:3000/api/pedidos/items/${nroPed}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             setPedidosItems(data.data);
    //         } else {
    //             throw new Error(`Error fetching pedidos items: ${response.status}`);
    //         }
    //     } catch (error) {
    //         console.error("Error al obtener los items de pedidos:", error);
    //     }
    // };

    // useEffect(() => {
    //     if (user && user.numero_vendedor) {
    //         fetchPedidos();
    //     } else {
    //         console.error("El usuario no tiene un numero_vendedor definido.");
    //     }
    // }, [user]);

    // useEffect(() => {
    //     if (selectedNROPED !== null) {
    //         fetchPedidosItems(selectedNROPED);
    //     }
    // }, [selectedNROPED]);



    // useEffect(() => {
    //     const fetchPedidos = async () => {
    //         try {
    //             const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
    //             const response = await fetch(`http://localhost:3000/api/pedidos?numero_vendedor=${user.numero_vendedor}`, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado de autorización
    //                     'Content-Type': 'application/json'
    //                 }
    //             });
    //             const data = await response.json();
    //             setPedidos(data.data);
    //         } catch (error) {
    //             console.error("Error al obtener los pedidos:", error);
    //         }
    //     };

    //     if (user && user.numero_vendedor) {
    //         fetchPedidos();
    //     } else {
    //         console.error("El usuario no tiene un numero_vendedor definido.");
    //     }
    // }, [user]);


    // useEffect(() => {
    //     if (selectedNROPED !== null) {
    //         const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
    //         fetch(`http://localhost:3000/api/pedidos/items/${selectedNROPED}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado de autorización
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //             .then(response => response.json())
    //             .then(data => setPedidosItems(data.data));
    //     }
    // }, [selectedNROPED]);


    const handleRowClick = (nroPed) => {
        setSelectedNROPED(nroPed);
    };


    const handleDelete = (nroPed) => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: `¿Está seguro de que desea eliminar el pedido ${nroPed}?`,
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
                        fetch(`${API_URL}/api/pedidos/${nroPed}?numero_vendedor=${user.numero_vendedor}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado de autorización
                                'Content-Type': 'application/json'
                            }
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


    const handleModify = (NROPED) => {
        // navigate(`/edit/${nroPed}`);   // Redirigir a la ruta de edición
        // navigate('/edit');   // Redirigir a la ruta de edición
        navigate('/edit', { state: { NROPED } });
    };

    // Calcular el total de cada fila
    const calcularTotal = (item) => {
        const precio = parseFloat(item.PRECIO) || 0;
        const cantidad = parseFloat(item.CANTPED) || 0;
        const descuento = parseFloat(item.DESCUENTO) || 0;
        return (precio * cantidad * (1 - descuento / 100)).toFixed(2);
    };

    // Formatear número para que tenga 2 decimales, punto como separador de miles y coma como separador de decimales
    const formatearNumero = (numero) => {
        return parseFloat(numero)
            .toFixed(2) // Asegura que hay exactamente 2 decimales
            .replace('.', ',') // Reemplaza el punto decimal con una coma
            .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Añade los puntos como separadores de miles
    };

    // Formatear número sin decimales, con punto como separador de miles
    const formatearNumeroSinDecimales = (numero) => {
        return parseInt(numero, 10)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Calcular el total general
    const totalGeneral = pedidosItems.reduce((total, item) => total + parseFloat(calcularTotal(item)), 0).toFixed(2);


    return (
        <div className="pedidos-container">
            <div className="pedidos">
                <div className="bg-primary text-white h4" align="center" colSpan="11"><b>PEDIDOS</b></div>
                <table className="table table-hover table-pedidos">
                    <thead>
                        <tr>
                            <th className="p-1">Fecha</th>
                            <th className="p-1">Nro Cliente</th>
                            <th className="p-1">Cliente</th>
                            <th className="p-1">Estado</th>
                            <th className="p-1 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.NROPED} onClick={() => handleRowClick(pedido.NROPED)}>
                                <td className="p-1">{formatDate(pedido.FECEMISION)}</td>
                                <td className="p-1">{pedido.CLIENTE}</td>
                                <td className="p-1">{pedido.RAZONSOC}</td>
                                <td className="p-1">{pedido.ESTADOSEG === 'P' ? 'Pendiente' : pedido.ESTADOSEG === 'A' ? 'Aprobado' : ''}</td>
                                <td className="p-1" align="center">
                                    <button
                                        className="btn btn-sm btn-outline-danger mr-1"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(pedido.NROPED); }}
                                        disabled={pedido.ESTADOSEG === 'A'} // Deshabilitar si el estado es 'A'
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={(e) => { e.stopPropagation(); handleModify(pedido.NROPED); }}
                                        disabled={pedido.ESTADOSEG === 'A'} // Deshabilitar si el estado es 'A'
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
                    <div className="bg-primary text-white h4" align="center" colSpan="11"><b>PEDIDOS ITEMS</b></div>
                    <thead>
                        <tr>
                            {/* <th>Nro Pedido</th> */}
                            <th className="p-1">Cliente</th>
                            <th className="p-1">Item</th>
                            <th className="p-1">Articulo</th>
                            <th className="p-1">Bultos</th>
                            <th className="p-1">Precio</th>
                            <th className="p-1">Descuento</th>
                            <th className="p-1">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosItems.map(item => (
                            <tr key={`${item.NROPED}-${item.ITEM}`}>
                                {/* <td>{item.NROPED}</td> */}
                                <td className="p-1">{item.CLIENTE}</td>
                                <td className="p-1">{item.ITEM}</td>
                                <td className="p-1">{item.DESCART}</td>
                                <td className="p-1">{formatearNumeroSinDecimales(item.CANTPED)}</td>
                                {/* <td>{item.PRECIO}</td> */}
                                <td className="p-1">{formatearNumero(item.PRECIO)}</td>
                                <td className="p-1">{formatearNumero(item.DESCUENTO)}</td>
                                <td className="p-1">{formatearNumero(calcularTotal(item))}</td>
                            </tr>
                        ))}
                        <tr>
                            <td></td><td></td><td></td><td></td><td></td><td></td>
                            <td className="p-1"><b>{formatearNumero(totalGeneral)}</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Pedidos;
