<template>
  <modal-header :title="title" @close="dismiss" />
  <ion-content :fullscreen="true">
    <form-jurusan
      :jurusan-label="itemObj.jurusan"
      :prodi-id="itemObj.prodi_id"
      :prodi-label="itemObj.prodi"
      :form-mode="formMode"
    />
  </ion-content>
  <modal-item-crud-footer
    :form-mode="formMode"
    @update="updateMode"
    @trash="handleTrash"
    @cancel="cancelUpdate"
    @send="handleSubmit"
  />
</template>

<script>
import { IonContent } from "@ionic/vue";
import { defineComponent, ref } from "vue";
import FormJurusan, { JurusanFormComponent } from "../Forms/FormJurusan.vue";
import ModalHeader from "../Headers/ModalHeader";
import ModalItemCrudFooter from "../Footers/ModalItemCrudFooter.vue";
import { useForm } from "vee-validate";
import http, { appJsonToken } from "../../utils/http";
import { alertConfirm } from "../../utils/alert";
import { baseToast } from "../../utils/toast";
import { assign } from "lodash";

export default defineComponent({
  components: { IonContent, ModalHeader, FormJurusan, ModalItemCrudFooter },
  props: {
    title: { type: String, default: "Data Jurusan" },
    submitValue: { type: Function },
    dismiss: { type: Function },
    itemObj: { type: Object },
    filePath: { type: String },
  },
  setup(props) {
    const confirms = alertConfirm;
    const currentForm = useForm({ validationSchema: JurusanFormComponent });
    const formMode = ref("read");
    const loading = ref(false);

    function updateMode() {
      formMode.value = "update";
    }
    function cancelUpdate() {
      formMode.value = "read";
      props.dismiss();
    }

    function handleTrash() {
      let message = "apakah anda yakin ingin menghapus?";
      let header = "Peringatan!";
      confirms(message, header).then(async (response) => {
        if (response) {
          trashData(props.itemObj.row_id);
        }
      });
    }

    function trashData(value) {
      const body = { data: { row_id: value } };
      const config = appJsonToken();
      http
        .delete("/api/akademik/jurusan/delete", body, config)
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

    async function handleSubmit() {
      const res = await currentForm.validate();
      if (res.valid) {
        assign(currentForm.values, { row_id: props.itemObj.row_id });

        let message = "apakah anda yakin ingin memperbarui?";
        let header = "Peringatan!";
        confirms(message, header).then(async (response) => {
          if (response) {
            submitData(currentForm.values);
          }
        });
      }
    }
    function submitData(body) {
      const config = appJsonToken();
      http
        .put("/api/akademik/jurusan/update", body, config)
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

    return {
      loading,
      currentForm,
      formMode,
      updateMode,
      cancelUpdate,
      handleSubmit,
      handleTrash,
    };
  },
});
</script>

<style scoped></style>
