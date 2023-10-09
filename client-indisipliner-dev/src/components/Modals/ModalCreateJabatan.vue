<template>
  <modal-header :title="title" @close="dismiss" />
  <ion-content class="ion-padding">
    <ion-list>
      <form-jabatan />
    </ion-list>

    <ion-loading :is-open="loading" />
  </ion-content>
  <modal-footer @action="handleSubmit" />
</template>

<script>
import { IonContent, IonList, IonLoading } from "@ionic/vue";
import { camera, chevronDown, add } from "ionicons/icons";
import { defineComponent, ref } from "vue";
import { useForm } from "vee-validate";
import ModalHeader from "../Headers/ModalHeader";
import ModalFooter from "../Footers/ModalFooter";
import FormJabatan, { JabatanFormComponent } from "../Forms/FormJabatan";
import http, { appJsonToken } from "../../utils/http";
import { baseToast } from "../../utils/toast";

export default defineComponent({
  components: {
    IonContent,
    IonList,
    IonLoading,
    ModalHeader,
    ModalFooter,
    FormJabatan,
  },
  props: {
    title: { type: String, default: "Form Petugas" },
    dismiss: { type: Function },
    submitValue: { type: Function },
  },
  setup(props) {
    const currentForm = useForm({
      validationSchema: JabatanFormComponent,
    });
    const loading = ref(false);

    async function handleSubmit() {
      const res = await currentForm.validate();
      if (res.valid) {
        submitData(currentForm.values);
      }
    }
    function submitData(body) {
      const config = appJsonToken();
      http
        .post("/api/petugas/jabatan/create", body, config)
        .then((response) => {
          const data = { ...response.data };
          baseToast(data.message, "success");
          props.submitValue();
        })
        .catch((ex) => {
          const data = { ...ex.data };
          baseToast(data.message, "danger");
        });
    }

    const icons = ref({ camera, chevronDown, add });
    return {
      icons,
      loading,
      /* Handler */
      handleSubmit,
      /* Handler */
    };
  },
});
</script>

<style scoped></style>
