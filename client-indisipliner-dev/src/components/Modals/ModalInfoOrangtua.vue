<template>
  <modal-header :title="title" @close="dismiss" />
  <ion-content :fullscreen="true">
    <form-orangtua
      :namaLengkap="userObj['nama']"
      :jenisKelamin="userObj['jenis_kelamin']"
      :nomorSeluler="userObj['nomor_seluler']"
      :formMode="formMode"
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
import { people } from "ionicons/icons";
import FormOrangtua, { OrangtuaFormComponent } from "../Forms/FormOrangtua.vue";
import ModalHeader from "../Headers/ModalHeader";
import ModalItemCrudFooter from "../Footers/ModalItemCrudFooter.vue";
import ModalOrangtua from "./ModalOrangtua.vue";
import { useForm } from "vee-validate";
import { assign } from "lodash";
import http, { appJsonToken } from "../../utils/http";
import { alertConfirm } from "../../utils/alert";
import { baseToast } from "../../utils/toast";
import { baseModal } from "../../utils/modal";

export default defineComponent({
  components: {
    IonContent,
    ModalHeader,
    FormOrangtua,
    ModalItemCrudFooter,
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
      validationSchema: OrangtuaFormComponent,
    });
    const formMode = ref("read");
    const loading = ref(false);

    const icons = ref({ people });

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
          trashData(props.userObj.orangtua_id);
        }
      });
    }

    function trashData(value) {
      const body = { data: { row_id: value } };
      const config = appJsonToken();
      http
        .delete("/api/mahasiswa/orangtua/delete", body, config)
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
        const data = {
          row_id: props.userObj.orangtua_id,
          mahasiswa: props.userObj.mahasiswa_id,
        };
        assign(currentForm.values, data);

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
        .put("/api/mahasiswa/orangtua/update", body, config)
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
      openOrangtuaModal,
    };
  },
});
</script>

<style scoped></style>
