<template>
  <ion-menu v-if="loggedIn" :content-id="contentId">
    <logo-header :title="title" />
    <ion-content>
      <side-nav-menu
        v-for="menu of menus"
        :key="menu.id"
        :user-role="userInfo.userType"
        :label="menu.title"
        :links="menu.links"
        :platform="menu.platform"
        :user-platform="platform"
        :user-status="userStatus"
      />
    </ion-content>
    <side-nav-footer />
  </ion-menu>
</template>

<script>
import { IonContent, IonMenu } from "@ionic/vue";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

import LogoHeader from "../Headers/LogoHeader";
import SideNavMenu from "../List/SideNavMenu";
import SideNavFooter from "../Footers/SideNavFooter";

export default defineComponent({
  components: {
    LogoHeader,
    SideNavMenu,
    SideNavFooter,
    IonContent,
    IonMenu,
  },
  props: {
    contentId: { type: String, required: true },
    title: { type: String, required: true },
  },
  setup() {
    const store = useStore();

    const menus = computed(() => {
      return store.getters["nav/sideNav"];
    });
    const platform = computed(() => {
      return store.getters["nav/deviceType"];
    });

    const userInfo = computed(() => {
      return store.getters["auth/userInfo"];
    });
    const userStatus = computed(() => {
      return store.getters["auth/userStatus"];
    });
    const loggedIn = computed(() => {
      return store.getters["auth/isLoggedIn"];
    });
    return { store, menus, userInfo, userStatus, platform, loggedIn };
  },
});
</script>

<style scoped></style>
