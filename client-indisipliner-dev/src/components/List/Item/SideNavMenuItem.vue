<template>
  <ion-item v-if="isExist" :color="isActive" button @click="goto(link)">
    <ion-icon slot="start" :icon="icon" />
    <ion-label>
      <p>{{ label }}</p>
    </ion-label>
  </ion-item>
</template>

<script>
import { IonIcon, IonLabel, IonItem } from "@ionic/vue";
import { defineComponent, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { includes } from "lodash";

export default defineComponent({
  components: { IonIcon, IonLabel, IonItem },
  props: {
    id: { type: String },
    label: { type: String },
    icon: { type: String },
    link: { type: String },
    roles: { type: Array },
    access: { type: Array },
    platform: { type: Array },
    userRole: { type: String },
    userAccess: { type: String },
    userPlatform: { type: String },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();

    const isExist = computed(() => {
      const accessValid = includes(props.access, props.userAccess);
      const deviceValid = includes(props.platform, props.userPlatform);
      const roleValid = includes(props.roles, props.userRole);
      return accessValid && deviceValid && roleValid;
    });

    const isActive = computed(() => {
      const currentPath = route.path;
      return currentPath === props.link ? "primary" : "";
    });

    function goto(url) {
      router.push(url);
    }
    return { isExist, router, goto, isActive };
  },
});
</script>

<style scoped></style>
