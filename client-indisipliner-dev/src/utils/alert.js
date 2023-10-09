import { alertController } from "@ionic/vue";

export async function alertConfirm(message, header, cancelText, okText) {
  return new Promise((resolve) => {
    alertController
      .create({
        message: message || "message",
        header: header || "alert",
        buttons: [
          {
            text: cancelText || "batal",
            role: "cancel",
            handler: () => {
              resolve(false);
            },
          },
          {
            text: okText || "ok",
            handler: () => {
              resolve(true);
            },
          },
        ],
      })
      .then((response) => {
        response.present();
      });
  });
}
export async function baseAlert(message, header, okText, returnValue) {
  return new Promise((resolve) => {
    alertController
      .create({
        message: message || "message",
        header: header || "alert",
        buttons: [
          {
            text: okText || "ok",
            handler: () => {
              resolve(returnValue);
            },
          },
        ],
      })
      .then((response) => {
        response.present();
      });
  });
}
