const jwt = require("jsonwebtoken");
const config = require("../config/token");

function generateToken(nomorId, statusAdmin, statusPengguna, refresh = false) {
  let secret = null;
  let expiresIn = null;
  /* token type check */
  if (!refresh) {
    secret = config.SecretToken;
    expiresIn = config.TokenExpired;
  } else {
    secret = config.SecretTokenRefresh;
    expiresIn = config.TokenRefreshExpired;
  }
  /* token body */
  const user = {
    nomorId: nomorId,
    statusAdmin: statusAdmin,
    statusPengguna: statusPengguna,
  };
  /* token option */
  const option = {
    expiresIn: expiresIn,
  };
  return {token: jwt.sign(user, secret, option), expiresIn};
}

module.exports = generateToken;
