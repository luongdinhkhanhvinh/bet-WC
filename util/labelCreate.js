const mongoose = require("mongoose");
const label = require("../models/label");
const urlConnect = `mongodb+srv://anycode:Vinh%40123@cluster0.3nrxg81.mongodb.net/beting
`;

// Connect to database
mongoose.connect(urlConnect, { useNewUrlParser: true }, (err) => {
  if (err) throw err;
  console.log("Connect successfully!!");

  let abc = new label({
    list: [
      "Shiro",
      "Mob",
      "Crepp",
      "Zara",
      "Levis",
      "Gucci",
      "Dolce & Gabbana",
      "Others",
    ],
  });

  abc.save(function (err) {
    if (err) throw err;
    console.log("Category successfully saved.");
  });
});
