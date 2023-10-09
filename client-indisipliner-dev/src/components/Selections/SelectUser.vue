<template>
  <modal-header
    :isSearch="true"
    :title="title"
    @close="dismiss"
    @search="handleInput"
  />
  <ion-content :fullscreen="true">
    <refresher @refresh="handleRefresh" />
    <base-list v-if="!listNull" :key-name="idKey" v-slot="{ item }">
      <user-item
        :first-name="item[firstNameKey]"
        :last-name="item[lastNameKey]"
        :title="item[titleKey]"
        :label="item[labelKey]"
        :foto="item[fotoKey]"
        :file-path="filePath"
        @btnClick="handleSelect(item)"
      />
    </base-list>
    <error-item v-else />
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
import ModalHeader from "../Headers/ModalHeader.vue";
import ErrorItem from "../Utils/ErrorItem.vue";
import Refresher from "../Utils/Refresher.vue";
import InfiniteLoad from "../Utils/InfiniteLoad.vue";
import BaseList from "../../components/List/BaseList";
import UserItem from "../../components/List/Item/UserItem";
import http, { appJsonToken } from "../../utils/http";

export default defineComponent({
  components: {
    IonContent,
    IonLoading,
    ModalHeader,
    BaseList,
    UserItem,
    ErrorItem,
    Refresher,
    InfiniteLoad,
  },
  props: {
    apiUrl: { type: String },
    firstNameKey: { type: String },
    lastNameKey: { type: String },
    title: { type: String },
    titleKey: { type: String },
    labelKey: { type: String },
    idKey: { type: String },
    fotoKey: { type: String },
    filePath: { type: String },
    dismiss: { type: Function },
    selected: { type: Function },
  },
  setup(props) {
    const loading = ref(false);

    const list = ref([]);
    const page = ref(1);
    const totalPage = ref(10);
    const count = ref(10);
    const disableScroll = ref(false);
    const listNull = computed(() => {
      if (list.value.length <= 0) return true;
      else return false;
    });

    function resetState() {
      page.value = 1;
      totalPage.value = 10;
      list.value = [];
      disableScroll.value = false;
      loading.value = false;
    }

    function loadFeed(keyword) {
      const params = {
        page: page.value,
        count: count.value,
        keyword: keyword,
      };
      http
        .get(props.apiUrl, appJsonToken(params))
        .then((response) => {
          const data = { ...response.data.data };
          data.list.forEach((item) => list.value.push(item));
          page.value = data.pages.next;
          totalPage.value = data.pages.total;
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

    function handleSelect(item) {
      props.selected(item);
      props.dismiss();
    }

    provide("list", list);

    onMounted(() => {
      loading.value = true;
      loadFeed();
    });
    onUnmounted(() => {
      resetState();
    });
    return {
      list,
      listNull,
      handleScroll,
      disableScroll,
      handleInput,
      handleRefresh,
      handleSelect,
      loading,
    };
  },
});
</script>

<style scoped></style>
