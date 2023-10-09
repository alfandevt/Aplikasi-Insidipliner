<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>
    <ion-item :color="formErrors['kelas'] ? 'danger' : ''">
      <ion-label position="stacked">Kelas*</ion-label>
      <ion-input
        type="text"
        readonly
        placeholder="pilih kelas"
        v-model="kelasLabel"
      />
      <ion-buttons slot="end">
        <ion-button
          @click="openModal(kelasModalConfig)"
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
</template>

<script>
import {
  IonItemGroup,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonItemDivider,
} from "@ionic/vue";
import { camera, chevronDown, add } from "ionicons/icons";
import { defineComponent, ref, computed, onMounted } from "vue";
import { useField, useFormErrors } from "vee-validate";
import { baseModal } from "../../utils/modal";
import SelectItem from "../Selections/SelectItem";
import * as yup from "yup";

export const BioKelasFormComponent = yup.object().shape({
  kelas: yup.number().required(),
});

export default defineComponent({
  components: {
    IonItemGroup,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonItemDivider,
  },
  props: {
    title: { type: String, default: "Data Kelas" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    kelasId: { type: Number },
    labelKelas: { type: String },
    /* FormProps */
  },
  setup(props) {
    const kelasLabel = ref("");
    /* Form */
    const { value: kelas } = useField("kelas");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        kelas.value = props.kelasId || null;
        kelasLabel.value = props.labelKelas || null;
      }
    }
    /* Init Form */
    const formErrors = useFormErrors();
    const readOnly = computed(() => {
      return props.formMode === "read" ? true : false;
    });

    const kelasModalConfig = ref({
      title: "Kelas",
      titleKey: "kelas",
      labelKey: "jurusan",
      idKey: "row_id",
      apiUrl: "/api/akademik/kelas/list",
      dismiss: handleCloseModal,
      selected: handleSelectKelas,
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
      kelas.value = item.row_id;
      kelasLabel.value = item.kelas;
    }

    onMounted(() => {
      initForm();
    });

    const icons = ref({
      camera,
      chevronDown,
      add,
    });
    return {
      icons,
      kelasLabel,
      readOnly,
      formErrors,
      openModal,
      /* Form */
      kelas,
      /* Form */
      /* ModalConfig */
      kelasModalConfig,
    };
  },
});
</script>

<style scoped>
.select-disabled,
.item-select-disabled ion-label {
  opacity: 1 !important;
}
</style>
