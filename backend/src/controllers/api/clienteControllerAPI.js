const clienteService = require("../../services/clienteService");
 
const clienteControllerAPI = {
    list: (req, res) => {
        clienteService.getAllClientes()
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