const express = require("express");
const router = express.Router();
/* Middleware */
const upload = require("../middlewares/upload");
const validate = require("../middlewares/joiValidations");
/* Joi */
const auth = require("../utils/validation/auth");
/* Controller */
const $auth = require("../controller/auth");

/* Routes */
router.post("/login", [validate.body(auth.login)], $auth.login);
router.post(
  "/sandi/create",
  [validate.body(auth.createSandi)],
  $auth.createSandi
);
router.put(
  "/sandi/update",
  [validate.body(auth.updateSandi)],
  $auth.updateSandi
);
router.put("/sandi/reset", [validate.body(auth.resetSandi)], $auth.resetSandi);
router.delete(
  "/sandi/delete",
  [validate.body(auth.deleteSandi)],
  $auth.deleteSandi
);
/* Admin */
router.post(
  "/admin/create",
  [validate.body(auth.createAdmin)],
  $auth.createAdmin
);
router.delete(
  "/admin/delete",
  [validate.body(auth.deleteAdmin)],
  $auth.deleteAdmin
);
router.get("/admin/list", [validate.query(auth.listAdmin)], $auth.listAdmin);

/* module export */
module.exports = router;
