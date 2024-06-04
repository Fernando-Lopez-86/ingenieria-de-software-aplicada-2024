import React from 'react';
import { useState } from 'react';
import axios from 'axios';

// Para crear un formulario en React que use hooks para manejar el estado y enviar una solicitud a un servidor usando Axios, 
// UseState para gestionar los campos del formulario y el envío de datos a través de Axios.
// Backend ejecutandose y listo para recibir solicitudes en http://localhost:3000/api/pedidos.
// Recibe los datos del formulario y los procesa para crear un nuevo pedido en la base de datos.

function PedidosNew(){
    // Utiliza useState para manejar el estado de cada campo del formulario (TIPO, CLIENTE, NROPED, NROREAL, ESTADOSEG, CODIGO) y la lista de artículos (items).
    const [TIPO, setTIPO] = useState('');
    const [CLIENTE, setCLIENTE] = useState('');
    const [NROPED, setNROPED] = useState('');
    const [NROREAL, setNROREAL] = useState('');
    const [ESTADOSEG, setESTADOSEG] = useState('');
    const [CODIGO, setCODIGO] = useState('');
    const [items, setItems] = useState([{ ITEM: '' }]);
    const [loading, setLoading] = useState(false);
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
    setItems([...items, { ITEM: '' }]);
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
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/api/pedidos', {
                TIPO,
                CLIENTE,
                NROPED,
                NROREAL,
                ESTADOSEG,
                CODIGO,
                items
            });

            console.log("response.data"+response.data);

            // Limpia los campos
            setTIPO('');
            setCLIENTE('');
            setNROPED('');
            setNROREAL('');
            setESTADOSEG('');
            setCODIGO('');
            setItems([{ ITEM: '' }]);

        } catch (error) {
            console.error('Error al crear el pedido', error);
            setError('Error al crear el pedido');
        } finally {
            setLoading(false);
        }
    };

    // Cuando el formulario se envía, los datos se recogen del estado del componente (useState) y se envían a la API en formato JSON.
    return (
        <div className="pedidos-new">
        <h1>Crear Nuevo Pedido</h1>
        <form onSubmit={handleSubmit}>
            <table className="bt-1 text-center">
                <tr>
                    <td><label>TIPO:</label></td>
                    <td><input type="text" value={TIPO} onChange={(e) => setTIPO(e.target.value)} required /></td>
                </tr>
                <tr>
                    <td><label>CLIENTE:</label></td>
                    <td><input type="text" value={CLIENTE} onChange={(e) => setCLIENTE(e.target.value)} required /></td>
                </tr>
                <tr>
                    <td><label>NROPED:</label></td>
                    <td><input type="text" value={NROPED} onChange={(e) => setNROPED(e.target.value)} required /></td>
                </tr>
                <tr>
                    <td><label>NROREAL:</label></td>
                    <td><input type="text" value={NROREAL} onChange={(e) => setNROREAL(e.target.value)} required /></td>
                </tr>
                <tr>
                    <td><label>ESTADOSEG:</label></td>
                    <td><input type="text" value={ESTADOSEG} onChange={(e) => setESTADOSEG(e.target.value)} required /></td>
                </tr>
                <tr>
                    <td><label>CODIGO:</label></td>
                    <td><input type="text" value={CODIGO} onChange={(e) => setCODIGO(e.target.value)} required /></td>
                </tr>
                
                <tr>
                    <td>
                        <div id="items">
                            {items.map((item, index) => (
                                <div key={index}>
                                    <label>ITEM:</label>
                                    <input
                                        type="text"
                                        name="ITEM"
                                        value={item.ITEM}
                                        onChange={(e) => handleItemChange(index, e)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </td>
                </tr> 
                <tr>
                    <td className="text-center">
                        <button type="button" onClick={addItem}>Añadir otro artículo</button>
                        <button type="submit" disabled={loading}>Crear Pedido</button>
                    </td>
                </tr>
                
            </table>
        </form>
        </div>
    ); 
}

export default PedidosNew;

