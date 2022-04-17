const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const configs = require('./config/config');
var path = require('path');
const eurekaHelper = require('./eureka-helper');
const invoiceRoute = require("./routes/invoice_routes");
const PORT = process.env.PORT || 4040;

app.use(express.static(path.join(__dirname, 'public'))); 

mongoose
    .connect(
        "mongodb+srv://bouhajja:Aa555333@cluster0.oueok.mongodb.net/test",
        {useNewUrlParser: true}
    )
    .then(() => {
        console.log("MongoDB database connection established successfully");
    })
    .catch(err => {
        console.log(err.message);
    });

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) =>{
    res.send('hi from inoive service')
})
app.use("/invoice", invoiceRoute);
app.use(express.static('public'));

const server = app.listen(configs.BACKEND_PORT, function () {
    console.log("Student management system backend server is running on port : " + configs.BACKEND_PORT);
});

eurekaHelper.registerWithEureka('invoice-service', PORT);