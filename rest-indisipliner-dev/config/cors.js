const ApiError = require("../utils/errors");

let nodeEnv = process.env.NODE_ENV;
nodeEnv = nodeEnv.trim();
let origins = [
  "http://localhost:8100",
  "http://192.168.43.1:8100",
  "http://192.168.43.171:8100",
  "http://192.168.43.12:8100",
];
/* allowed origin */
/* config */
const corsDev = {
  origin: "*",
  exposedHeaders: ["x-auth-token", "x-auth-refresh"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
const corsProd = {
  origin: function (origin, callback) {
    /* allow request with no origin 
       like mobile app
    */
    let message =
      "The CORS policy for this site does not " +
      "allow access from the specified Origin.";
    if (!origin) return callback(null, true);
    if (origins.indexOf(origin) === -1)
      return callback(new ApiError(401, message));
    return callback(null, true);
  },
  exposedHeaders: ["x-auth-token", "x-auth-refresh"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
const corsConfig = nodeEnv === "development" ? corsDev : corsProd;

/* module export */
module.exports = corsConfig;
