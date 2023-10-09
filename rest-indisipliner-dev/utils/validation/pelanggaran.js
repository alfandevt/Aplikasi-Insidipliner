const Joi = require("joi");

/* Joi Schemas */
/* Kategori */
const createKategori = Joi.object().keys({
  kategori: Joi.string().max(100).required(),
  poin: Joi.number().required(),
});
const updateKategori = Joi.object().keys({
  row_id: Joi.number().required(),
  kategori: Joi.string().max(100),
  poin: Joi.number(),
});
const deleteKategori = Joi.object().keys({
  row_id: Joi.number().required(),
});
const listKategori = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  keyword: Joi.string().max(50).allow("", null),
});
/* Pelanggaran */
const createPelanggaran = Joi.object().keys({
  pelapor: Joi.number().required(),
  terlapor: Joi.number().required(),
  detail: Joi.array()
    .items({
      kategori: Joi.number().required(),
      deskripsi: Joi.string().max(100).required(),
      gambar: Joi.number().required(),
    })
    .required(),
});
const listPelanggaran = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  kelas: Joi.number().allow("", null),
  keyword: Joi.string().max(50).allow("", null),
  tanggal_awal: Joi.date().allow("", null),
  tanggal_akhir: Joi.when("tanggal_awal", {
    is: Joi.exist(),
    then: Joi.date()
      .greater(Joi.ref("tanggal_awal"))
      .allow("", null)
      .required(),
  }),
});
const listLaporanPelanggaran = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  kelas: Joi.number().allow("", null),
  keyword: Joi.string().max(50).allow("", null),
  tanggal_awal: Joi.date().allow("", null),
  tanggal_akhir: Joi.when("tanggal_awal", {
    is: Joi.exist(),
    then: Joi.date()
      .greater(Joi.ref("tanggal_awal"))
      .allow("", null)
      .required(),
  }),
});
const chartByBulan = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  kelas: Joi.number().allow("", null),
  keyword: Joi.string().max(50).allow("", null),
  tanggal_awal: Joi.date().allow("", null),
  tanggal_akhir: Joi.when("tanggal_awal", {
    is: Joi.exist(),
    then: Joi.date()
      .greater(Joi.ref("tanggal_awal"))
      .allow("", null)
      .required(),
  }),
});
const chartByKategori = Joi.object().keys({
  page: Joi.number().required(),
  count: Joi.number().required(),
  kelas: Joi.number().allow("", null),
  keyword: Joi.string().max(50).allow("", null),
  tanggal_awal: Joi.date().allow("", null),
  tanggal_akhir: Joi.when("tanggal_awal", {
    is: Joi.exist(),
    then: Joi.date()
      .greater(Joi.ref("tanggal_awal"))
      .allow("", null)
      .required(),
  }),
});
/* Module Export */
module.exports = {
  /* Kategori */
  createKategori,
  updateKategori,
  deleteKategori,
  listKategori,
  /* Pelanggaran */
  createPelanggaran,
  listPelanggaran,
  listLaporanPelanggaran,
  chartByBulan,
  chartByKategori,
};
