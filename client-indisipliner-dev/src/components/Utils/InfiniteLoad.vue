<template>
  <ion-infinite-scroll
    :disabled="disabled"
    :position="position"
    :threshold="threshold"
    @ionInfinite="$emit('infinite', $event)"
  >
    <ion-infinite-scroll-content
      :loading-spinner="spinner"
      :loading-text="text"
    />
  </ion-infinite-scroll>
</template>

<script>
import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonInfiniteScroll, IonInfiniteScrollContent },
  emits: ["infinite"],
  props: {
    disabled: { type: Boolean, default: false },
    position: { type: String, default: "bottom" },
    threshold: { type: String, default: "15%" },
    spinner: { type: String, default: "dots" },
    text: { type: String, default: "memuat..." },
  },
});
</script>

<style scoped>
</style>