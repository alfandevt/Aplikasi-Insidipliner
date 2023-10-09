const express = require("express");
const router = express.Router();

/* Routers */
const $auth = require("./auth");
const $akademik = require("./akademik");
const $petugas = require("./petugas");
const $dosen = require("./dosen");
const $mahasiswa = require("./mahasiswa");
const $pelanggaran = require("./pelanggaran");
const $upload = require("./upload");

/* Routes */
router.use("/auth", $auth);
router.use("/akademik", $akademik);
router.use("/petugas", $petugas);
router.use("/dosen", $dosen);
router.use("/mahasiswa", $mahasiswa);
router.use("/pelanggaran", $pelanggaran);
router.use("/upload", $upload);

module.exports = router;
