<template>
  <ion-item>
    <ion-avatar v-if="filePath" size="large" slot="start">
      <img :src="imgUrl" :alt="fullName" />
    </ion-avatar>
    <ion-label>
      <h2>{{ fullName }}</h2>
      <h3 v-if="title">{{ title }}</h3>
      <h4 v-if="label">{{ label }}</h4>
    </ion-label>
    <ion-badge slot="end" v-if="isAdmin" color="primary">{{
      adminBadge
    }}</ion-badge>
    <ion-badge slot="end" v-if="isLecturer" color="secondary">
      {{ lecturerBadge }}
    </ion-badge>
    <ion-buttons slot="end">
      <ion-button
        :disabled="clickDisabled"
        :color="iconColor"
        @click="$emit('btnClick', $event)"
      >
        <ion-icon :size="iconSize" :icon="icon" />
        <ion-label v-if="iconLabel">{{ iconLabel }}</ion-label>
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>

<script>
import {
  IonItem,
  IonAvatar,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
} from "@ionic/vue";
import {
  chevronForward,
  informationCircle,
  pencil,
  trash,
  idCard,
} from "ionicons/icons";
import { computed, defineComponent, ref, onMounted } from "vue";
import http, { appTokenBuffer } from "../../../utils/http";

export default defineComponent({
  emits: ["btnClick", "info", "edit", "trash"],
  components: {
    IonItem,
    IonAvatar,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonBadge,
  },
  props: {
    firstName: { type: String },
    lastName: { type: String },
    title: { type: String },
    label: { type: String },
    foto: { type: String },
    icon: { type: String, default: chevronForward },
    iconColor: { type: String },
    iconSize: { type: String },
    iconLabel: { type: String },
    filePath: { type: String },
    clickDisabled: { type: Boolean, default: false },
    isLecturer: { type: Number, default: 0 },
    isAdmin: { type: Number, default: 0 },
  },
  setup(props) {
    const imgUrl = ref("/img/profile.jpg");
    const fullName = computed(() => {
      if (props.lastName) return props.firstName + " " + props.lastName;
      return props.firstName;
    });

    const adminBadge = computed(() => (props.isAdmin ? "ADMIN" : ""));
    const lecturerBadge = computed(() => (props.isLecturer ? "PA" : ""));

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
    return { fullName, imgUrl, icons, adminBadge, lecturerBadge };
  },
});
</script>

<style scoped>
ion-label {
  text-transform: capitalize;
}
</style>
