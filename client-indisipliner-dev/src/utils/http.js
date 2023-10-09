import axios from "axios";
import { includes, assign } from "lodash";

const http = axios.create({
  baseURL: process.env.VUE_APP_API,
});

http.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    const response = { ...error.response };
    console.log(response);
    if (includes(response.data.message, "token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("user");
      localStorage.removeItem("status");
      location.reload();
    }
    return Promise.reject(response);
  }
);

/* Configuration */
export const appJson = (params = null) => {
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };
  if (params) assign(config, { params });
  return config;
};
/* Configuration */
export const appJsonToken = (params = null) => {
  let token = localStorage.getItem("token") || null;
  const config = {
    headers: {
      "content-type": "application/json",
      "x-auth-token": token,
    },
  };
  if (params) assign(config, { params });
  return config;
};

export const appMultiFormToken = (params = null) => {
  let token = localStorage.getItem("token") || null;
  const config = {
    headers: {
      "content-type": "multipart/form-data",
      "x-auth-token": token,
    },
  };
  if (params) assign(config, { params });
  return config;
};

export const appTokenBuffer = (params = null) => {
  let token = localStorage.getItem("token") || null;
  const config = {
    headers: {
      "x-auth-token": token,
    },
    responseType: "arraybuffer",
  };
  if (params) assign(config, { params });
  return config;
};

export default http;
