const express = require("express");
const router = express.Router();
/* Middleware */
const upload = require("../middlewares/upload");
const validate = require("../middlewares/joiValidations");
const security = require("../middlewares/auth");
/* Joi */
const mahasiswa = require("../utils/validation/mahasiswa");
/* Controller */
const $mahasiswa = require("../controller/mahasiswa");
/* Router */
/* Mahasiswa */
router.post(
  "/create",
  [upload.fotoMahasiswa, validate.body(mahasiswa.createMahasiswa)],
  $mahasiswa.createMahasiswa
);
router.put(
  "/updatebio",
  [upload.fotoMahasiswa, validate.body(mahasiswa.updateBioMahasiswa)],
  $mahasiswa.updateBioMahasiswa
);
router.put(
  "/updatestatus",
  [validate.body(mahasiswa.updateStatusMahasiswa)],
  $mahasiswa.updateStatusMahasiswa
);
router.delete(
  "/delete",
  validate.body(mahasiswa.deleteMahasiswa),
  $mahasiswa.deleteMahasiswa
);
/* Orangtua */
router.post(
  "/orangtua/create",
  validate.body(mahasiswa.createOrangtua),
  $mahasiswa.createOrangtua
);
router.put(
  "/orangtua/update",
  validate.body(mahasiswa.updateOrangtua),
  $mahasiswa.updateOrangtua
);
router.delete(
  "/orangtua/delete",
  validate.body(mahasiswa.deleteOrangtua),
  $mahasiswa.deleteOrangtua
);
router.get(
  "/orangtua/list",
  validate.query(mahasiswa.listOrangtua),
  $mahasiswa.listOrangtua
);

router.get(
  "/list",
  [security.auth, validate.query(mahasiswa.listMahasiswa)],
  $mahasiswa.listMahasiswa
);
/* Module Export */
module.exports = router;
