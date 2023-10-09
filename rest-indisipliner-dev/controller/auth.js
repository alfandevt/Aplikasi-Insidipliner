const _ = require("lodash");

/* Utility Module */
const ApiError = require("../utils/errors");
const helper = require("../utils/helper");
const generateToken = require("../utils/token");
const password = require("../utils/passwordEncrypt");
const send = require("../utils/responseHandler");

/* Service */
const $auth = require("../services/auth");

/* Controllers */
/* auth */
async function login(req, res, next) {
  let message = "user tidak ditemukan";
  let akun = _.get(req.body, "nomor_id");
  let sandi = _.get(req.body, "kata_sandi");
  try {
    const $user = await $auth.login(akun);
    if (!$user) throw new ApiError(404, message);
    message = "akun tidak aktif";
    if (!$user.kata_sandi) throw new ApiError(404, message);
    /* compare password */
    const $passwordValid = await password.compare(sandi, $user.kata_sandi);
    message = "ID atau kata sandi tidak cocok";
    if (!$passwordValid) throw new ApiError(401, message);
    const jwt = generateToken(
      $user.nomor_id,
      $user.status_admin,
      $user.status_pengguna
    );
    const jwtRefresh = generateToken(
      $user.nomor_id,
      $user.status_admin,
      $user.status_pengguna,
      true
    );
    const user = {
      rowId: $user.row_id,
      nomorId: $user.nomor_id,
      namaDepan: $user.nama_depan,
      namaBelakang: $user.nama_belakang,
      foto: $user.foto,
      admin: $user.status_admin,
      userType: $user.status_pengguna,
      waliKelas: $user.wali_kelas,
      expiresIn: jwt.expiresIn,
    };
    const cusHeader = {
      "X-Auth-Token": jwt.token,
      "X-Auth-Refresh": jwtRefresh.token,
    };
    send.dataWithHeader(res, 200, { user }, cusHeader);
  } catch (ex) {
    next(ex);
  }
}
async function createSandi(req, res, next) {
  let message = "sukses";
  let akun = _.pick(req.body, ["akun", "kata_sandi"]);
  let akunId = _.get(req.body, "akun");
  try {
    const role = await $auth.roleCheck(akunId);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_akun) {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    akun.kata_sandi = await password.encrypt(akun.kata_sandi);
    const result = await $auth.createSandi(akun);
    if (!result.affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function updateSandi(req, res, next) {
  let message = "sukses";
  let akun = _.pick(req.body, ["kata_sandi_lama", "kata_sandi_baru"]);
  let akunId = _.get(req.body, "akun");
  let nomorId = _.get(req.body, "nomor_id");
  try {
    const role = await $auth.roleCheck(akunId);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (!role.status_akun) {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    /* Password Re-Validation */
    const $user = await $auth.login(nomorId);
    console.log($user);
    const $passwordValid = await password.compare(
      akun.kata_sandi_lama,
      $user.kata_sandi
    );
    message = "ID atau kata sandi tidak cocok";
    if (!$passwordValid) throw new ApiError(401, message);
    /* Process */
    akun.kata_sandi_baru = await password.encrypt(akun.kata_sandi_baru);
    const data = { kata_sandi: akun.kata_sandi_baru };
    const result = await $auth.updateSandi(data, akunId);
    if (!result.affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    message = "sukses";
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function resetSandi(req, res, next) {
  let message = "sukses";
  let akun = {};
  let akunId = _.get(req.body, "akun");
  try {
    const role = await $auth.roleCheck(akunId);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (!role.status_akun) {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    akun.kata_sandi = await password.encrypt(role.nomor_id);
    const result = await $auth.updateSandi(akun, akunId);
    if (!result.affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function deleteSandi(req, res, next) {
  let message = "sukses";
  let akunId = _.get(req.body, "akun");
  try {
    const role = await $auth.roleCheck(akunId);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (!role.status_akun) {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    const result = await $auth.deleteSandi(akunId);
    if (!result.affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
/* admin */
async function createAdmin(req, res, next) {
  let message = "sukses";
  let akun = _.pick(req.body, "akun");
  let akunId = _.get(req.body, "akun");
  try {
    const role = await $auth.roleCheck(akunId);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_admin) {
      message = "forbidden";
      throw new ApiError(403, message);
    } else if (role.status_pengguna !== "P") {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    const result = await $auth.createAdmin(akun);
    if (!result.affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function deleteAdmin(req, res, next) {
  let message = "sukses";
  let akun = _.pick(req.body, "akun");
  let akunId = _.get(req.body, "akun");
  try {
    const role = await $auth.roleCheck(akunId);
    if (role === 0) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    } else if (role.status_pengguna !== "P") {
      message = "forbidden";
      throw new ApiError(403, message);
    }
    const result = await $auth.deleteAdmin(akunId);
    if (!result.affectedRows) {
      message = "tidak ditemukan";
      throw new ApiError(404, message);
    }
    send.message(res, 200, message);
  } catch (ex) {
    next(ex);
  }
}
async function listAdmin(req, res, next) {
  let message = "permintaan tidak valid";
  let { page, count, keyword } = req.query;
  page = parseInt(page, 10);
  count = parseInt(count, 10);
  keyword = _.escape(keyword) || "";
  try {
    if (page <= 0) throw new ApiError(400, message);
    else if (count <= 0) throw new ApiError(400, message);
    let result = await $auth.listAdmin(page, count, keyword);
    message = "tidak ditemukan";
    if (result.list <= 0) throw new ApiError(404, message);
    result = helper.pager(result.list, page, count, result.totalRow);
    send.data(res, 200, result);
  } catch (ex) {
    next(ex);
  }
}

/* Module Export */
module.exports = {
  /* auth */
  login,
  createSandi,
  resetSandi,
  updateSandi,
  deleteSandi,
  /* admin */
  createAdmin,
  deleteAdmin,
  listAdmin,
};
