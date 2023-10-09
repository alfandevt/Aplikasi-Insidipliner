const Joi = require("joi");

/* Joi Schemas */
/* Prodi */
const createProdi = Joi.object().keys({
  prodi: Joi.string().max(100).required(),
});
const updateProdi = Joi.object().keys({
  row_id: Joi.number().required(),
  prodi: Joi.string().max(100).required(),
});
const deleteProdi = Joi.object().keys({
  row_id: Joi.number().required(),
});
const listProdi = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().max(50).allow("", null),
});
/* Jurusan */
const createJurusan = Joi.object().keys({
  jurusan: Joi.string().max(100).required(),
  prodi: Joi.number().required(),
});
const updateJurusan = Joi.object().keys({
  row_id: Joi.number().required(),
  jurusan: Joi.string().max(100).required(),
  prodi: Joi.number().required(),
});
const deleteJurusan = Joi.object().keys({
  row_id: Joi.number().required(),
});
const listJurusan = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().max(50).allow("", null),
});
/* Tahun */
const createTahun = Joi.object().keys({
  tahun_mulai: Joi.date().required(),
  tahun_selesai: Joi.date().greater(Joi.ref("tahun_mulai")).required(),
});
const updateTahun = Joi.object().keys({
  row_id: Joi.number().required(),
  tahun_mulai: Joi.date().required(),
  tahun_selesai: Joi.date().greater(Joi.ref("tahun_mulai")).required(),
});
const deleteTahun = Joi.object().keys({
  row_id: Joi.number().required(),
});
const listTahun = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  mulai: Joi.date(),
  selesai: Joi.date().greater(Joi.ref("mulai")),
});
/* Kelas */
const createKelas = Joi.object().keys({
  kelas: Joi.string().max(100).required(),
  wali_kelas: Joi.number().required(),
  jurusan: Joi.number().required(),
  tahun_ajaran: Joi.number().required(),
});
const updateKelas = Joi.object().keys({
  row_id: Joi.number().required(),
  kelas: Joi.string().max(100),
  wali_kelas: Joi.number().required(),
  jurusan: Joi.number().required(),
  tahun_ajaran: Joi.number().required(),
});
const deleteKelas = Joi.object().keys({
  row_id: Joi.number().required(),
});
const listKelas = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().max(50).allow("", null),
});
const listWaliKelas = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().max(50).allow("", null),
});
/* Module Export */
module.exports = {
  /* Prodi */
  createProdi,
  updateProdi,
  deleteProdi,
  listProdi,
  /* Jurusan */
  createJurusan,
  updateJurusan,
  deleteJurusan,
  listJurusan,
  /* Tahun */
  createTahun,
  updateTahun,
  deleteTahun,
  listTahun,
  /* Kelas */
  createKelas,
  updateKelas,
  deleteKelas,
  listKelas,
  listWaliKelas,
};
