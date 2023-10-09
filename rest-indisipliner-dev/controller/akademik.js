const _ = require("lodash");

/* utility module */
const ApiError = require("../utils/errors");
const send = require("../utils/responseHandler");
const helper = require("../utils/helper");

/* Schema */
/* Null */

/* Services */
const $auth = require("../services/auth");
const $akademik = require("../services/akademik");

/* Controllers */
/* Prodi */
async function createProdi(req, res, next) {
  let prodi = _.pick(req.body, "prodi");
  let message = "sukses";
  try {
    const result = await $akademik.createProdi(prodi);
    if (result.affectedRows == 0) {
      message = "gagal";
      throw new ApiError(400, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateProdi(req, res, next) {
  let prodi = _.pick(req.body, "prodi");
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $akademik.updateProdi(prodi, id);
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
async function deleteProdi(req, res, next) {
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $akademik.deleteProdi(id);
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
async function listProdi(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $akademik.listProdi(page, count, keyword);
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
/* Jurusan */
async function createJurusan(req, res, next) {
  let jurusan = _.pick(req.body, ["jurusan", "prodi"]);
  let message = "sukses";
  try {
    const result = await $akademik.createJurusan(jurusan);
    if (result.affectedRows == 0) {
      message = "gagal";
      throw new ApiError(400, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateJurusan(req, res, next) {
  let jurusan = _.pick(req.body, ["jurusan", "prodi"]);
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $akademik.updateJurusan(jurusan, id);
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
async function deleteJurusan(req, res, next) {
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $akademik.deleteJurusan(id);
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
async function listJurusan(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $akademik.listJurusan(page, count, keyword);
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
/* Tahun */
async function createTahun(req, res, next) {
  let tahun = _.pick(req.body, ["tahun_mulai", "tahun_selesai"]);
  tahun.tahun_mulai = helper.mySqlDate(tahun.tahun_mulai);
  tahun.tahun_selesai = helper.mySqlDate(tahun.tahun_selesai);
  let message = "sukses";
  try {
    const result = await $akademik.createTahun(tahun);
    if (result.affectedRows == 0) {
      message = "gagal";
      throw new ApiError(400, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateTahun(req, res, next) {
  let tahun = _.pick(req.body, ["tahun_mulai", "tahun_selesai"]);
  tahun.tahun_mulai = helper.mySqlDate(tahun.tahun_mulai);
  tahun.tahun_selesai = helper.mySqlDate(tahun.tahun_selesai);
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $akademik.updateTahun(tahun, id);
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
async function deleteTahun(req, res, next) {
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $akademik.deleteTahun(id);
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
async function listTahun(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, mulai, selesai } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  mulai = _.escape(mulai) || null;
  selesai = _.escape(selesai) || null;
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $akademik.listTahun(page, count, mulai, selesai);
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
/* Kelas */
async function createKelas(req, res, next) {
  let kelas = _.pick(req.body, [
    "kelas",
    "wali_kelas",
    "jurusan",
    "tahun_ajaran",
  ]);
  let message = "sukses";
  try {
    const role = await $auth.roleCheck(kelas.wali_kelas);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (!role.status_akun) {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_pengguna == "M") {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_pengguna == "U") {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    const result = await $akademik.createKelas(kelas);
    if (result.affectedRows == 0) {
      message = "gagal";
      throw new ApiError(400, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateKelas(req, res, next) {
  let kelas = _.pick(req.body, [
    "kelas",
    "wali_kelas",
    "jurusan",
    "tahun_ajaran",
  ]);
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const role = await $auth.roleCheck(kelas.wali_kelas);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (!role.status_akun) {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_pengguna == "M") {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_pengguna == "U") {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    const result = await $akademik.updateKelas(kelas, id);
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
async function deleteKelas(req, res, next) {
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $akademik.deleteKelas(id);
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
async function listKelas(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $akademik.listKelas(page, count, keyword);
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
/* Wali Kelas */
async function listWaliKelas(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $akademik.listWaliKelas(page, count, keyword);
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
  /* Tahun Ajaran */
  createTahun,
  updateTahun,
  deleteTahun,
  listTahun,
  /* Kelas */
  createKelas,
  updateKelas,
  deleteKelas,
  listKelas,
  /* Wali Kelas */
  listWaliKelas,
};
