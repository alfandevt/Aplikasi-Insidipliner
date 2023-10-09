<template>
  <ion-page>
    <laporan-header
      title="Informasi Laporan"
      :is-search="true"
      :is-filter="true"
      @pickDate="handlePickDate"
      @search="handleInput"
      @filter="openModal(kelasModalConfig)"
    />
    <ion-content :fullscreen="true">
      <refresher @refresh="handleRefresh" />
      <laporan-table
        v-if="!sourcesDataNull"
        header-key="NIM"
        row-key="nomor_id"
      />
      <error-item v-else :title="nullMessage" />
      <infinite-load @infinite="handleTableScroll" :disabled="disableScroll" />
      <ion-loading :is-open="loading" />
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, computed, provide } from "vue";
import {
  IonPage,
  IonContent,
  IonLoading,
  // IonGrid,
  // IonRow,
  // IonCol,
  onIonViewDidEnter,
  onIonViewDidLeave,
} from "@ionic/vue";
import http, { appJsonToken } from "../../utils/http";
import { baseModal } from "../../utils/modal";
import { mySqlDateLocale } from "../../utils/date";
import LaporanHeader from "../../components/Headers/LaporanHeader.vue";
import LaporanTable from "../../components/Tables/LaporanTable.vue";
import SelectItem from "../../components/Selections/SelectItem";
import Refresher from "../../components/Utils/Refresher.vue";
import ErrorItem from "../../components/Utils/ErrorItem.vue";
import InfiniteLoad from "../../components/Utils/InfiniteLoad.vue";

export default defineComponent({
  components: {
    LaporanHeader,
    Refresher,
    ErrorItem,
    InfiniteLoad,
    LaporanTable,
    IonPage,
    IonContent,
    IonLoading,
  },
  setup() {
    const tglAwal = ref("");
    const tglAkhir = ref("");
    const page = ref(1);
    const totalPage = ref(10);
    const kelas = ref(null);
    const keyword = ref("");
    const count = ref(35);
    const loading = ref(false);
    const disableScroll = ref(false);

    const sourcesData = ref([]);
    const columns = ref([
      { name: "NIM", prop: "nomor_id", size: 200, show: true },
      { name: "Mahasiswa", prop: "mahasiswa", size: 200, show: true },
      { name: "Kelas", prop: "kelas", size: 200, show: true },
      { name: "Prodi", prop: "prodi", size: 200, show: true },
      { name: "Poin", prop: "poin", size: 200, show: true },
      { name: "Tindakan", prop: "tindakan", size: 200, show: true },
    ]);

    const sourcesDataNull = computed(() => {
      if (sourcesData.value.length <= 0) return true;
      else return false;
    });
    const nullMessage = computed(() => {
      if (sourcesDataNull.value) return "tidak ditemukan";
      else return "berhasil";
    });
    const tableData = computed(() => sourcesData.value);

    const kelasModalConfig = ref({
      title: "Kelas",
      titleKey: "kelas",
      labelKey: "jurusan",
      idKey: "row_id",
      apiUrl: "/api/akademik/kelas/list",
      dismiss: handleCloseModal,
      selected: handleSelectKelas,
      isFooter: true,
    });
    let currentModal = ref(0);
    const isModalOpen = ref(false);
    async function openModal(config) {
      let modal = await baseModal(SelectItem, config);
      await modal.present();
      currentModal.value = modal;
      isModalOpen.value = true;
    }
    async function closeModal() {
      await currentModal.value.dismiss();
      isModalOpen.value = false;
    }
    function handleCloseModal() {
      closeModal();
    }
    function handleSelectKelas(item) {
      resetState();
      kelas.value = item.row_id;
      loadFeed();
    }

    function resetState() {
      page.value = 1;
      totalPage.value = 20;
      sourcesData.value = [];
      kelas.value = null;
      disableScroll.value = false;
      loading.value = false;
    }
    function resetFilter() {
      kelas.value = null;
    }
    function resetDates() {
      tglAwal.value = "";
      tglAkhir.value = "";
    }

    function tindakan(value) {
      if (value < 50) return "Peringatan Secara Lisan";
      else if (value < 150) return "Surat Teguran";
      else if (value < 350) return "Menghadap Bagian Akademik";
      else return "Hubungi Orangtua Mahasiswa";
    }

    function loadFeed() {
      const body = JSON.stringify({
        page: page.value,
        count: count.value,
        tanggal_awal: tglAwal.value,
        tanggal_akhir: tglAkhir.value,
        keyword: keyword.value,
        kelas: kelas.value,
      });
      let config = appJsonToken();
      http
        .post("/api/pelanggaran/poinlist", body, config)
        .then((response) => {
          const data = { ...response.data.data };
          page.value = data.pages.next;
          totalPage.value = data.pages.total;
          for (const tRow of data.list) {
            let row = {};
            for (const col of columns.value) {
              if (col.prop === "tindakan") {
                row["tindakan"] = tindakan(row["poin"]);
              } else {
                row[col.prop] = tRow[col.prop];
              }
            }
            sourcesData.value.push(row);
          }
          if (page.value === null) disableScroll.value = true;
        })
        .catch(() => {
          resetState();
        })
        .finally(() => {
          loading.value = false;
        });
    }

    function handlePickDate(data) {
      resetState();
      loading.value = true;
      const dateRange = { ...data };
      const awal = mySqlDateLocale(dateRange["tglAwal"]);
      const akhir = mySqlDateLocale(dateRange["tglAkhir"]);
      tglAwal.value = awal;
      tglAkhir.value = akhir;
      loadFeed();
    }
    function handleRefresh(event) {
      resetState();
      resetFilter();
      loading.value = true;
      loadFeed();
      event.target.complete(event);
    }
    async function handleTableScroll(event) {
      loadFeed();
      await event.target.complete();
    }

    function handleInput(value) {
      resetState();
      keyword.value = value;
      loadFeed(value);
    }

    provide("tableColumns", columns);
    provide("tableRows", sourcesData);
    provide("tableData", sourcesData);

    onIonViewDidEnter(() => {
      loading.value = true;
      loadFeed();
    });
    onIonViewDidLeave(() => {
      resetState();
      resetDates();
    });

    return {
      loading,
      handlePickDate,
      handleRefresh,
      handleTableScroll,
      handleInput,
      disableScroll,
      loadFeed,
      nullMessage,
      columns,
      tableData,
      sourcesDataNull,
      openModal,
      kelasModalConfig,
    };
  },
});
</script>

<style scoped></style>
