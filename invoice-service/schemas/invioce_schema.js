const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: Number
  },
  name_client: {
    type: String,
  },
  surname_client: {
    type: String,
  },
  priceTotal: {
    type: Number,
    required: true,
  },
  entreprise_name:{
    type: String,
  },
  mode_payment: {
    type: String,
    default: 'cash'
  },
  creation_date: {
    type: Date
  },
  tax:{
    type: Number,
    default: 0
  }
});

const invioceSchema =  mongoose.model("m_invioceSchema", schema);
module.exports = invioceSchema;