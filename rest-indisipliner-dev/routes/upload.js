const express = require("express");
const router = express.Router();
/* Middleware */
const upload = require("../middlewares/upload");
const validate = require("../middlewares/joiValidations");
/* Joi */
const uploadVal = require("../utils/validation/upload");
/* Controller */
const $upload = require("../controller/upload");
/* Router */
router.get(
  "/req/:path/:filename",
  [validate.params(uploadVal.sendImg)],
  $upload.sendImg
);
/* module export */
module.exports = router;
