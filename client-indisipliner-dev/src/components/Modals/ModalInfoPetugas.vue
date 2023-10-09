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
    :is-admin="userObj.admin_user"
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
    <form-bio-petugas
      :jabatan-id="userObj.jabatan_id"
      :label-jabatan="userObj.jabatan"
      :bidang-id="userObj.bidang_id"
      :label-bidang="userObj.bidang"
      :user-admin="userObj.admin_user"
      :form-mode="formMode"
      :show-admin-select="false"
    />
  </ion-content>
  <modal-user-crud-footer
    :set-admin="true"
    :is-admin="userObj.admin_user"
    :form-mode="formMode"
    @update="updateMode"
    @trash="handleTrash"
    @cancel="cancelUpdate"
    @send="handleSubmit"
    @reset="handleResetPass"
    @admin="handleAdminToggle"
  />
</template>

<script>
import { IonContent } from "@ionic/vue";
import { defineComponent, ref } from "vue";
import FormBioData, { BioDataFormComponent } from "../Forms/FormBioData.vue";
import FormBioPetugas, { PetugasDataFormComponent } from "../Forms/FormBioPetugas";
import ModalHeaderInfo from "../Headers/ModalHeaderInfo";
import ModalUserCrudFooter from "../Footers/ModalUserCrudFooter.vue";
import { useForm } from "vee-validate";
import { omit, pick, assign } from "lodash";
import http, { appJsonToken } from "../../utils/http";
import { alertConfirm } from "../../utils/alert";
import { baseToast } from "../../utils/toast";

export default defineComponent({
  components: {
    IonContent,
    ModalHeaderInfo,
    FormBioData,
    FormBioPetugas,
    ModalUserCrudFooter,
  },
  props: {
    title: { type: String, default: "Data Petugas" },
    submitValue: { type: Function },
    dismiss: { type: Function },
    userObj: { type: Object },
    filePath: { type: String },
  },
  setup(props) {
    const confirms = alertConfirm;
    const currentForm = useForm({
      validationSchema: BioDataFormComponent.concat(PetugasDataFormComponent),
    });
    const bioForm = ref({});
    const petugasForm = ref({});
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

    function handleAdminToggle() {
      if (props.userObj.admin_user == 1) {
        deleteAdmin(props.userObj.row_id);
      } else {
        addAdmin(props.userObj.row_id);
      }
    }
    function addAdmin(value) {
      const body = { akun: value };
      const config = appJsonToken();
      http
        .post("/api/auth/admin/create", body, config)
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
    function deleteAdmin(value) {
      const body = { data: { akun: value } };
      const config = appJsonToken();
      http
        .delete("/api/auth/admin/delete", body, config)
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
        .delete("/api/petugas/delete", body, config)
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
        const keys = ["jabatan", "bidang"];
        bioForm.value = omit(currentForm.values, keys);
        petugasForm.value = pick(currentForm.values, keys);
        assign(petugasForm.value, { akun: props.userObj.row_id });

        const bioData = new FormData();
        Object.keys(bioForm.value).forEach((key) => {
          bioData.append(key, bioForm.value[key]);
        });
        bioData.append("akun", props.userObj.row_id);
        bioData.delete("status_admin");
        if (foto.value)
          bioData.set("foto", foto.value, foto.value.name.toLowerCase());
        else bioData.delete("foto");

        let message = "apakah anda yakin ingin memperbarui?";
        let header = "Peringatan!";
        confirms(message, header).then(async (response) => {
          if (response) {
            submitData(bioData, petugasForm.value);
          }
        });
      }
    }
    function submitData(body, petugas) {
      const config = appJsonToken();
      http
        .put("/api/petugas/updatebio", body, config)
        .then((response) => {
          const data = { ...response.data };
          baseToast(data.message, "success");
          submitPetugasData(petugas);
        })
        .catch((ex) => {
          const data = { ...ex.data };
          baseToast(data.message, "danger");
        });
    }
    function submitPetugasData(body) {
      const config = appJsonToken();
      http
        .put("/api/petugas/updatestatus", body, config)
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
      handleAdminToggle,
    };
  },
});
</script>

<style scoped></style>
