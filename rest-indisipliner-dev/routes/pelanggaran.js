const express = require("express");
const router = express.Router();
/* Middleware */
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/joiValidations");
/* Joi */
const pelanggaran = require("../utils/validation/pelanggaran");
/* Controller */
const $pelanggaran = require("../controller/pelanggaran");
const $upload = require("../controller/upload");
/* Router */
/* Kategori */
router.post(
  "/kategori/create",
  validate.body(pelanggaran.createKategori),
  $pelanggaran.createKategori
);
router.put(
  "/kategori/update",
  validate.body(pelanggaran.updateKategori),
  $pelanggaran.updateKategori
);
router.delete(
  "/kategori/delete",
  validate.body(pelanggaran.deleteKategori),
  $pelanggaran.deleteKategori
);
router.get(
  "/kategori/list",
  validate.query(pelanggaran.listKategori),
  $pelanggaran.listKategori
);
/* Pelanggaran */
router.post(
  "/create",
  [validate.body(pelanggaran.createPelanggaran)],
  $pelanggaran.createPelanggaran
);
router.post("/upload", [upload.fotoPelanggaran], $upload.createFotoPelanggaran);
router.post(
  "/list",
  [validate.body(pelanggaran.listPelanggaran)],
  $pelanggaran.listPelanggaran
);
router.post(
  "/poinlist",
  [validate.body(pelanggaran.listLaporanPelanggaran)],
  $pelanggaran.listLaporanPelanggaran
);
router.post(
  "/poinbulan",
  [validate.body(pelanggaran.chartByBulan)],
  $pelanggaran.chartByBulan
);
router.post(
  "/poinkategori",
  [validate.body(pelanggaran.chartByKategori)],
  $pelanggaran.chartByKategori
);
/* Module Export */
module.exports = router;
