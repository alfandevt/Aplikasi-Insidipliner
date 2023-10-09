<template>
  <ion-header :translucent="translucent">
    <nav-toolbar :title="title" />
  </ion-header>
</template>

<script>
import { IonHeader } from "@ionic/vue";
import { arrowBack } from "ionicons/icons";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import NavToolbar from "./Toolbars/NavToolbar.vue";

export default defineComponent({
  props: {
    title: { type: String, required: true },
    translucent: { type: Boolean, default: true },
  },
  components: {
    IonHeader,
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
