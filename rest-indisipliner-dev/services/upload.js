const _ = require("lodash");
const pool = require("../utils/dbcon");

/* utility module */
const db = require("../utils/dbcon");
const parseResult = require("../utils/resultsetParser");

/* schema */
const scFile = require("../utils/schema/file");

/* service */
async function save(name, type) {
  const file = _.create({}, scFile.base);
  file.nama_file = name;
  file.tipe_file = type;
  let query = "INSERT INTO tb_file SET ?";
  const result = await pool.query(query, file);
  return parseResult(result, true);
}

/* Module Export */
module.exports = { save };
