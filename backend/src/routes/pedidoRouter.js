const { Router } = require("express");
const router = Router();

const pedidoController = require("../controllers/pedidoController");

router.get('/', pedidoController.list);
router.get('/listAdmin', pedidoController.listAdmin);

router.get("/new", pedidoController.new);
router.post("/create", pedidoController.create)
router.get("/edit/:id", pedidoController.edit);
router.post("/update/:id", pedidoController.update);
router.get("/delete/:NROPED", pedidoController.delete);
router.post("/destroy/:NROPED", pedidoController.destroy);

module.exports = router;
