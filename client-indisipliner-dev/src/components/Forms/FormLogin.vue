<template>
  <div class="input-group">
    <ion-item :color="fieldErrors['nomorId'] ? 'danger' : ''" lines="none">
      <ion-label position="floating">Nomor ID</ion-label>
      <ion-input
        type="text"
        inputmode="tel"
        name="nomorId"
        id="nomorId"
        v-model.trim="nomorId"
      />
    </ion-item>
    <ion-item :color="fieldErrors['sandi'] ? 'danger' : ''" lines="none">
      <ion-label position="floating">Kata Sandi</ion-label>
      <ion-input
        :type="visible"
        inputmode="text"
        name="sandi"
        id="sandi"
        v-model.trim="sandi"
      />
    </ion-item>
  </div>
</template>

<script>
import { IonItem, IonLabel, IonInput } from "@ionic/vue";
import { eye, eyeOff } from "ionicons/icons";
import { defineComponent, ref, computed } from "vue";
import { useField, useFormErrors } from "vee-validate";
import * as yup from "yup";

export const loginSchema = yup.object().shape({
  nomorId: yup
    .string()
    .max(100)
    .label("Nomor ID")
    .required(),
  sandi: yup
    .string()
    .max(100)
    .label("Kata Sandi")
    .required(),
});

export default defineComponent({
  components: { IonItem, IonLabel, IonInput },
  setup() {
    const { value: nomorId } = useField("nomorId");
    const { value: sandi } = useField("sandi");
    const fieldErrors = useFormErrors();

    const isVisible = ref(false);
    const icons = computed(() => {
      return isVisible.value ? eye : eyeOff;
    });
    const visible = computed(() => {
      return isVisible.value ? "text" : "password";
    });
    function toggleVisible() {
      isVisible.value = !isVisible.value;
    }
    return {
      isVisible,
      icons,
      visible,
      toggleVisible,
      nomorId,
      sandi,
      fieldErrors,
    };
  },
});
</script>

<style scoped>
.input-group {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin: 12px;
}
</style>
