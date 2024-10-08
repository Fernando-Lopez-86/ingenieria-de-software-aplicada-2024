const pedidoService = require("../../services/pedidoService");
 
const pedidoControllerAPI = {
    list: (req, res) => {
        const { numero_vendedor } = req.query;
        pedidoService.getAllPedidos(numero_vendedor)
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

    listCheck: (req, res) => {
        pedidoService.getAllPedidosCheck()
        .then(pedidos => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: pedidos.length,
                    url: "/api/pedidos/pending",
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

    destroy: async (req, res) => {
        const { numero_vendedor } = req.user
        try {
            await pedidoService.destroyPedido(req.params.NROPED, numero_vendedor);
            res.status(200).send({ message: 'Pedido eliminado con éxito' });
        } catch (error) {
            res.status(500).send({ message: 'Error al eliminar el pedido' });
        }
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

    createCheck: (req, res) => {
        pedidoService.createPedidoCheck(req.body)
        .then(pedidos => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: pedidos.length,
                    url: "/api/pedidos/check",
                },
                data: pedidos,
            };
            res.json(respuesta);
        })
    },

    edit: async(req, res) => {
        const { numero_vendedor } = req.user
        try {
            const pedido = await pedidoService.editPedido(req.body.NROPED, numero_vendedor);
            if (pedido) {
                res.status(200).json({ data: pedido });
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error) {
            console.error('Error al obtener el pedido:', error);
            res.status(500).json({ message: 'Error al obtener el pedido', error: error.message });
        }

    },

    editApprove: async(req, res) => {
        try {
            const pedido = await pedidoService.editPedidoApprove(req.body.NROPED);
            if (pedido) {
                res.status(200).json({ data: pedido });
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error) {
            console.error('Error al obtener el pedido:', error);
            res.status(500).json({ message: 'Error al obtener el pedido', error: error.message });
        }

    },

    update: async(req, res) => {
        try {
            const updatedPedido = await pedidoService.updatePedido(req.body);
            if (updatedPedido) {
                res.status(200).json({ message: 'Pedido actualizado correctamente' });
            } else {
                res.status(404).json({ message: 'Pedido no encontrado o no se pudo actualizar' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el pedido', error: error.message });
        }
    },

};

module.exports = pedidoControllerAPI;