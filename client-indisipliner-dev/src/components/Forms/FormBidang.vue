<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['bidang'] ? 'danger' : ''">
      <ion-label position="floating">
        Bidang*
      </ion-label>
      <ion-input
        :readonly="readOnly"
        type="text"
        placeholder="staf"
        v-model="bidang"
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

export const BidangFormComponent = yup.object().shape({
  bidang: yup
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
    title: { type: String, default: "Bidang" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    bidangLabel: { type: String },
    /* FormProps */
  },
  setup(props) {
    /* Form */
    const { value: bidang } = useField("bidang");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        bidang.value = props.bidangLabel || null;
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
      bidang,
      /* Form */
      initForm,
    };
  },
});
</script>

<style scoped></style>
