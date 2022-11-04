const mongoose = require("mongoose");
const Order = require("../models/order");
const urlConnect = `mongodb+srv://anycode:Vinh%40123@cluster0.3nrxg81.mongodb.net/beting
`;

//Connect to db
mongoose.connect(urlConnect, { useNewUrlParser: true }, err => {
  if (err) throw err;
  console.log("Connect successfully!!");

  let order = new Order({});

  order.save(function(err) {
    if (err) throw err;
    console.log("Comment successfully saved.");
  });
});
