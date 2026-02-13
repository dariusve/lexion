import Vue from "vue/dist/vue.esm.js";

import { App } from "./App";
import "./styles.css";

new Vue({
  render: (h) => h(App)
}).$mount("#app");
