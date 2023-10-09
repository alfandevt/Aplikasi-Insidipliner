<template>
  <ion-page>
    <header-info
      :title="title"
      :first-name="user.nama_depan"
      :last-name="user.nama_belakang"
      :item-title="user.kelas"
      :label="user.prodi"
      :foto="user.foto"
      :is-null="isNull"
      file-path="mahasiswa"
    />
    <ion-content :fullscreen="true">
      <refresher @refresh="handleRefresh" />
      <news-feed-grid v-if="!feedNull" title="Riwayat Pelanggaran Terakhir" />
      <error-item :title="nullMessage" v-else />
      <infinite-load @infinite="handleScroll" :disabled="disableScroll" />
      <ion-loading :is-open="loading" />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonLoading,
  onIonViewDidEnter,
  onIonViewDidLeave,
} from "@ionic/vue";
import { computed, defineComponent, ref, provide } from "vue";
import { useRoute } from "vue-router";
import http, { appJsonToken } from "../../utils/http";
import InfiniteLoad from "../../components/Utils/InfiniteLoad.vue";
import HeaderInfo from "../../components/Headers/HeaderInfo";
import NewsFeedGrid from "../../components/List/NewsFeedGrid.vue";
import Refresher from "../../components/Utils/Refresher.vue";
import ErrorItem from "../../components/Utils/ErrorItem.vue";

export default defineComponent({
  name: "InformasiDetail",
  components: {
    HeaderInfo,
    NewsFeedGrid,
    Refresher,
    ErrorItem,
    IonPage,
    IonContent,
    IonLoading,
    InfiniteLoad,
  },
  setup() {
    const route = useRoute();
    const nim = computed(() => {
      return route.params.nim;
    });

    const title = ref("Informasi Pelanggaran");
    const page = ref(1);
    const totalPage = ref(10);
    const count = ref(30);
    const disableScroll = ref(false);
    const user = ref([]);
    const feeds = ref([]);
    const loading = ref(false);
    const isNull = computed(() => {
      if (user.value.length <= 0) return true;
      else return false;
    });
    const feedNull = computed(() => {
      if (feeds.value.length <= 0) return true;
      else return false;
    });
    const nullMessage = computed(() => {
      if (feedNull.value) return "tidak ditemukan";
      else return "berhasil";
    });

    function loadInfo() {
      let params = {
        page: 1,
        count: 1,
        keyword: nim.value,
      };
      params = appJsonToken(params);

      http
        .get("/api/mahasiswa/list", params)
        .then((response) => {
          const data = { ...response.data.data };
          user.value = data.list[0];
          loadFeed();
        })
        .catch(() => {
          user.value = [];
        })
        .finally(() => true);
    }

    function loadFeed() {
      const body = JSON.stringify({
        page: page.value,
        count: count.value,
        keyword: nim.value,
      });
      loading.value = true;
      http
        .post("/api/pelanggaran/list", body, appJsonToken())
        .then((response) => {
          const data = { ...response.data.data };
          page.value = data.pages.next;
          totalPage.value = data.pages.total;
          data.list.forEach((item) => feeds.value.push(item));
          if (page.value === null) disableScroll.value = true;
        })
        .catch(() => {
          feeds.value = [];
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function reset() {
      page.value = 1;
      user.value = [];
      feeds.value = [];
      loading.value = false;
    }

    async function handleScroll(event) {
      loadFeed();
      await event.target.complete();
    }
    function handleRefresh(event) {
      reset();
      loadInfo();
      event.target.complete();
    }

    provide("feeds", feeds);

    onIonViewDidEnter(() => {
      loadInfo();
    });
    onIonViewDidLeave(() => {
      reset();
    });
    return {
      title,
      user,
      isNull,
      feeds,
      feedNull,
      handleRefresh,
      nullMessage,
      loading,
      disableScroll,
      handleScroll,
    };
  },
});
</script>

<style scoped></style>
