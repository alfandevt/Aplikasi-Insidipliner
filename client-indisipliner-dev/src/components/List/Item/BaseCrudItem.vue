<template>
  <ion-item>
    <ion-thumbnail v-if="filePath" size="large" slot="start">
      <img :src="imgUrl" :alt="foto" />
    </ion-thumbnail>
    <ion-label>
      <h2>{{ title }}</h2>
      <h3 v-if="label">{{ label }}</h3>
    </ion-label>
    <ion-buttons slot="end">
      <ion-button color="primary" @click="$emit('detail', $event)">
        <ion-icon :size="iconSize" :icon="icons.informationCircle" />
      </ion-button>
      <ion-button color="warning" @click="$emit('edit', $event)">
        <ion-icon :size="iconSize" :icon="icons.pencil" />
      </ion-button>
      <ion-button color="danger" @click="$emit('trash', $event)">
        <ion-icon :size="iconSize" :icon="icons.trash" />
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>

<script>
import {
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import {
  chevronForward,
  informationCircle,
  pencil,
  trash,
  idCard,
} from "ionicons/icons";
import { defineComponent, ref, onMounted } from "vue";
import http, { appTokenBuffer } from "../../../utils/http";

export default defineComponent({
  emits: ["btnClick", "info", "edit", "trash"],
  components: {
    IonItem,
    IonThumbnail,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
  },
  props: {
    title: { type: String },
    label: { type: String },
    foto: { type: String },
    filePath: { type: String },
  },
  setup(props) {
    const imgUrl = ref("/img/profile.jpg");
    const icons = ref({ informationCircle, pencil, trash, idCard });

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
    return { imgUrl, icons };
  },
});
</script>

<style scoped></style>
