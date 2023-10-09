const express = require("express");
const router = express.Router();
/* Middleware */
const upload = require("../middlewares/upload");
const validate = require("../middlewares/joiValidations");
/* Joi */
const akademik = require("../utils/validation/akademik");
/* Controller */
const $akademik = require("../controller/akademik");
/* Router */
/* Prodi */
router.post(
  "/prodi/create",
  validate.body(akademik.createProdi),
  $akademik.createProdi
);
router.put(
  "/prodi/update",
  validate.body(akademik.updateProdi),
  $akademik.updateProdi
);
router.delete(
  "/prodi/delete",
  validate.body(akademik.deleteProdi),
  $akademik.deleteProdi
);
router.get(
  "/prodi/list",
  validate.query(akademik.listProdi),
  $akademik.listProdi
);
/* Jurusan */
router.post(
  "/jurusan/create",
  validate.body(akademik.createJurusan),
  $akademik.createJurusan
);
router.put(
  "/jurusan/update",
  validate.body(akademik.updateJurusan),
  $akademik.updateJurusan
);
router.delete(
  "/jurusan/delete",
  validate.body(akademik.deleteJurusan),
  $akademik.deleteJurusan
);
router.get(
  "/jurusan/list",
  validate.query(akademik.listJurusan),
  $akademik.listJurusan
);
/* Tahun */
router.post(
  "/tahun/create",
  validate.body(akademik.createTahun),
  $akademik.createTahun
);
router.put(
  "/tahun/update",
  validate.body(akademik.updateTahun),
  $akademik.updateTahun
);
router.delete(
  "/tahun/delete",
  validate.body(akademik.deleteTahun),
  $akademik.deleteTahun
);
router.get(
  "/tahun/list",
  validate.query(akademik.listTahun),
  $akademik.listTahun
);
/* Kelas */
router.post(
  "/kelas/create",
  validate.body(akademik.createKelas),
  $akademik.createKelas
);
router.put(
  "/kelas/update",
  validate.body(akademik.updateKelas),
  $akademik.updateKelas
);
router.delete(
  "/kelas/delete",
  validate.body(akademik.deleteKelas),
  $akademik.deleteKelas
);
router.get(
  "/kelas/list",
  validate.query(akademik.listKelas),
  $akademik.listKelas
);
/* Wali Kelas */
router.get(
  "/kelas/listwali",
  validate.query(akademik.listWaliKelas),
  $akademik.listWaliKelas
);
/* Module Export */
module.exports = router;
