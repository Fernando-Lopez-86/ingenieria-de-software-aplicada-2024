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

    listItems: (req, res) => {
        pedidoService.getAllPedidosItems(req.params.nroped)
        .then(items => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: items.length,
                    url: "/api/pedidos/items",
                },
                data: items,
            };
            res.json(respuesta);
        })
    },

    destroy: (req, res) => {
        console.log("NROPED API:"+req.params.NROPED)
        pedidoService.destroyPedido(req.params.NROPED)
        .then(() => {
            pedidoService.destroyPedidosItem(req.params.NROPED)
            res.redirect("/");
        });
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