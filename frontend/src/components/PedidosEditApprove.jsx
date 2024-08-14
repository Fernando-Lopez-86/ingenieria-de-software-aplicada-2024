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
import { NumericFormat } from 'react-number-format';
import 'bootstrap/dist/css/bootstrap.min.css';

function PedidoEditApprove() {
    const navigate = useNavigate();
    const location = useLocation();
    const { NROPED } = location.state;
    const API_URL = process.env.REACT_APP_API_URL;
    const { user } = useContext(UserContext);
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
                const response = await fetch(`${API_URL}/api/pedidos/approve`, {
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
        const token = localStorage.getItem('token'); 

        // Fetch para obtener los ítems del pedido
        fetch(`${API_URL}/api/pedidos/items/${NROPED}`, {
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => setPedidoItems(data.data))
            .catch(error => console.error(`Error fetching items: ${error}`));
        
        fetch(`${API_URL}/api/articulos`)
            .then(response => response.json())
            .then(data => setArticulos(data.data));

        fetch(`${API_URL}/api/tablas/formas-pago`)
            .then(response => response.json())
            .then(data => setFormasDePago(data.data))
            .catch(error => console.error('Error fetching formas de pago:', error));
        
        fetch(`${API_URL}/api/tablas/provincias`)
            .then(response => response.json())
            .then(data => setProvincias(data.data))
            .catch(error => console.error('Error fetching provincias:', error));
    }, [NROPED]);


    useEffect(() => {
        if (user) {
            fetch(`${API_URL}/api/clientes/clientes-approve`)
                .then(response => response.json())
                .then(data => {
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
        
        const token = localStorage.getItem('token'); 
        const response = await fetch(`${API_URL}/api/pedidos/check`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
        },

        
            body: JSON.stringify({
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
                    navigate('/check');  
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
            <div className="bg-primary text-white h5" align="center" colSpan="11"><b>AUTORIZAR PEDIDOS</b></div>
            <div className="form-container w-100">
                <div className="form-card w-25 mr-4 mt-2 mb-4 border border-primary">

                    <div className="form-group">
                        <label>Cliente</label>
                        <Select
                            name="CLIENTE"
                            value={optionsClientes.find(option => option.value.NUMERO === formData.CLIENTE.NUMERO) || null}
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
                        />
                    </div>

                    <div className="form-group">
                        <label>Localidad Entrega</label>
                        <input
                            type="text"
                            name="LOCENT"
                            value={formData.LOCENT}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>Provincia Entrega</label>
                        <Select
                            name="PROENT"
                            value={optionsProvincias.find(option => option.value === formData.PROENT) || null}
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
                                                options={options}
                                                isSearchable
                                                placeholder="Seleccionar Artículo"
                                                required
                                                menuPortalTarget={document.body}  
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}  
                                                menuPosition="fixed"
                                                isDisabled
                                            />
                                        </td>
                                        <td className="form-group column column-medium"><input type="text" name="CANTPED" value={item.CANTPED}  required disabled/></td>
                                        <td className="form-group column column-medium">
                                            <NumericFormat
                                                value={item.PRECIO} // Valor numérico a mostrar
                                                displayType="input" // Tipo de componente a mostrar ("input" o "text")
                                                thousandSeparator="." // Separador de miles
                                                decimalSeparator="," // Separador decimal
                                                decimalScale={2} // Máximo de decimales permitidos
                                                fixedDecimalScale={true} // Mostrar siempre los decimales
                                                allowNegative={false} // No permitir valores negativos
                                                disabled // Campo de entrada deshabilitado
                                            />
                                        </td>
                                        <td className="form-group column column-medium">
                                            <NumericFormat
                                                value={item.DESCUENTO} // Valor numérico a mostrar
                                                displayType="input" // Tipo de componente a mostrar ("input" o "text")
                                                thousandSeparator="." // Separador de miles
                                                decimalSeparator="," // Separador decimal
                                                decimalScale={2} // Máximo de decimales permitidos
                                                fixedDecimalScale={true} // Mostrar siempre los decimales
                                                allowNegative={false} // No permitir valores negativos
                                                disabled // Campo de entrada deshabilitado
                                            />
                                        </td>
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