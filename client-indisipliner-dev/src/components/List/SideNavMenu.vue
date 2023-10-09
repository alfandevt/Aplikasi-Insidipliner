<template>
  <ion-list v-if="isMenuExist">
    <ion-list-header>
      <ion-label>
        <h2>
          <strong>{{ label }}</strong>
        </h2>
      </ion-label>
    </ion-list-header>
    <side-nav-menu-item
      v-for="item of links"
      :key="item.id"
      :label="item.label"
      :icon="item.icon"
      :roles="item.role"
      :link="item.link"
      :access="item.access"
      :platform="item.platform"
      :user-role="userRole"
      :user-access="userStatus"
      :user-platform="userPlatform"
    />
  </ion-list>
</template>

<script>
import { IonList, IonListHeader, IonLabel } from "@ionic/vue";
import { defineComponent, computed } from "vue";
import { includes } from "lodash";

import SideNavMenuItem from "./Item/SideNavMenuItem";

export default defineComponent({
  components: {
    IonList,
    IonListHeader,
    IonLabel,
    SideNavMenuItem,
  },
  props: {
    id: { type: String },
    label: { type: String },
    platform: { type: Array },
    links: { type: Array },
    userRole: { type: String },
    userPlatform: { type: String },
    userStatus: { type: String },
  },
  setup(props) {
    const isMenuExist = computed(() => {
      let access = 0;
      let devices = 0;
      for (const link of props.links) {
        if (includes(link.access, props.userStatus)) access++;
        if (includes(link.platform, props.userPlatform)) devices++;
      }
      return access > 0 && devices > 0;
    });
    return { isMenuExist };
  },
});
</script>

<style scoped></style>
