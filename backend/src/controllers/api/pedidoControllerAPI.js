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

    edit: async(req, res) => {
        // const marcas = await brandService.getAllBrands();
        // const categorias = await categoryService.getAllCategories();
        // console.log("NROPEDDDDD: "+req.params.NROPED)
        //pedidoService.editPedido(req.params.NROPED)
        //console.log("TIPODDD: "+req.body.tipo)
        // .then((pedidos) => {
        //     res.render("/api/pedidos/edit", {pedidos});
        // });
        const { NROPED } = req.params;
        try {
            const pedido = await pedidoService.editPedido(NROPED);
            if (pedido) {
                res.status(200).json({ data: pedido });
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el pedido', error: error.message });
        }

    },

    update: async(req, res) => {
        // console.log("NROPEDDD: "+req.params.NROPED)
        // console.log("TIPODDD: "+req.body.tipo)
        // pedidoService.updatePedido(req.body, req.params.NROPED)
        // .then(() => {
        //     res.redirect("/");
        // });

        const { NROPED } = req.params;
        const updatedData = req.body;
        try {
            const updatedPedido = await pedidoService.updatePedido(updatedData, NROPED);
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