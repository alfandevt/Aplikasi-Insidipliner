<template>
  <ion-item color="danger" lines="none">
    <ion-label>
      <h2>{{ message }}</h2>
    </ion-label>
  </ion-item>
</template>

<script>
import { IonItem, IonLabel } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonItem, IonLabel },
  props: { message: { type: String, default: "tidak ditemukan" } },
});
</script>

<style scoped>
</style>