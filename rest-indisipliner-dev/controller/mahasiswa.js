const _ = require("lodash");

/* utility module */
const ApiError = require("../utils/errors");
const send = require("../utils/responseHandler");
const helper = require("../utils/helper");
const password = require("../utils/passwordEncrypt");

/* Schema */
const scMahasiswa = require("../utils/schema/mahasiswa");

/* Services */
const $auth = require("../services/auth");
const $mahasiswa = require("../services/mahasiswa");
const $upload = require("../services/upload");
const $pengguna = require("../services/pengguna");

/* Controllers */
/* Mahasiswa */
async function createMahasiswa(req, res, next) {
  let message = "sukses";
  console.log(req.body);
  let data = _.assign({}, scMahasiswa.base);
  data = _.assign(data, req.body);
  let user = _.pick(data, _.keys(scMahasiswa.user));
  user.tgl_lahir = helper.mySqlDate(user.tgl_lahir);
  let mahasiswa = _.pick(data, _.keys(scMahasiswa.mahasiswa));
  const foto = req.file;
  try {
    let sandi = await password.encrypt(data.kata_sandi);
    if (foto) {
      const result = await $upload.save(foto.filename, foto.mimetype);
      user.foto = result.insertId;
    }
    const result = await $mahasiswa.createMahasiswa(user, mahasiswa, sandi);
    if (!result) {
      message = "gagal";
      throw new ApiError(500, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateBioMahasiswa(req, res, next) {
  let message = "sukses";
  let data = _.assign({}, scMahasiswa.base);
  data = _.assign(data, req.body);
  let user = _.pick(data, _.keys(scMahasiswa.user));
  user.nomor_id = null;
  user = _.pickBy(user, _.identity);
  user.tgl_lahir = helper.mySqlDate(user.tgl_lahir);
  let akun = _.get(req.body, "akun");
  const foto = req.file;
  try {
    const role = await $auth.roleCheck(akun);
    if (role.status_pengguna !== "M") {
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
async function updateStatusMahasiswa(req, res, next) {
  let message = "sukses";
  let data = _.pick(req.body, ["kelas"]);
  let akun = _.get(req.body, "akun");
  try {
    const role = await $auth.roleCheck(akun);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_admin) {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_pengguna !== "M") {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    const result = await $mahasiswa.updateStatusMahasiswa(data, akun);
    if (!result.affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function deleteMahasiswa(req, res, next) {
  let message = "sukses";
  let akun = _.get(req.body, "akun");
  try {
    const role = await $auth.roleCheck(akun);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_admin) {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_pengguna !== "M") {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    const result = await $mahasiswa.deleteMahasiswa(akun);
    if (!result.affectedRows) {
      message = "gagal";
      throw new ApiError(500, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function listMahasiswa(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword, kelas } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  kelas = parseInt(kelas, 10) || null;

  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $mahasiswa.listMahasiswa(page, count, keyword, kelas);
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}
/* Orangtua */
async function createOrangtua(req, res, next) {
  let orangtua = _.pick(req.body, [
    "mahasiswa",
    "nama",
    "jenis_kelamin",
    "nomor_seluler",
  ]);
  let mahasiswaId = _.get(req.body, "mahasiswa");
  let message = "sukses";
  try {
    const akun = await $mahasiswa.getUserId(mahasiswaId);
    const role = await $auth.roleCheck(akun.row_id);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_admin) {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_pengguna !== "M") {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    const result = await $mahasiswa.createOrangtua(orangtua);
    if (result.affectedRows == 0) {
      message = "gagal";
      throw new ApiError(400, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateOrangtua(req, res, next) {
  let orangtua = _.pick(req.body, [
    "mahasiswa",
    "nama",
    "jenis_kelamin",
    "nomor_seluler",
  ]);
  let mahasiswaId = _.get(req.body, "mahasiswa");
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const akun = await $mahasiswa.getUserId(mahasiswaId);
    const role = await $auth.roleCheck(akun.row_id);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_admin) {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_pengguna !== "M") {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    const result = await $mahasiswa.updateOrangtua(orangtua, id);
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
async function deleteOrangtua(req, res, next) {
  let id = _.get(req.body, "row_id");
  let message = "sukses";
  try {
    const result = await $mahasiswa.deleteOrangtua(id);
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
async function listOrangtua(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword, mahasiswa } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  mahasiswa = _.escape(mahasiswa) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $mahasiswa.listOrangtua(page, count, keyword, mahasiswa);
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
  /* Mahasiswa */
  createMahasiswa,
  updateBioMahasiswa,
  updateStatusMahasiswa,
  deleteMahasiswa,
  listMahasiswa,
  /* Orangtua */
  createOrangtua,
  updateOrangtua,
  deleteOrangtua,
  listOrangtua,
};
