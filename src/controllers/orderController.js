const orderController = {

    new: (req, res) => {
        res.render("./pedidos/new");
    },

    create: (req, res) => {
        res.render("./pedidos/create");
    },

    edit: (req, res) => {
        res.render("./pedidos/edit");
    },

    update: (req, res) => {
        res.render("./pedidos/update");
    },

    delete: (req, res) => {
        res.render("./pedidos/delete");
    },

    destroy: (req, res) => {
        res.render("./pedidos/new");
    },

    list: (req, res) => {
        res.render("./pedidos/list");
    },

    listAdmin: (req, res) => {
        res.render("./pedidos/listAdmin");
    }

};

module.exports = orderController;