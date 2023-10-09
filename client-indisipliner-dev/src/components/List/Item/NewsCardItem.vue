<template>
  <ion-card>
    <img :src="imgUrl" />
    <ion-card-header>
      <ion-card-subtitle
        >{{ kelas }} | {{ tanggal }} {{ waktu }}</ion-card-subtitle
      >
      <ion-card-title>{{ mahasiswa }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ deskripsi }}
    </ion-card-content>
  </ion-card>
</template>

<script>
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/vue";
import { defineComponent, ref, onMounted } from "vue";
import http, { appTokenBuffer } from "../../../utils/http";

export default defineComponent({
  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
  },
  props: {
    mahasiswa: { type: String },
    kelas: { type: String },
    deskripsi: { type: String },
    waktu: { type: String },
    tanggal: { type: String },
    foto: { type: String },
    filePath: { type: String },
  },
  setup(props) {
    const imgUrl = ref("/img/profile.jpg");

    function loadImg(cb) {
      http
        .get(
          "/api/upload/req/" + props.filePath + "/" + props.foto,
          appTokenBuffer()
        )
        .then((response) => {
          const url = Buffer.from(response.data, "binary").toString("base64");
          imgUrl.value = "data:image/*;base64," + url;
        })
        .catch(() => {
          const url = "img/profile.jpg";
          imgUrl.value = url;
        })
        .finally(() => cb);
    }
    onMounted(() => {
      loadImg();
    });
    return { imgUrl };
  },
});
</script>

<style scoped>
img {
  display: block;
  position: relative;
}
</style>
