<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['kata_sandi_lama'] ? 'danger' : ''">
      <ion-label position="floating">
        Kata Sandi Lama*
      </ion-label>
      <ion-input type="password" v-model="kata_sandi_lama" />
    </ion-item>

    <ion-item-divider>
      <ion-label>{{ subtitle }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['kata_sandi_baru'] ? 'danger' : ''">
      <ion-label position="floating">
        Kata Sandi Baru*
      </ion-label>
      <ion-input type="password" v-model="kata_sandi_baru" />
    </ion-item>

    <ion-item :color="formErrors['kata_sandi_confirm'] ? 'danger' : ''">
      <ion-label position="floating">
        Konfirmasi Kata Sandi Baru*
      </ion-label>
      <ion-input type="password" v-model="kata_sandi_confirm" />
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
import { defineComponent, ref } from "vue";
import { useField, useFormErrors } from "vee-validate";
import * as yup from "yup";

export const KataSandiFormComponent = yup.object().shape({
  kata_sandi_lama: yup
    .string()
    .max(100)
    .required(),
  kata_sandi_baru: yup
    .string()
    .min(8)
    .required(),
  kata_sandi_confirm: yup
    .string()
    .required()
    .oneOf([yup.ref("kata_sandi_baru")], "Passwords do not match"),
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
    title: { type: String, default: "Jurusan" },
    subtitle: { type: String },
  },
  setup() {

    /* Form */
    const { value: kata_sandi_lama } = useField("kata_sandi_lama");
    const { value: kata_sandi_baru } = useField("kata_sandi_baru");
    const { value: kata_sandi_confirm } = useField("kata_sandi_confirm");

    /* Form */
    const loading = ref(false);
    const formErrors = useFormErrors();

    return {
      formErrors,
      loading,
      /* Form */
      kata_sandi_lama,
      kata_sandi_baru,
      kata_sandi_confirm,
      /* Form */
    };
  },
});
</script>

<style scoped></style>
