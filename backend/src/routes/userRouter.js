const { Router } = require("express");
const router = Router();

const userController = require("../controllers/userController");

router.get("/login", userController.login);
router.post("/login", userController.loginProcess);
router.get("/logout", userController.logout);

module.exports = router;