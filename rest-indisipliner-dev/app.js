var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
/* config */
var corsConfig = require("./config/cors");
/* middleware */
var errorHandler = require("./middlewares/apiError");
var endpointErrorHandler = require("./middlewares/endPointError");

/* router */
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api");

var app = express();

/* view engine */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors(corsConfig));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.all("*", endpointErrorHandler);

/* Error Handler */
app.use(errorHandler);

module.exports = app;
