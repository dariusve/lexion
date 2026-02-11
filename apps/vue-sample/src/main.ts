import { createApp, h } from "vue";

import { App } from "./App.js";
import "./styles.css";

createApp({
  render: () => h(App)
}).mount("#app");
