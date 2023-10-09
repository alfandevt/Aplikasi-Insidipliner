<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['kelas'] ? 'danger' : ''">
      <ion-label position="floating">
        Kelas*
      </ion-label>
      <ion-input
        :readonly="readOnly"
        type="text"
        placeholder="17IK06R"
        v-model="kelas"
      />
    </ion-item>
    <ion-item :color="formErrors['wali_kelas'] ? 'danger' : ''">
      <ion-label position="stacked">Pembimbing Akademik*</ion-label>
      <ion-input
        type="text"
        readonly
        placeholder="pilih pembimbing akademik"
        v-model="labelWali"
      />
      <ion-buttons slot="end">
        <ion-button
          @click="openUserModal(waliModalConfig)"
          color="primary"
          size="small"
          type="button"
          :disabled="readOnly"
        >
          <ion-icon size="small" slot="end" :icon="icons.chevronDown" />
        </ion-button>
      </ion-buttons>
    </ion-item>
    <ion-item :color="formErrors['jurusan'] ? 'danger' : ''">
      <ion-label position="stacked">Jurusan*</ion-label>
      <ion-input
        type="text"
        readonly
        placeholder="pilih jurusan"
        v-model="labelJurusan"
      />
      <ion-buttons slot="end">
        <ion-button
          @click="openItemModal(jurusanModalConfig)"
          color="primary"
          size="small"
          type="button"
          :disabled="readOnly"
        >
          <ion-icon size="small" slot="end" :icon="icons.chevronDown" />
        </ion-button>
      </ion-buttons>
    </ion-item>
    <ion-item :color="formErrors['tahun_ajaran'] ? 'danger' : ''">
      <ion-label position="stacked">Tahun Akademik*</ion-label>
      <ion-input
        type="text"
        readonly
        placeholder="pilih tahun akademik"
        v-model="labelPeriode"
      />
      <ion-buttons slot="end">
        <ion-button
          @click="openItemModal(periodeModalConfig)"
          color="primary"
          size="small"
          type="button"
          :disabled="readOnly"
        >
          <ion-icon size="small" slot="end" :icon="icons.chevronDown" />
        </ion-button>
      </ion-buttons>
    </ion-item>
  </ion-item-group>
  <ion-loading :is-open="loading" />
</template>

<script>
import {
  IonItemGroup,
  IonItemDivider,
  IonItem,
  IonInput,
  IonLabel,
  IonLoading,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import {} from "ionicons/icons";
import { camera, chevronDown, add } from "ionicons/icons";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useField, useFormErrors } from "vee-validate";
import SelectItem from "../Selections/SelectItem";
import SelectUser from "../Selections/SelectUser";
import { baseModal } from "../../utils/modal";
import * as yup from "yup";

export const KelasFormComponent = yup.object().shape({
  kelas: yup
    .string()
    .max(100)
    .required(),
  wali_kelas: yup.number().required(),
  jurusan: yup.number().required(),
  tahun_ajaran: yup.number().required(),
});

export default defineComponent({
  components: {
    IonItemGroup,
    IonItemDivider,
    IonItem,
    IonInput,
    IonLabel,
    IonLoading,
    IonButtons,
    IonButton,
    IonIcon,
  },
  props: {
    title: { type: String, default: "Kelas" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    kelasLabel: { type: String },
    waliKelasId: { type: Number },
    waliKelasLabel: { type: String },
    jurusanId: { type: Number },
    jurusanLabel: { type: String },
    periodeId: { type: Number },
    periodeLabel: { type: String },
    /* FormProps */
  },
  setup(props) {
    const labelWali = ref();
    const labelJurusan = ref();
    const labelPeriode = ref();
    /* Form */
    const { value: kelas } = useField("kelas");
    const { value: wali_kelas } = useField("wali_kelas");
    const { value: jurusan } = useField("jurusan");
    const { value: tahun_ajaran } = useField("tahun_ajaran");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        kelas.value = props.kelasLabel || null;
        wali_kelas.value = props.waliKelasId || null;
        labelWali.value = props.waliKelasLabel || null;
        jurusan.value = props.jurusanId || null;
        labelJurusan.value = props.jurusanLabel || null;
        tahun_ajaran.value = props.periodeId || null;
        labelPeriode.value = props.periodeLabel || null;
      }
    }
    /* Init Form */
    const loading = ref(false);
    const formErrors = useFormErrors();
    const readOnly = computed(() => {
      return props.formMode === "read" ? true : false;
    });

    const waliModalConfig = ref({
      title: "Daftar Dosen dan Petugas",
      firstNameKey: "nama_depan",
      lastNameKey: "nama_belakang",
      titleKey: "nomor_id",
      labelKey: "status_akun",
      idKey: "row_id",
      apiUrl: "/api/akademik/kelas/listwali",
      dismiss: handleCloseModal,
      selected: handleSelectWali,
    });
    const jurusanModalConfig = ref({
      title: "Jurusan",
      titleKey: "jurusan",
      labelKey: "prodi",
      idKey: "row_id",
      apiUrl: "/api/akademik/jurusan/list",
      dismiss: handleCloseModal,
      selected: handleSelectJurusan,
    });
    const periodeModalConfig = ref({
      title: "Tahun Akademik",
      titleKey: "periode",
      idKey: "row_id",
      apiUrl: "/api/akademik/tahun/list",
      dismiss: handleCloseModal,
      selected: handleSelectPeriode,
    });

    let currentModal = ref(0);
    const isModalOpen = ref(false);
    async function openItemModal(config) {
      let modal = await baseModal(SelectItem, config);
      await modal.present();
      currentModal.value = modal;
      isModalOpen.value = true;
    }
    async function openUserModal(config) {
      let modal = await baseModal(SelectUser, config);
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

    function handleSelectWali(item) {
      wali_kelas.value = item.row_id;
      if (item.nama_belakang) {
        labelWali.value = item.nama_depan + " " + item.nama_belakang;
      } else {
        labelWali.value = item.nama_depan;
      }
    }
    function handleSelectJurusan(item) {
      jurusan.value = item.row_id;
      labelJurusan.value = item.jurusan;
    }
    function handleSelectPeriode(item) {
      tahun_ajaran.value = item.row_id;
      labelPeriode.value = item.periode;
    }

    const icons = ref({
      camera,
      chevronDown,
      add,
    });

    onMounted(() => {
      initForm();
    });
    return {
      icons,
      formErrors,
      loading,
      readOnly,
      labelWali,
      labelJurusan,
      labelPeriode,
      /* Form */
      kelas,
      wali_kelas,
      jurusan,
      tahun_ajaran,
      /* Form */
      initForm,
      openItemModal,
      openUserModal,
      waliModalConfig,
      jurusanModalConfig,
      periodeModalConfig,
    };
  },
});
</script>

<style scoped></style>
