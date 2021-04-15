const express = require("express");
const router = express.Router();

const { get } = require("../controllers/CreditController");


router.get("/getCredit", get );



module.exports = router;