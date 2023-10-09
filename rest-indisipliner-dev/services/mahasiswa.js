const _ = require("lodash");

/* utility module */
const pool = require("../utils/dbcon");
const parseResult = require("../utils/resultsetParser");

/* Service */
/* Mahasiswa */
async function createMahasiswa(user, mahasiswa, kata_sandi) {
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
    /* tb_mahasiswa */
    mahasiswa.akun = $userId;
    query = "INSERT INTO tb_mahasiswa SET ?";
    await conn.query(query, mahasiswa);
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
async function updateStatusMahasiswa(data, id) {
  let query = "UPDATE tb_mahasiswa SET ? WHERE akun = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
async function deleteMahasiswa(rowId) {
  let query = "SET TRANSACTION ISOLATION LEVEL READ COMMITTED";
  const conn = await pool.getConnection();
  await conn.query(query);
  await conn.beginTransaction();
  try {
    /* tb_sandi */
    query = "DELETE FROM tb_sandi WHERE akun = ?";
    await conn.query(query, [rowId]);
    /* tb_mahasiswa */
    query = "DELETE FROM tb_mahasiswa WHERE akun = ?";
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
async function listMahasiswa(page, count, keyword, kelas) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query = "SET @first_key = (SELECT SUBSTRING_INDEX(@keyword, ' ', 1))";
  await pool.query(query);
  query =
    "SET @last_key = (SELECT SUBSTRING(@keyword, LENGTH(@first_key) + 2))";
  await pool.query(query);
  query = "SET @kelas = ?";
  await pool.query(query, [kelas]);

  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "pn.row_id, pn.nomor_id, pn.nama_depan, " +
    "pn.nama_belakang, DATE_FORMAT(pn.tgl_lahir, '%d/%m/%Y %H:%i:%s') " +
    "AS tgl_lahir, pn.jenis_kelamin, pn.alamat_rumah, pn.nomor_seluler, " +
    "pn.email, tf.nama_file AS foto, " +
    "DATE_FORMAT(pn.tanggal_buat, '%d/%m/%Y %H:%i:%s') AS tgl_buat, " +
    "kl.kelas, kl.row_id AS kelas_id, tj.jurusan, tj.row_id AS jurusan_id, tp.prodi, " +
    "tp.row_id AS prodi_id, mh.row_id AS mahasiswa_id, " +
    "CONCAT(YEAR(th.tahun_mulai), '/', YEAR(th.tahun_selesai)) AS periode " +
    "FROM tb_pengguna pn " +
    "INNER JOIN tb_mahasiswa mh ON pn.row_id = mh.akun " +
    "INNER JOIN tb_kelas kl ON kl.row_id = mh.kelas " +
    "INNER JOIN tb_jurusan tj ON tj.row_id = kl.jurusan " +
    "INNER JOIN tb_prodi tp ON tp.row_id = tj.prodi " +
    "INNER JOIN tb_tahun_ajaran th ON th.row_id = kl.tahun_ajaran " +
    "LEFT JOIN tb_file tf ON pn.foto = tf.row_id " +
    "WHERE " +
    "((@keyword IS NULL) OR ((pn.nama_depan LIKE CONCAT(@keyword, '%')) OR (pn.nama_belakang LIKE CONCAT(@keyword, '%'))) OR " +
    "(pn.nama_depan LIKE CONCAT(@first_key, '%') AND pn.nama_belakang LIKE CONCAT(@last_key, '%')) OR " +
    "pn.nomor_id = @keyword) " +
    "AND " +
    "(@kelas IS NULL OR kl.row_id = @kelas) " +
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
async function getUserId(mahasiswaId) {
  let query =
    "SELECT pn.row_id, pn.nomor_id " +
    "FROM tb_pengguna pn " +
    "INNER JOIN tb_mahasiswa mh ON pn.row_id = mh.akun " +
    "WHERE mh.row_id = ? LIMIT 1";
  const result = await pool.query(query, [mahasiswaId]);
  return parseResult(result, true);
}
/* Orangtua */
async function createOrangtua(data) {
  let query = "INSERT INTO tb_orangtua SET ?";
  let result = await pool.query(query, data);
  return parseResult(result);
}
async function updateOrangtua(data, id) {
  let query = "UPDATE tb_orangtua SET ? WHERE row_id = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
async function deleteOrangtua(id) {
  let query = "DELETE FROM tb_orangtua WHERE row_id = ?";
  let result = await pool.query(query, id);
  return parseResult(result);
}
async function listOrangtua(page, count, keyword, mahasiswa) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query = "SET @mahasiswa = ?";
  await pool.query(query, [mahasiswa]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "ot.row_id AS orangtua_id, ot.nama, ot.jenis_kelamin, ot.nomor_seluler, " +
    "CONCAT(pn.nama_depan, ' ', pn.nama_belakang) AS mahasiswa, pn.nomor_id, " +
    "mh.row_id AS mahasiswa_id, kl.kelas, jr.jurusan, pr.prodi, " +
    "CONCAT(YEAR(th.tahun_mulai), '/', YEAR(th.tahun_selesai)) AS periode " +
    "FROM tb_orangtua ot " +
    "INNER JOIN tb_mahasiswa mh ON mh.row_id = ot.mahasiswa " +
    "INNER JOIN tb_pengguna pn ON pn.row_id = mh.akun " +
    "INNER JOIN tb_kelas kl ON kl.row_id = mh.kelas " +
    "INNER JOIN tb_jurusan jr ON jr.row_id = kl.jurusan " +
    "INNER JOIN tb_prodi pr ON pr.row_id = jr.prodi " +
    "INNER JOIN tb_tahun_ajaran th ON th.row_id = kl.tahun_ajaran " +
    "WHERE " +
    "(@keyword IS NULL OR ot.nama LIKE CONCAT('%', @keyword, '%'))" +
    "AND " +
    "(@mahasiswa IS NULL OR ot.mahasiswa = @mahasiswa) " +
    "ORDER BY ot.nama, pn.nama_depan, pn.nama_belakang, pn.row_id " +
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
  /* Mahasiswa */
  createMahasiswa,
  updateStatusMahasiswa,
  deleteMahasiswa,
  listMahasiswa,
  getUserId,
  /* Orangtua */
  createOrangtua,
  updateOrangtua,
  deleteOrangtua,
  listOrangtua,
};
