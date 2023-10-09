const _ = require("lodash");

/* utility module */
const ApiError = require("../utils/errors");
const send = require("../utils/responseHandler");
const helper = require("../utils/helper");

/* Schema */
const scPelanggaran = require("../utils/schema/petugas");

/* Services */
const $auth = require("../services/auth");
const $pelanggaran = require("../services/pelanggaran");
const $upload = require("../services/upload");
const $pengguna = require("../services/pengguna");

/* Controllers */
/* Kategori */
async function createKategori(req, res, next) {
  let kategori = _.pick(req.body, ["kategori", "poin"]);
  let message = "sukses";
  try {
    const result = await $pelanggaran.createKategori(kategori);
    if (result.affectedRows == 0) {
      message = "gagal";
      throw new ApiError(400, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateKategori(req, res, next) {
  let kategori = _.pick(req.body, ["kategori", "poin"]);
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $pelanggaran.updateKategori(kategori, id);
    const affectedRows = _.get(result, "affectedRows");
    if (!affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function deleteKategori(req, res, next) {
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $pelanggaran.deleteKategori(id);
    const affectedRows = _.get(result, "affectedRows");
    if (!affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function listKategori(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $pelanggaran.listKategori(page, count, keyword);
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
/* Pelanggaran */
async function createPelanggaran(req, res, next) {
  let message = "sukses";
  console.log(req.body);
  const pelanggaran = _.pick(req.body, ["pelapor", "terlapor"]);
  const detil = _.get(req.body, "detail");
  console.log(pelanggaran);
  console.log(detil);
  try {
    const result = await $pelanggaran.createPelanggaran(pelanggaran, detil);
    if (!result) {
      message = "gagal";
      throw new ApiError(500, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function listPelanggaran(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword, tanggal_awal, tanggal_akhir, kelas } = req.body;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  tanggal_awal = tanggal_awal || null;
  tanggal_akhir = tanggal_akhir || null;
  kelas = parseInt(kelas, 10) || null;
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    if (tanggal_awal) {
      if (!tanggal_akhir) throw new ApiError();
      tanggal_awal = helper.mySqlDate(tanggal_awal);
      tanggal_akhir = helper.mySqlDate(tanggal_akhir);
    }
    let result = await $pelanggaran.listPelanggaran(
      page,
      count,
      keyword,
      tanggal_awal,
      tanggal_akhir,
      kelas
    );
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
async function listLaporanPelanggaran(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword, tanggal_awal, tanggal_akhir, kelas } = req.body;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  tanggal_awal = tanggal_awal || null;
  tanggal_akhir = tanggal_akhir || null;
  kelas = parseInt(kelas, 10) || null;
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    if (tanggal_awal) {
      if (!tanggal_akhir) throw new ApiError();
      tanggal_awal = helper.mySqlDate(tanggal_awal);
      tanggal_akhir = helper.mySqlDate(tanggal_akhir);
    }
    let result = await $pelanggaran.listLaporanPelanggaran(
      page,
      count,
      keyword,
      tanggal_awal,
      tanggal_akhir,
      kelas
    );
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
async function chartByBulan(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword, tanggal_awal, tanggal_akhir, kelas } = req.body;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  tanggal_awal = tanggal_awal || null;
  tanggal_akhir = tanggal_akhir || null;
  kelas = parseInt(kelas, 10) || null;
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    if (tanggal_awal) {
      if (!tanggal_akhir) throw new ApiError();
      tanggal_awal = helper.mySqlDate(tanggal_awal);
      tanggal_akhir = helper.mySqlDate(tanggal_akhir);
    }
    let result = await $pelanggaran.chartByBulan(
      page,
      count,
      keyword,
      tanggal_awal,
      tanggal_akhir,
      kelas
    );
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
async function chartByKategori(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword, tanggal_awal, tanggal_akhir, kelas } = req.body;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  tanggal_awal = tanggal_awal || null;
  tanggal_akhir = tanggal_akhir || null;
  kelas = parseInt(kelas, 10) || null;
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    if (tanggal_awal) {
      if (!tanggal_akhir) throw new ApiError();
      tanggal_awal = helper.mySqlDate(tanggal_awal);
      tanggal_akhir = helper.mySqlDate(tanggal_akhir);
    }
    let result = await $pelanggaran.chartByKategori(
      page,
      count,
      keyword,
      tanggal_awal,
      tanggal_akhir,
      kelas
    );
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
/* module export */
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
