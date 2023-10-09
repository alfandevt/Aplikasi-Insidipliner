<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item>
      <ion-label position="floating">
        Nomor Induk
      </ion-label>
      <ion-input
        :readonly="true"
        type="text"
        inputmode="tel"
        :value="nomorId"
      />
    </ion-item>
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">
              Nama Depan
            </ion-label>
            <ion-input :readonly="true" type="text" :value="namaDepan" />
          </ion-item>
        </ion-col>
        <ion-col>
          <ion-item>
            <ion-label position="floating">
              Nama Belakang
            </ion-label>
            <ion-input :readonly="true" type="text" :value="nama_belakang" />
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-item>
      <ion-label position="floating">Tanggal Lahir</ion-label>
      <ion-datetime :readonly="true" :value="tglLahir" />
    </ion-item>
    <ion-item>
      <ion-label position="floating">Jenis Kelamin</ion-label>
      <ion-input :readonly="true" :value="jenis_kelamin" />
    </ion-item>
    <ion-item>
      <ion-label position="floating">Alamat</ion-label>
      <ion-textarea :readonly="true" :value="alamatRumah" />
    </ion-item>
    <ion-item>
      <ion-label position="floating">Nomor Seluler</ion-label>
      <ion-input :readonly="true" :value="nomorSeluler" />
    </ion-item>
    <ion-item>
      <ion-label position="floating">Email</ion-label>
      <ion-input :readonly="true" type="email" :value="eMail" />
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
  IonTextarea,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonDatetime,
  IonLoading,
} from "@ionic/vue";
import { camera, chevronDown, add } from "ionicons/icons";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    IonItemGroup,
    IonItemDivider,
    IonItem,
    IonInput,
    IonTextarea,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonDatetime,
    IonLoading,
  },
  emits: ["inputChanges"],
  props: {
    title: { type: String, default: "Info Mahasiswa" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    nomorId: { type: String },
    namaDepan: { type: String },
    namaBelakang: { type: String },
    tglLahir: { type: String },
    jenisKelamin: { type: String },
    alamatRumah: { type: String },
    nomorSeluler: { type: String },
    eMail: { type: String },
    photo: { type: Number },
    fileName: { type: String },
    filePath: { type: String },
    /* FormProps */
  },
  setup(props) {
    /* Init Form */
    const loading = ref(false);
    const nama_belakang = computed(() => {
      return props.namaBelakang ? props.namaBelakang : "-";
    });
    const jenis_kelamin = computed(() => {
      return props.jenisKelamin == "p" ? "Perempuan" : "Laki-laki";
    });

    const selectOptions = ref([
      { key: "l1", value: "l", label: "laki-laki" },
      { key: "p2", value: "p", label: "perempuan" },
    ]);

    const icons = ref({
      camera,
      chevronDown,
      add,
    });

    return {
      icons,
      selectOptions,
      loading,
      nama_belakang,
      jenis_kelamin,
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
