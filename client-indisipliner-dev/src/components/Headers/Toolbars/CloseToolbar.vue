<template>
  <ion-toolbar>
    <ion-title>{{ title }}</ion-title>
    <ion-buttons slot="end">
      <ion-button color="danger" @click="$emit('close')">
        <ion-icon :icon="closeIcon" />
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</template>

<script>
import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { close } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: { type: String, required: true },
    translucent: { type: Boolean, default: true },
    closeIcon: { type: String, default: close },
  },
  emits: ["close"],
  components: {
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
