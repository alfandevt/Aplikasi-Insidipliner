<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['prodi'] ? 'danger' : ''">
      <ion-label position="floating">
        Prodi*
      </ion-label>
      <ion-input
        :readonly="readOnly"
        type="text"
        placeholder="manajemen"
        v-model="prodi"
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

export const ProdiFormComponent = yup.object().shape({
  prodi: yup
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
    title: { type: String, default: "Prodi" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    prodiLabel: { type: String },
    /* FormProps */
  },
  setup(props) {
    /* Form */
    const { value: prodi } = useField("prodi");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        prodi.value = props.prodiLabel || null;
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
      prodi,
      /* Form */
      initForm,
    };
  },
});
</script>

<style scoped></style>
