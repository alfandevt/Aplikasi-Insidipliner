<template>
  <modal-header :title="title" @close="dismiss" />
  <ion-content class="ion-padding">
    <ion-list>
      <form-bio-data @inputChanges="handleInputChange" />
      <form-bio-petugas />
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
import FormBioData, { BioDataFormComponent } from "../Forms/FormBioData";
import FormBioPetugas, { PetugasDataFormComponent } from "../Forms/FormBioPetugas";
import http, { appJsonToken } from "../../utils/http";
import { baseToast } from "../../utils/toast";

export default defineComponent({
  components: {
    IonContent,
    IonList,
    IonLoading,
    ModalHeader,
    ModalFooter,
    FormBioData,
    FormBioPetugas,
  },
  props: {
    title: { type: String, default: "Form Petugas" },
    dismiss: { type: Function },
    submitValue: { type: Function },
  },
  setup(props) {
    const currentForm = useForm({
      validationSchema: BioDataFormComponent.concat(PetugasDataFormComponent),
    });
    const loading = ref(false);
    const foto = ref(null);

    function handleInputChange(value) {
      foto.value = value;
    }

    async function handleSubmit() {
      const res = await currentForm.validate();
      if (res.valid) {
        const formData = new FormData();
        const { status_admin } = currentForm.values;
        Object.keys(currentForm.values).forEach((key) => {
          formData.append(key, currentForm.values[key]);
        });
        formData.append("kata_sandi", currentForm.values["nomor_id"]);
        /* Foto */
        if (foto.value)
          formData.set("foto", foto.value, foto.value.name.toLowerCase());
        else formData.delete("foto");
        /* Foto */
        /* Status Admin */
        if (status_admin === 0 || status_admin === null)
          formData.set("status_admin", false);
        else formData.set("status_admin", true);

        submitData(formData);
      }
    }
    function submitData(body) {
      const config = appJsonToken();
      http
        .post("/api/petugas/create", body, config)
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
      handleInputChange,
      /* Handler */
      submitData,
    };
  },
});
</script>

<style scoped>
input[type="file"] {
  opacity: 0;
  position: absolute;
  width: 0px;
  height: 0px;
}
ion-thumbnail {
  --size: 100%;
  --border-radius: 10px;
}
</style>
