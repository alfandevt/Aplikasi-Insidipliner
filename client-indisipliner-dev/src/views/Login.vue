<template>
  <ion-page>
    <logo-header :title="title" />
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title color="light">{{ cardTitle }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form-login />
          <ion-button class="submit" @click="handleLogin" expand="full">Kirim</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from "@ionic/vue";
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useForm, useFormErrors } from "vee-validate";
import http, { appJson } from "../utils/http";
import { baseToast } from "../utils/toast";
import LogoHeader from "../components/Headers/LogoHeader";
import FormLogin, { loginSchema } from "../components/Forms/FormLogin";

export default defineComponent({
  components: {
    LogoHeader,
    FormLogin,
    IonPage,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const loggedIn = computed(() => store.getters["auth/isLoggedIn"]);

    const form = useForm({ validationSchema: loginSchema });
    const formErrors = useFormErrors();

    const title = ref("Login");
    const cardTitle = ref("Selamat Datang!");

    async function handleLogin() {
      const res = await form.validate();
      if (res.valid) {
        const values = { ...form.values };
        const body = JSON.stringify({
          nomor_id: values.nomorId,
          kata_sandi: values.sandi,
        });
        http
          .post("/api/auth/login", body, appJson())
          .then((response) => {
            const headers = { ...response.headers };
            const jwt = {
              token: headers["x-auth-token"],
              refresh: headers["x-auth-refresh"],
            };
            const data = { ...response.data.data };
            let status = data.user.admin ? "admin" : "user";
            const payload = { ...data, ...jwt, status };

            store.dispatch("auth/login", payload);
            location.reload();
          })
          .catch((ex) => {
            const data = { ...ex.data };

            baseToast(data.message, "danger");
          });
      }
    }

    if (loggedIn.value) router.push("/home");

    return { title, cardTitle, handleLogin, router, store, formErrors };
  },
});
</script>

<style scoped>
/* ion-thumbnail.logo {
  --size: 150px;
} */
ion-content {
  --padding-top: 50%;
  --padding-start: 10%;
  --padding-end: 10%;
  --background: url("/img/loginbg.jpg") 90% 50% no-repeat;
}

ion-card {
  --background: rgba(17, 17, 17, 0.253);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 12px;
}

ion-button.submit {
  margin: 20px 20px 10px 20px;
}

@media only screen and (min-width: 1200px) {
  ion-content {
    --padding-top: 20%;
    --padding-start: 60%;
    --padding-end: 10%;
  }
}
</style>
