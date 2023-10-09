const _ = require("lodash");

/* utility module */
const pool = require("../utils/dbcon");
const parseResult = require("../utils/resultsetParser");

/* Services */
/* Prodi */
async function createProdi(data) {
  let query = "INSERT INTO tb_prodi SET ?";
  let result = await pool.query(query, data);

  return parseResult(result);
}
async function updateProdi(data, id) {
  let query = "UPDATE tb_prodi SET ? WHERE row_id = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
async function deleteProdi(id) {
  let query = "DELETE FROM tb_prodi WHERE row_id = ?";
  let result = await pool.query(query, id);
  return parseResult(result);
}
async function listProdi(page, count, keyword) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS * FROM tb_prodi WHERE " +
    "(@keyword IS NULL OR prodi LIKE CONCAT(@keyword, '%')) " +
    "ORDER BY prodi, row_id LIMIT ?,?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}
/* Jurusan */
async function createJurusan(data) {
  let query = "INSERT INTO tb_jurusan SET ?";
  let result = await pool.query(query, data);
  return parseResult(result);
}
async function updateJurusan(data, id) {
  let query = "UPDATE tb_jurusan SET ? WHERE row_id = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
async function deleteJurusan(id) {
  let query = "DELETE FROM tb_jurusan WHERE row_id = ?";
  let result = await pool.query(query, id);
  return parseResult(result);
}
async function listJurusan(page, count, keyword) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "tj.row_id, tj.jurusan, tp.row_id AS prodi_id, " +
    "tp.prodi FROM tb_jurusan tj " +
    "INNER JOIN tb_prodi tp ON tj.prodi = tp.row_id " +
    "WHERE (@keyword IS NULL OR jurusan LIKE CONCAT(@keyword, '%')) " +
    "ORDER BY tj.jurusan, tp.prodi, tj.row_id LIMIT ?,?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}
/* Tahun Ajaran */
async function createTahun(data) {
  let query = "INSERT INTO tb_tahun_ajaran SET ?";
  let result = await pool.query(query, data);
  return parseResult(result);
}
async function updateTahun(data, id) {
  let query = "UPDATE tb_tahun_ajaran SET ? WHERE row_id = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
async function deleteTahun(id) {
  let query = "DELETE FROM tb_tahun_ajaran WHERE row_id = ?";
  let result = await pool.query(query, id);
  return parseResult(result);
}
async function listTahun(page, count, mulai, selesai) {
  let offset = (page - 1) * count;
  let query = "SET @mulai = ?";
  await pool.query(query, [mulai]);
  query = "SET @selesai = ?";
  await pool.query(query, [selesai]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "row_id, CONCAT(YEAR(tahun_mulai), '/', YEAR(tahun_selesai)) AS periode, " +
    "DATE_FORMAT(tahun_mulai, '%d/%m/%Y %H:%i:%s') AS tahun_mulai, " +
    "DATE_FORMAT(tahun_selesai, '%d/%m/%Y %H:%i:%s') AS tahun_selesai " +
    "FROM tb_tahun_ajaran WHERE " +
    "(@mulai IS NULL AND @selesai IS NULL) OR " +
    "(YEAR(tahun_mulai) = @mulai AND YEAR(tahun_selesai) = @selesai) " +
    "ORDER BY tahun_mulai DESC, row_id LIMIT ?,?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}
/* Kelas */
async function createKelas(data) {
  let query = "INSERT INTO tb_kelas SET ?";
  let result = await pool.query(query, data);
  return parseResult(result);
}
async function updateKelas(data, id) {
  let query = "UPDATE tb_kelas SET ? WHERE row_id = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
async function deleteKelas(id) {
  let query = "DELETE FROM tb_kelas WHERE row_id = ?";
  let result = await pool.query(query, id);
  return parseResult(result);
}
async function listKelas(page, count, keyword) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "kl.row_id, kl.kelas, tj.jurusan, tj.row_id AS jurusan_id, " +
    "tp.prodi, tp.row_id AS prodi_id, " +
    "CONCAT(pn.nama_depan, ' ', pn.nama_belakang) AS wali_kelas, " +
    "pn.row_id AS wali_kelas_id, " +
    "CONCAT(YEAR(th.tahun_mulai), '/', YEAR(th.tahun_selesai)) AS periode, " +
    "th.row_id AS periode_id " +
    "FROM tb_kelas kl " +
    "INNER JOIN tb_pengguna pn ON kl.wali_kelas = pn.row_id " +
    "INNER JOIN tb_jurusan tj ON kl.jurusan = tj.row_id " +
    "INNER JOIN tb_tahun_ajaran th ON kl.tahun_ajaran = th.row_id " +
    "INNER JOIN tb_prodi tp ON tj.prodi = tp.row_id " +
    "WHERE (@keyword IS NULL OR kl.kelas LIKE CONCAT(@keyword, '%')) " +
    "ORDER BY kl.kelas, tj.jurusan, tp.prodi, kl.row_id LIMIT ?,?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}
/* Wali Kelas */
async function listWaliKelas(page, count, keyword) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "pn.row_id, pn.nomor_id, pn.nama_depan, " +
    "pn.nama_belakang, DATE_FORMAT(pn.tgl_lahir, '%d/%m/%Y %H:%i:%s') " +
    "AS tgl_lahir, pn.jenis_kelamin, pn.alamat_rumah, pn.nomor_seluler, " +
    "pn.email, tf.nama_file AS foto, " +
    "DATE_FORMAT(pn.tanggal_buat, '%d/%m/%Y %H:%i:%s') AS tgl_buat, " +
    "CASE WHEN pn.row_id = dn.akun THEN 'Dosen' WHEN pn.row_id = pg.akun THEN 'Petugas' " +
    "END AS status_akun, " +
    "CASE WHEN pn.row_id = ta.akun THEN TRUE ELSE FALSE END AS admin_user, " +
    "COUNT(kl.row_id) AS jumlah_kelas " +
    "FROM tb_pengguna pn " +
    "LEFT JOIN tb_petugas pg ON pn.row_id = pg.akun " +
    "LEFT JOIN tb_dosen dn ON pn.row_id = dn.akun " +
    "LEFT JOIN tb_kelas kl ON pn.row_id = kl.wali_kelas " +
    "LEFT JOIN tb_admin ta ON pn.row_id = ta.akun " +
    "LEFT JOIN tb_file tf ON pn.foto = tf.row_id " +
    "WHERE " +
    "((@keyword IS NULL) OR ((pn.nama_depan LIKE CONCAT(@keyword, '%')) OR (pn.nama_belakang LIKE CONCAT(@keyword, '%'))) OR " +
    "(pn.nama_depan LIKE CONCAT(@first_key, '%') AND pn.nama_belakang LIKE CONCAT(@last_key, '%')) OR " +
    "pn.nomor_id = @keyword) " +
    "AND " +
    "pn.row_id NOT IN (SELECT akun FROM tb_mahasiswa) " +
    "GROUP BY pn.row_id " +
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
  /* Prodi */
  createProdi,
  updateProdi,
  deleteProdi,
  listProdi,
  /* Jurusan */
  createJurusan,
  updateJurusan,
  deleteJurusan,
  listJurusan,
  /* Tahun */
  createTahun,
  updateTahun,
  deleteTahun,
  listTahun,
  /* Kelas */
  createKelas,
  updateKelas,
  deleteKelas,
  listKelas,
  /* Wali kelas */
  listWaliKelas,
};
