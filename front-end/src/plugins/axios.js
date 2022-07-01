"use strict";

import Vue from "vue";
import axios from "axios";
import store from "../store/index";
Vue.prototype.$axios = axios;

// Full config:  https://github.com/axios/axios#request-config
axios.defaults.baseURL =
  process.env.baseURL || process.env.apiUrl || "http://localhost:8000/api";
axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("token");
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;

let config = {
  baseURL:
    process.env.baseURL || process.env.apiUrl || "http://localhost:8000/api",
  // timeout: 60 * 1000, // Timeout
  withCredentials: true // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    const token = store.getters.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (401 === error.response.status || 440 === error.response.status) {
      store.dispatch("sessionExpired");
    }
  }
);

Plugin.install = function (Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
