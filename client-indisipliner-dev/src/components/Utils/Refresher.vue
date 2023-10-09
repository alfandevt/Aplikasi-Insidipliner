<template>
  <ion-refresher
    @ionStart="$emit('start', $event)"
    @ionPull="$emit('pull', $event)"
    @ionRefresh="$emit('refresh', $event)"
    slot="fixed"
  >
    <ion-refresher-content
      :pulling-icon="icon"
      :pulling-text="pullText"
      :refreshing-spinner="spinner"
      :refreshing-text="refreshText"
    />
  </ion-refresher>
</template>

<script>
import { IonRefresher, IonRefresherContent } from "@ionic/vue";
import { sync } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonRefresher, IonRefresherContent },
  props: {
    icon: { type: String, default: sync },
    spinner: { type: String, default: "dots" },
    pullText: { type: String, default: "tarik kebawah" },
    refreshText: { type: String, default: "memuat..." },
  },
  emits: ["refresh", "pull", "start"],
});
</script>

<style scoped>
</style>