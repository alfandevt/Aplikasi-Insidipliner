import { modalController } from "@ionic/vue";

export async function baseModal(component, props) {
  const modal = await modalController.create({
    component: component,
    componentProps: props,
  });
  return modal;
}
