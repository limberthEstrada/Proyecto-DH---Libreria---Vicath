const express = require("express");
const router = express.Router();

const userAPIController = require("../../controllers/api/usersController")

router.get('/users', userAPIController.users)
router.get('/users/:id', userAPIController.usersDetail)

module.exports = router;