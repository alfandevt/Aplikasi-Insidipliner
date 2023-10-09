<template>
  <modal-header-info
    :title="title"
    :first-name="userObj.nama_depan"
    :last-name="userObj.nama_belakang"
    :item-title="userObj.jurusan"
    :label="userObj.prodi"
    :foto="userObj.foto"
    :is-null="false"
    :is-disable-click="false"
    :file-path="filePath"
    :is-lecturer="userObj.wali_kelas"
    :is-admin="userObj.admin_user"
    :icon="icons.people"
    icon-color="primary"
    icon-label="Orang Tua"
    @close="dismiss"
    @btn-click="openOrangtuaModal"
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
    <form-bio-kelas
      :kelas-id="userObj.kelas_id"
      :label-kelas="userObj.kelas"
      :form-mode="formMode"
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
import { people } from "ionicons/icons";
import FormBioData, { BioDataFormComponent } from "../Forms/FormBioData.vue";
import FormBioKelas, { BioKelasFormComponent } from "../Forms/FormBioKelas";
import ModalHeaderInfo from "../Headers/ModalHeaderInfo";
import ModalUserCrudFooter from "../Footers/ModalUserCrudFooter.vue";
import ModalOrangtua from "./ModalOrangtua.vue";
import { useForm } from "vee-validate";
import { omit, pick, assign } from "lodash";
import http, { appJsonToken } from "../../utils/http";
import { alertConfirm } from "../../utils/alert";
import { baseToast } from "../../utils/toast";
import { baseModal } from "../../utils/modal";

export default defineComponent({
  components: {
    IonContent,
    ModalHeaderInfo,
    FormBioData,
    FormBioKelas,
    ModalUserCrudFooter,
  },
  props: {
    title: { type: String, default: "Data Dosen" },
    submitValue: { type: Function },
    dismiss: { type: Function },
    userObj: { type: Object },
    filePath: { type: String },
  },
  setup(props) {
    const confirms = alertConfirm;
    const currentForm = useForm({
      validationSchema: BioDataFormComponent.concat(BioKelasFormComponent),
    });
    const bioForm = ref({});
    const kelasForm = ref({});
    const formMode = ref("read");
    const loading = ref(false);
    const foto = ref(null);

    const icons = ref({ people });

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
        .delete("/api/mahasiswa/delete", body, config)
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
        const keys = ["kelas"];
        bioForm.value = omit(currentForm.values, keys);
        kelasForm.value = pick(currentForm.values, keys);
        assign(kelasForm.value, { akun: props.userObj.row_id });

        const bioData = new FormData();
        Object.keys(bioForm.value).forEach((key) => {
          bioData.append(key, bioForm.value[key]);
        });
        bioData.append("akun", props.userObj.row_id);
        if (foto.value)
          bioData.set("foto", foto.value, foto.value.name.toLowerCase());
        else bioData.delete("foto");
        for (let pair of bioData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }
        console.log(kelasForm.value);

        let message = "apakah anda yakin ingin memperbarui?";
        let header = "Peringatan!";
        confirms(message, header).then(async (response) => {
          if (response) {
            submitData(bioData, kelasForm.value);
          }
        });
      }
    }
    function submitData(body, kelas) {
      const config = appJsonToken();
      http
        .put("/api/mahasiswa/updatebio", body, config)
        .then((response) => {
          const data = { ...response.data };
          baseToast(data.message, "success");
          submitPetugasData(kelas);
        })
        .catch((ex) => {
          const data = { ...ex.data };
          baseToast(data.message, "danger");
        });
    }
    function submitPetugasData(body) {
      const config = appJsonToken();
      http
        .put("/api/mahasiswa/updatestatus", body, config)
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
    let currentModal = ref(0);
    const isModalOpen = ref(false);
    async function openModal(modals, config) {
      let modal = await baseModal(modals, config);
      await modal.present();
      currentModal.value = modal;
      isModalOpen.value = true;
    }
    async function openOrangtuaModal() {
      await openModal(ModalOrangtua, {
        title: "Data Orangtua",
        dismiss: closeModal,
        userObj: props.userObj,
      });
    }
    async function closeModal() {
      await currentModal.value.dismiss();
      isModalOpen.value = false;
    }

    return {
      icons,
      loading,
      currentForm,
      formMode,
      updateMode,
      cancelUpdate,
      handleSubmit,
      handleTrash,
      handleInputChange,
      handleResetPass,
      openOrangtuaModal,
    };
  },
});
</script>

<style scoped></style>
