const { Router } = require("express");
const router = Router();
const pedidoControllerAPI = require("../../controllers/api/pedidoControllerAPI");
const { protect, verifyRole } = require('../../middlewares/auth');

router.get('/', protect, pedidoControllerAPI.list);
// router.get('/:numero_vendedor', protect, pedidoControllerAPI.list);
router.get('/pending', protect, pedidoControllerAPI.listCheck);
router.post("/", protect, pedidoControllerAPI.create);
router.post("/check", protect, pedidoControllerAPI.createCheck);
router.get('/items/:nroped', protect, pedidoControllerAPI.listItems);
router.delete('/:NROPED', protect, pedidoControllerAPI.destroy);
//router.get("/edit/:NROPED", protect, pedidoControllerAPI.edit);
router.post("/edit", protect, pedidoControllerAPI.edit);
router.post("/approve", protect, pedidoControllerAPI.editApprove);
router.post("/update", protect, pedidoControllerAPI.update);

module.exports = router;