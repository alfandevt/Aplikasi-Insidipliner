<template>
  <ion-header :translucent="translucent">
    <nav-toolbar :title="title" />
    <search-filter
      :isFilter="isFilter"
      @filter="$emit('filter')"
      @search="$emit('search', $event)"
    />
  </ion-header>
</template>

<script>
import { IonHeader } from "@ionic/vue";
import { arrowBack, filter } from "ionicons/icons";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import SearchFilter from "./Toolbars/SearchFilter.vue";
import NavToolbar from "./Toolbars/NavToolbar.vue";

export default defineComponent({
  emits: ["search", "filter"],
  props: {
    title: { type: String, required: true },
    translucent: { type: Boolean, default: true },
    isFilter: { type: Boolean, default: false },
  },
  components: {
    IonHeader,
    SearchFilter,
    NavToolbar,
  },
  setup() {
    const router = useRouter();
    function backward() {
      router.back();
    }

    const icons = ref({
      arrowBack,
      filter,
    });

    return { backward, icons };
  },
});
</script>

<style scoped></style>
