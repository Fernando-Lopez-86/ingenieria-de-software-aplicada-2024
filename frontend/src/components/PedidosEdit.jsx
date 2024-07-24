import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { Modal, Button } from 'react-bootstrap';
import { UserContext } from './UserContext'; 
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';

function PedidoEditForm() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Obtener el usuario desde el contexto
    const { NROPED } = useParams();
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
        fetch(`http://localhost:3000/api/pedidos/edit/${NROPED}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del pedido');
                }
                return response.json();
            })
            .then(data => {
                setFormData({
                    ...data.data,
                    CLIENTE: {
                        NUMERO: data.data.CLIENTE,
                        RAZONSOC: data.data.RAZONSOC
                    }
                });
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
        //     .then(data => setClientes(data.data))
        //     .catch(error => console.error('Error fetching clientes:', error));

    }, [NROPED]);


    useEffect(() => {
        if (user && user.numero_vendedor) {
            fetch(`http://localhost:3000/api/clientes?numero_vendedor=${user.numero_vendedor}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Clientes:", data.data);
                    setClientes(data.data);
                })
                .catch(error => console.error('Error fetching clientes:', error));
        } else {
            console.error("El usuario no tiene un numero_vendedor definido.");
        }
    }, [user]);


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
        // Encontrar el máximo valor actual de ITEM en pedidoItems
        const maxItem = Math.max(...pedidoItems.map(item => parseInt(item.ITEM, 10)));

        // Incrementar en 1 el máximo encontrado para obtener el nuevo ITEM
        const newItem = (maxItem + 1).toString().padStart(3, '0');

        setPedidoItems([...pedidoItems, { 
            //ITEM: (pedidoItems.length + 1).toString().padStart(3, '0'), ///////ERROR NO ES LENGTH ES EL SUPERIOR + 1
            ITEM: newItem,
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
        setFormData({ ...formData, CLIENTE: selectedOption ? selectedOption.value : { NUMERO: '', RAZONSOC: '' } });
    };


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

    const generatePDF = (data) => {
        const doc = new jsPDF();
        doc.text("Pedido", 15, 10);
        doc.text(`Cliente: ${formData.RAZONSOC}`, 15, 20);
        doc.text(`Forma de Pago: ${formData.CONDVENTA}`, 15, 30);
        doc.text(`Direccion Entrega: ${formData.DIREENT}`, 15, 40);
        doc.text(`Localidad Entrega: ${formData.LOCENT}`, 15, 50);
        doc.text(`Provincia Entrega: ${formData.FECTRANS}`, 15, 60);
        doc.text(`Fecha Entrega: ${formData.PROENT}`, 15, 70);
        doc.text(`Telefono Entrega: ${formData.TELEFONOS}`, 15, 80);
        doc.text(`Comentarios: ${formData.COMENTARIO}`, 15, 90);
        doc.text(`Numero Control: ${formData.NROPED}`, 15, 100);

        doc.autoTable({
            startY: 120,
            head: [['Item', 'Artículo', 'Cantidad', 'Precio', 'Descuento']],
            body: pedidoItems.map(item => [item.ITEM, item.ARTICULO, item.CANTPED, item.PRECIO, item.DESCUENTO])
        });

        doc.save('pedido.pdf');
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
                CLIENTE: formData.CLIENTE.NUMERO,
                RAZONSOC: formData.CLIENTE.RAZONSOC,
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
            .then((body) => {

                if (pedidoItems && pedidoItems.length > 0) {
                    generatePDF(formData);
                } else {
                    console.error('Error al generar PDF: no hay items');
                    setError('Error al generar PDF: no hay items');
                }

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
            {/* <h3 className="text-center">Modificar Pedido</h3> */}
            <div className="bg-primary text-white h5" align="center" colSpan="11"><b>MODIFICAR PEDIDO</b></div>
            <div className="form-container w-100">
                <div className="form-card w-25 mr-4 mt-2 mb-4 border border-primary">

                    <div className="form-group">
                        <label>Cliente</label>
                        <Select
                            name="CLIENTE"
                            // value={optionsClientes.find(option => option.value === formData.CLIENTE) || null}
                            value={optionsClientes.find(option => option.value.NUMERO === formData.CLIENTE.NUMERO) || null}
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
                        <textarea
                            name="COMENTARIO"
                            value={formData.COMENTARIO}
                            onChange={handleChange} 
                            rows="3" 
                        ></textarea>
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
                                        <td className="form-group column column-medium"><input type="text" name="DESCUENTO" value={item.DESCUENTO ? parseInt(Math.round(item.DESCUENTO)) : 0} onChange={(e) => handleItemChange(index, e)} required/></td>
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
                <button type="button" className="m-4 btn btn-secondary" onClick={() => navigate('/')}>Cancelar</button>
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

export default PedidoEditForm;