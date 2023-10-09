const Joi = require("joi");

/* Joi Schemas */
/* Jabatan */
const createJabatan = Joi.object().keys({
  jabatan: Joi.string().max(100).required(),
});
const updateJabatan = Joi.object().keys({
  row_id: Joi.number().required(),
  jabatan: Joi.string().max(100).required(),
});
const deleteJabatan = Joi.object().keys({
  row_id: Joi.number().required(),
});
const listJabatan = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().max(50).allow("", null),
});
/* Bidang */
const createBidang = Joi.object().keys({
  bidang: Joi.string().max(100).required(),
});
const updateBidang = Joi.object().keys({
  row_id: Joi.number().required(),
  bidang: Joi.string().max(100).required(),
});
const deleteBidang = Joi.object().keys({
  row_id: Joi.number().required(),
});
const listBidang = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().min(0).max(50).allow("", null),
});
/* Petugas */
const createPetugas = Joi.object().keys({
  nomor_id: Joi.string().max(100).required(),
  nama_depan: Joi.string().max(100).required(),
  nama_belakang: Joi.string().max(100).allow("", null),
  tgl_lahir: Joi.date().required(),
  jenis_kelamin: Joi.string().max(1).required(),
  alamat_rumah: Joi.string().max(255).allow("", null),
  nomor_seluler: Joi.string().max(20).allow("", null),
  email: Joi.string().max(255).allow("", null),
  foto: Joi.number(),
  jabatan: Joi.number().required(),
  bidang: Joi.number().required(),
  kata_sandi: Joi.string().max(255).required(),
  status_admin: Joi.boolean(),
});
const updateBioPetugas = Joi.object().keys({
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
const updateStatusPetugas = Joi.object().keys({
  akun: Joi.number().required(),
  jabatan: Joi.number().required(),
  bidang: Joi.number().required(),
});
const deletePetugas = Joi.object().keys({
  akun: Joi.number().required(),
});
const listPetugas = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().max(50).allow("", null),
});
/* Module Export */
module.exports = {
  /* Jabatan */
  createJabatan,
  updateJabatan,
  deleteJabatan,
  listJabatan,
  /* Bidang */
  createBidang,
  updateBidang,
  deleteBidang,
  listBidang,
  /* Petugas */
  createPetugas,
  updateBioPetugas,
  updateStatusPetugas,
  deletePetugas,
  listPetugas,
};
