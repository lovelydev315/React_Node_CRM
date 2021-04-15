const express = require("express");
const router = express.Router();

const { get } = require("../controllers/PhaseController");


router.get("/getPhase", get );



module.exports = router;