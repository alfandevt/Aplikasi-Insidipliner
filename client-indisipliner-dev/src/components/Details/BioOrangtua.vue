<template>
  <ion-item-group v-if="!listNull">
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item v-for="item of list" :key="item.row_id">
      <ion-label position="floating">
        {{ item.nama }}
      </ion-label>
      <ion-input :readonly="true" type="text" :value="item.nomor_seluler" />
    </ion-item>
  </ion-item-group>
  <ion-item-group v-else>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item>
      <ion-input :readonly="true" type="text" value="Tidak Ditemukan" />
    </ion-item>
  </ion-item-group>
  <ion-loading :is-open="loading" />
</template>

<script>
import {
  IonItemGroup,
  IonItemDivider,
  IonItem,
  IonInput,
  IonLabel,
  IonLoading,
} from "@ionic/vue";
import { camera, chevronDown, add } from "ionicons/icons";
import { defineComponent, ref } from "vue";
// import { parseDate } from "../../utils/date";

export default defineComponent({
  components: {
    IonItemGroup,
    IonItemDivider,
    IonItem,
    IonInput,
    IonLabel,
    IonLoading,
  },
  emits: ["inputChanges"],
  props: {
    title: { type: String, default: "Info Orangtua" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    list: { type: Array },
    listNull: { type: Boolean, default: false },

    /* FormProps */
  },
  setup() {
    /* Init Form */ const loading = ref(false);

    const icons = ref({
      camera,
      chevronDown,
      add,
    });

    return {
      icons,
      loading,
    };
  },
});
</script>

<style scoped>
.select-disabled,
.item-select-disabled ion-label {
  opacity: 1 !important;
}
</style>
