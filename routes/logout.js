const express = require("express");
const router = express.Router();
const {  logout } = require("../controllers/AuthController");


// Logs In a User, creates session in mongo store
// and returns a cookie containing sessionID, also called "session-id"

router.get("/logout", logout);


// Log out user by deleting session from store
// and deleting cookie on client side
// Needs cookie containing sessionID to be attached to request
// router.delete("/logout", logoutAdmin );

module.exports = router;