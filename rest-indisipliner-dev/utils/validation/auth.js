const Joi = require("joi");

/* Joi Schemas */
/* Auth */
const login = Joi.object().keys({
  nomor_id: Joi.number().required(),
  kata_sandi: Joi.string().max(100).required(),
});
const createSandi = Joi.object().keys({
  akun: Joi.number().required(),
  kata_sandi: Joi.string().max(255).required(),
});
const updateSandi = Joi.object().keys({
  akun: Joi.number().required(),
  nomor_id: Joi.string().required(),
  kata_sandi_lama: Joi.string().max(255).required(),
  kata_sandi_baru: Joi.string().max(255).required(),
});
const resetSandi = Joi.object().keys({
  akun: Joi.number().required(),
});
const deleteSandi = Joi.object().keys({
  akun: Joi.number().required(),
});
/* Admin */
const createAdmin = Joi.object().keys({
  akun: Joi.number().required(),
});
const updateAdmin = Joi.object().keys({
  akun: Joi.number().required(),
});
const deleteAdmin = Joi.object().keys({
  akun: Joi.number().required(),
});
const listAdmin = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().min(0).max(50).allow("", null),
});

/* Module Export */
module.exports = {
  login,
  createSandi,
  updateSandi,
  resetSandi,
  deleteSandi,
  /* Admin */
  createAdmin,
  updateAdmin,
  deleteAdmin,
  listAdmin,
};
