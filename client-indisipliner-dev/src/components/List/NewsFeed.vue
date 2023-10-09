<template>
  <ion-list>
    <ion-list-header>
      <ion-label>
        <h1>{{ title }}</h1>
      </ion-label>
    </ion-list-header>
    <news-feed-item
      v-for="(feed, index) of feeds"
      :key="index"
      :mahasiswa="feed.mahasiswa"
      :kelas="feed.kelas"
      :deskripsi="feed.deskripsi"
      :waktu="feed.waktu"
    />
  </ion-list>
</template>

<script>
import { IonList, IonListHeader, IonLabel } from "@ionic/vue";
import { defineComponent, inject } from "vue";
import NewsFeedItem from "./Item/NewsFeedItem";

export default defineComponent({
  components: { IonList, IonListHeader, IonLabel, NewsFeedItem },
  inject: ["feeds"],
  props: { title: { type: String } },
  setup() {
    const feeds = inject("feeds");
    return { feeds };
  },
});
</script>

<style scoped></style>
