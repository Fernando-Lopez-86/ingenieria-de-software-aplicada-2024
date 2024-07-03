const articuloService = require("../../services/articuloService");
 
const articuloControllerAPI = {
    list: (req, res) => {
        articuloService.getAllArticulos()
        .then(articulos => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: articulos.length,
                    url: "/api/articulos",
                },
                data: articulos,
            };
            res.json(respuesta);
        })
    },
};

module.exports = articuloControllerAPI;