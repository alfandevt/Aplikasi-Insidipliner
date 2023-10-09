<template>
  <ion-page>
    <backward-header title="Keamanan" />
    <ion-content :fullscreen="true">
      <form-sandi title="Kata Sandi Lama" subtitle="Kata Sandi Baru" />
      <ion-button
        @click="handleSubmit"
        class="ion-margin"
        expand="block"
        size="default"
      >
        <ion-label>Kirim</ion-label>
        <ion-icon :icon="icons.send" />
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonButton, IonLabel, IonIcon } from "@ionic/vue";
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { useForm } from "vee-validate";
import { send } from "ionicons/icons";
import BackwardHeader from "../../components/Headers/BackwardHeader.vue";
import FormSandi, {
  KataSandiFormComponent,
} from "../../components/Forms/FormSandi";
import http, { appJsonToken } from "../../utils/http";
import { baseToast } from "../../utils/toast";
import { assign, omit } from "lodash";

export default defineComponent({
  components: {
    BackwardHeader,
    FormSandi,
    IonPage,
    IonContent,
    IonButton,
    IonLabel,
    IonIcon,
  },
  setup() {
    const store = useStore();
    const userInfo = computed(() => {
      return store.getters["auth/userInfo"];
    });

    const currentForm = useForm({
      validationSchema: KataSandiFormComponent,
    });

    async function handleSubmit() {
      const res = await currentForm.validate();
      console.log(userInfo.value);
      if (res.valid) {
        const data = omit(currentForm.values, "kata_sandi_confirm");
        assign(data, {
          akun: userInfo.value.rowId,
          nomor_id: userInfo.value.nomorId,
        });
        submitData(data);
      }
    }
    function submitData(body) {
      const config = appJsonToken();
      http
        .put("/api/auth/sandi/update", body, config)
        .then((response) => {
          const data = { ...response.data };
          baseToast(data.message, "success");
          store.dispatch({ type: "auth/logout" });
        })
        .catch((ex) => {
          const data = { ...ex.data };
          baseToast(data.message, "danger");
        });
    }

    const icons = ref({ send });

    return { handleSubmit, icons };
  },
});
</script>

<style></style>
