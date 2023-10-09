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
      <base-item
        :title="item[titleKey]"
        :label="item[labelKey]"
        icon-color="primary"
        icon-size="large"
        @btnClick="handleSelect(item[idKey], item[titleKey])"
      />
    </base-list>
    <error-item v-else />
    <infinite-load @infinite="handleScroll" :disabled="disableScroll" />
    <ion-loading :is-open="loading" />
  </ion-content>
  <modal-footer
    v-if="isFooter"
    :buttonColor="buttonColor"
    :buttonIcon="buttonIcon"
    :buttonLabel="buttonLabel"
    :buttonSize="buttonSize"
    @action="handleSelect(null, null)"
  />
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
import { reload } from "ionicons/icons";
import ModalHeader from "../Headers/ModalHeader.vue";
import ModalFooter from "../Footers/ModalFooter.vue";
import ErrorItem from "../Utils/ErrorItem.vue";
import Refresher from "../Utils/Refresher.vue";
import InfiniteLoad from "../Utils/InfiniteLoad.vue";
import BaseList from "../../components/List/BaseList";
import BaseItem from "../../components/List/Item/BaseItem";
import http, { appJsonToken } from "../../utils/http";

export default defineComponent({
  components: {
    IonContent,
    IonLoading,
    ModalHeader,
    ModalFooter,
    BaseList,
    BaseItem,
    ErrorItem,
    Refresher,
    InfiniteLoad,
  },
  props: {
    apiUrl: { type: String },
    title: { type: String },
    titleKey: { type: String },
    labelKey: { type: String },
    idKey: { type: String },
    dismiss: { type: Function },
    selected: { type: Function },
    isFooter: { type: Boolean, default: false },
    /* footer */
    buttonColor: { type: String, default: "primary" },
    buttonIcon: { type: String, default: reload },
    buttonLabel: { type: String, default: "reset" },
    buttonSize: { type: String, default: "default" },
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

    function handleSelect(id, title) {
      props.selected({ [props.idKey]: id, [props.titleKey]: title });
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
