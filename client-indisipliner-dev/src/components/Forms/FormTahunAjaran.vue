<template>
  <ion-item-group>
    <ion-item-divider>
      <ion-label>{{ title }}</ion-label>
    </ion-item-divider>

    <ion-item :color="formErrors['tahun_mulai'] ? 'danger' : ''">
      <ion-label position="floating">
        Tahun Mulai*
      </ion-label>
      <ion-datetime
        :readonly="readOnly"
        placeholder="pilih tanggal"
        v-model="tahun_mulai"
      />
    </ion-item>
    <ion-item :color="formErrors['tahun_selesai'] ? 'danger' : ''">
      <ion-label position="floating">
        Tahun Selesai*
      </ion-label>
      <ion-datetime
        :readonly="readOnly"
        placeholder="pilih tanggal"
        v-model="tahun_selesai"
      />
    </ion-item>
  </ion-item-group>
  <ion-loading :is-open="loading" />
</template>

<script>
import {
  IonItemGroup,
  IonItemDivider,
  IonItem,
  IonDatetime,
  IonLabel,
  IonLoading,
} from "@ionic/vue";
import { camera, chevronDown, add } from "ionicons/icons";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useField, useFormErrors } from "vee-validate";
import { parseDate } from "../../utils/date";
import * as yup from "yup";

export const TahunFormComponent = yup.object().shape({
  tahun_mulai: yup.date().required(),
  tahun_selesai: yup
    .date()
    .min(yup.ref("tahun_mulai"))
    .required(),
});

export default defineComponent({
  components: {
    IonItemGroup,
    IonItemDivider,
    IonItem,
    IonDatetime,
    IonLabel,
    IonLoading,
  },
  props: {
    title: { type: String, default: "Jurusan" },
    formMode: { String: String, default: "create" },
    /* FormProps */
    tahunAwal: { type: String },
    tahunAkhir: { type: String },
    /* FormProps */
  },
  setup(props) {
    /* Form */
    const { value: tahun_mulai } = useField("tahun_mulai");
    const { value: tahun_selesai } = useField("tahun_selesai");
    /* Form */
    /* Init Form */
    function initForm() {
      if (props.formMode === "read" || props.formMode === "update") {
        tahun_mulai.value = parseDate(props.tahunAwal).toString() || null;
        tahun_selesai.value = parseDate(props.tahunAkhir).toISOString() || null;
      }
    }
    /* Init Form */
    const loading = ref(false);
    const formErrors = useFormErrors();
    const readOnly = computed(() => {
      return props.formMode === "read" ? true : false;
    });

    const icons = ref({
      camera,
      chevronDown,
      add,
    });

    onMounted(() => {
      initForm();
    });
    return {
      icons,
      formErrors,
      loading,
      readOnly,
      /* Form */
      tahun_mulai,
      tahun_selesai,
      /* Form */
      initForm,
    };
  },
});
</script>

<style scoped></style>
