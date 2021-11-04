//const { Router } = require('express');
const express=require('express')
const productController=require('../controllers/productControllers')
const router=express.Router();

// route =/api/v1/products
router.route('/').get(productController.getAllProducts).post(productController.createNewProduct);
router.route('/:id').put(productController.updateProductById).delete(productController.deleteProductById);

module.exports=router
