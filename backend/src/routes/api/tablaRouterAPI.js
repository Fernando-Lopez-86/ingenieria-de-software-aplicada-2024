const { Router } = require("express");
const router = Router();
const tablaControllerAPI = require("../../controllers/api/tablaControllerAPI");

router.get('/formas-pago', tablaControllerAPI.formasPago);
router.get('/provincias', tablaControllerAPI.provincias);

module.exports = router;