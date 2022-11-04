const mongoose = require("mongoose");
const Product = require("../models/product");
const urlConnect = `mongodb+srv://anycode:Vinh%40123@cluster0.3nrxg81.mongodb.net/beting
`;

// Connect to database
mongoose.connect(urlConnect, { useNewUrlParser: true }, (err) => {
  if (err) throw err;
  console.log("Connect successfully!!");

  let product = new Product({});

  product.save(function (err) {
    if (err) throw err;
    console.log("Product successfully saved.");
  });
});
