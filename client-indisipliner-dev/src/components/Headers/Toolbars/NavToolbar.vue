<template>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button @click="goBack">
        <ion-icon :icon="backIcon" />
      </ion-button>
    </ion-buttons>
    <ion-title>{{ title }}</ion-title>
  </ion-toolbar>
</template>

<script>
import {
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButtons,
  IonButton,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import { arrowBack } from "ionicons/icons";

export default defineComponent({
  props: {
    title: { type: String, required: true },
    translucent: { type: Boolean, default: true },
    backIcon: { type: String, default: arrowBack },
  },
  emits: ["navClick"],
  components: {
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButtons,
    IonButton,
  },
  setup() {
    const router = useRouter();
    function goBack() {
      router.back();
    }
    return { goBack };
  },
});
</script>

<style scoped></style>
