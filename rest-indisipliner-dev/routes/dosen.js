const express = require("express");
const router = express.Router();
/* Middleware */
const upload = require("../middlewares/upload");
const validate = require("../middlewares/joiValidations");
/* Joi */
const dosen = require("../utils/validation/dosen");
/* Controller */
const $dosen = require("../controller/dosen");
/* Router */
/* Dosen */
router.post(
  "/create",
  [upload.fotoDosen, validate.body(dosen.createDosen)],
  $dosen.createDosen
);
router.put(
  "/updatebio",
  [upload.fotoDosen, validate.body(dosen.updateBioDosen)],
  $dosen.updateBioDosen
);
router.delete(
  "/delete",
  validate.body(dosen.deleteDosen),
  $dosen.deleteDosen
);
router.get("/list", validate.query(dosen.listDosen), $dosen.listDosen);
/* Module Export */
module.exports = router;
