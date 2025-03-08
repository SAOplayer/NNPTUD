var express = require('express');
var router = express.Router();
let productSchema = require('../models/products')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let products = await productSchema.find({});
  res.send(products);
});
router.post('/', async function(req, res, next) {
  let body = req.body;
  console.log(body);
  let newProduct = new productSchema({
    productName: body.productName,
    price: body.price,
    quantity: body.quantity,
    categoryID: body.category
  })
  await newProduct.save()
  res.send(newProduct);
});


module.exports = router;