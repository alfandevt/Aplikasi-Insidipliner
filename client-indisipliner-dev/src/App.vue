<template>
  <ion-app>
    <split-layout :disabled="!loggedIn" content-id="app01">
      <template v-slot:nav>
        <side-nav :title="menuTitle" content-id="app01" />
      </template>
      <template v-slot:page>
        <ion-router-outlet id="app01" />
      </template>
    </split-layout>
  </ion-app>
</template>

<script>
import { computed, ref, defineComponent } from "vue";
import { useStore } from "vuex";
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import SplitLayout from "./components/Layout/SplitLayout";
import SideNav from "./components/Nav/SideNav";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    SplitLayout,
    SideNav,
  },
  setup() {
    const store = useStore();
    const loggedIn = computed(() => store.getters["auth/isLoggedIn"]);

    const contentId = ref("main-content");
    const menuTitle = ref("App Indisipliner");
    function loadData() {
      store.dispatch({ type: "auth/load" });
    }

    loadData();

    return { loggedIn, contentId, menuTitle };
  },
});
</script>