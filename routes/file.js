const express = require("express");
const router = express.Router();
const multer = require('multer');
var upload = multer();

const { get, addFolder, uploadDocument, getFiles } = require("../controllers/FileController");

router.get("/getFolder", get );

router.post("/createNewFolder", addFolder );
router.post("/uploadDocument", upload.single('document'), uploadDocument );



module.exports = router;