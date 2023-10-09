const fs = require("fs");
const path = require("path");
/* 3rd party */
const multer = require("multer");
/* utils */
const ApiError = require("../utils/errors");

require("dotenv").config();

/* Storage */
/* set upload destination */
const uploadDir = path.join(__dirname, "..", "upload", "image");
/* storage function */
function imageStorage(dest) {
  dest = path.join(uploadDir, dest);
  const pathExist = fs.existsSync(dest);
  /* create directory if path not exists */
  if (!pathExist) fs.mkdirSync(dest, { recursive: true });
  /* return multer disk storage */
  return multer.diskStorage({
    destination: function (_req, _res, cb) {
      cb(null, dest);
    },
    filename: function (_req, file, cb) {
      let filename = Math.ceil(Math.random() * 100) + Date.now();
      filename = filename
        .toString()
        .concat(path.extname(file.originalname).toLowerCase());
      cb(null, filename);
    },
  });
}
/* image filter function */
function imageFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new ApiError(400, "Only image files are allowed!"), false);
  }
  cb(null, true);
}
/* Upload middleware */
const imageSizeLimit = 5 * 1024 * 1024;
const fotoPetugas = multer({
  storage: imageStorage("petugas"),
  fileFilter: imageFilter,
  limits: { fileSize: imageSizeLimit },
}).single("foto");
const fotoDosen = multer({
  storage: imageStorage("dosen"),
  fileFilter: imageFilter,
  limits: { fileSize: imageSizeLimit },
}).single("foto");
const fotoMahasiswa = multer({
  storage: imageStorage("mahasiswa"),
  fileFilter: imageFilter,
  limits: { fileSize: imageSizeLimit },
}).single("foto");
const fotoPelanggaran = multer({
  storage: imageStorage("pelanggaran"),
  fileFilter: imageFilter,
  limits: { fileSize: imageSizeLimit },
}).single("foto");

/* Module Export */
module.exports = {
  fotoPetugas,
  fotoDosen,
  fotoMahasiswa,
  fotoPelanggaran,
};
