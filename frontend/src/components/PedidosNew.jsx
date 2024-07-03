import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Para crear un formulario en React que use hooks para manejar el estado y enviar una solicitud a un servidor usando Axios, 
// UseState para gestionar los campos del formulario y el envío de datos a través de Axios.
// Backend ejecutandose y listo para recibir solicitudes en http://localhost:3000/api/pedidos.
// Recibe los datos del formulario y los procesa para crear un nuevo pedido en la base de datos.

function PedidosNew(){
    const navigate = useNavigate();
    // Utiliza useState para manejar el estado de cada campo del formulario (TIPO, CLIENTE, NROPED, NROREAL, ESTADOSEG, CODIGO) y la lista de artículos (items).
    // const [TIPO, setTIPO] = useState('');
    const [CLIENTE, setCLIENTE] = useState('');
    const [DIREENT, setDIREENT] = useState('');
    const [LOCENT, setLOCENT] = useState('');
    const [PROENT, setPROENT] = useState('');
    const [CONDVENTA, setCONDVENTA] = useState('');
    const [TELEFONOS, setTELEFONOS] = useState('');
    const [FECTRANS, setFECTRANS] = useState('');
    const [FECEMISION, setFECEMISION] = useState('');
    const [COMENTARIO, setCOMENTARIO] = useState('');
    const [items, setItems] = useState([{
        ITEM: '001',
        ARTICULO: '',
        CANTPED: '',
        PRECIO: '',
        DESCUENTO: '',
    }]);


    const [error, setError] = useState(null);
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
        fetch("http://localhost:3000/api/articulos")
            .then(response => response.json())
            .then(data => {
                console.log("Articulos:", data.data);
                setArticulos(data.data);
            })
            .catch(error => console.error('Error fetching articulos:', error));
    }, []);


    useEffect(() => {
        fetch("http://localhost:3000/api/clientes")
            .then(response => response.json())
            .then(data => {
                console.log("Clientes:", data.data);
                setClientes(data.data);
            })
            .catch(error => console.error('Error fetching clientes:', error));
    }, []);


    useEffect(() => {
        fetch("http://localhost:3000/api/tablas/formas-pago")
            .then(response => response.json())
            .then(data => setFormasDePago(data.data))
            .catch(error => console.error('Error fetching formas de pago:', error));
    }, []);


    useEffect(() => {
        fetch("http://localhost:3000/api/tablas/provincias")
            .then(response => response.json())
            .then(data => setProvincias(data.data))
            .catch(error => console.error('Error fetching formas de pago:', error));
    }, []);


    // Actualiza el estado de un artículo específico en la lista cuando su valor cambia.
    const handleItemChange = (index, event) => {
        const newItems = [...items];
        newItems[index][event.target.name] = event.target.value;
        setItems(newItems);
    };


    const handleClientChange = (selectedOption) => {
        setCLIENTE(selectedOption ? selectedOption.value : null);
    };


    const handleFormaDePagoChange = (selectedOption) => {
        setCONDVENTA(selectedOption ? selectedOption.value : null);
    };


    const handleProvinciasChange = (selectedOption) => {
        setPROENT(selectedOption ? selectedOption.value : null);
    };


    const handleArticuloChange = (index, selectedOption) => {
        const newItems = [...items];
        newItems[index].ARTICULO = selectedOption ? selectedOption.NUMERO : null;
        newItems[index].DESCART = selectedOption ? selectedOption.DESCRIP : null;
        setItems(newItems);
    };


    const handleDateChange = (date) => {
        setFECTRANS(date);
    };


    // Agrega un nuevo objeto de artículo vacío a la lista.
    // items es un array de objetos, donde cada objeto representa un artículo en el pedido.
    const addItem = () => {
        // Encontrar el máximo valor actual de ITEM en pedidoItems
        const maxItem = Math.max(...items.map(item => parseInt(item.ITEM, 10)));

        // Incrementar en 1 el máximo encontrado para obtener el nuevo ITEM
        const newItem = (maxItem + 1).toString().padStart(3, '0');

        setItems([...items, { 
            // ITEM: (items.length + 1).toString().padStart(3, '0'),
            // NROPED: '',
            ITEM: newItem,
            ARTICULO: '',
            CANTPED: '',
            PRECIO: '',
            DESCUENTO: '',
        }]);
    };


    const removeItem = (index) => {
        const newItems = items.filter((item, i) => i !== index);
        setItems(newItems);
    };


    const generatePDF = (data) => {
        const doc = new jsPDF();
        doc.text("Pedido", 20, 10);
        doc.text(`Cliente: ${data.CLIENTE}`, 20, 20);
        doc.text(`Entrega: ${data.ENTREGA}`, 20, 30);
        doc.text(`Localidad Entrega: ${data.LOCENT}`, 20, 40);
        doc.text(`Provincia Entrega: ${data.PROENT}`, 20, 50);

        doc.autoTable({
            startY: 60,
            head: [['Item', 'Artículo', 'Cantidad', 'Precio']],
            body: data.items.map(item => [item.ITEM, item.ARTICULO, item.CANTPED, item.PRECIO])
        });

        doc.save('pedido.pdf');
    };
    

    // Gestiona el envío del formulario, recopila todos los datos del formulario y los envía a la API utilizando axios.
    // La función handleSubmit se ejecuta al enviar el formulario.
    // Hace una solicitud POST a la API para crear un nuevo pedido.
    // Si la solicitud es exitosa, resetea los campos del formulario.
    // Maneja errores de la solicitud y los imprime en la consola.
    // loading: indica si la solicitud está en curso y deshabilita el botón de envío mientras se procesa la solicitud.
    // error: almacena un mensaje de error si la solicitud falla y muestra el error en la interfaz de usuario.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        const formattedDate = FECTRANS ? format(FECTRANS, 'yyyy-MM-dd HH:mm:ss') : null;
        const today = new Date();
        const formattedToday = today ? format(today, 'yyyy-MM-dd HH:mm:ss') : null;
        
        const pedidoData = {
            CLIENTE: CLIENTE ? CLIENTE.NUMERO : '',
            RAZONSOC: CLIENTE ? CLIENTE.RAZONSOC : '',
            DIREENT,
            LOCENT,
            PROENT,
            CONDVENTA,
            TELEFONOS,
            FECTRANS: formattedDate,
            FECEMISION: formattedToday,
            COMENTARIO,
            items: items.map(item => ({
                ...item,
                ARTICULO: item.ARTICULO,
                DESCART: item.DESCART
            }))
        };

        try {
            fetch('http://localhost:3000/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedidoData),
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
                    setModalMessage('Pedido actualizado correctamente');
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

            setCLIENTE('');
            setDIREENT('');
            setLOCENT('');
            setPROENT('');
            setCONDVENTA('');
            setTELEFONOS('');
            setFECTRANS(null);
            setFECEMISION(null);
            setCOMENTARIO('');

            setItems([{ 
                ITEM: '001',
                ARTICULO: '',
                CANTPED: '',
                PRECIO: '',
                DESCUENTO: '',
            }]);

            if (items && items.length > 0) {
                generatePDF(pedidoData);
            } else {
                console.error('Error al generar PDF: no hay items');
                setError('Error al generar PDF: no hay items');
            }

        } catch (error) {
            console.error('Error al crear el pedido', error);
            setError('Error al crear el pedido');
        } 
    };


    const closeModal = () => {
        setShowModal(false);
    };


    return (
        <div className="form-container w-100">
            <form className="w-100" onSubmit={handleSubmit}>
            <h3 className="text-center">Nuevo Pedido</h3>
            <div className="form-container w-100">
                <div className="form-card w-25 mr-4 mt-2 mb-4 border border-primary">
                    <div className="form-group">
                        <label>Cliente</label>
                            <Select
                                name="CLIENTE"
                                value={optionsClientes.find(option => option.value.NUMERO === (CLIENTE ? CLIENTE.NUMERO : '')) || null}
                                onChange={handleClientChange}
                                options={optionsClientes}
                                isSearchable
                                placeholder="Seleccionar Cliente"
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                menuPosition="fixed"
                            />
                    </div>
                    
                    <div className="form-group">
                        <label>Forma de Pago</label>
                        <Select
                            name="CONDVENTA"
                            value={optionsFormasDePago.find(option => option.value === CONDVENTA) || null}
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
                            value={DIREENT} 
                            onChange={(e) => setDIREENT(e.target.value)} 
                            // required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Localidad Entrega</label>
                        <input
                            type="text"
                            name="LOCENT"
                            value={LOCENT} 
                            onChange={(e) => setLOCENT(e.target.value)} 
                            // required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Provincia Entrega</label>
                        <Select
                            name="PROENT"
                            value={optionsProvincias.find(option => option.value === PROENT) || null}
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
                            selected={FECTRANS}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="Seleccionar Fecha"
                        />
                    </div>

                    <div className="form-group">
                        <label>Telefono Entrega</label>
                        <input
                            type="text"
                            name="TELEFONOS"
                            value={TELEFONOS} 
                            onChange={(e) => setTELEFONOS(e.target.value)} 
                            // required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Comentarios</label>
                        <input
                            type="text"
                            name="COMENTARIO"
                            value={COMENTARIO} 
                            onChange={(e) => setCOMENTARIO(e.target.value)} 
                            // required 
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
                                {items.map((item, index) => (
                                    <tr key={index} className="table-row">
                                        <td className="form-group column column-small"><input type="text" name="ITEM" value={item.ITEM} onChange={(e) => handleItemChange(index, e)} required readOnly/></td>
                                        <td className="form-group column">
                                            <Select
                                                name="ARTICULO"
                                                value={options.find(option => option.value.NUMERO === item.ARTICULO) || null}
                                                onChange={(selectedOption) => handleArticuloChange(index, selectedOption.value)}
                                                options={options}
                                                isSearchable
                                                placeholder="Seleccionar Artículo"
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
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

export default PedidosNew;

