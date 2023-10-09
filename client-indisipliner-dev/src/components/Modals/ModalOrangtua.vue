<template>
  <modal-crud-header
    :title="title"
    :is-action="true"
    :is-filter="true"
    @search="handleInput"
    @action="openCreateModal"
    @filter="openFilter"
    @close="dismiss"
  />
  <ion-content :fullscreen="true">
    <refresher @refresh="handleRefresh" />
    <base-list v-if="!listDataNull" keyName="row_id" v-slot="{ item }">
      <base-item
        :title="item['nama']"
        :label="item['nomor_seluler']"
        @btnClick="openInfoModal(item)"
      />
    </base-list>
    <error-item v-else :message="nullMessage" />
    <infinite-load @infinite="handleScroll" :disabled="disableScroll" />
    <ion-loading :is-open="loading" />
  </ion-content>
</template>

<script>
import {
  computed,
  defineComponent,
  ref,
  provide,
  onMounted,
  onUnmounted,
} from "vue";
import { IonContent, IonLoading } from "@ionic/vue";
import ModalCrudHeader from "../Headers/ModalCrudHeader.vue";
import ErrorItem from "../Utils/ErrorItem.vue";
import Refresher from "../Utils/Refresher.vue";
import InfiniteLoad from "../Utils/InfiniteLoad.vue";
import ModalCreateOrangtua from "./ModalCreateOrangtua";
import ModalInfoOrangtua from "./ModalInfoOrangtua";
import BaseList from "../List/BaseList";
import BaseItem from "../List/Item/BaseItem";
import SelectItem from "../Selections/SelectItem";
import http, { appJsonToken } from "../../utils/http";
import { baseModal } from "../../utils/modal";

export default defineComponent({
  components: {
    IonContent,
    IonLoading,
    ModalCrudHeader,
    BaseList,
    BaseItem,
    ErrorItem,
    Refresher,
    InfiniteLoad,
  },
  props: {
    mahasiswaId: { type: Number },
    title: { type: String, default: "Data Orangtua" },
    submitValue: { type: Function },
    dismiss: { type: Function },
    userObj: { type: Object },
    filePath: { type: String },
  },
  setup(props) {
    const loading = ref(false);

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
      await openModal(ModalCreateOrangtua, {
        title: "Form Orangtua",
        dismiss: closeModal,
        submitValue: handleAfterSubmit,
        userObj: props.userObj,
      });
    }
    async function openInfoModal(obj) {
      await openModal(ModalInfoOrangtua, {
        title: "Data Orangtua",
        dismiss: closeModal,
        /* user props */
        userObj: obj,
        submitValue: handleAfterSubmit,
      });
    }
    async function openFilter() {
      await openModal(SelectItem, {
        title: "Kelas",
        dismiss: closeModal,
        selected: handleSelectKelas,
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
        mahasiswa: props.userObj.mahasiswa_id,
      };
      console.log(params);
      params = appJsonToken(params);
      http
        .get("/api/mahasiswa/orangtua/list", params)
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

    provide("list", listData);

    onMounted(() => {
      loading.value = true;
      loadFeed();
    });
    onUnmounted(() => {
      resetState();
    });
    return {
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
