const mysql = require("mysql2/promise");
/* config */
const dbconfig = require("../config/db");

const pool = mysql.createPool(dbconfig);

/* module export */
module.exports = pool;
