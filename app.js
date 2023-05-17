const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var http = require("http");
const sequelize = require("./src/database/connections");
require("dotenv").config();

const PORT = process.env.PORT;

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);

app.use(cookieParser("secret"));

app.use(
  session({
    secret: "secret",
    resave: true,
    cookie: { httpOnly: true /*, secure: true*/ },
    saveUninitialized: false,
  })
);

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.sync();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  console.log(`Starting Sequelize + Express example on port ${PORT}...`);

  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}`);
  });
}

init();

// routes
require("./src/routes/auth.route")(app);
require("./src/routes/seed.route")(app);
require("./src/routes/server.check")(app);
