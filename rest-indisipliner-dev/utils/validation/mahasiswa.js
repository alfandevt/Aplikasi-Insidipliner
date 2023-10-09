const Joi = require("joi");

/* Joi Schemas */
/* Mahasiswa */
const createMahasiswa = Joi.object().keys({
  nomor_id: Joi.string().max(100).required(),
  nama_depan: Joi.string().max(100).required(),
  nama_belakang: Joi.string().max(100).allow("", null),
  tgl_lahir: Joi.date().required(),
  jenis_kelamin: Joi.string().max(1).required(),
  alamat_rumah: Joi.string().max(255).allow("", null),
  nomor_seluler: Joi.string().max(20).allow("", null),
  email: Joi.string().max(255).allow("", null),
  foto: Joi.number(),
  kelas: Joi.number().required(),
  kata_sandi: Joi.string().max(255).required(),
});
const updateBioMahasiswa = Joi.object().keys({
  akun: Joi.number().required(),
  nomor_id: Joi.string().max(100).required(),
  nama_depan: Joi.string().max(100).required(),
  nama_belakang: Joi.string().max(100).allow("", null),
  tgl_lahir: Joi.date().required(),
  jenis_kelamin: Joi.string().max(1).required(),
  alamat_rumah: Joi.string().max(255).allow("", null),
  nomor_seluler: Joi.string().max(20).allow("", null),
  email: Joi.string().max(255).allow("", null),
  foto: Joi.number(),
});
const updateStatusMahasiswa = Joi.object().keys({
  akun: Joi.number().required(),
  kelas: Joi.number().required(),
});
const deleteMahasiswa = Joi.object().keys({
  akun: Joi.number().required(),
});
const listMahasiswa = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  kelas: Joi.number().allow("", null),
  keyword: Joi.string().max(50).allow("", null),
});
/* Orangtua */
const createOrangtua = Joi.object().keys({
  mahasiswa: Joi.number().required(),
  nama: Joi.string().max(100).required(),
  jenis_kelamin: Joi.string().max(1).required(),
  nomor_seluler: Joi.string().max(20).required(),
});
const updateOrangtua = Joi.object().keys({
  row_id: Joi.number().required(),
  mahasiswa: Joi.number(),
  nama: Joi.string().max(100).required(),
  jenis_kelamin: Joi.string().max(1).required(),
  nomor_seluler: Joi.string().max(20).required(),
});
const deleteOrangtua = Joi.object().keys({
  row_id: Joi.number().required(),
});
const listOrangtua = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().max(50).allow("", null),
  mahasiswa: Joi.number().allow("", null),
});
/* Module Export */
module.exports = {
  /* Mahasiswa */
  createMahasiswa,
  updateBioMahasiswa,
  updateStatusMahasiswa,
  deleteMahasiswa,
  listMahasiswa,
  /* Orangtua */
  createOrangtua,
  updateOrangtua,
  deleteOrangtua,
  listOrangtua,
};
