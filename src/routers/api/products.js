const express = require("express");
const router = express.Router();

const productsAPIController = require("../../controllers/api/productsController")

router.get('/products', productsAPIController.products)
router.get('/lastProduct', productsAPIController.lastProduct)
router.get('/products/:id', productsAPIController.productDetail)
router.get('/searchproducts', productsAPIController.productSearch)

module.exports = router;