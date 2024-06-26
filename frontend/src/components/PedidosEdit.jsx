import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';

function PedidoEditForm() {
    const navigate = useNavigate();
    const { NROPED } = useParams();
    // const [CLIENTE, setCLIENTE] = useState('');
    // const [ENTREGA, setENTREGA] = useState('');
    // const [LOCENT, setLOCENT] = useState('');
    // const [PROENT, setPROENT] = useState('');
    // const [CONDVENTA, setCONDVENTA] = useState('');
    const [formData, setFormData] = useState({
        // NROPED: '',
        CLIENTE: '',
        DIREENT: '',
        LOCENT: '',
        PROENT: '',
        TELEFONOS: '',
        CONDVENTA: '',
        FECTRANS: '',
        COMENTARIO: '',
    });

    const [pedidoItems, setPedidoItems] = useState([]); // Estado para los ítems del pedido
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [items, setItems] = useState([{
        ITEM: '001',
        // NROPED: '',
        ARTICULO: '',
        CANTPED: '',
        PRECIO: '',
        DESCUENTO: '',
    }]);

    const [articulos, setArticulos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [formasDePago, setFormasDePago] = useState([]);
    const [provincias, setProvincias] = useState([]);

    // const options = articulos.map(articulo => ({
    //     value: articulo.NUMERO,
    //     label: articulo.DESCRIP
    // }));

    const options = articulos.map(articulo => ({
        value: { NUMERO: articulo.NUMERO, DESCRIP: articulo.DESCRIP },
        label: articulo.DESCRIP
    }));

    const optionsClientes = clientes.map(cliente => ({
        value: cliente.NUMERO,
        label: cliente.RAZONSOC
    }));

    const optionsFormasDePago = formasDePago.map(forma => ({
        value: forma.value,
        label: forma.label
    }));

    const optionsProvincias = provincias.map(provincia => ({
        value: provincia.value,
        label: provincia.label
    }));

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
        
        fetch("http://localhost:3000/api/articulos")
        .then(response => response.json())
        .then(data => setArticulos(data.data));

        fetch("http://localhost:3000/api/tablas/formas-pago")
            .then(response => response.json())
            .then(data => setFormasDePago(data.data))
            .catch(error => console.error('Error fetching formas de pago:', error));
        
        fetch("http://localhost:3000/api/tablas/provincias")
            .then(response => response.json())
            .then(data => setProvincias(data.data))
            .catch(error => console.error('Error fetching provincias:', error));

        // fetch("http://localhost:3000/api/clientes")
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log("Clientes:", data.data);
        //         setClientes(data.data);
        //     })
        //     .catch(error => console.error('Error fetching clientes:', error));
    
        // fetch("http://localhost:3000/api/clientes")
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log("Clientes:", data.data);
        //         setClientes(data.data);
        //         // Set initial CLIENTE value after fetching clients
        //         const selectedCliente = data.data.find(cliente => cliente.NUMERO === formData.CLIENTE);
        //         if (selectedCliente) {
        //             setCLIENTE(selectedCliente.NUMERO);
        //         }
        //     })
        //     .catch(error => console.error('Error fetching clientes:', error));

        fetch("http://localhost:3000/api/clientes")
            .then(response => response.json())
            .then(data => {
                setClientes(data.data);
                // Set initial CLIENTE value after fetching clients
                const selectedCliente = data.data.find(cliente => cliente.NUMERO === formData.CLIENTE);
                if (selectedCliente) {
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        CLIENTE: selectedCliente.NUMERO
                    }));
                }
            })
            .catch(error => console.error('Error fetching clientes:', error));

    }, [NROPED]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleItemChange = (index, event) => {
        const newItems = [...pedidoItems]; // Clonar el array
        newItems[index][event.target.name] = event.target.value;
        setPedidoItems(newItems);
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, FECTRANS: date });
    };
    
    const addItem = () => {
        setPedidoItems([...pedidoItems, { 
            ITEM: (pedidoItems.length + 1).toString().padStart(3, '0'),
            ARTICULO: '',
            CANTPED: '',
            PRECIO: '',
        }]);
    };
    
    const removeItem = (index) => {
        const newItems = pedidoItems.filter((item, i) => i !== index);
        setPedidoItems(newItems);
    };


    const handleClientChange = (selectedOption) => {
        //setCLIENTE(selectedOption ? selectedOption.value : null);
        setFormData({ ...formData, CLIENTE: selectedOption ? selectedOption.value : '' });
    };

    // const handleArticuloChange = (index, selectedOption) => {
    //     const newItems = [...pedidoItems];
    //     newItems[index].ARTICULO = selectedOption ? selectedOption.value : null;
    //     setItems(newItems);
    // };

    const handleArticuloChange = (index, selectedOption) => {
        const newItems = [...pedidoItems];
        newItems[index].ARTICULO = selectedOption ? selectedOption.NUMERO : null;
        newItems[index].DESCART = selectedOption ? selectedOption.DESCRIP : null;
        setItems(newItems);
    };

    const handleFormaDePagoChange = (selectedOption) => {
        setFormData({ ...formData, CONDVENTA: selectedOption ? selectedOption.value : '' });
    };

    const handleProvinciasChange = (selectedOption) => {
        setFormData({ ...formData, PROENT: selectedOption ? selectedOption.value : '' });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formattedDate = formData.FECTRANS ? format(formData.FECTRANS, 'yyyy-MM-dd HH:mm:ss') : null;

        fetch(`http://localhost:3000/api/pedidos/update/${NROPED}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // ESTADOSEG: formData.ESTADOSEG,
                CLIENTE: formData.CLIENTE,
                DIREENT: formData.DIREENT,
                LOCENT: formData.LOCENT,
                PROENT: formData.PROENT,
                TELEFONOS: formData.TELEFONOS,
                CONDVENTA: formData.CONDVENTA,
                FECTRANS: formattedDate,
                COMENTARIO: formData.COMENTARIO,
                // pedidoItems: pedidoItems
                pedidoItems: pedidoItems.map(item => ({
                    ...item,
                    ARTICULO: item.ARTICULO,
                    DESCART: item.DESCART
                }))
            }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Error al actualizar el pedido');
                    });
                }
                return response.json();
            })
            .then(() => {
                console.log('Pedido actualizado correctamente');
                navigate('/');  // Redirigir después de la actualización exitosa
            })
            .catch(error => {
                setError(error.message);
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
            <form className="w-100" onSubmit={handleSubmit}>
            <h3 className="text-center">Modificar Pedido</h3>
            <div className="form-container w-100">
                <div className="form-card w-25 mr-4 mt-2 mb-4 border border-primary">
                    {/* <div className="form-group">
                        <label>Nro Pedido</label>
                        <input
                            type="text"
                            name="NROPED"
                            value={formData.NROPED}
                            onChange={handleChange}
                            disabled
                        />
                    </div> */}
                    <div className="form-group">
                        <label>Cliente</label>
                        <Select
                            name="CLIENTE"
                            value={optionsClientes.find(option => option.value === formData.CLIENTE) || null}
                            onChange={handleClientChange}
                            options={optionsClientes}
                            isSearchable
                            placeholder="Seleccionar Cliente"
                            required
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            menuPosition="fixed"
                        />
                    </div>
                    <div className="form-group">
                        <label>Forma de Pago</label>
                        <Select
                            name="CONDVENTA"
                            value={optionsFormasDePago.find(option => option.value === formData.CONDVENTA) || null}
                            onChange={handleFormaDePagoChange}
                            options={optionsFormasDePago}
                            isSearchable
                            placeholder="Seleccionar Forma de Pago"
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            menuPosition="fixed"
                        />
                    </div>

                    <div className="form-group">
                        <label>Direccion Entrega</label>
                        <input
                            type="text"
                            name="DIREENT"
                            value={formData.DIREENT}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Localidad Entrega</label>
                        <input
                            type="text"
                            name="LOCENT"
                            value={formData.LOCENT}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Provincia Entrega</label>
                        <Select
                            name="PROENT"
                            value={optionsProvincias.find(option => option.value === formData.PROENT) || null}
                            onChange={handleProvinciasChange}
                            options={optionsProvincias}
                            isSearchable
                            placeholder="Seleccionar Provincia"
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            menuPosition="fixed"
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha Entrega</label>
                        <DatePicker
                            name="FECTRANS"
                            value={formData.FECTRANS} 
                            onChange={handleDateChange}
                            selected={formData.FECTRANS ? new Date(formData.FECTRANS) : null}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/yyyy"
                        />
                        {/* <input
                            type="text"
                            name="FECTRANS"
                            value={formData.FECTRANS}
                            onChange={handleChange}
                        /> */}
                    </div>

                    <div className="form-group">
                        <label>Telefono Entrega</label>
                        <input
                            type="text"
                            name="TELEFONOS"
                            value={formData.TELEFONOS}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Comentarios</label>
                        <input
                            type="text"
                            name="COMENTARIO"
                            value={formData.COMENTARIO}
                            onChange={handleChange}
                        />
                    </div>
                    
                </div>
                
            
                <div className="form-card w-75 mt-2 mb-4 border border-primary">
                    <div className="form-container d-flex justify-content-between">
                        <h3>Items del Pedido</h3>
                        <button type="button" className="btn btn-outline-success mr-3 mb-2 mt-1" onClick={addItem}><FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr className="table-row">
                                    <th className="column column-small">Item</th>
                                    <th className="column">Articulo</th>
                                    <th className="column column-medium">Cantidad</th>
                                    <th className="column column-medium">Precio</th>
                                    <th className="column column-medium">Descuento</th>
                                    <th className="column column-small">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidoItems.map((item, index) => (
                                    <tr key={item.ITEM} className="table-row">
                                        <td className="form-group column column-small"><input type="text" name="ITEM" value={item.ITEM} onChange={(e) => handleItemChange(index, e)} required readOnly/></td>
                                        <td className="form-group column">
                                            <Select
                                                name="ARTICULO"
                                                value={options.find(option => option.value.NUMERO === item.ARTICULO)}
                                                // onChange={(selectedOption) => handleItemChange(index, { target: { name: 'ARTICULO', value: selectedOption.value } })}
                                                onChange={(selectedOption) => handleArticuloChange(index, selectedOption.value)}
                                                options={options}
                                                isSearchable
                                                placeholder="Seleccionar Artículo"
                                                required
                                                menuPortalTarget={document.body}  // Renderiza el menú en el body
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}  // Ajusta el z-index
                                                menuPosition="fixed"
                                            />
                                        </td>
                                        <td className="form-group column column-medium"><input type="text" name="CANTPED" value={item.CANTPED} onChange={(e) => handleItemChange(index, e)} required/></td>
                                        <td className="form-group column column-medium"><input type="text" name="PRECIO" value={item.PRECIO} onChange={(e) => handleItemChange(index, e)} required/></td>
                                        <td className="form-group column column-medium"><input type="text" name="DESCUENTO" value={item.DESCUENTO} onChange={(e) => handleItemChange(index, e)} required/></td>
                                        <td className="form-group column column-small text-center">
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
                <button type="submit" className="m-4 btn btn-primary">Guardar</button>
                <button type="button" className="m-4 btn btn-secondary" onClick={() => navigate('/pedidos')}>Cancelar</button>
            </div>
            </form>
        </div>
    );

}

export default PedidoEditForm;