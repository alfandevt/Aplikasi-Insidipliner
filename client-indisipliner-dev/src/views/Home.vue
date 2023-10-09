<template>
  <ion-page>
    <menu-header :title="title" />

    <ion-content :fullscreen="true">
      <refresher @refresh="handleRefresh" />
      <news-feed-grid v-if="!feedNull" title="Update Pelanggaran" />
      <error-item :title="nullMessage" v-else />
      <infinite-load @infinite="handleScroll" :disabled="disableScroll" />
      <ion-loading :is-open="loading" />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonPage,
  IonLoading,
  /* life cycle */
  onIonViewDidEnter,
  onIonViewDidLeave,
} from "@ionic/vue";
import { computed, defineComponent, ref, provide } from "vue";
import http, { appJsonToken } from "../utils/http";
import MenuHeader from "../components/Headers/MenuHeader.vue";
import NewsFeedGrid from "../components/List/NewsFeedGrid.vue";
import InfiniteLoad from "../components/Utils/InfiniteLoad.vue";
import Refresher from "../components/Utils/Refresher.vue";
import ErrorItem from "../components/Utils/ErrorItem.vue";

export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonPage,
    IonLoading,
    MenuHeader,
    NewsFeedGrid,
    Refresher,
    ErrorItem,
    InfiniteLoad,
  },
  setup() {
    const title = ref("Beranda");
    const loading = ref(false);

    const page = ref(1);
    const totalPage = ref(10);
    const count = ref(30);
    const disableScroll = ref(false);
    const feeds = ref([]);
    const feedNull = computed(() => {
      if (feeds.value.length <= 0) return true;
      else return false;
    });
    const nullMessage = computed(() => {
      if (feedNull.value) return "tidak ditemukan";
      else return "berhasil";
    });

    function loadFeed() {
      const body = JSON.stringify({
        page: page.value,
        count: count.value,
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
    function resetState() {
      page.value = 1;
      totalPage.value = 10;
      feeds.value = [];
      disableScroll.value = false;
      loading.value = false;
    }

    function handleRefresh(event) {
      resetState();
      loadFeed();
      event.target.complete();
    }
    async function handleScroll(event) {
      loadFeed();
      await event.target.complete();
    }

    provide("feeds", feeds);

    onIonViewDidEnter(() => {
      loadFeed();
    });
    onIonViewDidLeave(() => {
      resetState();
    });

    return {
      title,
      feeds,
      feedNull,
      handleRefresh,
      nullMessage,
      loading,
      handleScroll,
      disableScroll,
    };
  },
});
</script>

<style scoped></style>
