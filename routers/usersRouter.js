const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const isAuth = require("../middleware/authMiddleware");

router.post("/register", usersController.createUser);
router.post("/login", usersController.loginUser);
router.get("/users-all", isAuth, usersController.getUsers);
router.post("/checkout", usersController.stripePayIntegration);

module.exports = router;
