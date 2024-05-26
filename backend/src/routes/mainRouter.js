const { Router } = require("express");
const router = Router();

const mainController = require("../controllers/mainController");
router.get("/", mainController.home);

const orderRouter = require("./pedidoRouter");
router.use("/pedidos", orderRouter);

const userRouter = require("./userRouter");
router.use("/usuarios", userRouter);

module.exports = router;