<template>
  <ion-split-pane :disabled="disabled" :content-id="contentId">
    <slot name="nav">Side Navigation</slot>
    <slot name="page">Router</slot>
  </ion-split-pane>
</template>

<script>
import { IonSplitPane } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonSplitPane,
  },
  props: {
    disabled: { type: Boolean, default: false },
    contentId: { type: String, required: true },
  },
});
</script>

<style scoped>
</style>