import { toastController } from "@ionic/vue";
import parse from "parse-duration";

export async function baseToast(message, color, posision, duration = "2s") {
  const toast = await toastController.create({
    message: message || "message",
    position: posision || "bottom",
    duration: parse(duration),
    color: color || "success",
    buttons: [{ text: "tutup", role: "cancel" }],
  });
  await toast.present();
}
