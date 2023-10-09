const _ = require("lodash");

/* utility module */
const pool = require("../utils/dbcon");
const parseResult = require("../utils/resultsetParser");

/* Service */
/* Bio */
async function updateBio(data, id) {
  let query = "UPDATE tb_pengguna SET ? WHERE row_id = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
/* Sandi */
async function updateSandi(data, id) {
  let query = "UPDATE tb_sandi SET ? WHERE akun = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}

/* module export */
module.exports = { updateBio, updateSandi };
