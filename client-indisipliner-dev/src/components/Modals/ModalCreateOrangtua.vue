<template>
  <modal-header :title="title" @close="dismiss" />
  <ion-content class="ion-padding">
    <ion-list>
      <form-orangtua />
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
import FormOrangtua, { OrangtuaFormComponent } from "../Forms/FormOrangtua";
import http, { appJsonToken } from "../../utils/http";
import { baseToast } from "../../utils/toast";
import { assign } from "lodash";

export default defineComponent({
  components: {
    IonContent,
    IonList,
    IonLoading,
    ModalHeader,
    ModalFooter,
    FormOrangtua,
  },
  props: {
    title: { type: String, default: "Form Petugas" },
    dismiss: { type: Function },
    userObj: { type: Object },
    submitValue: { type: Function },
  },
  setup(props) {
    const currentForm = useForm({
      validationSchema: OrangtuaFormComponent,
    });
    const loading = ref(false);

    async function handleSubmit() {
      const res = await currentForm.validate();
      if (res.valid) {
        const data = { mahasiswa: props.userObj.mahasiswa_id };
        assign(currentForm.values, data);

        submitData(currentForm.values);
      }
    }
    function submitData(body) {
      const config = appJsonToken();
      http
        .post("/api/mahasiswa/orangtua/create", body, config)
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
