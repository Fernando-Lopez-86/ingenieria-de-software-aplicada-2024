const { Router } = require("express");
const router = Router();
const articuloControllerAPI = require("../../controllers/api/articuloControllerAPI");

router.get('/', articuloControllerAPI.list);

module.exports = router;