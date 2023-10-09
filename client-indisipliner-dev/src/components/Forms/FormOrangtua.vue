<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['nama'] ? 'danger' : ''">
      <ion-label position="floating">
        Nama*
      </ion-label>
      <ion-input
        :readonly="readOnly"
        type="text"
        inputmode="tel"
        placeholder="Andi"
        v-model="nama"
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
    <ion-item :color="formErrors['nomor_seluler'] ? 'danger' : ''">
      <ion-label position="floating">Nomor Seluler</ion-label>
      <ion-input
        :readonly="readOnly"
        placeholder="081234567890"
        v-model="nomor_seluler"
      />
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
  IonSelect,
  IonSelectOption,
  IonLoading,
} from "@ionic/vue";
import { camera, chevronDown, add } from "ionicons/icons";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useField, useFormErrors } from "vee-validate";
import * as yup from "yup";

export const OrangtuaFormComponent = yup.object().shape({
  nama: yup
    .string()
    .max(100)
    .required(),
  jenis_kelamin: yup
    .string()
    .max(1)
    .required(),
  nomor_seluler: yup.string().max(20),
});

export default defineComponent({
  components: {
    IonItemGroup,
    IonItemDivider,
    IonItem,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonLoading,
  },
  emits: ["inputChanges"],
  props: {
    title: { type: String, default: "Orangtua" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    namaLengkap: { type: String },
    jenisKelamin: { type: String },
    nomorSeluler: { type: String },
    /* FormProps */
  },
  setup(props) {
    /* Form */
    const { value: nama } = useField("nama");
    const { value: jenis_kelamin } = useField("jenis_kelamin");
    const { value: nomor_seluler } = useField("nomor_seluler");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        nama.value = props.namaLengkap || null;
        jenis_kelamin.value = props.jenisKelamin || null;
        nomor_seluler.value = props.nomorSeluler || null;
      }
    }
    /* Init Form */
    const loading = ref(false);
    const formErrors = useFormErrors();
    const readOnly = computed(() => {
      return props.formMode === "read" ? true : false;
    });

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
      icons,
      selectOptions,
      formErrors,
      loading,
      readOnly,
      /* Form */
      nama,
      jenis_kelamin,
      nomor_seluler,
      /* Form */
      initForm,
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
