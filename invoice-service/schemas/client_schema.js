const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: Number
  },
  name: {
    type: String,
    //required: true,
  },
  surname: {
    type: String,
    //required: true,
  },
  tel: {
    type: String,
    //required: true,
  },
  email: {
    type: String,
    //required: true,
  },
  sex: {
    type: String,
  },
  entreprise: {
    type: String
  },
  dob: {
    type: Date
  },
  postalCode:{
    type: String,
    default: 218
  },
  localisation:{
    type: String
  }
});

const clientSchema =  mongoose.model("m_client", schema);
module.exports = clientSchema;