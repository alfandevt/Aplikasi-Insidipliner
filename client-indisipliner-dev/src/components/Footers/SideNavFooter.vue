<template>
  <ion-footer>
    <ion-toolbar v-if="loggedIn">
      <ion-buttons>
        <ion-button color="danger" @click="handleLogout" expand="full">
          <ion-icon slot="start" :icon="logOut" />
          <ion-label>Log Out</ion-label>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
</template>

<script>
import {
  IonFooter,
  IonLabel,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { defineComponent, computed } from "vue";
import { logOut } from "ionicons/icons";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    IonFooter,
    IonLabel,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
  },
  setup() {
    const store = useStore();

    const loggedIn = computed(() => {
      return store.getters["auth/isLoggedIn"];
    });

    const text = computed(() => {
      let date = new Date();
      let year = date.getUTCFullYear().toString();
      let word = "@fandevtian " + year;
      return word;
    });

    function handleLogout() {
      store.dispatch({ type: "auth/logout" });
    }
    return { logOut, text, loggedIn, handleLogout };
  },
});
</script>

<style scoped>
</style>