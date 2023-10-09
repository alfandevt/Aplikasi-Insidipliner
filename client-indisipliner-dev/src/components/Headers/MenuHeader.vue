<template>
  <ion-header :translucent="translucent">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button />
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: { type: String, required: true },
    translucent: { type: Boolean, default: true },
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
  },
});
</script>

<style scoped>
</style>