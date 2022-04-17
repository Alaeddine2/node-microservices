const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: Number
  },
  name: {
    type: String,
  },
  discription: {
    type: String,
  },
  price: {
    type: Number,
  },
  category_name: {
    type: String,
  },
  ref: {
    type: String,
  },
  added_date: {
    type: Date
  },
  quntity:{
    type: Number
  }
});

const productSchema =  mongoose.model("m_product", schema);
module.exports = productSchema;