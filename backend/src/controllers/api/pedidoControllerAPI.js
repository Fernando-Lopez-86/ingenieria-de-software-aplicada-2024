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

    // detail: (req, res) => {
    //     pedidoService.getPedidoDetail(req.params.id)
    //     .then(pedidos => {
    //         let respuesta = {
    //             meta: {
    //                 status: 200,
    //                 url: "/api/pedidos/:id",
    //             },
    //             data: pedidos,
    //         };
    //         res.json(respuesta);
    //     })
    // },
};

module.exports = pedidoControllerAPI;