<template>
  <ion-footer>
    <ion-toolbar class="ion-padding-vertical">
      <ion-buttons v-if="!isUpdate" slot="start">
        <ion-button color="primary" @click="$emit('update')">
          <ion-icon :icon="icons.pencil" />
          <ion-label>Ubah</ion-label>
        </ion-button>
        <ion-button color="danger" @click="$emit('trash')">
          <ion-icon :icon="icons.trash" />
          <ion-label>Hapus</ion-label>
        </ion-button>
      </ion-buttons>
      <ion-buttons v-else slot="end">
        <ion-button color="danger" @click="$emit('cancel')">
          <ion-icon :icon="icons.close" />
          <ion-label>Batal</ion-label>
        </ion-button>
        <ion-button color="success" @click="$emit('send')">
          <ion-icon :icon="icons.send" />
          <ion-label>Kirim</ion-label>
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
import { defineComponent, ref, computed } from "vue";
import { send, pencil, trash, close } from "ionicons/icons";

export default defineComponent({
  components: {
    IonFooter,
    IonToolbar,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
  },
  emits: ["update", "trash", "cancel", "send"],
  props: {
    formMode: { type: String },
    resetPass: { type: Boolean, default: true },
    setAdmin: { type: Boolean, default: false },
    isAdmin: { type: Number, default: 0 },
  },
  setup(props) {
    const isUpdate = computed(() => {
      return props.formMode === "update" ? true : false;
    });
    const icons = ref({
      send,
      pencil,
      trash,
      close,
    });
    return { icons, isUpdate };
  },
});
</script>

<style scoped></style>
