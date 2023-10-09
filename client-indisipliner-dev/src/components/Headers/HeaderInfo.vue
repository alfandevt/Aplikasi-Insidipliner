<template>
  <ion-header :translucent="translucent">
    <nav-toolbar :title="title" />
    <ion-toolbar>
      <user-item
        v-if="!isNull"
        :first-name="firstName"
        :last-name="lastName"
        :title="itemTitle"
        :label="label"
        :foto="foto"
        :file-path="filePath"
        :click-disabled="isDisableClick"
        :icon="icon"
        :icon-color="iconColor"
        :icon-size="iconSize"
        @btn-click="$emit('btnClick', $event)"
      />
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { IonHeader, IonToolbar } from "@ionic/vue";
import { arrowBack, information } from "ionicons/icons";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import UserItem from "../List/Item/UserItem";
import NavToolbar from "./Toolbars/NavToolbar.vue";

export default defineComponent({
  emits: ["btnClick"],
  props: {
    firstName: { type: String },
    lastName: { type: String },
    itemTitle: { type: String },
    label: { type: String },
    foto: { type: String },
    title: { type: String, required: true },
    translucent: { type: Boolean, default: true },
    filePath: { type: String },
    isNull: { type: Boolean },
    isDisableClick: { type: Boolean, default: true },
    icon: { type: String, default: information },
    iconColor: { type: String },
    iconSize: { type: String },
  },
  components: {
    IonHeader,
    IonToolbar,
    UserItem,
    NavToolbar,
  },
  setup() {
    const router = useRouter();
    function backward() {
      router.back();
    }

    const icons = ref({
      arrowBack,
    });
    return { backward, icons };
  },
});
</script>

<style scoped></style>
