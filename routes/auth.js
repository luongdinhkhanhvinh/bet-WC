let express = require("express");
let router = express.Router();


router.get("/admin/health", (request, response) => {
  return response.json({ version: "ADMIN TBD" });
});

module.exports = router;
