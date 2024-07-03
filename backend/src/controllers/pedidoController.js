const pedidoService = require("../services/pedidoService");

const pedidoController = {

    new: async(req, res) => {
        res.render("./pedidos/new");
    },

    create: async(req, res) => {
        try {
            const pedidoData = {
                TIPO: req.body.TIPO,
                CLIENTE: req.body.CLIENTE,
                NROPED: req.body.NROPED,
                NROREAL: req.body.NROREAL,
                ESTADOSEG: req.body.ESTADOSEG,
                CODIGO: req.body.CODIGO,
                items: req.body.items
            };
            
            pedidoService.createPedido(pedidoData)
            .then(() => {
                res.redirect("/");
            });

            res.status(201).json(result);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    edit: async(req, res) => {
        pedidoService.editPedido(req.params.NROPED)
        .then((pedidos) => {
            res.render("./pedidos/edit", {pedidos});
        });
    },

    update: (req, res) => {
        pedidoService.updatePedido(req.body, req.params.NROPED)
        .then(() => {
            res.redirect("/");
        });
    },

    delete: (req, res) => {
        pedidoService.deletePedido(req.params.NROPED)
        .then((pedidos) => {
            res.render("./pedidos/delete", {pedidos});
        });
    },

    destroy: (req, res) => {
        pedidoService.destroyPedido(req.params.NROPED)
        .then(() => {
            pedidoService.destroyPedidosItem(req.params.NROPED)
            res.redirect("/");
        });
    },

    list: (req, res) => {
        res.render("./pedidos/list");
    },

    listAdmin: (req, res) => {
        res.render("./pedidos/listAdmin");
    }

};

module.exports = pedidoController;