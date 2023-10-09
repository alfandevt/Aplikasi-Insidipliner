const express = require("express");
const router = express.Router();
/* Middleware */
const upload = require("../middlewares/upload");
const validate = require("../middlewares/joiValidations");
/* Joi */
const petugas = require("../utils/validation/petugas");
/* Controller */
const $petugas = require("../controller/petugas");
/* Router */
/* Jabatan */
router.post(
  "/jabatan/create",
  validate.body(petugas.createJabatan),
  $petugas.createJabatan
);
router.put(
  "/jabatan/update",
  validate.body(petugas.updateJabatan),
  $petugas.updateJabatan
);
router.delete(
  "/jabatan/delete",
  validate.body(petugas.deleteJabatan),
  $petugas.deleteJabatan
);
router.get(
  "/jabatan/list",
  validate.query(petugas.listJabatan),
  $petugas.listJabatan
);
/* Bidang */
router.post(
  "/bidang/create",
  validate.body(petugas.createBidang),
  $petugas.createBidang
);
router.put(
  "/bidang/update",
  validate.body(petugas.updateBidang),
  $petugas.updateBidang
);
router.delete(
  "/bidang/delete",
  validate.body(petugas.deleteBidang),
  $petugas.deleteBidang
);
router.get(
  "/bidang/list",
  validate.query(petugas.listBidang),
  $petugas.listBidang
);
/* Petugas */
router.post(
  "/create",
  [upload.fotoPetugas, validate.body(petugas.createPetugas)],
  $petugas.createPetugas
);
router.put(
  "/updatebio",
  [upload.fotoPetugas, validate.body(petugas.updateBioPetugas)],
  $petugas.updateBioPetugas
);
router.put(
  "/updatestatus",
  [validate.body(petugas.updateStatusPetugas)],
  $petugas.updateStatusPetugas
);
router.delete(
  "/delete",
  validate.body(petugas.deletePetugas),
  $petugas.deletePetugas
);
router.get("/list", validate.query(petugas.listPetugas), $petugas.listPetugas);
/* Module Export */
module.exports = router;
