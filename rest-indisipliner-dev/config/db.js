const bluenird = require("bluebird");

/* db connection config */
let nodeEnv = process.env.NODE_ENV;
nodeEnv = nodeEnv.trim();

const devCon = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  timezone: "Z",
  database: process.env.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  debug: true,
  trace: true,
  Promise: bluenird,
};
const prodCon = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  timezone: "Z",
  database: process.env.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  debug: false,
  trace: true,
  Promise: bluenird,
};

const dbConfig = nodeEnv === "development" ? devCon : prodCon;

/* module export */
module.exports = dbConfig;
