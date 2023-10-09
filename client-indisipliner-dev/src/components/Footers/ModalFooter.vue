<template>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="end" class="ion-padding-horizontal">
        <ion-button
          :size="buttonSize"
          :color="buttonColor"
          @click="$emit('action')"
          expand="full"
        >
          <ion-label>{{ buttonLabel }}</ion-label>
          <ion-icon slot="end" :icon="buttonIcon" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
</template>

<script>
import {
  IonFooter,
  IonToolbar,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { send } from "ionicons/icons";

export default defineComponent({
  components: {
    IonFooter,
    IonToolbar,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
  },
  emits: ["action"],
  props: {
    buttonColor: { type: String, default: "success" },
    buttonIcon: { type: String, default: send },
    buttonLabel: { type: String, default: "kirim" },
    buttonSize: { type: String, default: "large" },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
