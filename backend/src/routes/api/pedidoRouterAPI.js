const { Router } = require("express");
const router = Router();
const pedidoControllerAPI = require("../../controllers/api/pedidoControllerAPI");

router.get('/', pedidoControllerAPI.list);
// router.get('/:id', pedidoControllerAPI.detail);

module.exports = router;