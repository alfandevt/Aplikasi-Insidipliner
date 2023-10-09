import { createRouter, createWebHistory } from "@ionic/vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    meta: { authRequired: true },
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: { authRequired: false },
    component: () => import("../views/Login.vue"),
  },
  /* M1 */
  {
    path: "/laporkan",
    name: "Laporkan",
    meta: { authRequired: true },
    component: () => import("../views/Informasi/Informasi.vue"),
  },
  {
    path: "/pelanggaran",

    meta: { authRequired: true },
    component: () => import("../views/Informasi/Informasi.vue"),
  },
  {
    path: "/informasi",

    meta: { authRequired: true },
    component: () => import("../views/Informasi/Informasi.vue"),
  },
  {
    path: "/pelanggar/mahasiswa/:nim",
    name: "Informasi Pelanggaran",
    meta: { authRequired: true },
    component: () => import("../views/Informasi/InformasiDetail.vue"),
  },
  {
    path: "/info/mahasiswa/:nim",
    name: "Informasi Mahasiswa",
    meta: { authRequired: true },
    component: () => import("../views/Manajemen_Informasi/MahasiswaInfo.vue"),
  },
  {
    path: "/lapor/mahasiswa/:nim",
    name: "Lapor Mahasiswa",
    meta: { authRequired: true },
    component: () => import("../views/Informasi/Laporkan.vue"),
  },
  /* M2 */
  {
    path: "/laporan",
    name: "Laporan",
    meta: { authRequired: true },
    component: () => import("../views/Manajemen_Informasi/Laporan.vue"),
  },
  /* M3 */
  {
    path: "/mahasiswa/",
    name: "Mahasiswa",
    meta: { authRequired: true },
    component: () =>
      import("../views/Manajemen_Administrasi/Mahasiswa/MahasiswaData.vue"),
  },
  {
    path: "/petugas/",
    name: "Petugas",
    meta: { authRequired: true },
    component: () =>
      import("../views/Manajemen_Administrasi/Petugas/PetugasTabs.vue"),
    children: [
      { path: "", redirect: "/petugas/data" },
      {
        path: "data",
        component: () =>
          import("../views/Manajemen_Administrasi/Petugas/PetugasData.vue"),
      },
      {
        path: "jabatan",
        component: () =>
          import("../views/Manajemen_Administrasi/Petugas/JabatanData.vue"),
      },
      {
        path: "bidang",
        component: () =>
          import("../views/Manajemen_Administrasi/Petugas/BidangData.vue"),
      },
    ],
  },
  {
    path: "/dosen",
    name: "Dosen",
    meta: { authRequired: true },
    component: () =>
      import("../views/Manajemen_Administrasi/Dosen/DosenData.vue"),
  },
  {
    path: "/kelas",
    name: "Kelas",
    meta: { authRequired: true },
    component: () =>
      import("../views/Manajemen_Administrasi/Kelas/KelasTabs.vue"),
    children: [
      { path: "", redirect: "/kelas/data" },
      {
        path: "data",
        component: () =>
          import("../views/Manajemen_Administrasi/Kelas/KelasData.vue"),
      },
      {
        path: "jurusan",
        component: () =>
          import("../views/Manajemen_Administrasi/Kelas/JurusanData.vue"),
      },
      {
        path: "prodi",
        component: () =>
          import("../views/Manajemen_Administrasi/Kelas/ProdiData.vue"),
      },
      {
        path: "tahun",
        component: () =>
          import("../views/Manajemen_Administrasi/Kelas/TahunData.vue"),
      },
    ],
  },
  /* M4 */
  {
    path: "/kategori/",
    name: "Kategori",
    meta: { authRequired: true },
    component: () =>
      import("../views/Manajemen_Pelanggaran/Kategori/KategoriData.vue"),
  },
  /* M5 */
  {
    path: "/keamanan/",
    name: "Keamanan",
    meta: { authRequired: true },
    component: () => import("../views/Keamanan/GantiKataSandi.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some((record) => record.meta.authRequired)) {
    if (localStorage.getItem("token") === null) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
