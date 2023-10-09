import {
  folder,
  people,
  camera,
  statsChart,
  home,
  idCard,
} from "ionicons/icons";

export default {
  namespaced: true,
  state() {
    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    // const windowHeight =
    //   window.innerHeight ||
    //   document.documentElement.clientHeight ||
    //   document.body.clientHeight;

    const device = windowWidth > 768 ? "desktop" : "mobile";
    let menus = [
      {
        id: "m1",
        title: "Menu Utama",
        platform: ["mobile", "desktop"],
        access: ["user", "admin"],
        links: [
          {
            id: "ml1",
            label: "Beranda",
            icon: home,
            role: ["P", "M", "D"],
            link: "/home",
            access: ["user", "admin"],
            platform: ["mobile", "desktop"],
          },
          {
            id: "ml2",
            label: "Laporkan",
            icon: camera,
            role: ["P", "M", "D"],
            link: "/laporkan",
            access: ["user", "admin"],
            platform: ["mobile"],
          },
        ],
      },
      {
        id: "m2",
        title: "Informasi",
        platform: ["desktop", "mobile"],
        access: ["admin", "user"],
        links: [
          {
            id: "ml21",
            label: "Laporan",
            icon: folder,
            role: ["P"],
            link: "/laporan",
            access: ["user", "admin"],
            platform: ["desktop"],
          },
          {
            id: "ml21",
            label: "Informasi Mahasiswa",
            icon: idCard,
            role: ["P"],
            link: "/informasi",
            access: ["user", "admin"],
            platform: ["desktop", "mobile"],
          },
          {
            id: "ml23",
            label: "Informasi Pelanggaran",
            icon: statsChart,
            role: ["P", "M", "D"],
            link: "/pelanggaran",
            access: ["user", "admin"],
            platform: ["mobile", "desktop"],
          },
        ],
      },
      {
        id: "m3",
        title: "Data Master",
        platform: ["desktop"],
        access: ["admin"],
        links: [
          {
            id: "ml31",
            label: "Mahasiswa",
            icon: people,
            role: ["P"],
            link: "/mahasiswa",
            access: ["admin"],
            platform: ["desktop"],
          },
          {
            id: "ml32",
            label: "Petugas",
            icon: people,
            role: ["P"],
            link: "/petugas",
            access: ["admin"],
            platform: ["desktop"],
          },
          {
            id: "ml33",
            label: "Dosen",
            icon: people,
            role: ["P"],
            link: "/dosen",
            access: ["admin"],
            platform: ["desktop"],
          },
          {
            id: "ml34",
            label: "Kelas",
            icon: folder,
            role: ["P"],
            link: "/kelas",
            access: ["admin"],
            platform: ["desktop"],
          },
          {
            id: "ml41",
            label: "Kategori Pelanggaran",
            icon: folder,
            role: ["P"],
            link: "/kategori",
            access: ["admin"],
            platform: ["desktop"],
          },
        ],
      },
      {
        id: "m4",
        title: "Keamanan",
        platform: ["desktop"],
        access: ["admin"],
        links: [
          {
            id: "ml41",
            label: "Ganti Kata Sandi",
            icon: folder,
            role: ["P", "M", "D"],
            link: "/keamanan",
            access: ["admin", "user"],
            platform: ["desktop", "mobile"],
          },
        ],
      },
    ];
    let tabs = [
      {
        id: "t1",
        role: ["P"],
        category: "mahasiswa",
        platform: ["mobile", "desktop"],
        links: [
          {
            id: "tl1",
            tab: "mahasiswa",
            label: "Data Mahasiswa",
            icon: people,
            link: "/mahasiswa/data",
            access: ["user", "admin"],
            platform: ["mobile", "desktop"],
          },
          {
            id: "tl2",
            tab: "orangtua",
            label: "Data Orang Tua",
            icon: camera,
            link: "/mahasiswa/orangtua",
            access: ["user", "admin"],
            platform: ["mobile"],
          },
        ],
      },
      {
        id: "t2",
        role: ["P"],
        category: "petugas",
        platform: ["desktop"],
        links: [
          {
            id: "tl21",
            tab: "petugas",
            label: "Petugas",
            icon: people,
            link: "/petugas/data",
            access: ["admin"],
            platform: ["desktop"],
          },
          {
            id: "tl22",
            tab: "jabatan",
            label: "Jabatan",
            icon: folder,
            link: "/petugas/jabatan",
            access: ["admin"],
            platform: ["desktop"],
          },
          {
            id: "tl23",
            tab: "bidang",
            label: "Bidang",
            icon: folder,
            link: "/petugas/bidang",
            access: ["admin"],
            platform: ["desktop"],
          },
        ],
      },
      {
        id: "t3",
        role: ["P"],
        category: "dosen",
        platform: ["desktop"],
        links: [
          {
            id: "tl31",
            tab: "dosen",
            label: "Dosen",
            icon: people,
            link: "/dosen/data",
            access: ["admin"],
            platform: ["desktop"],
          },
        ],
      },
      {
        id: "t4",
        role: ["P"],
        category: "kelas",
        platform: ["desktop"],
        links: [
          {
            id: "tl31",
            tab: "kelas",
            label: "Kelas",
            icon: people,
            link: "/kelas/data",
            access: ["admin"],
            platform: ["desktop"],
          },
          {
            id: "tl32",
            tab: "jurusan",
            label: "Jurusan",
            icon: folder,
            link: "/kelas/jurusan",
            access: ["user", "admin"],
            platform: ["desktop"],
          },
          {
            id: "tl33",
            tab: "prodi",
            label: "Prodi",
            icon: folder,
            link: "/kelas/prodi",
            access: ["user", "admin"],
            platform: ["desktop"],
          },
          {
            id: "tl34",
            tab: "tahun",
            label: "Tahun Ajaran",
            icon: folder,
            link: "/kelas/tahun",
            access: ["user", "admin"],
            platform: ["desktop"],
          },
        ],
      },
    ];
    return { menus, tabs, device };
  },
  getters: {
    sideNav(state) {
      return state.menus;
    },
    deviceType(state) {
      return state.device;
    },
    /* tabs */
    mahasiswaTabs(state) {
      return state.tabs.find((item) => item.category === "mahasiswa");
    },
    petugasTabs(state) {
      return state.tabs.find((item) => item.category === "petugas");
    },
    dosenTabs(state) {
      return state.tabs.find((item) => item.category === "dosen");
    },
    kelasTabs(state) {
      return state.tabs.find((item) => item.category === "kelas");
    },
  },
};
