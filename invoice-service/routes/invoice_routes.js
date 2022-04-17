const express = require("express");
const mongoose = require("mongoose");
const clientSchema = require('../schemas/client_schema')
const invioceSchema = require('../schemas/invioce_schema')
const productInvioceSchema = require('../schemas/product_invioce_routes')
const productSchema = require('../schemas/product_schema')

const router = express.Router();

router.post("/add", async (req, res) => {
    let client = req.body.client;
    let clientCounter = await clientSchema.find({id: client.id}).count();
    let productIndex = await invioceSchema.find().count() + 1;
    if(clientCounter == 0){
        await clientSchema({
            id: client.id,
            name: client.name,
            surname: client.surname,
            tel: client.tel,
            email: client.email,
            sex: client.sex,
            entreprise: client.entreprise,
            dob: new Date(),
            postalCode: client.postalCode,
            localisation: client.localisation
        }).save();
    }
    let invioceModel = invioceSchema({
        id: productIndex,
        name_client: client.name,
        surname_client: client.surname,
        priceTotal: 0,
        entreprise_name: client.entreprise,
        mode_payment: req.body.method,
        tax: req.body.tax,
        creation_date: new Date()
    })
    invioceModel
      .save()
      .then((result) => {
        res.status(200).json({
          status: 200,
          message: "Added successfully",
          createdInvoice: invioceModel,
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: 400,
          message: "Adding new failed",
          error: err,
        });
    });
});

router.post("/add/products", async (req, res) => {
  let productList = req.body.products;
  let productInvoiceIndex = await productInvioceSchema.find().count() + 1;
  productList.forEach(async product => {
    let storedProduct = null
    let counter = await productSchema.find({"id": product.id}).count();
    if(counter == 0){
      storedProduct = await productSchema({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        added_date: new Date(),
        ref: product.ref,
        category_name: product.category_name
      }).save();
      console.log('sucessfully stored');
    }else{
      storedProduct = await productSchema.find({id: product.id});
      storedProduct = storedProduct[0];
      console.log('sucessfully retreive');
    }
    console.log(storedProduct);
    await productInvioceSchema({
      id: productInvoiceIndex,
      product: storedProduct,
      product_id: product.id,
      quantity: product.quantity,
      total_price: storedProduct.price * product.quantity,
      invioce_id: req.body.invioce_id,
      invioce_id_auto: req.body.invioce_id,
    }).save();
  });
  res.status(200).json({
    status: 200,
    message: "Added successfully",
    //createdInvoice: invioceModel,
  });
});

router.post("/update/:id", (req, res) => {
  let client = req.body.client;
    invioceSchema.updateOne({"id": req.params.id}, {
      "$set": {
        "name_client": client.name,
        "surname_client": client.surname,
        "entreprise": client.entreprise,
        "mode_payment": req.body.method,
        "tax": req.body.tax,
      }
    })
      .then(result => {
        invioceSchema.find({"id": req.params.id})
      .exec()
      .then(resultList => {
          res.status(200).json({
              message: "Updated successfully",
              created: resultList[0]
          });
      })
      })
      .catch(err => {
          res.status(400).json({
              message: "Updating failed",
              error: err
          });
  });
});

router.delete("/delete/:id", (req, res) => {
  invioceSchema.findOneAndDelete({ "id": req.params.id }, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json("Deleted successfully");
    }
  });
});

router.get("/get/details/:id", (req, res) => {
  invioceSchema.find({"id": req.params.id}).exec().then(async invoiceList => {
    let products = []
    productList = await productInvioceSchema.find({"invioce_id_auto": req.params.id}).populate('product');
    productList.forEach(product => {
      if(products.findIndex(el => el.product_id == product.product_id) == -1){
        products.push({
          product: product.product,
          product_id: product.product_id,
          quantity: product.quantity
        })
      }else{
        products[products.findIndex(el => el.product_id == product.product_id)].quantity += product.quantity
      }
    })
    console.log(productList);
    res.status(200).json({
      message: "retrieve data successfully",
      invoice: {
        details: invoiceList[0],
        productList: products
      }
    });
  }).catch(err =>{
    res.status(400).send(err);
  })
});

router.get("/get/all", (req, res) => {
  invioceSchema.find().exec().then(async invoiceList => {
    res.status(200).json({
      message: "retrieve data successfully",
      invoices:  invoiceList,
    });
  }).catch(err =>{
    res.status(400).send(err);
  })
});

router.get("/get/name/:name", (req, res) => {
  invioceSchema.find({"name_client": req.params.name}).exec().then(async invoiceList => {
    res.status(200).json({
      message: "retrieve data successfully",
      invoices:  invoiceList,
    });
  }).catch(err =>{
    res.status(400).send(err);
  })
});

router.post("/remove/product", (req, res) => {
  console.log( req.body.product_id);
  productInvioceSchema.find({"product_id": req.body.product_id, 'invioce_id_auto': req.body.invoice_id}).exec().then(async invoiceProductList => {
    invoiceProductList.forEach(async data =>{
      await productInvioceSchema.findOneAndDelete({ _id: data._id })
      console.log(data);
    })
    res.status(200).json({
      message: "remove data successfully",
    });
  }).catch(err =>{
    res.status(400).send(err);
  })
});

module.exports = router;