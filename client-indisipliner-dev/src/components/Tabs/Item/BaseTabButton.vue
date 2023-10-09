<template>
  <ion-tab-button :tab="tab" :href="link">
    <ion-icon :color="isActive" :icon="icon" />
    <ion-label :color="isActive">{{ label }}</ion-label>
  </ion-tab-button>
</template>

<script>
import { IonIcon, IonLabel, IonTabButton } from "@ionic/vue";
import { defineComponent, computed, toRefs } from "vue";
import { useRoute } from "vue-router";
import { includes } from "lodash";

export default defineComponent({
  components: { IonIcon, IonLabel, IonTabButton },
  props: {
    id: { type: String },
    tab: { type: String },
    label: { type: String },
    icon: { type: String },
    link: { type: String },
    access: { type: Array },
    platform: { type: Array },
    userAccess: { type: String },
    userPlatform: { type: String },
  },
  setup(props) {
    const { access, platform, userAccess, userPlatform, link } = toRefs(props);
    const route = useRoute();

    const isExist = computed(() => {
      const accessValid = includes(access.value, userAccess.value);
      const deviceValid = includes(platform.value, userPlatform.value);
      return accessValid && deviceValid;
    });

    const isActive = computed(() => {
      const currentPath = route.path;
      return currentPath === link.value ? "primary" : "";
    });

    return { isExist, isActive };
  },
});
</script>

<style scoped></style>
