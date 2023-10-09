<template>
  <ion-page>
    <search-header
      :title="title"
      :is-filter="true"
      @search="handleInput"
      @filter="openModal(kelasModalConfig)"
    />
    <ion-content :fullscreen="true">
      <refresher @refresh="handleRefresh" />
      <base-list v-if="!listDataNull" keyName="row_id" v-slot="{ item }">
        <user-item
          :first-name="item['nama_depan']"
          :last-name="item['nama_belakang']"
          :title="item['kelas']"
          :label="item['prodi']"
          :foto="item['foto']"
          file-path="mahasiswa"
          @btnClick="handleRoute(item['nomor_id'])"
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
import { useRoute, useRouter } from "vue-router";
import {
  IonPage,
  IonContent,
  IonLoading,
  onIonViewDidEnter,
  onIonViewDidLeave,
} from "@ionic/vue";
import SearchHeader from "../../components/Headers/SearchHeader.vue";
import ErrorItem from "../../components/Utils/ErrorItem.vue";
import Refresher from "../../components/Utils/Refresher.vue";
import InfiniteLoad from "../../components/Utils/InfiniteLoad.vue";
import BaseList from "../../components/List/BaseList";
import UserItem from "../../components/List/Item/UserItem";
import SelectItem from "../../components/Selections/SelectItem";
import http, { appJsonToken } from "../../utils/http";
import { baseModal } from "../../utils/modal";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    IonLoading,
    SearchHeader,
    BaseList,
    UserItem,
    ErrorItem,
    Refresher,
    InfiniteLoad,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);
    const title = ref("Pencarian");

    const keyword = ref("");
    const page = ref(1);
    const totalPage = ref(10);
    const count = ref(30);
    const kelas = ref(null);
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

    function handleRoute(params) {
      let routePath = route.path;
      if (routePath == "/pelanggaran") {
        routePath = "/pelanggar/mahasiswa/" + params;
      } else if (routePath == "/laporkan") {
        routePath = "/lapor/mahasiswa/" + params;
      } else if (routePath == "/informasi") {
        routePath = "/info/mahasiswa/" + params;
      }
      router.push(routePath);
    }

    provide("list", listData);

    onIonViewDidEnter(() => {
      loading.value = true;
      loadFeed();
    });
    onIonViewDidLeave(() => {
      resetState();
    });
    return {
      route,
      title,
      listDataNull,
      nullMessage,
      disableScroll,
      kelasModalConfig,
      openModal,
      handleScroll,
      handleInput,
      handleRefresh,
      handleRoute,
      loading,
    };
  },
});
</script>

<style scoped></style>
