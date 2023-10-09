<template>
  <ion-header :translucent="translucent">
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
    <ion-toolbar>
      <form-date-range @pickDate="$emit('pickDate', $event)" />
    </ion-toolbar>
    <search-filter
      v-if="isSearch"
      :isFilter="isFilter"
      @filter="$emit('filter')"
      @search="$emit('search', $event)"
    />
  </ion-header>
</template>

<script>
import { IonHeader, IonToolbar, IonTitle } from "@ionic/vue";
import { arrowBack } from "ionicons/icons";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import FormDateRange from "../Forms/FormDateRange.vue";
import SearchFilter from "./Toolbars/SearchFilter.vue";

export default defineComponent({
  emits: ["search", "filter", "pickDate"],
  props: {
    title: { type: String, required: true },
    translucent: { type: Boolean, default: true },
    isSearch: { type: Boolean, default: false },
    isFilter: { type: Boolean, default: false },
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    FormDateRange,
    SearchFilter,
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
