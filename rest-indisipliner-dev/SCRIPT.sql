DROP DATABASE IF EXISTS db_indisipliner;
CREATE DATABASE db_indisipliner;
USE db_indisipliner;

-- DEFINE TABLE

-- PENGGUNA
CREATE TABLE tb_pengguna (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nomor_id VARCHAR(100) NOT NULL UNIQUE,
    nama_depan VARCHAR(100) NOT NULL,
    nama_belakang VARCHAR(100),
    tgl_lahir DATETIME NOT NULL,
    jenis_kelamin VARCHAR(1) NOT NULL,
    alamat_rumah VARCHAR(255),
    nomor_seluler VARCHAR(20),
    email VARCHAR(255),
    foto INTEGER UNIQUE, -- REFERENSI KE TABEL FILE
    tanggal_buat TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tb_sandi (
	akun INTEGER NOT NULL UNIQUE, -- REFERENSI KE tb_pengguna
    kata_sandi VARCHAR(255) NOT NULL
);

CREATE TABLE tb_admin (
	akun INTEGER NOT NULL UNIQUE -- REFERENSI KE tb_pengguna
);

CREATE TABLE tb_file (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nama_file VARCHAR(100) NOT NULL,
	tipe_file VARCHAR(50) NOT NULL
);

CREATE TABLE tb_log_masuk (
	akun INTEGER NOT NULL, -- REFERENSI KE tb_pengguna
    tanggal TIMESTAMP DEFAULT NOW()
);

-- KELAS, AKADEMIK DAN MAHASISWA
CREATE TABLE tb_mahasiswa (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	akun INTEGER NOT NULL UNIQUE, -- REFERENSI KE tb_pengguna
    kelas INTEGER NOT NULL -- REFERENSI KE tb_kelas
);

CREATE TABLE tb_kelas (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    kelas VARCHAR(100) NOT NULL,
    wali_kelas INTEGER, -- REFERENSI KE tb_pengguna
    jurusan INTEGER NOT NULL, -- REFERENSI KE tb_jurusan
    tahun_ajaran INTEGER NOT NULL -- REFERENSI KE tb_tahun_ajaran
);

CREATE TABLE tb_jurusan (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    jurusan VARCHAR(100) NOT NULL UNIQUE,
    prodi INTEGER NOT NULL -- REFERENSI KE tb_prodi
);

CREATE TABLE tb_prodi (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    prodi VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE tb_tahun_ajaran (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tahun_mulai DATETIME NOT NULL,
    tahun_selesai DATETIME NOT NULL
);

CREATE TABLE tb_orangtua (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	mahasiswa INTEGER NOT NULL, -- REFERENSI KE MAHASISWA
    nama VARCHAR(100) NOT NULL,
    jenis_kelamin VARCHAR(1) NOT NULL,
    nomor_seluler VARCHAR(20) NOT NULL
);

CREATE TABLE tb_dosen (
	akun INTEGER NOT NULL UNIQUE -- REFERENSI KE tb_pengguna
);

-- PETUGAS
CREATE TABLE tb_petugas (
	akun INTEGER NOT NULL UNIQUE, -- REFERENSI KE tb_pengguna
    jabatan INTEGER NOT NULL, -- REFERENSI KE tb_jabatan
    bidang INTEGER NOT NULL -- REFERENSI KE tb_bidang
);

CREATE TABLE tb_jabatan (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    jabatan VARCHAR(100) NOT NULL
);

CREATE TABLE tb_bidang (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bidang VARCHAR(100) NOT NULL
);

-- FITUR
CREATE TABLE tb_pelanggaran (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pelapor INTEGER NOT NULL, -- REFERENSI KE tb_pengguna
    terlapor INTEGER NOT NULL, -- REFERENSI KE tb_pengguna
    tanggal TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tb_detil_pelanggaran (
	pelanggaran INTEGER NOT NULL, -- REFERENSI KE tb_pelanggaran
    kategori INTEGER NOT NULL, -- REFERENSI KE tb_kategori_pelanggaran
    deskripsi VARCHAR(100) NOT NULL,
    gambar INTEGER NOT NULL -- REFERENSI KE tb_file
);

CREATE TABLE tb_kategori_pelanggaran (
	row_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    kategori VARCHAR(100) NOT NULL UNIQUE,
    poin INTEGER NOT NULL
);

-- REFERENSI ANTAR TABLE
-- PENGGUNA
-- tb_sandi - tb_pengguna
ALTER TABLE tb_sandi
ADD CONSTRAINT fk_sandi_pengguna
FOREIGN KEY (akun) REFERENCES tb_pengguna(row_id)
ON DELETE CASCADE;

-- tb_admin - tb_pengguna
ALTER TABLE tb_admin
ADD CONSTRAINT fk_admin_pengguna
FOREIGN KEY (akun) REFERENCES tb_pengguna(row_id);

-- tb_pengguna - tb_file
ALTER TABLE tb_pengguna
ADD CONSTRAINT fk_foto_pengguna
FOREIGN KEY (foto) REFERENCES tb_file(row_id);

-- tb_log_masuk - tb_pengguna
ALTER TABLE tb_log_masuk
ADD CONSTRAINT fk_log_masuk
FOREIGN KEY (akun) REFERENCES tb_pengguna(row_id);

-- KELAS, DOSEN, MAHASISWA
-- tb_mahasiswa - tb_pengguna
ALTER TABLE tb_mahasiswa
ADD CONSTRAINT fk_mahasiswa
FOREIGN KEY (akun) REFERENCES tb_pengguna(row_id)
ON DELETE CASCADE;

-- tb__mahasiswa - tb_kelas
ALTER TABLE tb_mahasiswa
ADD CONSTRAINT fk_kelas_mahasiswa
FOREIGN KEY (kelas) REFERENCES tb_kelas(row_id);

-- tb_kelas - tb_pengguna
ALTER TABLE tb_kelas
ADD CONSTRAINT fk_wali_kelas
FOREIGN KEY (wali_kelas) REFERENCES tb_pengguna(row_id);

-- tb_kelas - tb_jurusan
ALTER TABLE tb_kelas
ADD CONSTRAINT fk_jurusan_kelas
FOREIGN KEY (jurusan) REFERENCES tb_jurusan(row_id);

-- tb_kelas - tb_tahun_ajaran
ALTER TABLE tb_kelas
ADD CONSTRAINT fk_tahun_ajaran
FOREIGN KEY (tahun_ajaran) REFERENCES tb_tahun_ajaran(row_id);

-- tb_jurusan - tb_prodi
ALTER TABLE tb_jurusan
ADD CONSTRAINT fk_prodi_jurusan
FOREIGN KEY (prodi) REFERENCES tb_prodi(row_id);

-- tb_orangtua - tb_mahasiswa
ALTER TABLE tb_orangtua
ADD CONSTRAINT fk_orangtua_mahasiswa
FOREIGN KEY (mahasiswa) REFERENCES tb_mahasiswa(row_id)
ON DELETE CASCADE;

-- tb_dosen - tb_pengguna
ALTER TABLE tb_dosen
ADD CONSTRAINT fk_dosen
FOREIGN KEY (akun) REFERENCES tb_pengguna(row_id)
ON DELETE CASCADE;

-- PETUGAS
-- tb_petugas - tb_pengguna
ALTER TABLE tb_petugas
ADD CONSTRAINT fk_petugas
FOREIGN KEY (akun) REFERENCES tb_pengguna(row_id)
ON DELETE CASCADE;

-- tb_petugas - tb_jabatan
ALTER TABLE tb_petugas
ADD CONSTRAINT fk_jabatan_petugas
FOREIGN KEY (jabatan) REFERENCES tb_jabatan(row_id);

-- tb_petugas - tb_bidang
ALTER TABLE tb_petugas
ADD CONSTRAINT fk_bidang_petugas
FOREIGN KEY (bidang) REFERENCES tb_bidang(row_id);

-- FITUR

-- tb_pelanggaran - tb_pengguna
ALTER TABLE tb_pelanggaran
ADD CONSTRAINT fk_pelapor
FOREIGN KEY (pelapor) REFERENCES tb_pengguna(row_id);

-- tb_pelanggaran - tb_pengguna
ALTER TABLE tb_pelanggaran
ADD CONSTRAINT fk_terlapor
FOREIGN KEY (terlapor) REFERENCES tb_pengguna(row_id);

-- tb_detil_pelanggaran - tb_pelanggaran
ALTER TABLE tb_detil_pelanggaran
ADD CONSTRAINT fk_detil_pelanggaran
FOREIGN KEY (pelanggaran) REFERENCES tb_pelanggaran(row_id);

-- tb_detil_pelanggaran - tb_kategori_pelanggaran
ALTER TABLE tb_detil_pelanggaran
ADD CONSTRAINT fk_kategori
FOREIGN KEY (kategori) REFERENCES tb_kategori_pelanggaran(row_id);

-- tb_detil_pelanggaran - tb_file
ALTER TABLE tb_detil_pelanggaran
ADD CONSTRAINT fk_gambar
FOREIGN KEY (gambar) REFERENCES tb_file(row_id);

-- INSERTING ---

-- PETUGAS --
--  tb_jabatan
INSERT INTO tb_jabatan (jabatan) VALUES ("kabid"), ("staf");
--  tb_bidang
INSERT INTO tb_bidang (bidang) VALUES ("akademik"), ("keuangan"), ("pemasaran");
-- PETUGAS
-- ADMIN
INSERT INTO tb_pengguna (nomor_id, nama_depan, nama_belakang, tgl_lahir, jenis_kelamin, alamat_rumah, nomor_seluler, email) VALUES ("101", "john", "doe", "1990-01-01 00:00:00", "l", "lorem ipsum street", "081234567890", "john.doe@email.com");
INSERT INTO tb_sandi (akun, kata_sandi) VALUES (1, "$2b$10$sznO4isV6JYqXpQrq/lqtu9Nf6p/vltjVNeLJSVCVXOEnOhoVHjsO");
INSERT INTO tb_admin (akun) VALUES (1);
INSERT INTO tb_petugas (akun, jabatan, bidang) VALUES (1, 1, 1);

-- AKADEMIK
-- tb_prodi
INSERT INTO tb_prodi (prodi) VALUES ("manajemen informatika"), ("humas"), ("administrasi perkantoran"), ("komputerisasi akuntansi");
-- tb_jurusan
INSERT INTO tb_jurusan (jurusan, prodi) VALUES ("informatika komputer", 1), ("multimedia komunikasi dan visual", 2), ("administrasi perkantoran", 3), ("komputerisasi akuntansi", 4);
-- tb_tahun_ajaran
INSERT INTO tb_tahun_ajaran (tahun_mulai, tahun_selesai) VALUES ("2017-01-01 00:00:00", "2020-01-01 00:00:00"), ("2018-01-01 00:00:00", "2021-01-01 00:00:00"), ("2019-01-01 00:00:00", "2022-01-01 00:00:00"); 