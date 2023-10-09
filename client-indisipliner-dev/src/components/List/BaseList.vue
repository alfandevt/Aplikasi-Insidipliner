<template>
  <ion-list>
    <ion-item-group v-for="item of list" :key="item[keyName]">
      <slot :item="item"></slot>
    </ion-item-group>
  </ion-list>
</template>

<script>
import { IonList, IonItemGroup } from "@ionic/vue";
import { defineComponent, inject } from "vue";

export default defineComponent({
  components: { IonList, IonItemGroup },
  props: { keyName: { type: String } },
  inject: ["list"],
  setup() {
    const list = inject("list");
    return { list };
  },
});
</script>

<style scoped></style>
