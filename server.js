const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const router = express.Router();
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require('helmet');
const cors = require('cors');
const { createAdmin, logout } = require("./controllers/AuthController");

const corsOptions = {
  origin: 'http://192.53.163.251:3000',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
// Constants
const {
  HOST,
  PORT,
  SESS_SECRET,
  NODE_ENV,
  IS_PROD,
  COOKIE_NAME
} = require("./config/config");
const { MongoURI } = require("./config/database");
const MAX_AGE = 1000 * 60 * 60 * 3; // Three hours
// const IS_PROD = NODE_ENV === "production";

// Connecting to Database
mongoose
  .connect(MongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// setting up connect-mongodb-session store
const mongoDBstore = new MongoDBStore({
  uri: MongoURI,
  collection: "mySessions"
});

// Express Bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//default file path
app.use(express.static(path.join(__dirname, 'public')));

// Express-Session
app.use(
  session({
    name: COOKIE_NAME, //name to be put in "key" field in postman etc
    secret: SESS_SECRET,
    resave: true,
    saveUninitialized: true,
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE,
      sameSite: false,
      secure: IS_PROD
    }
  })
);


router.get("/", (req, res) => res.send("HELLO FRIEND"));
router.get("/api/logout", logout);
app.use("/api/logout", require('./routes/logout'));

// API / Routes;
// Uncomment Below for Development
app.use("/api/customer", require("./routes/users"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/files", require("./routes/file"));
app.use("/api/Credit", require("./routes/credit"));
app.use("/api/phase", require("./routes/phase"));
router.delete("/api/logout", logout);

//Uncomment Below for Production, routes mounted at /sessions-auth-app and not root domain
//app.use("/sessions-auth-app/api/users", require("./routes/users"));
// app.use("/api/auth", require("./routes/auth"));

app.listen(PORT, () => console.log(`Server started on http://${HOST}:${PORT}`));

createAdmin();
