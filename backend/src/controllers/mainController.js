// const mainController = {
//     home: (req, res) => {
//         res.render("index");
//     }
// };

// module.exports = mainController;


const pedidoService = require("../services/pedidoService");
 
const mainController = {
    home: (req, res) => {
        pedidoService.getAllProducts()
        .then(pedidos => {
            res.render("index", {pedidos});
        })
        
    },
}

module.exports = mainController;