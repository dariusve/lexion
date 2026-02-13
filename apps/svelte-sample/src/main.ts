import { mount } from "svelte";
import App from "./App.svelte";
import "./styles.css";

const container = document.querySelector<HTMLElement>("#app");
if (!container) {
  throw new Error("Missing #app container");
}

mount(App, {
  target: container
});
