const pedidoService = require("../services/pedidoService");

const pedidoController = {

    new: async(req, res) => {
        //const marcas = await brandService.getAllBrands();
        // const categorias = await categoryService.getAllCategories();
        // res.render("./productos/new", {marcas, categorias});
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

        // app.post('/api/createPedido', async (req, res) => {
        //     const pedidoData = {
        //         TIPO: req.body.TIPO,
        //         CLIENTE: req.body.CLIENTE,
        //         NROPED: req.body.NROPED,
        //         CODIGO: req.body.CODIGO,
        //         items: Array.isArray(req.body.items) ? req.body.items : []
        //     };
          
        //     const result = await createPedido(pedidoData);

        // });

    },

    edit: async(req, res) => {
        // const marcas = await brandService.getAllBrands();
        // const categorias = await categoryService.getAllCategories();

        pedidoService.editPedido(req.params.NROPED)
        .then((pedidos) => {
            res.render("./pedidos/edit", {pedidos});
        });
    },

    update: (req, res) => {
        // console.log("NROPEDDD: "+req.params.NROPED)
        pedidoService.updatePedido(req.body, req.params.NROPED)
        .then(() => {
            res.redirect("/");
        });
    },

    delete: (req, res) => {
        //console.log("NROPED: "+req.params.NROPED)
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