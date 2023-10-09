<template>
  <ion-page>
    <ion-tabs @ionTabsWillChange="ionTabsWillChange">
      <ion-tab-bar slot="bottom">
        <template v-for="item of tabs.links" :key="item.id">
          <ion-tab-button
            :class="isExist(item.access, item.platform) ? '' : 'hidden'"
            :tab="item.tab"
            :href="item.link"
          >
            <ion-icon :icon="item.icon" />
            <ion-label>{{ item.label }}</ion-label>
          </ion-tab-button>
        </template>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import {
  IonTabs,
  IonTabBar,
  IonPage,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/vue";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { includes } from "lodash";

export default defineComponent({
  components: {
    IonPage,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  },
  props: {},
  setup() {
    const store = useStore();

    const tabs = computed(() => {
      return store.getters["nav/petugasTabs"];
    });
    const userPlatform = computed(() => {
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

    function isExist(access, platform) {
      console.log(access);
      console.log(platform);
      console.log(userStatus.value);
      console.log(userPlatform.value);
      const accessValid = includes(access, userStatus.value);
      const deviceValid = includes(platform, userPlatform.value);
      const valid = accessValid && deviceValid;
      console.log(valid);
      return accessValid && deviceValid;
    }

    function ionTabsWillChange(evt) {
      console.log(evt);
    }
    return {
      store,
      tabs,
      userInfo,
      loggedIn,
      ionTabsWillChange,
      isExist,
    };
  },
});
</script>

<style scoped>
ion-tab-button.hidden {
  display: none;
}
</style>
