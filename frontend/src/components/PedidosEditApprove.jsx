import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { Modal, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function PedidoEditApprove() {
    const navigate = useNavigate();
    const location = useLocation();
    const { NROPED } = location.state;
    // const { NROPED } = useParams();
    const { user } = useContext(UserContext);
    // const [CLIENTE, setCLIENTE] = useState('');
    // const [ENTREGA, setENTREGA] = useState('');
    // const [LOCENT, setLOCENT] = useState('');
    // const [PROENT, setPROENT] = useState('');
    // const [CONDVENTA, setCONDVENTA] = useState('');
    const [formData, setFormData] = useState({
        CLIENTE: { NUMERO: '', RAZONSOC: '' },
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
        ARTICULO: '',
        CANTPED: '',
        PRECIO: '',
        DESCUENTO: '',
    }]);

    const [articulos, setArticulos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [formasDePago, setFormasDePago] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');


    const options = articulos.map(articulo => ({
        value: { NUMERO: articulo.NUMERO, DESCRIP: articulo.DESCRIP },
        label: articulo.DESCRIP
    }));


    const optionsClientes = clientes.map(cliente => ({
        // value: cliente.NUMERO,
        value: { NUMERO: cliente.NUMERO, RAZONSOC: cliente.RAZONSOC },
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
        if (!NROPED) {
            setError('No se recibió un número de pedido válido');
            setIsLoading(false);
            return;
        }

        const fetchPedido = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/pedidos/edit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ NROPED }),
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los datos del pedido');
                }

                const data = await response.json();
                // setPedidoData(data.data);
                setFormData({
                    ...data.data,
                    CLIENTE: {
                        NUMERO: data.data.CLIENTE,
                        RAZONSOC: data.data.RAZONSOC
                    }
                });
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchPedido();
    }, [NROPED]);



    useEffect(() => {
        const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
        // fetch(`http://localhost:3000/api/pedidos/edit/${NROPED}?numero_vendedor=${user.numero_vendedor}`,{
        //     headers: {
        //         'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado de autorización
        //         'Content-Type': 'application/json'
        //     }
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Error al obtener los datos del pedido');
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         setFormData({
        //             ...data.data,
        //             CLIENTE: {
        //                 NUMERO: data.data.CLIENTE,
        //                 RAZONSOC: data.data.RAZONSOC
        //             }
        //         });
        //         setIsLoading(false);
        //     })
        //     .catch(error => {
        //         setError(error.message);
        //         setIsLoading(false);
        //     });

        // Fetch para obtener los ítems del pedido
        fetch(`http://localhost:3000/api/pedidos/items/${NROPED}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado de autorización
                'Content-Type': 'application/json'
            }
        })
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
        //     .then(data => setClientes(data.data))
        //     .catch(error => console.error('Error fetching clientes:', error));
    }, [NROPED]);

    useEffect(() => {
        if (user && user.numero_vendedor) {
            fetch(`http://localhost:3000/api/clientes?numero_vendedor=${user.numero_vendedor}`)
                .then(response => response.json())
                .then(data => {
                    // console.log("Clientes:", data.data);
                    setClientes(data.data);
                })
                .catch(error => console.error('Error fetching clientes:', error));
        } else {
            console.error("El usuario no tiene un numero_vendedor definido.");
        }
    }, [user]);



    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedDate = formData.FECTRANS ? format(formData.FECTRANS, 'yyyy-MM-dd HH:mm:ss') : null;
        const today = new Date();
        const formattedToday = today ? format(today, 'yyyy-MM-dd HH:mm:ss') : null;
        
        const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
        const response = await fetch('http://localhost:3000/api/pedidos/check', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Enviar el token en el encabezado de autorización
                'Content-Type': 'application/json'
        },

        
            body: JSON.stringify({
                // ESTADOSEG: formData.ESTADOSEG,
                NROPED: NROPED,
                CLIENTE: formData.CLIENTE.NUMERO,
                RAZONSOC: formData.CLIENTE.RAZONSOC,
                DIREENT: formData.DIREENT,
                LOCENT: formData.LOCENT,
                PROENT: formData.PROENT,
                TELEFONOS: formData.TELEFONOS,
                VENDEDOR: formData.VENDEDOR,
                CONDVENTA: formData.CONDVENTA,
                FECTRANS: formattedDate,
                FECEMISION: formattedToday,
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
                setModalMessage('Pedido APROBADO correctamente');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/');  
                }, 3000);
            })
            .catch(error => {
                setModalMessage(`Error: ${error.message}`);
                setShowModal(true);
            });
    };


    const closeModal = () => {
        setShowModal(false);
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
            {/* <h3 className="text-center">Controlar Pedido</h3> */}
            <div className="bg-primary text-white h5" align="center" colSpan="11"><b>AUTORIZAR PEDIDOS</b></div>
            <div className="form-container w-100">
                <div className="form-card w-25 mr-4 mt-2 mb-4 border border-primary">

                    <div className="form-group">
                        <label>Cliente</label>
                        <Select
                            name="CLIENTE"
                            // value={optionsClientes.find(option => option.value === formData.CLIENTE) || null}
                            value={optionsClientes.find(option => option.value.NUMERO === formData.CLIENTE.NUMERO) || null}
                            // onChange={handleClientChange}
                            options={optionsClientes}
                            isSearchable
                            placeholder="Seleccionar Cliente"
                            required
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            menuPosition="fixed"
                            isDisabled
                        />

                    </div>
                    <div className="form-group">
                        <label>Forma de Pago</label>
                        <Select
                            name="CONDVENTA"
                            value={optionsFormasDePago.find(option => option.value === formData.CONDVENTA) || null}
                            // onChange={handleFormaDePagoChange}
                            options={optionsFormasDePago}
                            isSearchable
                            placeholder="Seleccionar Forma de Pago"
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            menuPosition="fixed"
                            isDisabled
                        />
                    </div>

                    <div className="form-group">
                        <label>Direccion Entrega</label>
                        <input
                            type="text"
                            name="DIREENT"
                            value={formData.DIREENT}
                            disabled
                            // onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Localidad Entrega</label>
                        <input
                            type="text"
                            name="LOCENT"
                            value={formData.LOCENT}
                            disabled
                            // onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Provincia Entrega</label>
                        <Select
                            name="PROENT"
                            value={optionsProvincias.find(option => option.value === formData.PROENT) || null}
                            // onChange={handleProvinciasChange}
                            options={optionsProvincias}
                            isSearchable
                            placeholder="Seleccionar Provincia"
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            menuPosition="fixed"
                            isDisabled
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha Entrega</label>
                        <DatePicker
                            name="FECTRANS"
                            value={formData.FECTRANS} 
                            // onChange={handleDateChange}
                            selected={formData.FECTRANS ? new Date(formData.FECTRANS) : null}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/yyyy"
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>Telefono Entrega</label>
                        <input
                            type="text"
                            name="TELEFONOS"
                            value={formData.TELEFONOS}
                            disabled
                            // onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Comentarios</label>
                        <textarea
                            name="COMENTARIO"
                            value={formData.COMENTARIO}
                            rows="3" 
                            disabled
                        ></textarea>
                    </div>
                </div>
                
                <div className="form-card w-75 mt-2 mb-4 border border-primary">
                    <div className="form-container d-flex justify-content-between">
                        {/* <h3>Items del Pedido</h3> */}
                        {/* <button type="button" className="btn btn-outline-success mr-3 mb-2 mt-1" onClick={addItem}><FontAwesomeIcon icon={faPlus} /></button> */}
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
                                    {/* <th className="column column-small">Eliminar</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {pedidoItems.map((item, index) => (
                                    <tr key={item.ITEM} className="table-row">
                                        <td className="form-group column column-small"><input type="text" name="ITEM" value={item.ITEM} required readOnly disabled/></td>
                                        <td className="form-group column">
                                            <Select
                                                name="ARTICULO"
                                                value={options.find(option => option.value.NUMERO === item.ARTICULO)}
                                                // onChange={(selectedOption) => handleItemChange(index, { target: { name: 'ARTICULO', value: selectedOption.value } })}
                                                // onChange={(selectedOption) => handleArticuloChange(index, selectedOption.value)}
                                                options={options}
                                                isSearchable
                                                placeholder="Seleccionar Artículo"
                                                required
                                                menuPortalTarget={document.body}  // Renderiza el menú en el body
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}  // Ajusta el z-index
                                                menuPosition="fixed"
                                                isDisabled
                                            />
                                        </td>
                                        <td className="form-group column column-medium"><input type="text" name="CANTPED" value={item.CANTPED}  required disabled/></td>
                                        <td className="form-group column column-medium"><input type="text" name="PRECIO" value={item.PRECIO}  required disabled/></td>
                                        <td className="form-group column column-medium"><input type="text" name="DESCUENTO" value={item.DESCUENTO ? parseInt(Math.round(item.DESCUENTO)) : 0}  required disabled/></td>
                                        {/* <td className="form-group column column-small text-center">
                                            <button type="button" className="btn btn-sm btn-outline-danger remove-button" onClick={() => removeItem(index)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="form-buttons">
                <button type="submit" className="m-4 btn btn-primary">Aprobar</button>
                <button type="button" className="m-4 btn btn-secondary" onClick={() => navigate('/check')}>Cancelar</button>
            </div>
            </form>

            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalMessage.startsWith('Error') ? 'Error' : 'Éxito'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
    
}

export default PedidoEditApprove;