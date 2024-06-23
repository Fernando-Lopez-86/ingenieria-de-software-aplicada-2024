import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// Para crear un formulario en React que use hooks para manejar el estado y enviar una solicitud a un servidor usando Axios, 
// UseState para gestionar los campos del formulario y el envío de datos a través de Axios.
// Backend ejecutandose y listo para recibir solicitudes en http://localhost:3000/api/pedidos.
// Recibe los datos del formulario y los procesa para crear un nuevo pedido en la base de datos.

function PedidosNew(){
    const navigate = useNavigate();
    // Utiliza useState para manejar el estado de cada campo del formulario (TIPO, CLIENTE, NROPED, NROREAL, ESTADOSEG, CODIGO) y la lista de artículos (items).
    // const [TIPO, setTIPO] = useState('');
    const [CLIENTE, setCLIENTE] = useState('');
    const [NROPED, setNROPED] = useState('');
    // const [NROREAL, setNROREAL] = useState('');
    // const [ESTADOSEG, setESTADOSEG] = useState('');
    // const [CODIGO, setCODIGO] = useState('');
    const [items, setItems] = useState([{
        ITEM: '001',
        // NROPED: '',
        ARTICULO: '',
        CANTPED: '',
        PRECIO: '',
    }]);

    const [error, setError] = useState(null);

    // Actualiza el estado de un artículo específico en la lista cuando su valor cambia.
    const handleItemChange = (index, event) => {
        const newItems = [...items];
        newItems[index][event.target.name] = event.target.value;
        setItems(newItems);
    };
    
    // Agrega un nuevo objeto de artículo vacío a la lista.
    // items es un array de objetos, donde cada objeto representa un artículo en el pedido.
    const addItem = () => {
        setItems([...items, { 
            ITEM: (items.length + 1).toString().padStart(3, '0'),
            // NROPED: '',
            ARTICULO: '',
            CANTPED: '',
            PRECIO: '',
        }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((item, i) => i !== index);
        setItems(newItems);
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

        try {
            const response = await axios.post('http://localhost:3000/api/pedidos', {
                // TIPO,
                CLIENTE,
                NROPED,
                // NROREAL,
                // ESTADOSEG,
                // CODIGO,
                items
            });

            console.log("response.data"+response.data);

            // Limpia los campos
            // setTIPO('');
            setCLIENTE('');
            setNROPED('');
            // setNROREAL('');
            // setESTADOSEG('');
            // setCODIGO('');
            // setItems([{ ITEM: '' }]);

            setItems([{ 
                ITEM: '001',
                // NROPED: '',
                ARTICULO: '',
                CANTPED: '',
                PRECIO: '',
            }]);

        } catch (error) {
            console.error('Error al crear el pedido', error);
            setError('Error al crear el pedido');
        } 
    };



    return (
        <div className="form-container w-100">
            <form className="w-100" onSubmit={handleSubmit}>
            <h3 className="text-center">Modificar Pedido</h3>
            <div className="form-container w-100">
                <div className="form-card w-25 mr-4 mt-2 mb-4 border border-primary">
                    <div className="form-group">
                        <label>Nro Pedido</label>
                        <input type="text" value={NROPED} onChange={(e) => setNROPED(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Cliente</label>
                        <input type="text" value={CLIENTE} onChange={(e) => setCLIENTE(e.target.value)} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Forma de Pago</label>
                        <input type="text" />
                    </div>

                    <div className="form-group">
                        <label>Direccion Entrega</label>
                        <input type="text" />
                    </div>
                    <div className="form-group">
                        <label>Localidad</label>
                        <input type="text"  />
                    </div>

                    <div className="form-group">
                        <label>Hora Entrega</label>
                        <input type="text" />
                    </div>
                    <div className="form-group">
                        <label>Fecha Entrega</label>
                        <input type="text" />
                    </div>

                    <div className="form-group">
                        <label>Telefono Entrega</label>
                        <input type="text" />
                    </div>

                    {/* <div className="form-group">
                        <label>Nro Real</label>
                        <input type="text" value={NROREAL} onChange={(e) => setNROREAL(e.target.value)} required />
                    </div> */}
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
                                    <th className="column">Item</th>
                                    {/* <th className="column">Nro Pedido</th> */}
                                    <th className="column">Articulo</th>
                                    <th className="column">Cantidad</th>
                                    <th className="column">Precio</th>
                                    <th className="column">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="table-row">
                                        <td className="column"><input type="text" name="ITEM" value={item.ITEM} onChange={(e) => handleItemChange(index, e)} required readOnly/></td>
                                        {/* <td className="column"><input type="text" name="NROPED" value={item.NROPED} onChange={(e) => handleItemChange(index, e)} required/></td> */}
                                        <td className="column"><input type="text" name="ARTICULO" value={item.ARTICULO} onChange={(e) => handleItemChange(index, e)} required/></td>
                                        <td className="column"><input type="text" name="CANTPED" value={item.CANTPED} onChange={(e) => handleItemChange(index, e)} required/></td>
                                        <td className="column"><input type="text" name="PRECIO" value={item.PRECIO} onChange={(e) => handleItemChange(index, e)} required/></td>
                                        <td className="column">
                                            <button type="button" className="btn btn-sm btn-outline-danger mr-1 text-center" onClick={() => removeItem(index)}>
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

export default PedidosNew;

