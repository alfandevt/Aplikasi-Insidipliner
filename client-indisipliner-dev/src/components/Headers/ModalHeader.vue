<template>
  <ion-header :translucent="translucent">
    <close-toolbar
      :title="title"
      :closeIcon="closeIcon"
      @close="$emit('close')"
    />
    <search-filter
      v-if="isSearch"
      :isFilter="isFilter"
      @filter="$emit('filter')"
      @search="$emit('search', $event)"
    />
  </ion-header>
</template>

<script>
import { IonHeader } from "@ionic/vue";
import { close, filter } from "ionicons/icons";
import { defineComponent, ref, watch } from "vue";
import CloseToolbar from "./Toolbars/CloseToolbar.vue";
import SearchFilter from "./Toolbars/SearchFilter.vue";

export default defineComponent({
  emits: ["search", "filter", "close"],
  props: {
    title: { type: String, required: true },
    translucent: { type: Boolean, default: true },
    isSearch: { type: Boolean, default: false },
    isFilter: { type: Boolean, default: false },
    closeIcon: { type: String, default: close },
  },
  components: {
    SearchFilter,
    CloseToolbar,
    IonHeader,
  },
  setup(_props, context) {
    const icons = ref({
      close,
      filter,
    });

    const keyword = ref("");

    watch(keyword, (value) => context.emit("search", value));
    return { icons, keyword };
  },
});
</script>

<style scoped></style>
