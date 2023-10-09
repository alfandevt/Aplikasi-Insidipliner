const Joi = require("joi");

/* Joi Schemas */
/* Dosen */
const createDosen = Joi.object().keys({
  nomor_id: Joi.string().max(100).required(),
  nama_depan: Joi.string().max(100).required(),
  nama_belakang: Joi.string().max(100).allow("", null),
  tgl_lahir: Joi.date().required(),
  jenis_kelamin: Joi.string().max(1).required(),
  alamat_rumah: Joi.string().max(255).allow("", null),
  nomor_seluler: Joi.string().max(20).allow("", null),
  email: Joi.string().max(255).allow("", null),
  foto: Joi.number(),
  kata_sandi: Joi.string().max(255).required(),
});
const updateBioDosen = Joi.object().keys({
  akun: Joi.number().required(),
  nomor_id: Joi.string().max(100),
  nama_depan: Joi.string().max(100),
  nama_belakang: Joi.string().max(100).allow("", null),
  tgl_lahir: Joi.date(),
  jenis_kelamin: Joi.string().max(1),
  alamat_rumah: Joi.string().max(255).allow("", null),
  nomor_seluler: Joi.string().max(20).allow("", null),
  email: Joi.string().max(255).allow("", null),
  foto: Joi.number(),
});
const deleteDosen = Joi.object().keys({
  akun: Joi.number().required(),
});
const listDosen = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().max(50).allow("", null),
});
/* Module Export */
module.exports = {
  /* Dosen */
  createDosen,
  updateBioDosen,
  deleteDosen,
  listDosen,
};
