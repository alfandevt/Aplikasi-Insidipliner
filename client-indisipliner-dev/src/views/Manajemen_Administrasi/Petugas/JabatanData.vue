<template>
  <ion-page>
    <crud-header
      :isAction="true"
      :title="title"
      @search="handleInput"
      @action="openCreateModal"
    />
    <ion-content :fullscreen="true">
      <refresher @refresh="handleRefresh" />
      <base-list v-if="!listDataNull" keyName="row_id" v-slot="{ item }">
        <base-item :title="item['jabatan']" @btnClick="openInfoModal(item)" />
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
import BaseItem from "../../../components/List/Item/BaseItem";
import ModalCreateJabatan from "../../../components/Modals/ModalCreateJabatan";
import ModalInfoJabatan from "../../../components/Modals/ModalInfoJabatan";
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
    BaseItem,
    ErrorItem,
    Refresher,
    InfiniteLoad,
  },
  setup() {
    const warns = baseAlert;
    const route = useRoute();
    const loading = ref(false);
    const title = ref("Data Jabatan");

    const page = ref(1);
    const totalPage = ref(10);
    const count = ref(30);
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
      await openModal(ModalCreateJabatan, {
        title: "Form Jabatan",
        dismiss: closeModal,
        submitValue: handleAfterSubmit,
      });
    }
    async function handleAfterSubmit() {
      await closeModal();
      resetState();
      loadFeed();
    }
    async function openInfoModal(obj) {
      await openModal(ModalInfoJabatan, {
        title: "Data Jabatan",
        dismiss: closeModal,
        /* user props */
        itemObj: obj,
        filePath: "petugas",
        submitValue: handleAfterSubmit,
      });
    }

    function resetState() {
      page.value = 1;
      totalPage.value = 10;
      list.value = [];
      disableScroll.value = false;
      loading.value = false;
    }

    function loadFeed(keyword) {
      let params = {
        page: page.value,
        count: count.value,
        keyword: keyword,
      };
      params = appJsonToken(params);
      http
        .get("/api/petugas/jabatan/list", params)
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
      loadFeed(value);
    }

    function handleRefresh(event) {
      resetState();
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
      handleRefresh,
      loading,
    };
  },
});
</script>

<style scoped></style>
