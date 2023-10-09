const jwt = require("jsonwebtoken");
const ApiError = require("../utils/errors");
const config = require("../config/token");

/* Middleware */
/* Privilege */
function admin(req, res, next) {
  if (!req.user.statusAdmin)
    return next(new ApiError(403, "Akses hanya untuk admin."));
  next();
}
function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return next(new ApiError(401, "access token not found"));
  console.log(token);

  try {
    const decoded = jwt.verify(token, config.SecretToken);
    req.user = decoded;
    next();
  } catch (ex) {
    console.log(ex);
    next(new ApiError(403, "invalid token"));
  }
}

/* module export */
module.exports = {
  /* PRIVILEGE */
  admin,
  auth,
};
