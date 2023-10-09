<template>
  <ion-header :translucent="translucent">
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
    <search-filter
      :isFilter="isFilter"
      :isAction="isAction"
      @action="$emit('action')"
      @search="$emit('search', $event)"
      @filter="$emit('filter')"
    />
  </ion-header>
</template>

<script>
import { IonHeader, IonToolbar, IonTitle } from "@ionic/vue";
import { arrowBack, filter } from "ionicons/icons";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import SearchFilter from "./Toolbars/SearchFilter.vue";

export default defineComponent({
  emits: ["search", "filter", "action"],
  props: {
    title: { type: String, required: true },
    translucent: { type: Boolean, default: true },
    isFilter: { type: Boolean, default: false },
    isAction: { type: Boolean, default: false },
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    SearchFilter,
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
