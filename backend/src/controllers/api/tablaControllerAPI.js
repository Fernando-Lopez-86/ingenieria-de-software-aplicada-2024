const tablaService = require("../../services/tablaService");
 
const tablaControllerAPI = {
    formasPago: (req, res) => {
        tablaService.getAllFormasPago()
        .then(formasPago => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: formasPago.length,
                    url: "/api/tablas/formas-pago",
                },
                data: formasPago,
            };
            res.json(respuesta);
        })
    },

    provincias: (req, res) => {
        tablaService.getAllProvincias()
        .then(provincias => {
            let respuesta = {
                meta: {
                    status: 200,
                    total: provincias.length,
                    url: "/api/tablas/provincias",
                },
                data: provincias,
            };
            res.json(respuesta);
        })
    },

};

module.exports = tablaControllerAPI;