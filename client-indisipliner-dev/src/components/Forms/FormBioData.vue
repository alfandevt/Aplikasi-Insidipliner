<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['nomor_id'] ? 'danger' : ''">
      <ion-label position="floating">
        Nomor Induk*
      </ion-label>
      <ion-input
        :readonly="readOnly"
        type="text"
        inputmode="tel"
        placeholder="10100022334456"
        v-model="nomor_id"
      />
    </ion-item>
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-item :color="formErrors['nama_depan'] ? 'danger' : ''">
            <ion-label position="floating">
              Nama Depan*
            </ion-label>
            <ion-input
              :readonly="readOnly"
              type="text"
              placeholder="John"
              v-model="nama_depan"
            />
          </ion-item>
        </ion-col>
        <ion-col>
          <ion-item :color="formErrors['nama_belakang'] ? 'danger' : ''">
            <ion-label position="floating">
              Nama Belakang
            </ion-label>
            <ion-input
              :readonly="readOnly"
              type="text"
              placeholder="Doe"
              v-model="nama_belakang"
            />
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-item :color="formErrors['tgl_lahir'] ? 'danger' : ''">
      <ion-label position="floating">Tanggal Lahir*</ion-label>
      <ion-datetime
        :readonly="readOnly"
        placeholder="pilih tanggal"
        v-model="tgl_lahir"
      />
    </ion-item>
    <ion-item :color="formErrors['jenis_kelamin'] ? 'danger' : ''">
      <ion-label position="floating">Jenis Kelamin*</ion-label>
      <ion-select :disabled="readOnly" v-model="jenis_kelamin">
        <ion-select-option
          v-for="option of selectOptions"
          :key="option['key']"
          :value="option['value']"
        >
          {{ option["label"] }}
        </ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item :color="formErrors['alamat_rumah'] ? 'danger' : ''">
      <ion-label position="floating">Alamat</ion-label>
      <ion-textarea
        :readonly="readOnly"
        placeholder="Jl Transyogi"
        v-model="alamat_rumah"
      />
    </ion-item>
    <ion-item :color="formErrors['nomor_seluler'] ? 'danger' : ''">
      <ion-label position="floating">Nomor Seluler</ion-label>
      <ion-input
        :readonly="readOnly"
        placeholder="081234567890"
        v-model="nomor_seluler"
      />
    </ion-item>
    <ion-item :color="formErrors['email'] ? 'danger' : ''">
      <ion-label position="floating">Email</ion-label>
      <ion-input :readonly="readOnly" type="email" v-model="email" />
    </ion-item>
    <ion-item :color="formErrors['foto'] ? 'danger' : ''">
      <ion-label>Foto</ion-label>
      <ion-input
        type="text"
        readonly
        placeholder="1230014555.jpg"
        v-model="imgName"
      />
      <ion-buttons slot="end">
        <ion-button
          :disabled="readOnly"
          @click="$refs.inputFile.click()"
          color="primary"
          size="large"
          type="button"
        >
          <ion-icon size="large" slot="end" :icon="icons.camera" />
        </ion-button>
      </ion-buttons>
      <input
        type="file"
        ref="inputFile"
        capture="environment"
        accept="image/*"
        @change="handleInputChange"
        :readonly="readOnly"
      />
    </ion-item>
    <ion-thumbnail>
      <img :src="imgUrl" :alt="imgName" />
    </ion-thumbnail>
  </ion-item-group>
  <ion-loading :is-open="loading" />
</template>

<script>
import {
  IonItemGroup,
  IonItemDivider,
  IonItem,
  IonInput,
  IonTextarea,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonDatetime,
  IonLoading,
  IonThumbnail,
} from "@ionic/vue";
import { camera, chevronDown, add } from "ionicons/icons";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useField, useFormErrors } from "vee-validate";
import http, { appTokenBuffer } from "../../utils/http";
import { parseDate } from "../../utils/date";
import { baseToast } from "../../utils/toast";
import Compressor from "compressorjs";
import * as yup from "yup";

export const BioDataFormComponent = yup.object().shape({
  nomor_id: yup
    .string()
    .max(100)
    .required(),
  nama_depan: yup
    .string()
    .max(100)
    .required(),
  nama_belakang: yup.string().max(100),
  tgl_lahir: yup.date().required(),
  jenis_kelamin: yup
    .string()
    .max(1)
    .required(),
  alamat_rumah: yup.string().max(255),
  nomor_seluler: yup.string().max(20),
  email: yup.string().max(255),
  foto: yup.string(),
});

export default defineComponent({
  components: {
    IonItemGroup,
    IonItemDivider,
    IonItem,
    IonInput,
    IonTextarea,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonGrid,
    IonRow,
    IonCol,
    IonDatetime,
    IonLoading,
    IonThumbnail,
  },
  emits: ["inputChanges"],
  props: {
    title: { type: String, default: "Bio Data" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    nomorId: { type: String },
    namaDepan: { type: String },
    namaBelakang: { type: String },
    tglLahir: { type: String },
    jenisKelamin: { type: String },
    alamatRumah: { type: String },
    nomorSeluler: { type: String },
    eMail: { type: String },
    photo: { type: Number },
    fileName: { type: String },
    filePath: { type: String },
    /* FormProps */
  },
  setup(props, context) {
    const imgUrl = ref("img/placeholder.png");
    const imgName = ref("foto.jpeg");
    /* Form */
    const { value: nomor_id } = useField("nomor_id");
    const { value: nama_depan } = useField("nama_depan");
    const { value: nama_belakang } = useField("nama_belakang");
    const { value: tgl_lahir } = useField("tgl_lahir");
    const { value: jenis_kelamin } = useField("jenis_kelamin");
    const { value: alamat_rumah } = useField("alamat_rumah");
    const { value: nomor_seluler } = useField("nomor_seluler");
    const { value: email } = useField("email");
    const { value: foto } = useField("foto");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        nomor_id.value = props.nomorId || null;
        nama_depan.value = props.namaDepan || null;
        nama_belakang.value = props.namaBelakang || null;
        tgl_lahir.value = parseDate(props.tglLahir).toISOString() || null;
        jenis_kelamin.value = props.jenisKelamin || null;
        alamat_rumah.value = props.alamatRumah || null;
        nomor_seluler.value = props.nomorSeluler || null;
        email.value = props.eMail || null;
        imgName.value = props.fileName || null;
        loadImg();
      }
    }
    /* Init Form */
    const loading = ref(false);
    const formErrors = useFormErrors();
    const readOnly = computed(() => {
      return props.formMode === "read" ? true : false;
    });

    function loadImg() {
      const config = appTokenBuffer();
      http
        .get("/api/upload/req/" + props.filePath + "/" + props.fileName, config)
        .then((response) => {
          const url = Buffer.from(response.data, "binary").toString("base64");
          imgUrl.value = "data:image/*;base64," + url;
        })
        .catch(() => {
          imgUrl.value = "img/placeholder.png";
          imgName.value = "foto.jpeg";
        });
    }
    function handleInputChange(event) {
      const files = event.target.files[0];
      if (files) {
        new Compressor(files, {
          quality: 0.6,
          maxWidth: 1920,
          maxHeight: 1920,
          success: (result) => {
            const reader = new FileReader();
            reader.onload = (ev) => (imgUrl.value = ev.target.result);
            reader.readAsDataURL(result);
            imgName.value = files.name;
            foto.value = files.name;
            context.emit("inputChanges", result);
          },
          error(ex) {
            baseToast(ex.message, "danger");
          },
        });
      }
    }
    const selectOptions = ref([
      { key: "l1", value: "l", label: "laki-laki" },
      { key: "p2", value: "p", label: "perempuan" },
    ]);
    const icons = ref({
      camera,
      chevronDown,
      add,
    });

    onMounted(() => {
      initForm();
    });
    return {
      imgUrl,
      imgName,
      icons,
      selectOptions,
      formErrors,
      loading,
      readOnly,
      /* Form */
      nomor_id,
      nama_depan,
      nama_belakang,
      tgl_lahir,
      jenis_kelamin,
      alamat_rumah,
      nomor_seluler,
      email,
      foto,
      /* Form */
      loadImg,
      initForm,
      handleInputChange,
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
.select-disabled,
.item-select-disabled ion-label {
  opacity: 1 !important;
}
</style>
