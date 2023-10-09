const _ = require("lodash");

let nodeEnv = process.env.NODE_ENV;
nodeEnv = nodeEnv.trim();

const constraintErr = "a foreign key constraint fails";

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
  });
};

function errorHandler(err, req, res, _next) {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";
  let message = err.message.toLowerCase();
  if (_.includes(message, constraintErr.toLowerCase())) {
    err.message = "data tidak sesuai atau telah terpakai";
    err.statusCode = 500;
  }
  if (nodeEnv === "development") {
    sendErrorDev(err, res);
  } else if (nodeEnv === "production") {
    sendErrorProd(err, res);
  }
}

module.exports = errorHandler;
