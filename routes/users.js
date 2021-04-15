const express = require("express");
const router = express.Router();
const multer = require('multer');
var upload = multer();

const { registerCustomer, loginCustomer, authChecker, changeCustomer, getInfo } = require("../controllers/AuthController");
const { registerLimiter, loginLimiter } = require("../utils/rateLimiter");

// Registers a new Customer
router.post("/register", upload.single('avatar'), registerCustomer );

// change customer infomation
router.post("/changeUser", upload.single('avatar'), changeCustomer )

// Logs In a Customer, creates session in mongo store
// and returns a cookie containing sessionID, also called "session-id"
router.post("/login", loginLimiter, loginCustomer );

// Log out Customer by deleting session from store
// and deleting cookie on client side
// Needs cookie containing sessionID to be attached to request
// router.delete("/logout", logoutCustomer );

// Check if Customer is Authenticated by reading session data
// Needs cookie containing sessionID
router.get("/authchecker", authChecker );


router.get("/getInfo", getInfo);



module.exports = router;