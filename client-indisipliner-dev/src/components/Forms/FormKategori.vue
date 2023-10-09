<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['kategori'] ? 'danger' : ''">
      <ion-label position="floating">
        Kategori*
      </ion-label>
      <ion-input
        :readonly="readOnly"
        type="text"
        placeholder="etika"
        v-model="kategori"
      />
    </ion-item>
    <ion-item :color="formErrors['poin'] ? 'danger' : ''">
      <ion-label position="floating">
        Poin*
      </ion-label>
      <ion-input
        :readonly="readOnly"
        type="number"
        placeholder="15"
        v-model="poin"
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
  IonLoading,
} from "@ionic/vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useField, useFormErrors } from "vee-validate";
import * as yup from "yup";

export const KategoriFormComponent = yup.object().shape({
  kategori: yup
    .string()
    .max(100)
    .required(),
  poin: yup.number().required(),
});

export default defineComponent({
  components: {
    IonItemGroup,
    IonItemDivider,
    IonItem,
    IonInput,
    IonLabel,
    IonLoading,
  },
  props: {
    title: { type: String, default: "Kategori" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    kategoriLabel: { type: String },
    poinNumber: { type: Number },
    /* FormProps */
  },
  setup(props) {
    /* Form */
    const { value: kategori } = useField("kategori");
    const { value: poin } = useField("poin");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        kategori.value = props.kategoriLabel || null;
        poin.value = props.poinNumber || null;
      }
    }
    /* Init Form */
    const loading = ref(false);
    const formErrors = useFormErrors();
    const readOnly = computed(() => {
      return props.formMode === "read" ? true : false;
    });

    onMounted(() => {
      initForm();
    });
    return {
      formErrors,
      loading,
      readOnly,
      /* Form */
      kategori,
      poin,
      /* Form */
      initForm,
    };
  },
});
</script>

<style scoped></style>
