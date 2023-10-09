const _ = require("lodash");

/* utility module */
const pool = require("../utils/dbcon");
const parseResult = require("../utils/resultsetParser");

/* Services */
/* Auth */
async function login(nomorId) {
  let query =
    "SELECT pn.row_id, pn.nomor_id, pn.nama_depan, " +
    "pn.nama_belakang, fl.nama_file AS foto, ks.kata_sandi, " +
    "CASE WHEN pn.row_id = ad.akun THEN TRUE ELSE FALSE END AS status_admin, " +
    "CASE WHEN pn.row_id = pt.akun THEN 'P' WHEN pn.row_id = dn.akun THEN 'D' " +
    "WHEN pn.row_id = mh.akun THEN 'M' ELSE 'U' END AS status_pengguna, " +
    "CASE WHEN pn.row_id = kl.wali_kelas THEN TRUE ELSE FALSE END AS wali_kelas " +
    "FROM tb_pengguna pn LEFT JOIN tb_petugas pt ON pn.row_id = pt.akun " +
    "LEFT JOIN tb_dosen dn ON pn.row_id = dn.akun " +
    "LEFT JOIN tb_mahasiswa mh ON pn.row_id = mh.akun " +
    "LEFT JOIN tb_kelas kl ON pn.row_id = kl.wali_kelas " +
    "LEFT JOIN tb_sandi ks ON pn.row_id = ks.akun " +
    "LEFT JOIN tb_admin ad ON pn.row_id = ad.akun " +
    "LEFT JOIN tb_file fl ON pn.foto = fl.row_id " +
    "WHERE pn.nomor_id = ? LIMIT 1";
  const result = await pool.query(query, [nomorId]);
  return parseResult(result, true);
}
async function roleCheck(rowId) {
  let query =
    "SELECT pn.row_id, pn.nomor_id, CASE " +
    "WHEN pn.row_id = pt.akun THEN 'P' " +
    "WHEN pn.row_id = dn.akun THEN 'D' " +
    "WHEN pn.row_id = mh.akun THEN 'M' ELSE 'U' " +
    "END AS status_pengguna, " +
    "CASE WHEN pn.row_id = ad.akun THEN TRUE ELSE FALSE " +
    "END AS status_admin, " +
    "CASE WHEN pn.row_id = kl.wali_kelas THEN TRUE ELSE FALSE " +
    "END AS status_pembimbing, " +
    "CASE WHEN pn.row_id = ks.akun THEN TRUE ELSE FALSE " +
    "END AS status_akun " +
    "FROM tb_pengguna pn " +
    "LEFT JOIN tb_petugas pt ON pn.row_id = pt.akun " +
    "LEFT JOIN tb_dosen dn ON pn.row_id = dn.akun " +
    "LEFT JOIN tb_mahasiswa mh ON pn.row_id = mh.akun " +
    "LEFT JOIN tb_sandi ks ON pn.row_id = ks.akun " +
    "LEFT JOIN tb_admin ad ON pn.row_id = ad.akun " +
    "LEFT JOIN tb_kelas kl ON pn.row_id = kl.wali_kelas " +
    "WHERE pn.row_id = ? LIMIT 1";
  const result = await pool.query(query, [rowId]);
  return parseResult(result, true);
}
async function createSandi(akun) {
  let query = "INSERT INTO tb_sandi SET ?";
  const result = await pool.query(query, akun);
  return parseResult(result, true);
}
async function updateSandi(sandi, akun) {
  let query = "UPDATE tb_sandi SET ? WHERE akun = ?";
  const result = await pool.query(query, [sandi, akun]);
  return parseResult(result, true);
}
async function deleteSandi(akun) {
  let query = "DELETE FROM tb_sandi WHERE akun = ?";
  const result = await pool.query(query, [akun]);
  return parseResult(result, true);
}
/* admin */
async function createAdmin(akun) {
  let query = "INSERT INTO tb_admin SET ?";
  const result = await pool.query(query, akun);
  return parseResult(result, true);
}
async function deleteAdmin(akun) {
  let query = "DELETE FROM tb_admin WHERE akun = ?";
  const result = await pool.query(query, [akun]);
  return parseResult(result, true);
}
async function listAdmin(page, count, keyword) {
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
    "DATE_FORMAT(pn.tanggal_buat, '%d/%m/%Y %H:%i:%s') AS tgl_buat, " +
    "tj.jabatan, tj.row_id AS jabatan_id, tb.bidang, tb.row_id AS bidang_id, " +
    "CASE WHEN pn.row_id = ta.akun THEN TRUE ELSE FALSE END AS admin_user " +
    "FROM tb_pengguna pn " +
    "INNER JOIN tb_petugas pg ON pn.row_id = pg.akun " +
    "INNER JOIN tb_jabatan tj ON tj.row_id = pg.jabatan " +
    "INNER JOIN tb_bidang tb ON tb.row_id = pg.bidang " +
    "INNER JOIN tb_admin ta ON pn.row_id = ta.akun " +
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
/* Module Export */
module.exports = {
  /* auth */
  login,
  roleCheck,
  createSandi,
  updateSandi,
  deleteSandi,
  /* Admin */
  createAdmin,
  deleteAdmin,
  listAdmin,
};
