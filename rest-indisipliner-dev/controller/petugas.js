const _ = require("lodash");

/* utility module */
const ApiError = require("../utils/errors");
const send = require("../utils/responseHandler");
const helper = require("../utils/helper");
const password = require("../utils/passwordEncrypt");

/* Schema */
const scPetugas = require("../utils/schema/petugas");

/* Services */
const $auth = require("../services/auth");
const $petugas = require("../services/petugas");
const $upload = require("../services/upload");
const $pengguna = require("../services/pengguna");

/* Controllers */
/* Jabatan */
async function createJabatan(req, res, next) {
  let jabatan = _.pick(req.body, "jabatan");
  let message = "sukses";
  try {
    const result = await $petugas.createJabatan(jabatan);
    if (result.affectedRows == 0) {
      message = "gagal";
      throw new ApiError(400, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateJabatan(req, res, next) {
  let jabatan = _.pick(req.body, "jabatan");
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $petugas.updateJabatan(jabatan, id);
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
async function deleteJabatan(req, res, next) {
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $petugas.deleteJabatan(id);
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
async function listJabatan(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $petugas.listJabatan(page, count, keyword);
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
/* Bidang */
async function createBidang(req, res, next) {
  let bidang = _.pick(req.body, "bidang");
  let message = "sukses";
  try {
    const result = await $petugas.createBidang(bidang);
    if (!result) {
      message = "gagal";
      throw new ApiError(400, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateBidang(req, res, next) {
  let bidang = _.pick(req.body, "bidang");
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $petugas.updateBidang(bidang, id);
    console.log(result);
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
async function deleteBidang(req, res, next) {
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $petugas.deleteBidang(id);
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
async function listBidang(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $petugas.listBidang(page, count, keyword);
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
/* Petugas */
async function createPetugas(req, res, next) {
  let message = "sukses";
  console.log(req.body);
  let data = _.assign({}, scPetugas.base);
  data = _.assign(data, req.body);
  let user = _.pick(data, _.keys(scPetugas.user));
  user.tgl_lahir = helper.mySqlDate(user.tgl_lahir);
  let petugas = _.pick(data, _.keys(scPetugas.petugas));
  let isAdmin = _.get(data, "status_admin") === "true" ? true : false;
  const foto = req.file;
  try {
    let sandi = await password.encrypt(data.kata_sandi);
    if (foto) {
      const result = await $upload.save(foto.filename, foto.mimetype);
      user.foto = result.insertId;
    }
    const result = await $petugas.createPetugas(user, petugas, sandi, isAdmin);
    if (!result) {
      message = "gagal";
      throw new ApiError(500, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateBioPetugas(req, res, next) {
  let message = "sukses";
  let data = _.assign({}, scPetugas.base);
  data = _.assign(data, req.body);
  let user = _.pick(data, _.keys(scPetugas.user));
  user.nomor_id = null;
  user = _.pickBy(user, _.identity);
  user.tgl_lahir = helper.mySqlDate(user.tgl_lahir);
  let akun = _.get(req.body, "akun");
  const foto = req.file;
  try {
    const role = await $auth.roleCheck(akun);
    if (role.status_pengguna !== "P") {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    if (foto) {
      const result = await $upload.save(foto.filename, foto.mimetype);
      user.foto = result.insertId;
    }
    const result = await $pengguna.updateBio(user, akun);
    if (!result.affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateStatusPetugas(req, res, next) {
  let message = "sukses";
  let data = _.pick(req.body, ["jabatan", "bidang"]);
  let akun = _.get(req.body, "akun");
  try {
    const role = await $auth.roleCheck(akun);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_pengguna !== "P") {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    const result = await $petugas.updateStatusPetugas(data, akun);
    if (!result.affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function deletePetugas(req, res, next) {
  let message = "sukses";
  let akun = _.get(req.body, "akun");
  try {
    const role = await $auth.roleCheck(akun);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_pengguna !== "P") {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_admin) {
      message = "tidak dapat menghapus admin";
      throw new ApiError(403, message);
    } else if (role.status_pembimbing) {
      message = "tidak dapat menghapus pembimbing";
      throw new ApiError(403, message);
    }
    const result = await $petugas.deletePetugas(akun);
    if (!result.affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function listPetugas(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $petugas.listPetugas(page, count, keyword);
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
  updateBioPetugas,
  updateStatusPetugas,
  deletePetugas,
  listPetugas,
};
