<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item>
      <ion-label position="floating">
        Kelas
      </ion-label>
      <ion-input :readonly="true" type="text" :value="kelas" />
    </ion-item>
    <ion-item>
      <ion-label position="floating">Jurusan</ion-label>
      <ion-input :readonly="true" :value="jurusan" />
    </ion-item>
    <ion-item>
      <ion-label position="floating">Program Studi</ion-label>
      <ion-input :readonly="true" :value="prodi" />
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
    title: { type: String, default: "Info Mahasiswa" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    kelas: { type: String },
    jurusan: { type: String },
    prodi: { type: String },

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
