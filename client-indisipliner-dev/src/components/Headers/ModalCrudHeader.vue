<template>
  <ion-header :translucent="translucent">
    <close-toolbar
      :title="title"
      :closeIcon="closeIcon"
      @close="$emit('close')"
    />
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
import { IonHeader } from "@ionic/vue";
import { arrowBack, filter, close } from "ionicons/icons";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import SearchFilter from "./Toolbars/SearchFilter.vue";
import CloseToolbar from "./Toolbars/CloseToolbar.vue";

export default defineComponent({
  emits: ["search", "filter", "action", "close"],
  props: {
    title: { type: String, required: true },
    translucent: { type: Boolean, default: true },
    isFilter: { type: Boolean, default: false },
    isAction: { type: Boolean, default: false },
    closeIcon: { type: String, default: close },
  },
  components: {
    IonHeader,
    SearchFilter,
    CloseToolbar,
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
