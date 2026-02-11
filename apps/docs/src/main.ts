import { sections } from "./content.js";
import "./styles.css";

const app = document.getElementById("app");

if (!app) {
  throw new Error("Missing #app root element");
}

const nav = sections
  .map((section) => `<a href="#${section.id}">${section.title}</a>`)
  .join("");

const content = sections
  .map(
    (section) => `
      <section id="${section.id}" class="card">
        <h2>${section.title}</h2>
        ${section.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </section>
    `
  )
  .join("");

app.innerHTML = `
  <main class="page">
    <header class="hero">
      <h1>Lexion Documentation</h1>
      <p>Developer-focused docs for core, extensions, adapters, and backend services.</p>
    </header>
    <nav class="nav">${nav}</nav>
    <article class="content">${content}</article>
  </main>
`;
