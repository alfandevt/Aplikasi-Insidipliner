/* utils */
const ApiError = require("../utils/errors");

function body(schema) {
  return function (req, _res, next) {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((item) => item.message).join(",");
      next(new ApiError(400, message));
    }
  };
}

function query(schema) {
  return function (req, _res, next) {
    const { error } = schema.validate(req.query);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((item) => item.message).join(",");
      next(new ApiError(400, message));
    }
  };
}

function params(schema) {
  return function (req, _res, next) {
    const { error } = schema.validate(req.params);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((item) => item.message).join(",");
      next(new ApiError(400, message));
    }
  };
}

/* module export */
module.exports = { body, query, params };
