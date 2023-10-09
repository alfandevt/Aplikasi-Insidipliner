export default {
  namespaced: true,
  state() {
    return {
      user: null,
      token: null,
      status: null,
    };
  },
  mutations: {
    setAuth(state, payload) {
      state.user = payload.user;
      state.token = payload.token;
      state.status = payload.status;
    },
  },
  actions: {
    load(context) {
      let user = localStorage.getItem("user") || null;
      if (user) user = JSON.parse(user);
      let token = localStorage.getItem("token") || null;
      let status = localStorage.getItem("status") || null;

      context.commit("setAuth", { user, token, status });
    },
    login(context, payload) {
      localStorage.setItem("token", payload.token);
      localStorage.setItem("refresh", payload.refresh);
      localStorage.setItem("expiresIn", payload.expiresIn);
      localStorage.setItem("user", JSON.stringify(payload.user));
      localStorage.setItem("status", payload.status);
      context.commit("setAuth", payload);
    },
    logout(context) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("user");
      localStorage.removeItem("status");
      const data = { user: null, token: null, status: null };
      context.commit("setAuth", data);
      location.reload();
    },
  },
  getters: {
    isLoggedIn(state) {
      if (!state.user && !state.token && !state.status) {
        return false;
      }

      return true;
    },
    userInfo(state) {
      return state.user;
    },
    userStatus(state) {
      return state.status;
    },
  },
};
