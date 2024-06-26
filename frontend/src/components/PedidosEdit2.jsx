import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

function PedidosEdit() {
    const { NROPED } = useParams(); // Obtener el parámetro NROPED de la URL
    const navigate = useNavigate();

    const [cliente, setCliente] = useState(''); // Inicializar la variable cliente en el estado
    const [items, setItems] = useState([]); // Inicializar items como un array vacío
    const [error, setError] = useState(null); // Estado para manejar errores
    const [articulos, setArticulos] = useState([]); // Inicializar articulos como un array vacío

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/pedidos/edit/${NROPED}`);
                if (!response.ok) {
                    throw new Error('Error al obtener el pedido');
                }
                const data = await response.json();
                const { CLIENTE, pedidositem } = data; // Ajustar según la estructura de tu respuesta API
                setCliente(CLIENTE);
                setItems(pedidositem || []); // Asegurarse de manejar un posible valor nulo
            } catch (error) {
                console.error('Error al obtener el pedido', error);
                setError('Error al obtener el pedido');
            }
        };

        const fetchItems = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/pedidos/items/${NROPED}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los items del pedido');
                }
                const data = await response.json();
                setArticulos(data.data || []); // Asegurarse de manejar un posible valor nulo
            } catch (error) {
                console.error('Error al obtener los items del pedido', error);
                setError('Error al obtener los items del pedido');
            }
        };

        fetchPedido();
        fetchItems();
    }, [NROPED]);

    const handleItemChange = (index, event) => {
        const newItems = [...items];
        newItems[index][event.target.name] = event.target.value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, {
            ITEM: (items.length + 1).toString().padStart(3, '0'),
            ARTICULO: '',
            CANTPED: '',
            PRECIO: '',
        }]);
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch(`http://localhost:3000/api/pedidos/update/${NROPED}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CLIENTE: cliente, // Asegurarse de enviar cliente correctamente
                    items,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el pedido');
            }

            console.log('Pedido actualizado');
            navigate('/pedidos'); // Redireccionar después de actualizar
        } catch (error) {
            console.error('Error al actualizar el pedido', error);
            setError('Error al actualizar el pedido');
        }
    };

    const options = articulos.map(articulo => ({
        value: articulo.ARTICULO,
        label: articulo.DESCRIPCION
    }));

    return (
        <div className="form-container w-100">
            <form className="w-100" onSubmit={handleSubmit}>
                <h3 className="text-center">Editar Pedido</h3>
                <div className="form-container w-100">
                    <div className="form-card w-25 mr-4 mt-2 mb-4 border border-primary">
                        <div className="form-group">
                            <label>Cliente</label>
                            <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-card w-75 mt-2 mb-4 border border-primary">
                        <div className="form-container d-flex justify-content-between">
                            <h2>Items del Pedido</h2>
                            <button type="button" className="btn btn-outline-success ml-3 mb-3 mt-2" onClick={addItem}><FontAwesomeIcon icon={faPlus} /></button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr className="table-row">
                                        <th className="column column-small">Item</th>
                                        <th className="column">Articulo</th>
                                        <th className="column column-medium">Cantidad</th>
                                        <th className="column column-medium">Precio</th>
                                        <th className="column column-small">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index} className="table-row">
                                            <td className="column column-small">{item.ITEM}</td>
                                            <td className="column">
                                                <Select
                                                    name="ARTICULO"
                                                    value={options.find(option => option.value === item.ARTICULO)}
                                                    onChange={(selectedOption) => handleItemChange(index, { target: { name: 'ARTICULO', value: selectedOption.value } })}
                                                    options={options}
                                                    isSearchable
                                                    placeholder="Seleccionar Artículo"
                                                    required
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                    menuPosition="fixed"
                                                />
                                            </td>
                                            <td className="column column-medium"><input type="text" name="CANTPED" value={item.CANTPED} onChange={(e) => handleItemChange(index, e)} required /></td>
                                            <td className="column column-medium"><input type="text" name="PRECIO" value={item.PRECIO} onChange={(e) => handleItemChange(index, e)} required /></td>
                                            <td className="column column-small text-center">
                                                <button type="button" className="btn btn-sm btn-outline-danger remove-button" onClick={() => removeItem(index)}>
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
                <div className="form-buttons">
                    <button type="submit" className="m-4 btn btn-primary">Guardar Cambios</button>
                    <button type="button" className="m-4 btn btn-secondary" onClick={() => navigate('/pedidos')}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default PedidosEdit;