const pedidoService = require("../../services/pedidoService");
 
const pedidoControllerAPI = {
    list: (req, res) => {
        pedidoService.getAllPedidos()
        .then(pedidos => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: pedidos.length,
                    url: "/api/pedidos",
                },
                data: pedidos,
            };
            res.json(respuesta);
        })
    },

    create: (req, res) => {
        pedidoService.createPedido(req.body)
        .then(pedidos => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: pedidos.length,
                    url: "/api/pedidos",
                },
                data: pedidos,
            };
            res.json(respuesta);
        })
    },

   
};

module.exports = pedidoControllerAPI;