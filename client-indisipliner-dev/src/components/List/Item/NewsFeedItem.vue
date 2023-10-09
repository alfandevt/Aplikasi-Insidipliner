<template>
  <ion-item>
    <ion-icon
      slot="start"
      color="danger"
      size="large"
      :icon="alertCircle"
    />
    <ion-label>
      <h2>{{ mahasiswa }}</h2>
      <h2>{{ kelas }}</h2>
      <p>{{ deskripsi }}</p>
      <p class="time">{{ waktu }}</p>
    </ion-label>
  </ion-item>
</template>

<script>
import { IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { alertCircle } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonItem, IonLabel, IonIcon },
  props: {
    mahasiswa: { type: String },
    kelas: { type: String },
    deskripsi: { type: String },
    waktu: { type: String },
  },
  setup() {
    return { alertCircle };
  },
});
</script>

<style scoped>
ion-label > p.time {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style>