<template>
  <ion-page>
    <crud-header
      :title="title"
      :is-action="true"
      :is-filter="true"
      @search="handleInput"
      @action="openCreateModal"
      @filter="openFilter"
    />
    <ion-content :fullscreen="true">
      <refresher @refresh="handleRefresh" />
      <base-list v-if="!listDataNull" keyName="row_id" v-slot="{ item }">
        <user-item
          :first-name="item['nama_depan']"
          :last-name="item['nama_belakang']"
          :title="item['kelas']"
          :label="item['jurusan']"
          :foto="item['foto']"
          :is-lecturer="item['wali_kelas']"
          file-path="mahasiswa"
          @btnClick="openInfoModal(item)"
        />
      </base-list>
      <error-item v-else :message="nullMessage" />
      <infinite-load @infinite="handleScroll" :disabled="disableScroll" />
      <ion-loading :is-open="loading" />
    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent, ref, provide } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import {
  IonPage,
  IonContent,
  IonLoading,
  onIonViewDidEnter,
  onIonViewDidLeave,
} from "@ionic/vue";
import CrudHeader from "../../../components/Headers/CrudHeader.vue";
import ErrorItem from "../../../components/Utils/ErrorItem.vue";
import Refresher from "../../../components/Utils/Refresher.vue";
import InfiniteLoad from "../../../components/Utils/InfiniteLoad.vue";
import BaseList from "../../../components/List/BaseList";
import UserItem from "../../../components/List/Item/UserItem";
import ModalCreateMahasiswa from "../../../components/Modals/ModalCreateMahasiswa";
import ModalInfoMahasiswa from "../../../components/Modals/ModalInfoMahasiswa";
import SelectItem from "../../../components/Selections/SelectItem";
import http, { appJsonToken } from "../../../utils/http";
import { baseModal } from "../../../utils/modal";
import { baseAlert } from "../../../utils/alert";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonLoading,
    CrudHeader,
    BaseList,
    UserItem,
    ErrorItem,
    Refresher,
    InfiniteLoad,
  },
  setup() {
    const warns = baseAlert;
    const route = useRoute();
    const loading = ref(false);
    const title = ref("Data Mahasiswa");

    const page = ref(1);
    const totalPage = ref(10);
    const count = ref(30);
    const kelas = ref(null);
    const keyword = ref("");
    const disableScroll = ref(false);

    const list = ref([]);
    const listDataNull = computed(() => {
      if (list.value.length <= 0) return true;
      else return false;
    });
    const nullMessage = computed(() => {
      if (listDataNull.value) return "tidak ditemukan";
      else return "berhasil";
    });
    const listData = computed(() => list.value);

    let currentModal = ref(0);
    const isModalOpen = ref(false);
    async function openModal(modals, config) {
      let modal = await baseModal(modals, config);
      await modal.present();
      currentModal.value = modal;
      isModalOpen.value = true;
    }
    async function closeModal() {
      await currentModal.value.dismiss();
      isModalOpen.value = false;
    }

    async function openCreateModal() {
      await openModal(ModalCreateMahasiswa, {
        title: "Form Mahasiswa",
        dismiss: closeModal,
        submitValue: handleAfterSubmit,
      });
    }
    async function openInfoModal(obj) {
      await openModal(ModalInfoMahasiswa, {
        title: "Data Mahasiswa",
        dismiss: closeModal,
        /* user props */
        userObj: obj,
        filePath: "mahasiswa",
        submitValue: handleAfterSubmit,
      });
    }
    async function openFilter() {
      await openModal(SelectItem, {
        title: "Kelas",
        titleKey: "kelas",
        labelKey: "jurusan",
        idKey: "row_id",
        apiUrl: "/api/akademik/kelas/list",
        dismiss: closeModal,
        selected: handleSelectKelas,
        isFooter: true,
      });
    }
    async function handleAfterSubmit() {
      await closeModal();
      resetState();
      loadFeed();
    }
    function handleSelectKelas(item) {
      resetState();
      resetFilter();
      kelas.value = item.row_id;
      loadFeed();
    }

    function resetState() {
      page.value = 1;
      totalPage.value = 10;
      list.value = [];
      disableScroll.value = false;
      loading.value = false;
    }
    function resetFilter() {
      kelas.value = null;
    }

    function loadFeed() {
      let params = {
        page: page.value,
        count: count.value,
        keyword: keyword.value,
        kelas: kelas.value,
      };
      console.log(params);
      params = appJsonToken(params);
      http
        .get("/api/mahasiswa/list", params)
        .then((response) => {
          const data = { ...response.data.data };
          page.value = data.pages.next;
          totalPage.value = data.pages.total;
          data.list.forEach((item) => list.value.push(item));
          if (page.value === null) disableScroll.value = true;
        })
        .catch(() => {
          resetState();
        })
        .finally(() => {
          loading.value = false;
        });
    }

    async function handleScroll(event) {
      loadFeed();
      await event.target.complete();
    }

    function handleInput(value) {
      resetState();
      keyword.value = value;
      loadFeed();
    }

    function handleRefresh(event) {
      resetState();
      resetFilter();
      loadFeed();
      event.target.complete();
    }

    function handleGuard(_to, _from, next) {
      let message = "apakah anda yakin keluar?";
      let header = "Peringatan!";

      if (isModalOpen.value) {
        message = "tutup form terlebih dahulu!";
        return warns(message, header).then(() => next(false));
      }
      next();
    }

    provide("list", listData);

    onIonViewDidEnter(() => {
      loading.value = true;
      loadFeed();
    });
    onIonViewDidLeave(() => {
      resetState();
    });

    onBeforeRouteLeave((to, from, next) => {
      handleGuard(to, from, next);
    });
    return {
      route,
      title,
      listDataNull,
      nullMessage,
      handleScroll,
      disableScroll,
      handleInput,
      openCreateModal,
      openInfoModal,
      openFilter,
      handleRefresh,
      loading,
    };
  },
});
</script>

<style scoped></style>
