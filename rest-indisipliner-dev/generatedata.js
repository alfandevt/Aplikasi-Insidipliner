const mysql = require("mysql2/promise");
const bluenird = require("bluebird");
const bcrypt = require("bcrypt");
const faker = require("faker/locale/id_ID");
const mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "tanpanama",
  database: "db_indisipliner",
  Promise: bluenird,
};
const pool = require("./utils/dbcon");
const par = require("./utils/resultsetParser");

async function listJabatan(page, count, keyword) {
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
  await pool.end();
  console.log(par(result));
  console.log("=======================================")
  console.log(par(totalRow, true));
}

listJabatan(1, 3, "");

// async function select() {
//   try {
//     let query = "SELECT * FROM tb_bidang";
//     let result = await pool.query(query);

//     console.log(par(result, true));
//   } catch (ex) {
//     console.log(ex);
//   } finally {
//     await pool.end();
//   }
// }

// async function select() {
//   try {
//     let query = "DELETE FROM tb_bidang WHERE row_id = ?";
//     let result = await pool.query(query, [7]);

//     console.log(par(result));
//   } catch (ex) {
//     console.log(ex);
//   } finally {
//     await pool.end();
//   }
// }

// async function select() {
//   try {
//     let query = "INSERT INTO tb_bidang (bidang) VALUES (?)";
//     let result = await pool.query(query, ["marketing"]);

//     console.log(par(result));
//   } catch (ex) {
//     console.log(ex);
//   } finally {
//     await pool.end();
//   }
// }

// async function select() {
//   try {
//     let query = "UPDATE tb_bidang SET bidang = ? WHERE row_id = ?";
//     let result = await pool.query(query, ["marketingz", 7]);

//     console.log(par(result));
//   } catch (ex) {
//     console.log(ex);
//   } finally {
//     await pool.end();
//   }
// }

// select();

async function insertBidang() {
  const data = [["akademik"], ["keuangan"], ["informasi"]];
  const connect = await mysql.createConnection(mysqlConfig);
  try {
    const res = await connect.query(
      "INSERT INTO `tb_bidang` (`bidang`) VALUES ?",
      [data]
    );
    console.log(res);
  } catch (ex) {
    console.log(ex);
  } finally {
    await connect.end();
  }
}

async function insertJabatan() {
  const data = [["kabid"], ["staff"]];
  const connect = await mysql.createConnection(mysqlConfig);
  try {
    const res = await connect.query(
      "INSERT INTO `tb_jabatan` (`jabatan`) VALUES ?",
      [data]
    );
    console.log(res);
  } catch (ex) {
    console.log(ex);
  } finally {
    await connect.end();
  }
}

async function insertJabatan() {
  const data = [["kabid"], ["staff"]];
  const connect = await mysql.createConnection(mysqlConfig);
  try {
    const res = await connect.query(
      "INSERT INTO `tb_jabatan` (`jabatan`) VALUES ?",
      [data]
    );
    console.log(res);
  } catch (ex) {
    console.log(ex);
  } finally {
    await connect.end();
  }
}

async function insertTahun() {
  const data = [
    ["2017-01-01 00:00:00", "2020-01-01 00:00:00"],
    ["2018-01-01 00:00:00", "2021-01-01 00:00:00"],
    ["2019-01-01 00:00:00", "2022-01-01 00:00:00"],
  ];
  const connect = await mysql.createConnection(mysqlConfig);
  try {
    const res = await connect.query(
      "INSERT INTO `tb_tahun_ajaran` (`tahun_mulai`, `tahun_selesai`) VALUES ?",
      [data]
    );
    console.log(res);
  } catch (ex) {
    console.log(ex);
  } finally {
    await connect.end();
  }
}

async function insertProdi() {
  const data = [
    ["manajemen informatika"],
    ["humas"],
    ["administrasi perkantoran"],
    ["komputerisasi akuntansi"],
  ];
  const connect = await mysql.createConnection(mysqlConfig);
  try {
    const res = await connect.query(
      "INSERT INTO `tb_prodi` (`prodi`) VALUES ?",
      [data]
    );
    console.log(res);
  } catch (ex) {
    console.log(ex);
  } finally {
    await connect.end();
  }
}

async function insertJurusan() {
  const data = [
    ["informatika komputer", 1],
    ["multimedia komunikasi dan visual", 2],
    ["administrasi perkantoran", 3],
    ["komputerisasi akuntansi", 4],
  ];
  const connect = await mysql.createConnection(mysqlConfig);
  try {
    const res = await connect.query(
      "INSERT INTO `tb_jurusan` (`jurusan`, `prodi`) VALUES ?",
      [data]
    );
    console.log(res);
  } catch (ex) {
    console.log(ex);
  } finally {
    await connect.end();
  }
}

async function password(params) {
  const password = await bcrypt.hash(params, 10);
  console.log(password);
  return password;
}
