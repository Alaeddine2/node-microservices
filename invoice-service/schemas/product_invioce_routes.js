const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: Number
  },
  product: {
    type: mongoose.Schema.Types.ObjectId, ref: 'm_product'
  },
  product_id: {
    type: Number
  },
  quantity: {
    type: Number,
    required: true,
  },
  total_price:{
    type: Number,
  },
  invioce_id: {
    type: String,
  },
  invioce_id_auto: {
    type: Number
  }
});

const invioceProductSchema =  mongoose.model("m_invioce_productSchema", schema);
module.exports = invioceProductSchema;