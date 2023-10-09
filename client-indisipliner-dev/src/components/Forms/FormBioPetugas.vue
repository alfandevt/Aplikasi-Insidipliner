<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>
    <ion-item :color="formErrors['jabatan'] ? 'danger' : ''">
      <ion-label position="stacked">Jabatan*</ion-label>
      <ion-input
        type="text"
        readonly
        placeholder="pilih jabatan"
        v-model="jabatanLabel"
      />
      <ion-buttons slot="end">
        <ion-button
          @click="openModal(jabatanModalConfig)"
          color="primary"
          size="small"
          type="button"
          :disabled="readOnly"
        >
          <ion-icon size="small" slot="end" :icon="icons.chevronDown" />
        </ion-button>
      </ion-buttons>
    </ion-item>
    <ion-item :color="formErrors['bidang'] ? 'danger' : ''">
      <ion-label position="stacked">Bidang*</ion-label>
      <ion-input
        type="text"
        readonly
        placeholder="pilih bidang"
        v-model="bidangLabel"
      />
      <ion-buttons slot="end">
        <ion-button
          @click="openModal(bidangModalConfig)"
          color="primary"
          size="small"
          type="button"
          :disabled="readOnly"
        >
          <ion-icon size="small" slot="end" :icon="icons.chevronDown" />
        </ion-button>
      </ion-buttons>
    </ion-item>
    <ion-item
      v-if="showAdminSelect"
      :color="formErrors['status_admin'] ? 'danger' : ''"
    >
      <ion-label position="floating">Admin</ion-label>
      <ion-select :disabled="readOnly" v-model="status_admin">
        <ion-select-option
          v-for="option of selectOptions"
          :key="option['key']"
          :value="option['value']"
        >
          {{ option["label"] }}
        </ion-select-option>
      </ion-select>
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
  IonSelect,
  IonSelectOption,
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

export const PetugasDataFormComponent = yup.object().shape({
  jabatan: yup.number().required(),
  bidang: yup.number().required(),
  status_admin: yup.number(),
});

export default defineComponent({
  components: {
    IonItemGroup,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonInput,
    IonItemDivider,
  },
  props: {
    title: { type: String, default: "Data Petugas" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    jabatanId: { type: Number },
    labelJabatan: { type: String },
    bidangId: { type: Number },
    labelBidang: { type: String },
    userAdmin: { type: Number },
    showAdminSelect: { type: Boolean, default: true },
    /* FormProps */
  },
  setup(props) {
    const jabatanLabel = ref("");
    const bidangLabel = ref("");
    /* Form */
    const { value: jabatan } = useField("jabatan");
    const { value: bidang } = useField("bidang");
    const { value: status_admin } = useField("status_admin");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        jabatan.value = props.jabatanId || null;
        jabatanLabel.value = props.labelJabatan || null;
        bidang.value = props.bidangId || null;
        bidangLabel.value = props.labelBidang || null;
        status_admin.value = props.userAdmin || 0;
      }
    }
    /* Init Form */
    const formErrors = useFormErrors();
    const readOnly = computed(() => {
      return props.formMode === "read" ? true : false;
    });
    const selectOptions = ref([
      { key: "a1", value: 0, label: "Tidak" },
      { key: "a2", value: 1, label: "Iya" },
    ]);

    const jabatanModalConfig = ref({
      title: "Jabatan",
      titleKey: "jabatan",
      idKey: "row_id",
      apiUrl: "/api/petugas/jabatan/list",
      dismiss: handleCloseModal,
      selected: handleSelectJabatan,
    });
    const bidangModalConfig = ref({
      title: "Bidang",
      titleKey: "bidang",
      idKey: "row_id",
      apiUrl: "/api/petugas/bidang/list",
      dismiss: handleCloseModal,
      selected: handleSelectBidang,
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

    function handleSelectJabatan(item) {
      jabatan.value = item.row_id;
      jabatanLabel.value = item.jabatan;
    }
    function handleSelectBidang(item) {
      bidang.value = item.row_id;
      bidangLabel.value = item.bidang;
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
      jabatanLabel,
      bidangLabel,
      selectOptions,
      readOnly,
      formErrors,
      openModal,
      /* Form */
      jabatan,
      bidang,
      status_admin,
      /* Form */
      /* ModalConfig */
      jabatanModalConfig,
      bidangModalConfig,
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
