const { Router } = require("express");
const router = Router();

const orderController = require("../controllers/pedidoController");

router.get('/', orderController.list);
router.get('/listAdmin', orderController.listAdmin);

router.get("/new", orderController.new);
router.get("/create", orderController.create)
router.get("/edit", orderController.edit);
router.get("/update", orderController.update);
router.get("/delete", orderController.delete);
router.get("/destroy", orderController.destroy);

module.exports = router;
