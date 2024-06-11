const { Router } = require("express");
const router = Router();
const pedidoControllerAPI = require("../../controllers/api/pedidoControllerAPI");

router.get('/', pedidoControllerAPI.list);
router.post("/", pedidoControllerAPI.create);
router.get('/items/:nroped', pedidoControllerAPI.listItems);
router.delete('/:NROPED', pedidoControllerAPI.destroy);
router.get("/edit/:NROPED", pedidoControllerAPI.edit);
router.post("/update/:NROPED", pedidoControllerAPI.update);

module.exports = router;