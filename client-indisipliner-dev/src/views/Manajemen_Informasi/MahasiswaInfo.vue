<template>
  <ion-page>
    <header-info
      :title="headerTitle"
      :first-name="user.nama_depan"
      :last-name="user.nama_belakang"
      :item-title="user.kelas"
      :label="user.prodi"
      :foto="user.foto"
      :is-null="isNull"
      file-path="mahasiswa"
    />
    <ion-content :fullscreen="true">
      <bio-data
        :nomor-id="user.nomor_id"
        :nama-depan="user.nama_depan"
        :nama-belakang="user.nama_belakang"
        :tgl-lahir="formatedBirthDate"
        :jenis-kelamin="user.jenis_kelamin"
        :alamat-rumah="user.alamat_rumah"
        :nomor-seluler="user.nomor_seluler"
        :e-mail="user.email"
        :file-name="user.foto"
        file-path="mahasiswa"
        form-mode="read"
      />
      <bio-mahasiswa
        :kelas="user.kelas"
        :jurusan="user.jurusan"
        :prodi="user.prodi"
      />
      <bio-orangtua :list="list" :list-null="listNull" />
    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { IonPage, IonContent, onIonViewDidEnter } from "@ionic/vue";
import { useRoute } from "vue-router";
import http, { appJsonToken } from "../../utils/http";
import { parseDate } from "../../utils/date";
import HeaderInfo from "../../components/Headers/HeaderInfo.vue";
import BioData from "../../components/Details/BioData.vue";
import BioMahasiswa from "../../components/Details/BioMahasiswa.vue";
import BioOrangtua from "../../components/Details/BioOrangtua.vue";

export default defineComponent({
  components: {
    IonPage,
    IonContent,
    HeaderInfo,
    BioData,
    BioMahasiswa,
    BioOrangtua,
  },
  setup() {
    const route = useRoute();
    const nim = computed(() => {
      return route.params.nim;
    });

    const headerTitle = ref("Informasi Mahasiswa");
    const page = ref(1);
    const count = ref(1);
    const user = ref([]);
    const formatedBirthDate = ref();
    const list = ref([]);
    const loading = ref(false);

    const isNull = computed(() => {
      if (user.value.length <= 0) return true;
      else return false;
    });
    const listNull = computed(() => {
      if (list.value.length <= 0) return true;
      else return false;
    });

    function loadInfo() {
      let params = {
        page: page.value,
        count: count.value,
        keyword: nim.value,
      };
      params = appJsonToken(params);
      http
        .get("/api/mahasiswa/list", params)
        .then((response) => {
          const data = { ...response.data.data };
          user.value = { ...data.list[0] };
          formatedBirthDate.value = parseDate(
            user.value.tgl_lahir
          ).toISOString();
          loadFeed(user.value.mahasiswa_id);
        })
        .catch(() => {
          user.value = [];
        });
    }

    function loadFeed(mahasiswaId) {
      let params = {
        page: 1,
        count: 100,
        mahasiswa: mahasiswaId,
      };
      params = appJsonToken(params);
      http
        .get("/api/mahasiswa/orangtua/list", params)
        .then((response) => {
          const data = { ...response.data.data };
          data.list.forEach((item) => list.value.push(item));
        })
        .catch(() => {
          list.value = [];
        })
        .finally(() => {
          loading.value = false;
        });
    }

    onIonViewDidEnter(() => {
      loadInfo();
    });

    return {
      headerTitle,
      loading,
      isNull,
      listNull,
      user,
      list,
      formatedBirthDate,
    };
  },
});
</script>

<style></style>
