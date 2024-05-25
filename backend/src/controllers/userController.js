const userController = {

    login: (req, res) => {
        res.render("./usuarios/login");
    },

    loginProcess: (req, res) => {
        res.render("./usuarios/login");
    },

    logout: (req, res) => {
        res.redirect("/");
    }

}

module.exports = userController;