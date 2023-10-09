require("dotenv").config();

const config = {
  SecretToken: process.env.SECRET_TOKEN,
  SecretTokenRefresh: process.env.SECRET_TOKEN_REFRESH,
  TokenExpired: process.env.TOKEN_EXPIRED,
  TokenRefreshExpired: process.env.TOKEN_REFRESH_EXPIRED,
};

/* module export */
module.exports = config;
