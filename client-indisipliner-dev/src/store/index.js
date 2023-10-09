import { createStore } from "vuex";
import authModule from "./modules/auth";
import navigationModule from "./modules/navigation";

const store = createStore({
  modules: { auth: authModule, nav: navigationModule },
});

export default store;
