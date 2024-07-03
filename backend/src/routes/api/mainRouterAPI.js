const { Router } = require("express");
const router = Router();

const pedidoRouterAPI = require("./pedidoRouterAPI")
const articuloRouterAPI = require("./articuloRouterAPI")
const clienteRouterAPI = require("./clienteRouterAPI")
const tablaRouterAPI = require("./tablaRouterAPI")
router.use("/pedidos", pedidoRouterAPI);
router.use("/articulos", articuloRouterAPI);
router.use("/clientes", clienteRouterAPI);
router.use("/tablas", tablaRouterAPI);

module.exports = router;