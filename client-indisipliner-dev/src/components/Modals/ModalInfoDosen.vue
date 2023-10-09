<template>
  <modal-header-info
    :title="title"
    :first-name="userObj.nama_depan"
    :last-name="userObj.nama_belakang"
    :item-title="userObj.kelas"
    :label="userObj.prodi"
    :foto="userObj.foto"
    :is-null="false"
    :is-disable-click="false"
    :file-path="filePath"
    :is-lecturer="userObj.wali_kelas"
    @close="dismiss"
  />
  <ion-content :fullscreen="true">
    <form-bio-data
      :nomor-id="userObj.nomor_id"
      :nama-depan="userObj.nama_depan"
      :nama-belakang="userObj.nama_belakang"
      :tgl-lahir="userObj.tgl_lahir"
      :jenis-kelamin="userObj.jenis_kelamin"
      :alamat-rumah="userObj.alamat_rumah"
      :nomor-seluler="userObj.nomor_seluler"
      :e-mail="userObj.email"
      :file-name="userObj.foto"
      :file-path="filePath"
      :form-mode="formMode"
      @inputChanges="handleInputChange"
    />
  </ion-content>
  <modal-user-crud-footer
    :form-mode="formMode"
    @update="updateMode"
    @trash="handleTrash"
    @cancel="cancelUpdate"
    @send="handleSubmit"
    @reset="handleResetPass"
  />
</template>

<script>
import { IonContent } from "@ionic/vue";
import { defineComponent, ref } from "vue";
import FormBioData, { BioDataFormComponent } from "../Forms/FormBioData.vue";
import ModalHeaderInfo from "../Headers/ModalHeaderInfo";
import ModalUserCrudFooter from "../Footers/ModalUserCrudFooter.vue";
import { useForm } from "vee-validate";
import http, { appJsonToken } from "../../utils/http";
import { alertConfirm } from "../../utils/alert";
import { baseToast } from "../../utils/toast";

export default defineComponent({
  components: { IonContent, ModalHeaderInfo, FormBioData, ModalUserCrudFooter },
  props: {
    title: { type: String, default: "Data Dosen" },
    submitValue: { type: Function },
    dismiss: { type: Function },
    userObj: { type: Object },
    filePath: { type: String },
  },
  setup(props) {
    const confirms = alertConfirm;
    const currentForm = useForm({ validationSchema: BioDataFormComponent });
    const formMode = ref("read");
    const loading = ref(false);
    const foto = ref(null);

    function handleInputChange(value) {
      foto.value = value;
    }

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
          trashData(props.userObj.row_id);
        }
      });
    }

    function trashData(value) {
      const body = { data: { akun: value } };
      const config = appJsonToken();
      http
        .delete("/api/dosen/delete", body, config)
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

    function handleResetPass() {
      let message = "apakah anda yakin ingin reset kata sandi?";
      let header = "Peringatan!";
      confirms(message, header).then(async (response) => {
        if (response) {
          let body = { akun: props.userObj.row_id };
          resetPass(body);
        }
      });
    }

    function resetPass(body) {
      const config = appJsonToken();
      http
        .put("/api/auth/sandi/reset", body, config)
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
        const formData = new FormData();
        Object.keys(currentForm.values).forEach((key) => {
          formData.append(key, currentForm.values[key]);
        });
        formData.append("akun", props.userObj.row_id);
        if (foto.value)
          formData.set("foto", foto.value, foto.value.name.toLowerCase());
        else formData.delete("foto");

        let message = "apakah anda yakin ingin memperbarui?";
        let header = "Peringatan!";
        confirms(message, header).then(async (response) => {
          if (response) {
            submitData(formData);
          }
        });
      }
    }
    function submitData(body) {
      const config = appJsonToken();
      http
        .put("/api/dosen/updatebio", body, config)
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
      handleInputChange,
      handleResetPass,
    };
  },
});
</script>

<style scoped></style>
