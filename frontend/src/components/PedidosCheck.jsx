
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa los estilos de react-confirm-alert

function PedidosCheck() {
    const [pedidos, setPedidos] = useState([]);
    const [pedidosItems, setPedidosItems] = useState([]);
    const [selectedNROPED, setSelectedNROPED] = useState(null);
    const { user } = useContext(UserContext);
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


    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
                const response = await fetch(`${API_URL}/api/pedidos/pending`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado de autorización
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setPedidos(data.data);
            } catch (error) {
                console.error("Error al obtener los pedidos:", error);
            }
        };

        if (user) {
            fetchPedidos();
        } else {
            console.error("El usuario no tiene un numero_vendedor definido.");
        }
    }, [user]);


    useEffect(() => {
        if (selectedNROPED !== null) {
            fetch(`${API_URL}/api/pedidos/items/${selectedNROPED}`)
                .then(response => response.json())
                .then(data => setPedidosItems(data.data));
        }
    }, [selectedNROPED]);


    const handleModify = (NROPED) => {
        navigate('/check/approve', { state: { NROPED } });
    };


    return (
        <div className="pedidos-container">
            <div className="pedidos-check">
                <div className="header-sticky bg-primary text-white h4" align="center" colSpan="11"><b>AUTORIZAR PEDIDOS</b></div>
                <table className="table table-hover table-pedidos-check">
                    <thead>
                        <tr>
                            <th className="p-1">Fecha</th>
                            <th className="p-1">Nro Cliente</th>
                            <th className="p-1">Cliente</th>
                            <th className="p-1">Vendedor</th>
                            <th className="p-1">Estado</th>
                            <th className="p-1 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.NROPED} >
                                <td className="p-1">{formatDate(pedido.FECEMISION)}</td>
                                <td className="p-1">{pedido.CLIENTE}</td>
                                <td className="p-1">{pedido.RAZONSOC}</td>
                                <td className="p-1">{pedido.VENDEDOR}</td>
                                <td className="p-1">{pedido.ESTADOSEG === 'P' ? 'Pendiente' : pedido.ESTADOSEG === 'A' ? 'Aprobado' : ''}</td>
                                <td className="p-1" align="center">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={(e) => { e.stopPropagation(); handleModify(pedido.NROPED); }}
                                        disabled={pedido.ESTADOSEG === 'A'} 
                                    >
                                        Ver Pedido
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default PedidosCheck;
