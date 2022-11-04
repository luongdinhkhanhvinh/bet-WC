let express = require("express");
let router = express.Router();
/* GET home page. */

router.get("/health", (request, response) => {
  return response.json({ version: "TBD" });
});

module.exports = router;
