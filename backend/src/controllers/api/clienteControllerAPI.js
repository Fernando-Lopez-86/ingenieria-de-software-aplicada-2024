const clienteService = require("../../services/clienteService");
 
const clienteControllerAPI = {
    listApprove: (req, res) => {
        clienteService.getAllClientesApprove()
        .then(clientes => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: clientes.length,
                    url: "/api/clientes",
                },
                data: clientes,
            };
            res.json(respuesta);
        })
    },
    list: (req, res) => {
        const { numero_vendedor } = req.query;
        clienteService.getAllClientes(numero_vendedor)
        .then(clientes => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: clientes.length,
                    url: "/api/clientes",
                },
                data: clientes,
            };
            res.json(respuesta);
        })
    },
};

module.exports = clienteControllerAPI;