const fs = require("fs");
const path = require("path");
const _ = require("lodash");

/* utility module */
const ApiError = require("../utils/errors");
const send = require("../utils/responseHandler");
const helper = require("../utils/helper");
const password = require("../utils/passwordEncrypt");
const parseResult = require("../utils/resultsetParser");

/* Schema */
const scPetugas = require("../utils/schema/petugas");

/* Services */
const $auth = require("../services/auth");
const $petugas = require("../services/petugas");
const $upload = require("../services/upload");
const $pengguna = require("../services/pengguna");

/* Controllers */
/* Pelanggaran */
async function createFotoPelanggaran(req, res, next) {
  let message = "tidak ditemukan";
  try {
    const foto = req.file;
    if (!foto) throw new ApiError(404, message);
    const fotoId = await $upload.save(foto.filename, foto.mimetype);
    send.data(res, 200, {
      filename: foto.filename,
      id: _.get(fotoId, "insertId"),
    });
  } catch (ex) {
    next(ex);
  }
}
/* File */
async function sendImg(req, res, next) {
  const reqPath = req.params.path;
  const reqFile = req.params.filename;
  const filePath = path.join(
    __dirname,
    "..",
    "upload",
    "image",
    reqPath,
    reqFile
  );
  fs.access(filePath, (err) => {
    if (err) {
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        "placeholder-image.png"
      );
      return send.file(res, 200, filePath);
    }
    return send.file(res, 200, filePath);
  });
}

/* module export */
module.exports = { createFotoPelanggaran, sendImg };
