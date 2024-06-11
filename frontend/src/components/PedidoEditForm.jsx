import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     if (NROPED) {
    //         fetch(`http://localhost:3000/api/pedidos/edit/${NROPED}`)
    //             .then(response => response.json())
    //             .then(data => setFormData(data.data))
    //             .catch(error => console.error('Error fetching pedido:', error));
    //     }
    // }, [NROPED]);

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
    }, [NROPED]);

    // const [formData, setFormData] = useState(pedido);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     fetch(`http://localhost:3000/api/pedidos/update/${NROPED}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(formData),
    //     })
    //     .then(response => {
    //         if (response.ok) {
    //             navigate('/pedidos');
    //         } else {
    //             console.error('Error updating pedido');
    //         }
    //     })
    //     .catch(error => console.error('Error:', error));
    // };

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
            .then(() => {
                navigate('/');
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
        <div className="form-container">
            <div className="form-card">
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
        </div>
    );
}

export default PedidoEditForm;