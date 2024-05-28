const { Router } = require("express");
const router = Router();

const pedidoRouterAPI = require("./pedidoRouterAPI")
router.use("/pedidos", pedidoRouterAPI);

module.exports = router;