<template>
  <ion-grid>
    <ion-row>
      <ion-col size="5">
        <ion-item :color="formErrors['tglAwal'] ? 'danger' : ''">
          <ion-label position="floating">Tanggal Awal</ion-label>
          <ion-datetime v-model="tglAwal" placeholder="pilih tanggal" />
          <ion-icon color="primary" slot="end" :icon="icons.calendar" />
        </ion-item>
      </ion-col>
      <ion-col size="5">
        <ion-item :color="formErrors['tglAkhir'] ? 'danger' : ''">
          <ion-label position="floating">Tanggal Akhir</ion-label>
          <ion-datetime v-model="tglAkhir" placeholder="pilih tanggal" />
          <ion-icon color="primary" slot="end" :icon="icons.calendar" />
        </ion-item>
      </ion-col>
      <ion-col size="1">
        <ion-button @click="handleSubmit" color="success" expand="block">
          <ion-icon :icon="icons.send" />
        </ion-button>
      </ion-col>
      <ion-col size="1">
        <ion-button
          @click="handleExport"
          color="dark"
          :disabled="tableDataNull"
          expand="block"
        >
          <ion-icon :icon="icons.print" />
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import {
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonLabel,
  IonDatetime,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { calendar, send, print } from "ionicons/icons";
import { computed, defineComponent, inject, ref } from "vue";
import { useForm, useField, useFormErrors } from "vee-validate";
import { exportAsExcel } from "../../utils/exportJSON";
import * as yup from "yup";

const DateRangeForm = yup.object().shape({
  tglAwal: yup.date().required(),
  tglAkhir: yup
    .date()
    .min(yup.ref("tglAwal"))
    .required(),
});

export default defineComponent({
  components: {
    IonGrid,
    IonCol,
    IonRow,
    IonItem,
    IonLabel,
    IonDatetime,
    IonButton,
    IonIcon,
  },
  emits: ["pickDate"],
  inject: ["tableData"],
  setup(_props, context) {
    const dateRangeForm = useForm({ validationSchema: DateRangeForm });
    const formErrors = useFormErrors();
    const { value: tglAwal } = useField("tglAwal");
    const { value: tglAkhir } = useField("tglAkhir");
    const tableData = inject("tableData");
    const tableDataNull = computed(() => {
      if (tableData.value.length <= 0) return true;
      else return false;
    });

    async function handleSubmit() {
      const currentForm = await dateRangeForm.validate();
      if (currentForm.valid) {
        context.emit("pickDate", dateRangeForm.values);
      }
    }
    async function handleExport() {
      if (!tableDataNull.value) {
        exportAsExcel(tableData.value);
      }
    }

    const icons = ref({ calendar, send, print });
    return {
      tglAwal,
      tglAkhir,
      icons,
      handleSubmit,
      handleExport,
      formErrors,
      tableDataNull,
    };
  },
});
</script>

<style scoped></style>
