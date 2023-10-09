<template>
  <ion-grid :fixed="true">
    <ion-row>
      <ion-col>
        <ion-list-header>
          <ion-label>
            <h2>{{ title }}</h2>
          </ion-label>
        </ion-list-header>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col
        size-lg="6"
        size-xs="12"
        v-for="(feed, index) of feeds"
        :key="index"
      >
        <news-card-item
          :mahasiswa="feed.mahasiswa"
          :kelas="feed.kelas"
          :deskripsi="feed.deskripsi"
          :tanggal="feed.tanggal"
          :waktu="feed.waktu"
          :foto="feed.gambar"
          filePath="pelanggaran"
        />
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import { IonListHeader, IonLabel, IonGrid, IonRow, IonCol } from "@ionic/vue";
import { defineComponent, inject } from "vue";
import NewsCardItem from "./Item/NewsCardItem.vue";

export default defineComponent({
  components: {
    IonListHeader,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    NewsCardItem,
  },
  inject: ["feeds"],
  props: { keyName: { type: String }, title: { type: String } },
  setup() {
    const feeds = inject("feeds");
    return { feeds };
  },
});
</script>

<style scoped></style>
