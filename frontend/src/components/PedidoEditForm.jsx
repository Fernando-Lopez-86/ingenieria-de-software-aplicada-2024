import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// Componente para el formulario emergente de agregar ítem
// function AddItemPopup({ isOpen, onClose, onAddItem }) {
//     const [articulo, setArticulo] = useState('');
//     const [cantidad, setCantidad] = useState('');
//     const [precio, setPrecio] = useState('');

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         // Aquí podrías realizar validaciones adicionales antes de agregar el ítem
//         const newItem = { articulo, cantidad, precio };
//         onAddItem(newItem);
//         onClose();
//     };

//     return isOpen ? (
//         <div className="popup">
//             <div className="popup-inner">
//                 <h2>Agregar Nuevo Ítem</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label>Artículo</label>
//                         <input
//                             type="text"
//                             value={articulo}
//                             onChange={(e) => setArticulo(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Cantidad</label>
//                         <input
//                             type="number"
//                             value={cantidad}
//                             onChange={(e) => setCantidad(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Precio</label>
//                         <input
//                             type="number"
//                             value={precio}
//                             onChange={(e) => setPrecio(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-buttons">
//                         <button type="submit" className="btn btn-primary">Aceptar</button>
//                         <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     ) : null;
// }




function PedidoEditForm() {
    const { NROPED } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        NROPED: '',
        CLIENTE: '',
        TIPO: '',
        ESTADOSEG: '',
        CODIGO: '',
        NROREAL: '',
        RAZONSOC: '',
    });

    const [pedidoItems, setPedidoItems] = useState([]); // Estado para los ítems del pedido
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para controlar la apertura del popup
    const [newItem, setNewItem] = useState({
        ARTICULO: '',
        CANTPED: '',
        PRECIO: '',
    });

    useEffect(() => {
        fetch(`http://localhost:3000/api/pedidos/edit/${NROPED}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del pedido');
                }
                return response.json();
            })
            .then(data => {
                setFormData(data.data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setIsLoading(false);
            });

        // Fetch para obtener los ítems del pedido
        fetch(`http://localhost:3000/api/pedidos/items/${NROPED}`)
            .then(response => response.json())
            .then(data => setPedidoItems(data.data))
            .catch(error => console.error(`Error fetching items: ${error}`));

    }, [NROPED]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:3000/api/pedidos/update/${NROPED}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el pedido');
                }
                return response.json();
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el pedido');
                }
                return response.json();
            })
            .then(() => {
                // Si se actualiza el pedido correctamente, guardar los ítems del pedido
                console.log('Pedido actualizado correctamente');
            })
            .catch(error => {
                setError(error.message);
            });
    };

    const handleDeleteItem = (itemId) => {
        // Eliminar el ítem de manera local en el estado de pedidoItems
        setPedidoItems(pedidoItems.filter(item => item.ITEM !== itemId));
    };

    const handleAddItem = () => {
        // Agregar el nuevo ítem de manera local en el estado de pedidoItems
        const newItemWithNROPED = { ...newItem, NROPED: formData.NROPED, ITEM: (pedidoItems.length > 0 ? Math.max(...pedidoItems.map(item => parseInt(item.ITEM))) : 0) + 1, };
        setPedidoItems([...pedidoItems, newItemWithNROPED]);
        setIsPopupOpen(false); // Cerrar el popup después de agregar el ítem
        setNewItem({
            ARTICULO: '',
            CANTPED: '',
            PRECIO: '',
        });
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div className="form-container w-100 ">
            <div className="form-card w-25 ml-4 mr-4">
                <h2>Modificar Pedido</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nro Pedido</label>
                        <input
                            type="text"
                            name="NROPED"
                            value={formData.NROPED}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>Cliente</label>
                        <input
                            type="text"
                            name="CLIENTE"
                            value={formData.CLIENTE}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Tipo</label>
                        <input
                            type="text"
                            name="TIPO"
                            value={formData.TIPO}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Estado Seguimiento</label>
                        <input
                            type="text"
                            name="ESTADOSEG"
                            value={formData.ESTADOSEG}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Código</label>
                        <input
                            type="text"
                            name="CODIGO"
                            value={formData.CODIGO}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Nro Real</label>
                        <input
                            type="text"
                            name="NROREAL"
                            value={formData.NROREAL}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="btn btn-primary">Guardar</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/pedidos')}>Cancelar</button>
                    </div>
                </form>
            </div>


            <div className="w-75 mr-4">
                <div className="form-card">
                <h2>Items del Pedido</h2>
                <button
                    className="btn btn-outline-primary btn-sm mb-2"
                    onClick={() => setIsPopupOpen(true)}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Agregar Ítem
                </button>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Nro Pedido</th>
                                <th>Item</th>
                                <th>Articulo</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidoItems.map(item => (
                                <tr key={item.ITEM}>
                                    <td>{item.NROPED}</td>
                                    <td>{item.ITEM.toString().padStart(3, '0')}</td> {/* Formatear el valor a 3 dígitos con ceros a la izquierda */}
                                    <td>{item.ARTICULO}</td>
                                    <td>{item.CANTPED}</td>
                                    <td>{item.PRECIO}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-outline-danger mr-1"
                                            onClick={() => handleDeleteItem(item.ITEM)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
            {/* Popup para agregar nuevo ítem */}
            {isPopupOpen && (
                <div className="form-card popup w-25">
                    <div className="popup-inner">
                        <h2>Agregar Nuevo Ítem</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label>Artículo</label>
                                <input
                                    type="text"
                                    value={newItem.ARTICULO}
                                    onChange={(e) => setNewItem({ ...newItem, ARTICULO: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Cantidad</label>
                                <input
                                    type="number"
                                    value={newItem.CANTPED}
                                    onChange={(e) => setNewItem({ ...newItem, CANTPED: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Precio</label>
                                <input
                                    type="number"
                                    value={newItem.PRECIO}
                                    onChange={(e) => setNewItem({ ...newItem, PRECIO: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddItem}
                                >
                                    Aceptar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsPopupOpen(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );


}

export default PedidoEditForm;