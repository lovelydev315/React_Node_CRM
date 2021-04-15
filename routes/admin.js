const express = require("express");
const router = express.Router();
const { loginAdmin, getUsers, updateCredit } = require("../controllers/AuthController");
const { loginLimiter } = require("../utils/rateLimiter");

// Logs In a User, creates session in mongo store
// and returns a cookie containing sessionID, also called "session-id"
router.post("/login", loginAdmin );
router.get("/getUsers", getUsers);
router.post("/updateCredit", updateCredit);

// Log out user by deleting session from store
// and deleting cookie on client side
// Needs cookie containing sessionID to be attached to request
// router.delete("/logout", logoutAdmin );

module.exports = router;