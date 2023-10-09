<template>
  <ion-toolbar :color="toolbarColor">
    <ion-buttons v-if="isAction" slot="start">
      <ion-button :color="actionColor" @click="$emit('action')">
        <ion-icon :icon="actionIcon" />
      </ion-button>
    </ion-buttons>
    <ion-searchbar show-clear-button="focus" v-model.trim="keyword" />
    <ion-buttons v-if="isFilter" slot="end">
      <ion-button :color="filterColor" @click="$emit('filter')">
        <ion-icon :icon="filterIcon" />
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</template>

<script>
import {
  IonSearchbar,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { addCircle, filter } from "ionicons/icons";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  emits: ["search", "filter", "action"],
  props: {
    translucent: { type: Boolean, default: true },
    isFilter: { type: Boolean, default: false },
    filterIcon: { type: String, default: filter },
    filterColor: { type: String, default: "" },
    isAction: { type: Boolean, default: false },
    actionIcon: { type: String, default: addCircle },
    actionColor: { type: String, default: "" },
    toolbarColor: { type: String, default: "" },
  },
  components: {
    IonSearchbar,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
  },
  setup(_, context) {
    const keyword = ref("");

    watch(keyword, (value) => context.emit("search", value));
    return { keyword };
  },
});
</script>

<style scoped></style>
