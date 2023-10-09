<template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-thumbnail slot="start" class="logo">
        <img src="/img/lp3i.png" alt="logo" />
      </ion-thumbnail>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { IonHeader, IonToolbar, IonThumbnail, IonTitle } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: { title: { type: String, required: true } },
  components: { IonHeader, IonToolbar, IonThumbnail, IonTitle },
});
</script>

<style scoped>
ion-toolbar {
  background: transparent;
}
</style>
