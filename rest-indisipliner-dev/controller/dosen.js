const _ = require("lodash");

/* utility module */
const ApiError = require("../utils/errors");
const send = require("../utils/responseHandler");
const helper = require("../utils/helper");
const password = require("../utils/passwordEncrypt");

/* Schema */
const scDosen = require("../utils/schema/dosen");

/* Services */
const $auth = require("../services/auth");
const $dosen = require("../services/dosen");
const $upload = require("../services/upload");
const $pengguna = require("../services/pengguna");

/* Controllers */
/* Dosen */
async function createDosen(req, res, next) {
  let message = "sukses";
  console.log(req.body);
  let data = _.assign({}, scDosen.base);
  data = _.assign(data, req.body);
  let user = _.pick(data, _.keys(scDosen.user));
  user.tgl_lahir = helper.mySqlDate(user.tgl_lahir);
  const foto = req.file;
  try {
    let sandi = await password.encrypt(data.kata_sandi);
    if (foto) {
      const result = await $upload.save(foto.filename, foto.mimetype);
      user.foto = result.insertId;
    }
    const result = await $dosen.createDosen(user, sandi);
    if (!result) {
      message = "gagal";
      throw new ApiError(500, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateBioDosen(req, res, next) {
  let message = "sukses";
  let data = _.assign({}, scDosen.base);
  data = _.assign(data, req.body);
  let user = _.pick(data, _.keys(scDosen.user));
  user.nomor_id = null;
  user = _.pickBy(user, _.identity);
  user.tgl_lahir = helper.mySqlDate(user.tgl_lahir);
  let akun = _.get(req.body, "akun");
  const foto = req.file;
  try {
    const role = await $auth.roleCheck(akun);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_admin) {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_pengguna !== "D") {
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
async function deleteDosen(req, res, next) {
  let message = "sukses";
  let akun = _.get(req.body, "akun");
  try {
    const role = await $auth.roleCheck(akun);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_pengguna !== "D") {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_admin) {
      message = "tidak dapat menghapus admin";
      throw new ApiError(403, message);
    } else if (role.status_pembimbing) {
      message = "tidak dapat menghapus pembimbing";
      throw new ApiError(403, message);
    }
    const result = await $dosen.deleteDosen(akun);
    if (!result.affectedRows) {
      message = "gagal";
      throw new ApiError(500, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function listDosen(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $dosen.listDosen(page, count, keyword);
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
  /* Dosen */
  createDosen,
  updateBioDosen,
  deleteDosen,
  listDosen,
};
