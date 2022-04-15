const express = require("express");
const apiProductController = require("../../controllers/APIs/APIProductsController");
const router = express.Router();

router.get("/products", apiProductController.getProducts)
router.get("/products/:id", apiProductController.getProductById)

module.exports = router;