const _ = require("lodash");

/* utility module */
const pool = require("../utils/dbcon");
const parseResult = require("../utils/resultsetParser");

/* Service */
/* Kategori */
async function createKategori(data) {
  let query = "INSERT INTO tb_kategori_pelanggaran SET ?";
  let result = await pool.query(query, data);
  return parseResult(result);
}
async function updateKategori(data, id) {
  let query = "UPDATE tb_kategori_pelanggaran SET ? WHERE row_id = ?";
  let result = await pool.query(query, [data, id]);
  return parseResult(result);
}
async function deleteKategori(id) {
  let query = "DELETE FROM tb_kategori_pelanggaran WHERE row_id = ?";
  let result = await pool.query(query, id);
  return parseResult(result);
}
async function listKategori(page, count, keyword) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS * FROM tb_kategori_pelanggaran WHERE " +
    "(@keyword IS NULL OR kategori LIKE CONCAT(@keyword, '%')) " +
    "ORDER BY kategori, row_id LIMIT ?,?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}
/* Pelanggaran */
async function createPelanggaran(pelanggaran, detil) {
  let query = "SET TRANSACTION ISOLATION LEVEL READ COMMITTED";
  const conn = await pool.getConnection();
  await conn.query(query);
  await conn.beginTransaction();
  try {
    /* tb_pelanggaran */
    query = "INSERT INTO tb_pelanggaran SET ?";
    let $pelanggaran = await conn.query(query, pelanggaran);
    $pelanggaran = parseResult($pelanggaran, true);
    let $pelanggaranId = _.get($pelanggaran, "insertId");
    /* tb_detil_pelanggaran */
    const data = [];
    for (const item of detil) {
      _.assign(item, { pelanggaran: $pelanggaranId });
    }
    for (const item of detil) {
      data.push(_.values(item));
    }

    query =
      "INSERT INTO tb_detil_pelanggaran " +
      "(kategori, deskripsi, gambar, pelanggaran) VALUES ?";
    await conn.query(query, [data]);
    await conn.commit();
    return $pelanggaranId;
  } catch (ex) {
    console.log(ex);
    await conn.rollback();
    throw ex;
  } finally {
    conn.release();
  }
}
async function listPelanggaran(page, count, keyword, awal, akhir, kelas) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query = "SET @first_key = (SELECT SUBSTRING_INDEX(@keyword, ' ', 1))";
  await pool.query(query);
  query =
    "SET @last_key = (SELECT SUBSTRING(@keyword, LENGTH(@first_key) + 2))";
  await pool.query(query);
  query = "SET @awal = ?";
  await pool.query(query, [awal]);
  query = "SET @akhir = ?";
  await pool.query(query, [akhir]);
  query = "SET @kelas = ?";
  await pool.query(query, [kelas]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "pn.row_id AS user_id, pn.nomor_id, CONCAT(pn.nama_depan, ' ', pn.nama_belakang) AS mahasiswa, " +
    "kl.row_id AS kelas_id, kl.kelas, jr.jurusan, pr.prodi, kt.kategori, dp.deskripsi, " +
    "fl.nama_file AS gambar, DATE_FORMAT(pl.tanggal, '%d/%m/%Y' ) AS tanggal, " +
    "DATE_FORMAT(pl.tanggal, '%H:%i:%s') AS waktu, " +
    "(SELECT CONCAT(nama_depan, ' ', nama_belakang) FROM tb_pengguna WHERE row_id = pl.pelapor) " +
    "AS pelapor " +
    "FROM tb_detil_pelanggaran dp " +
    "INNER JOIN tb_pelanggaran pl ON pl.row_id = dp.pelanggaran " +
    "INNER JOIN tb_kategori_pelanggaran kt ON kt.row_id = dp.kategori " +
    "INNER JOIN tb_pengguna pn ON pn.row_id = pl.terlapor " +
    "INNER JOIN tb_mahasiswa mh ON pn.row_id = mh.akun " +
    "INNER JOIN tb_kelas kl ON kl.row_id = mh.kelas " +
    "INNER JOIN tb_jurusan jr ON jr.row_id = kl.jurusan " +
    "INNER JOIN tb_prodi pr ON pr.row_id = jr.prodi " +
    "INNER JOIN tb_file fl ON fl.row_id = dp.gambar " +
    "WHERE " +
    "((@keyword IS NULL) OR ((pn.nama_depan LIKE CONCAT(@keyword, '%')) OR (pn.nama_belakang LIKE CONCAT(@keyword, '%'))) OR " +
    "(pn.nama_depan LIKE CONCAT(@first_key, '%') AND pn.nama_belakang LIKE CONCAT(@last_key, '%')) OR " +
    "kt.kategori LIKE CONCAT(@keyword, '%') OR kl.kelas = @keyword OR pn.nomor_id = @keyword) " +
    "AND " +
    "(@awal IS NULL OR DATE(pl.tanggal) BETWEEN DATE(@awal) AND DATE(@akhir)) " +
    "AND " +
    "(@kelas IS NULL OR kl.row_id = @kelas) " +
    "ORDER BY pl.tanggal DESC, waktu DESC " +
    "LIMIT ?, ?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}
async function listLaporanPelanggaran(
  page,
  count,
  keyword,
  awal,
  akhir,
  kelas
) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query = "SET @first_key = (SELECT SUBSTRING_INDEX(@keyword, ' ', 1))";
  await pool.query(query);
  query =
    "SET @last_key = (SELECT SUBSTRING(@keyword, LENGTH(@first_key) + 2))";
  await pool.query(query);
  query = "SET @awal = ?";
  await pool.query(query, [awal]);
  query = "SET @akhir = ?";
  await pool.query(query, [akhir]);
  query = "SET @kelas = ?";
  await pool.query(query, [kelas]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "pn.row_id AS user_id, pn.nomor_id, CONCAT(pn.nama_depan, ' ', pn.nama_belakang) AS mahasiswa, " +
    "kl.row_id AS kelas_id, kl.kelas, jr.jurusan, pr.prodi, SUM(kt.poin) AS poin, " +
    "fl.nama_file AS gambar, DATE_FORMAT(pl.tanggal, '%d/%m/%Y' ) AS tanggal, " +
    "DATE_FORMAT(pl.tanggal, '%H:%i:%s') AS waktu, " +
    "(SELECT CONCAT(nama_depan, ' ', nama_belakang) FROM tb_pengguna WHERE row_id = pl.pelapor) " +
    "AS pelapor " +
    "FROM tb_detil_pelanggaran dp " +
    "INNER JOIN tb_pelanggaran pl ON pl.row_id = dp.pelanggaran " +
    "INNER JOIN tb_kategori_pelanggaran kt ON kt.row_id = dp.kategori " +
    "INNER JOIN tb_pengguna pn ON pn.row_id = pl.terlapor " +
    "INNER JOIN tb_mahasiswa mh ON pn.row_id = mh.akun " +
    "INNER JOIN tb_kelas kl ON kl.row_id = mh.kelas " +
    "INNER JOIN tb_jurusan jr ON jr.row_id = kl.jurusan " +
    "INNER JOIN tb_prodi pr ON pr.row_id = jr.prodi " +
    "INNER JOIN tb_file fl ON fl.row_id = dp.gambar " +
    "WHERE " +
    "((@keyword IS NULL) OR ((pn.nama_depan LIKE CONCAT(@keyword, '%')) OR (pn.nama_belakang LIKE CONCAT(@keyword, '%'))) OR " +
    "(pn.nama_depan LIKE CONCAT(@first_key, '%') AND pn.nama_belakang LIKE CONCAT(@last_key, '%')) OR " +
    "kt.kategori LIKE CONCAT(@keyword, '%') OR kl.kelas = @keyword OR pn.nomor_id = @keyword) " +
    "AND " +
    "(@awal IS NULL OR DATE(pl.tanggal) BETWEEN DATE(@awal) AND DATE(@akhir)) " +
    "AND " +
    "(@kelas IS NULL OR kl.row_id = @kelas) " +
    "GROUP BY pn.row_id " +
    "ORDER BY kl.kelas, mahasiswa " +
    "LIMIT ?, ?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}
async function chartByBulan(page, count, keyword, awal, akhir, kelas) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query = "SET @first_key = (SELECT SUBSTRING_INDEX(@keyword, ' ', 1))";
  await pool.query(query);
  query =
    "SET @last_key = (SELECT SUBSTRING(@keyword, LENGTH(@first_key) + 2))";
  await pool.query(query);
  query = "SET @awal = ?";
  await pool.query(query, [awal]);
  query = "SET @akhir = ?";
  await pool.query(query, [akhir]);
  query = "SET @kelas = ?";
  await pool.query(query, [kelas]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "SUM(kt.poin) AS poin, DATE_FORMAT(pl.tanggal, '%Y') AS tahun, " +
    "DATE_FORMAT(pl.tanggal, '%d/%m/%Y' ) AS tanggal, " +
    "DATE_FORMAT(pl.tanggal, '%H:%i:%s') AS waktu, MONTHNAME(pl.tanggal) AS bulan " +
    "FROM tb_detil_pelanggaran dp " +
    "INNER JOIN tb_pelanggaran pl ON pl.row_id = dp.pelanggaran " +
    "INNER JOIN tb_kategori_pelanggaran kt ON kt.row_id = dp.kategori " +
    "INNER JOIN tb_pengguna pn ON pn.row_id = pl.terlapor " +
    "INNER JOIN tb_mahasiswa mh ON pn.row_id = mh.akun " +
    "INNER JOIN tb_kelas kl ON kl.row_id = mh.kelas " +
    "INNER JOIN tb_jurusan jr ON jr.row_id = kl.jurusan " +
    "INNER JOIN tb_prodi pr ON pr.row_id = jr.prodi " +
    "INNER JOIN tb_file fl ON fl.row_id = dp.gambar " +
    "WHERE " +
    "((@keyword IS NULL) OR ((pn.nama_depan LIKE CONCAT(@keyword, '%')) OR (pn.nama_belakang LIKE CONCAT(@keyword, '%'))) OR " +
    "(pn.nama_depan LIKE CONCAT(@first_key, '%') AND pn.nama_belakang LIKE CONCAT(@last_key, '%')) OR " +
    "kt.kategori LIKE CONCAT(@keyword, '%') OR kl.kelas = @keyword OR pn.nomor_id = @keyword) " +
    "AND " +
    "(@awal IS NULL OR DATE(pl.tanggal) BETWEEN DATE(@awal) AND DATE(@akhir)) " +
    "AND " +
    "(@kelas IS NULL OR kl.row_id = @kelas) " +
    "GROUP BY bulan " +
    "ORDER BY pl.tanggal ASC, waktu ASC " +
    "LIMIT ?, ?";
  let result = await pool.query(query, [offset, count]);
  query = "SELECT FOUND_ROWS() AS total_row";
  let totalRow = await pool.query(query);
  return {
    list: parseResult(result),
    totalRow: _.get(parseResult(totalRow, true), "total_row"),
  };
}
async function chartByKategori(page, count, keyword, awal, akhir, kelas) {
  let offset = (page - 1) * count;
  let query = "SET @keyword = ?";
  await pool.query(query, [keyword]);
  query = "SET @first_key = (SELECT SUBSTRING_INDEX(@keyword, ' ', 1))";
  await pool.query(query);
  query =
    "SET @last_key = (SELECT SUBSTRING(@keyword, LENGTH(@first_key) + 2))";
  await pool.query(query);
  query = "SET @awal = ?";
  await pool.query(query, [awal]);
  query = "SET @akhir = ?";
  await pool.query(query, [akhir]);
  query = "SET @kelas = ?";
  await pool.query(query, [kelas]);
  query =
    "SELECT SQL_CALC_FOUND_ROWS " +
    "kt.kategori, SUM(kt.poin) AS poin, DATE_FORMAT(pl.tanggal, '%Y') AS tahun, " +
    "DATE_FORMAT(pl.tanggal, '%d/%m/%Y' ) AS tanggal, " +
    "DATE_FORMAT(pl.tanggal, '%H:%i:%s') AS waktu, MONTHNAME(pl.tanggal) AS bulan " +
    "FROM tb_detil_pelanggaran dp " +
    "INNER JOIN tb_pelanggaran pl ON pl.row_id = dp.pelanggaran " +
    "INNER JOIN tb_kategori_pelanggaran kt ON kt.row_id = dp.kategori " +
    "INNER JOIN tb_pengguna pn ON pn.row_id = pl.terlapor " +
    "INNER JOIN tb_mahasiswa mh ON pn.row_id = mh.akun " +
    "INNER JOIN tb_kelas kl ON kl.row_id = mh.kelas " +
    "INNER JOIN tb_jurusan jr ON jr.row_id = kl.jurusan " +
    "INNER JOIN tb_prodi pr ON pr.row_id = jr.prodi " +
    "INNER JOIN tb_file fl ON fl.row_id = dp.gambar " +
    "WHERE " +
    "((@keyword IS NULL) OR ((pn.nama_depan LIKE CONCAT(@keyword, '%')) OR (pn.nama_belakang LIKE CONCAT(@keyword, '%'))) OR " +
    "(pn.nama_depan LIKE CONCAT(@first_key, '%') AND pn.nama_belakang LIKE CONCAT(@last_key, '%')) OR " +
    "kt.kategori LIKE CONCAT(@keyword, '%') OR kl.kelas = @keyword OR pn.nomor_id = @keyword) " +
    "AND " +
    "(@awal IS NULL OR DATE(pl.tanggal) BETWEEN DATE(@awal) AND DATE(@akhir)) " +
    "AND " +
    "(@kelas IS NULL OR kl.row_id = @kelas) " +
    "GROUP BY kt.kategori " +
    "ORDER BY pl.tanggal DESC, waktu DESC " +
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
  /* Kategori */
  createKategori,
  updateKategori,
  deleteKategori,
  listKategori,
  /* Pelanggaran */
  createPelanggaran,
  listPelanggaran,
  listLaporanPelanggaran,
  chartByBulan,
  chartByKategori,
};
