const ApiError = require("../utils/errors");

function endPointError(_req, _res, next) {
  next(new ApiError(404, "endpoint not found"));
}

module.exports = endPointError;
