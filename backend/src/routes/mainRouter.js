const { Router } = require("express");
const router = Router();

const mainController = require("../controllers/mainController");
router.get("/", mainController.home);

const pedidoRouter = require("./pedidoRouter");
router.use("/pedidos", pedidoRouter);

const apiRouter = require("./api/mainRouterAPI")
router.use("/api", apiRouter);

const authRouter = require('./auth');
router.use("/auth", authRouter);

module.exports = router;