<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['jurusan'] ? 'danger' : ''">
      <ion-label position="floating">
        Jurusan*
      </ion-label>
      <ion-input
        :readonly="readOnly"
        type="text"
        placeholder="informatika"
        v-model="jurusan"
      />
    </ion-item>
    <ion-item :color="formErrors['prodi'] ? 'danger' : ''">
      <ion-label position="stacked">Prodi*</ion-label>
      <ion-input
        type="text"
        readonly
        placeholder="pilih prodi"
        v-model="labelProdi"
      />
      <ion-buttons slot="end">
        <ion-button
          @click="openModal(prodiModalConfig)"
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
import { camera, chevronDown, add } from "ionicons/icons";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useField, useFormErrors } from "vee-validate";
import SelectItem from "../Selections/SelectItem";
import { baseModal } from "../../utils/modal";
import * as yup from "yup";

export const JurusanFormComponent = yup.object().shape({
  jurusan: yup
    .string()
    .max(100)
    .required(),
  prodi: yup.number().required(),
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
    title: { type: String, default: "Jurusan" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    prodiId: { type: Number },
    prodiLabel: { type: String },
    jurusanLabel: { type: String },
    /* FormProps */
  },
  setup(props) {
    const labelProdi = ref();
    /* Form */
    const { value: jurusan } = useField("jurusan");
    const { value: prodi } = useField("prodi");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        jurusan.value = props.jurusanLabel || null;
        prodi.value = props.prodiId || null;
        labelProdi.value = props.prodiLabel || null;
      }
    }
    /* Init Form */
    const loading = ref(false);
    const formErrors = useFormErrors();
    const readOnly = computed(() => {
      return props.formMode === "read" ? true : false;
    });

    const prodiModalConfig = ref({
      title: "Prodi",
      titleKey: "prodi",
      idKey: "row_id",
      apiUrl: "/api/akademik/prodi/list",
      dismiss: handleCloseModal,
      selected: handleSelectProdi,
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

    function handleSelectProdi(item) {
      prodi.value = item.row_id;
      labelProdi.value = item.prodi;
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
      labelProdi,
      /* Form */
      jurusan,
      /* Form */
      initForm,
      openModal,
      prodiModalConfig,
    };
  },
});
</script>

<style scoped></style>
