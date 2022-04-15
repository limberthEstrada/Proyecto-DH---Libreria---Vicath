const express = require("express");
const apiUserController = require("../../controllers/APIs/apiUsersController");
const router = express.Router();

router.get("/users", apiUserController.getUsers)
router.get("/users/:id", apiUserController.getUserById)

module.exports = router;