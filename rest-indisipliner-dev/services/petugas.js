const _ = require("lodash");

/* utility module */
const pool = require("../utils/dbcon");
const parseResult = require("../utils/resultsetParser");

/* Service */
/* Jabatan */
async function createJabatan(data) {
  let query = "INSERT INTO tb_jabatan SET ?";
  let result = await pool.query(query, data);
  return parseResult(result);
}
async function updateJabatan(data, id) {
  let query = "UPDATE tb_jabatan SET ? WHERE row_id = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
async function deleteJabatan(id) {
  let query = "DELETE FROM tb_jabatan WHERE row_id = ?";
  let result = await pool.query(query, id);
  return parseResult(result);
}
async function listJabatan(page, count, keyword) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS * FROM tb_jabatan WHERE " +
    "(@keyword IS NULL OR jabatan LIKE CONCAT(@keyword, '%')) " +
    "ORDER BY jabatan, row_id LIMIT ?,?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}
/* Bidang */
async function createBidang(data) {
  let query = "INSERT INTO tb_bidang SET ?";
  let result = await pool.query(query, data);
  return parseResult(result);
}
async function updateBidang(data, id) {
  let query = "UPDATE tb_bidang SET ? WHERE row_id = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
async function deleteBidang(id) {
  let query = "DELETE FROM tb_bidang WHERE row_id = ?";
  let result = await pool.query(query, id);
  return parseResult(result);
}
async function listBidang(page, count, keyword) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS * FROM tb_bidang WHERE " +
    "(@keyword IS NULL OR bidang LIKE CONCAT(@keyword, '%')) " +
    "ORDER BY bidang, row_id LIMIT ?,?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}
/* Petugas */
async function createPetugas(user, petugas, kata_sandi, isAdmin) {
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
    /* tb_petugas */
    petugas.akun = $userId;
    query = "INSERT INTO tb_petugas SET ?";
    await conn.query(query, petugas);
    /* tb_sandi */
    let sandi = { akun: $userId, kata_sandi: kata_sandi };
    query = "INSERT INTO tb_sandi SET ?";
    await conn.query(query, sandi);
    /* tb_admin */
    if (isAdmin) {
      let admin = { akun: $userId };
      query = "INSERT INTO tb_admin SET ?";
      await conn.query(query, admin);
    }
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
async function updateStatusPetugas(data, id) {
  let query = "UPDATE tb_petugas SET ? WHERE akun = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
async function deletePetugas(rowId) {
  let query = "SET TRANSACTION ISOLATION LEVEL READ COMMITTED";
  const conn = await pool.getConnection();
  await conn.query(query);
  await conn.beginTransaction();
  try {
    /* tb_sandi */
    query = "DELETE FROM tb_sandi WHERE akun = ?";
    await conn.query(query, [rowId]);
    /* tb_petugas */
    query = "DELETE FROM tb_petugas WHERE akun = ?";
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
async function listPetugas(page, count, keyword) {
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
    "CASE WHEN pn.row_id = kl.wali_kelas THEN TRUE ELSE FALSE END AS wali_kelas, " +
    "CASE WHEN pn.row_id = ta.akun THEN TRUE ELSE FALSE END AS admin_user " +
    "FROM tb_pengguna pn " +
    "INNER JOIN tb_petugas pg ON pn.row_id = pg.akun " +
    "INNER JOIN tb_jabatan tj ON tj.row_id = pg.jabatan " +
    "INNER JOIN tb_bidang tb ON tb.row_id = pg.bidang " +
    "LEFT JOIN tb_kelas kl ON pn.row_id = kl.wali_kelas " +
    "LEFT JOIN tb_admin ta ON pn.row_id = ta.akun " +
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
  /* Jabatan */
  createJabatan,
  updateJabatan,
  deleteJabatan,
  listJabatan,
  /* Bidang */
  createBidang,
  updateBidang,
  deleteBidang,
  listBidang,
  /* Petugas */
  createPetugas,
  updateStatusPetugas,
  deletePetugas,
  listPetugas,
};
