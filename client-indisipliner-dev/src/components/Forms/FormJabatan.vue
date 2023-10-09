<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['jabatan'] ? 'danger' : ''">
      <ion-label position="floating">
        Jabatan*
      </ion-label>
      <ion-input
        :readonly="readOnly"
        type="text"
        placeholder="staf"
        v-model="jabatan"
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

export const JabatanFormComponent = yup.object().shape({
  jabatan: yup
    .string()
    .max(100)
    .required(),
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
    title: { type: String, default: "Jabatan" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    jabatanLabel: { type: String },
    /* FormProps */
  },
  setup(props) {
    /* Form */
    const { value: jabatan } = useField("jabatan");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        jabatan.value = props.jabatanLabel || null;
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
      jabatan,
      /* Form */
      initForm,
    };
  },
});
</script>

<style scoped></style>
