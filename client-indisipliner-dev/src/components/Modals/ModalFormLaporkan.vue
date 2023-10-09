<template>
  <modal-header :title="title" @close="dismiss" />
  <ion-content class="ion-padding">
    <ion-list>
      <ion-item-group>
        <ion-item :color="formErrors['kategori'] ? 'danger' : ''">
          <ion-label position="stacked">Kategori</ion-label>
          <ion-input
            type="text"
            readonly
            placeholder="pilih kategori"
            v-model="kategoriLabel"
          />
          <ion-buttons slot="end">
            <ion-button
              @click="openModal"
              color="primary"
              size="small"
              type="button"
            >
              <ion-icon size="small" slot="end" :icon="icons.chevronDown" />
            </ion-button>
          </ion-buttons>
        </ion-item>
        <ion-item :color="formErrors['deskripsi'] ? 'danger' : ''">
          <ion-label position="stacked">Keterangan</ion-label>
          <ion-textarea
            type="text"
            placeholder="seragam tidak lengkap"
            v-model="deskripsi"
          />
        </ion-item>
        <ion-item :color="formErrors['gambar'] ? 'danger' : ''">
          <ion-label>Foto</ion-label>
          <ion-input
            type="text"
            readonly
            placeholder="1230014555.jpg"
            v-model="fileName"
          />
          <ion-buttons slot="end">
            <ion-button
              @click="takePicture"
              color="primary"
              size="large"
              type="button"
            >
              <ion-icon size="large" slot="end" :icon="icons.camera" />
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-item-group>
      <ion-thumbnail>
        <img :src="imgUrl" :alt="imgAlt" />
      </ion-thumbnail>
    </ion-list>
    <ion-fab horizontal="end" vertical="bottom" slot="fixed">
      <ion-fab-button @click="handleSubmitValue" color="success">
        <ion-icon :icon="icons.add" />
      </ion-fab-button>
    </ion-fab>
    <ion-loading :is-open="loading" />
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonList,
  IonItemGroup,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButtons,
  IonButton,
  IonFab,
  IonFabButton,
  IonLoading,
  IonThumbnail,
  IonIcon,
} from "@ionic/vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { camera, chevronDown, add } from "ionicons/icons";
import { computed, defineComponent, ref } from "vue";
import { baseModal } from "../../utils/modal";
import { useField, useFormErrors, useForm } from "vee-validate";
import http, { appMultiFormToken, appTokenBuffer } from "../../utils/http";
import { baseToast } from "../../utils/toast";
import ModalHeader from "../Headers/ModalHeader";
import SelectItem from "../Selections/SelectItem";
import Compressor from "compressorjs";
import * as yup from "yup";

const laporkanSchema = yup.object().shape({
  kategori: yup.number().required(),
  deskripsi: yup
    .string()
    .max(100)
    .required(),
  gambar: yup.number().required(),
  kategoriLabel: yup.string().required(),
  fileName: yup.string().required(),
});

export default defineComponent({
  components: {
    IonContent,
    IonList,
    IonItemGroup,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButtons,
    IonButton,
    IonFab,
    IonFabButton,
    IonLoading,
    IonThumbnail,
    IonIcon,
    ModalHeader,
  },
  props: {
    title: { type: String, default: "Laporkan" },
    dismiss: { type: Function },
    submitValue: { type: Function },
  },
  setup(props) {
    const currentForm = useForm({ validationSchema: laporkanSchema });
    const formErrors = useFormErrors();
    const { value: kategori } = useField("kategori");
    const { value: deskripsi } = useField("deskripsi");
    const { value: gambar } = useField("gambar");
    const { value: kategoriLabel } = useField("kategoriLabel");
    const { value: fileName } = useField("fileName");

    const imgUrl = ref("/img/placeholder.png");
    const imgAlt = computed(() => {
      return fileName.value || "gambar";
    });
    const loading = ref(false);

    let currentModal = ref(0);
    const isModalOpen = ref(false);
    async function openModal() {
      let modal = await baseModal(SelectItem, {
        title: "Kategori",
        titleKey: "kategori",
        idKey: "row_id",
        apiUrl: "/api/pelanggaran/kategori/list",
        dismiss: handleCloseModal,
        selected: handleSelect,
      });
      await modal.present();
      currentModal.value = modal;
      isModalOpen.value = true;
    }
    async function closeModal() {
      await currentModal.value.dismiss();
      isModalOpen.value = false;
    }

    async function uploadImg(file, filename) {
      const formData = new FormData();
      formData.append("foto", file, filename.toLowerCase());
      loading.value = true;
      const config = appMultiFormToken();
      http
        .post("/api/pelanggaran/upload", formData, config)
        .then((response) => {
          const data = { ...response.data.data };
          gambar.value = data.id;
          fileName.value = data.filename;
          loadImg(fileName.value);
        })
        .catch((ex) => {
          const data = { ...ex.data };

          baseToast(data.message, "danger");
        })
        .finally(() => (loading.value = false));
    }

    function loadImg(fileName) {
      http
        .get("/api/upload/req/pelanggaran/" + fileName, appTokenBuffer())
        .then((response) => {
          const url = Buffer.from(response.data, "binary").toString("base64");
          imgUrl.value = "data:image/*;base64," + url;
        })
        .catch(() => {
          const url = "img/placeholder.png";
          imgUrl.value = url;
        });
    }

    async function handleSubmitValue() {
      const res = await currentForm.validate();
      if (res.valid) {
        props.submitValue({ ...currentForm.values });
      }
    }

    async function takePicture() {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
      });
      const fileName = new Date().getTime() + ".jpeg";
      const response = await fetch(image.webPath).then((res) => res.blob());
      console.log(response);
      if (response) {
        new Compressor(response, {
          quality: 0.6,
          maxWidth: 1920,
          maxHeight: 1920,
          success: (result) => {
            console.log(result);
            uploadImg(result, fileName);
          },
          error(ex) {
            baseToast(ex.message, "danger");
          },
        });
      }
    }

    function handleCloseModal() {
      closeModal();
    }

    function handleSelect(item) {
      kategori.value = item.row_id;
      kategoriLabel.value = item.kategori;
    }

    const icons = ref({ camera, chevronDown, add });
    return {
      icons,
      openModal,
      kategoriLabel,
      deskripsi,
      fileName,
      gambar,
      currentForm,
      formErrors,
      imgUrl,
      imgAlt,
      handleSubmitValue,
      loading,
      takePicture,
    };
  },
});
</script>

<style scoped>
input[type="file"] {
  opacity: 0;
  position: absolute;
  width: 0px;
  height: 0px;
}
ion-thumbnail {
  --size: 100%;
  --border-radius: 10px;
}
</style>
