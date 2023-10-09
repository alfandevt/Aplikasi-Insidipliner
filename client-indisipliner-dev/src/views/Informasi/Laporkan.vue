<template>
  <ion-page>
    <header-info
      :title="title"
      :first-name="user.nama_depan"
      :last-name="user.nama_belakang"
      :item-title="user.kelas"
      :label="user.prodi"
      :foto="user.foto"
      :icon="icons.addCircle"
      :is-null="isNull"
      :is-disable-click="false"
      file-path="mahasiswa"
      icon-color="success"
      icon-size="large"
      @btn-click="openModal"
    />
    <ion-content :fullscreen="true">
      <refresher @refresh="handleRefresh" />
      <base-list v-if="!feedNull" keyName="foto" v-slot="{ item }">
        <base-item
          :click-disabled="true"
          :icon="icons.information"
          :title="item['kategoriLabel']"
          :label="item['deskripsi']"
          :foto="item['fileName']"
          file-path="pelanggaran"
        />
      </base-list>
      <error-item v-else :message="nullMessage" />
      <ion-loading :is-open="loading" />
      <ion-fab horizontal="end" vertical="bottom" slot="fixed">
        <ion-fab-button @click="handleSubmitValue" color="success">
          <ion-icon :icon="icons.send" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonLoading,
  IonFab,
  IonFabButton,
  IonIcon,
  onIonViewWillEnter,
  onIonViewDidLeave,
} from "@ionic/vue";
import { computed, defineComponent, provide, ref } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
import { pick } from "lodash";
import { addCircle, information, send } from "ionicons/icons";
import http, { appJsonToken } from "../../utils/http";
import { baseModal } from "../../utils/modal";
import { alertConfirm, baseAlert } from "../../utils/alert";
import { baseToast } from "../../utils/toast";

import HeaderInfo from "../../components/Headers/HeaderInfo";
import Refresher from "../../components/Utils/Refresher.vue";
import ErrorItem from "../../components/Utils/ErrorItem.vue";
import ModalFormLaporkan from "../../components/Modals/ModalFormLaporkan";
import BaseList from "../../components/List/BaseList";
import BaseItem from "../../components/List/Item/BaseItem";

export default defineComponent({
  name: "Laporkan",
  components: {
    HeaderInfo,
    Refresher,
    ErrorItem,
    BaseList,
    BaseItem,
    IonPage,
    IonContent,
    IonLoading,
    IonFab,
    IonFabButton,
    IonIcon,
  },
  setup() {
    const confirms = alertConfirm;
    const warns = baseAlert;

    const store = useStore();
    const reporter = computed(() => store.getters["auth/userInfo"]);

    const route = useRoute();
    const router = useRouter();

    const icons = ref({ addCircle, information, send });

    let currentModal = ref(0);
    const isModalOpen = ref(false);
    async function openModal() {
      let modal = await baseModal(ModalFormLaporkan, {
        title: "Form Laporkan",
        dismiss: handleCloseModal,
        submitValue: handleSave,
      });
      await modal.present();
      currentModal.value = modal;
      isModalOpen.value = true;
    }
    async function handleOpenModal() {
      await openModal();
    }
    async function closeModal() {
      await currentModal.value.dismiss();
      isModalOpen.value = false;
    }
    function handleCloseModal() {
      const message = "apakah anda yakin menutup?";
      const header = "Peringatan!";
      confirms(message, header).then(async (response) => {
        if (response) {
          await closeModal();
        }
      });
    }
    async function handleSave(values) {
      feeds.value.push(values);
      await closeModal();
    }

    const title = ref("Laporkan Mahasiswa");
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
      if (feedNull.value) return "tekan + untuk menambah detail laporan!";
      else return "berhasil";
    });

    function loadInfo() {
      let params = {
        page: 1,
        count: 1,
        keyword: route.params.nim,
      };
      params = appJsonToken(params);
      loading.value = true;
      http
        .get("/api/mahasiswa/list", params)
        .then((response) => {
          const data = { ...response.data.data };
          user.value = data.list[0];
        })
        .catch(() => {
          user.value = [];
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function reset() {
      user.value = [];
      feeds.value = [];
      loading.value = false;
    }
    function handleRefresh(event) {
      loadInfo();
      event.target.complete();
    }

    function submitLaporan() {
      const detail = [];
      for (const item of feeds.value) {
        detail.push(pick(item, ["kategori", "deskripsi", "gambar"]));
      }
      const body = JSON.stringify({
        pelapor: reporter.value["rowId"],
        terlapor: user.value["row_id"],
        detail,
      });
      const config = appJsonToken();
      loading.value = true;
      http
        .post("/api/pelanggaran/create", body, config)
        .then((response) => {
          feeds.value = [];
          const data = { ...response.data };
          baseToast(data.message, "success");
          router.replace("/");
        })
        .catch((ex) => {
          const data = { ...ex.data };
          baseToast(data.message, "danger");
        })
        .finally(() => {
          loading.value = false;
        });
    }
    async function handleSubmitValue() {
      if (feedNull.value) {
        await warns(nullMessage.value, "Peringatan!");
      } else {
        submitLaporan();
      }
    }

    function handleGuard(_to, _from, next) {
      let message = "apakah anda yakin keluar?";
      let header = "Peringatan!";

      if (isModalOpen.value) {
        message = "tutup form terlebih dahulu!";
        return warns(message, header).then(() => next(false));
      }

      if (feedNull.value) {
        return next();
      }

      confirms(message, header).then(async (response) => {
        if (!response) {
          next(false);
        } else {
          next();
        }
      });
    }

    provide("list", feeds);

    onIonViewWillEnter(() => {
      loadInfo();
    });
    onIonViewDidLeave(() => {
      reset();
    });

    onBeforeRouteLeave((to, from, next) => {
      handleGuard(to, from, next);
    });

    return {
      title,
      user,
      isNull,
      icons,
      feeds,
      feedNull,
      handleRefresh,
      handleOpenModal,
      handleSubmitValue,
      nullMessage,
      loading,
      openModal,
    };
  },
});
</script>

<style scoped></style>
