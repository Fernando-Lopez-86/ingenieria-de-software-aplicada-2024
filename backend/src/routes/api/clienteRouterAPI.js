const { Router } = require("express");
const router = Router();
const clienteControllerAPI = require("../../controllers/api/clienteControllerAPI");

router.get('/', clienteControllerAPI.list);
router.get('/clientes-approve', clienteControllerAPI.listApprove);

module.exports = router;