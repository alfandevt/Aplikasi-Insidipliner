const _ = require("lodash");

/* utility module */
const pool = require("../utils/dbcon");
const parseResult = require("../utils/resultsetParser");

/* Service */
/* Dosen */
async function createDosen(user, kata_sandi) {
  let dosen = {};
  let query = "SET TRANSACTION ISOLATION LEVEL READ COMMITTED";
  const conn = await pool.getConnection();
  await conn.query(query);
  await conn.beginTransaction();
  try {
    /* tb_pengguna */
    query = "INSERT INTO tb_pengguna SET ?";
    let $user = await conn.query(query, user);
    $user = parseResult($user, true);
    let $userId = _.get($user, "insertId");
    /* tb_dosen */
    dosen.akun = $userId;
    query = "INSERT INTO tb_dosen SET ?";
    await conn.query(query, dosen);
    /* tb_sandi */
    let sandi = { akun: $userId, kata_sandi: kata_sandi };
    query = "INSERT INTO tb_sandi SET ?";
    await conn.query(query, sandi);
    await conn.commit();
    return $userId;
  } catch (ex) {
    console.log(ex);
    await conn.rollback();
    throw ex;
  } finally {
    conn.release();
  }
}
async function deleteDosen(rowId) {
  let query = "SET TRANSACTION ISOLATION LEVEL READ COMMITTED";
  const conn = await pool.getConnection();
  await conn.query(query);
  await conn.beginTransaction();
  try {
    /* tb_sandi */
    query = "DELETE FROM tb_sandi WHERE akun = ?";
    await conn.query(query, [rowId]);
    /* tb_dosen */
    query = "DELETE FROM tb_dosen WHERE akun = ?";
    await conn.query(query, [rowId]);
    /* tb_pengguna */
    query = "DELETE FROM tb_pengguna WHERE row_id = ?";
    const result = await conn.query(query, [rowId]);
    await conn.commit();
    return parseResult(result, true);
  } catch (ex) {
    console.log(ex);
    await conn.rollback();
    throw ex;
  } finally {
    conn.release();
  }
}
async function listDosen(page, count, keyword) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query = "SET @first_key = (SELECT SUBSTRING_INDEX(@keyword, ' ', 1))";
  await pool.query(query);
  query =
    "SET @last_key = (SELECT SUBSTRING(@keyword, LENGTH(@first_key) + 2))";
  await pool.query(query);
  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "pn.row_id, pn.nomor_id, pn.nama_depan, " +
    "pn.nama_belakang, DATE_FORMAT(pn.tgl_lahir, '%d/%m/%Y %H:%i:%s') " +
    "AS tgl_lahir, pn.jenis_kelamin, pn.alamat_rumah, pn.nomor_seluler, " +
    "pn.email, tf.nama_file AS foto, " +
    "CASE WHEN pn.row_id = kl.wali_kelas THEN TRUE ELSE FALSE END AS wali_kelas, " +
    "DATE_FORMAT(pn.tanggal_buat, '%d/%m/%Y %H:%i:%s') AS tgl_buat " +
    "FROM tb_pengguna pn " +
    "INNER JOIN tb_dosen dn ON pn.row_id = dn.akun " +
    "LEFT JOIN tb_kelas kl ON pn.row_id = kl.wali_kelas " +
    "LEFT JOIN tb_file tf ON pn.foto = tf.row_id " +
    "WHERE " +
    "((@keyword IS NULL) OR ((pn.nama_depan LIKE CONCAT(@keyword, '%')) OR (pn.nama_belakang LIKE CONCAT(@keyword, '%'))) OR " +
    "(pn.nama_depan LIKE CONCAT(@first_key, '%') AND pn.nama_belakang LIKE CONCAT(@last_key, '%')) OR " +
    "pn.nomor_id = @keyword) " +
    "ORDER BY pn.nama_depan, pn.nama_belakang, pn.row_id " +
    "LIMIT ?, ?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}

/* Module export */
module.exports = {
  /* Dosen */
  createDosen,
  deleteDosen,
  listDosen,
};
