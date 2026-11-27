import { StrictMode, createElement } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App.js";
import "./styles.css";

const container = document.querySelector<HTMLElement>("#app");
if (!container) {
  throw new Error("Missing #app container");
}

createRoot(container).render(createElement(StrictMode, null, createElement(App)));
