<template>
  <ion-header :translucent="translucent">
    <close-toolbar :title="title" @close="$emit('close')" />
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
        :icon-label="iconLabel"
        :is-lecturer="isLecturer"
        :is-admin="isAdmin"
        @btn-click="$emit('btnClick', $event)"
      />
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { IonHeader, IonToolbar } from "@ionic/vue";
import { information } from "ionicons/icons";
import { defineComponent } from "vue";
import UserItem from "../List/Item/UserItem";
import CloseToolbar from "../Headers/Toolbars/CloseToolbar";

export default defineComponent({
  emits: ["btnClick", "close"],
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
    iconLabel: { type: String },
    isLecturer: { type: Number, default: 0 },
    isAdmin: { type: Number, default: 0 },
  },
  components: {
    IonHeader,
    IonToolbar,
    UserItem,
    CloseToolbar,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
