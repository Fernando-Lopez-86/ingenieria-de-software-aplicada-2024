const { Router } = require("express");
const router = Router();

const mainController = require("../controllers/mainController");
router.get("/", mainController.home);

const orderRouter = require("./pedidoRouter");
router.use("/pedidos", orderRouter);

const apiRouter = require("./api/mainRouterAPI")
router.use("/api", apiRouter);

module.exports = router;