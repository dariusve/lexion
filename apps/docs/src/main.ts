import { categoryOrder, pages } from "./content.js";
import { renderMarkdown } from "./markdown.js";
import logo from "../../../assets/images/logo.png";
import "./styles.css";

const app = document.getElementById("app");

if (!app) {
  throw new Error("Missing #app root element");
}

const pagesById = new Map(pages.map((page) => [page.id, page]));
const defaultPageId = pages[0]?.id ?? "";

function getActivePageId(): string {
  const hash = window.location.hash.slice(1);
  return pagesById.has(hash) ? hash : defaultPageId;
}

function renderNav(activePageId: string): string {
  return categoryOrder
    .map((category) => {
      const categoryPages = pages.filter((page) => page.category === category);
      if (categoryPages.length === 0) {
        return "";
      }

      const links = categoryPages
        .map((page) => {
          const activeClass = page.id === activePageId ? "is-active" : "";
          return `<a href="#${page.id}" class="nav-link ${activeClass}">${page.title}</a>`;
        })
        .join("");

      return `
        <section class="nav-group">
          <h2>${category}</h2>
          <div class="nav-links">${links}</div>
        </section>
      `;
    })
    .join("");
}

function renderPage(activePageId: string): string {
  const page = pagesById.get(activePageId);
  if (!page) {
    return "<p>Document not found.</p>";
  }

  return `
    <header class="doc-header">
      <h1>${page.title}</h1>
      <p>${page.summary}</p>
      <p class="doc-source">Source: <code>${page.sourcePath}</code></p>
    </header>
    <section class="doc-content">${renderMarkdown(page.markdown)}</section>
  `;
}

function mount(): void {
  const activePageId = getActivePageId();
  app.innerHTML = `
    <main class="page">
      <header class="hero">
        <div class="hero-brand">
          <img src="${logo}" alt="Lexion logo" class="hero-logo" />
          <h1>Lexion Documentation</h1>
        </div>
        <p>Complete project documentation index across architecture, APIs, extensions, adapters, and operations.</p>
      </header>
      <div class="layout">
        <aside class="sidebar">${renderNav(activePageId)}</aside>
        <article class="viewer">${renderPage(activePageId)}</article>
      </div>
    </main>
  `;
}

if (defaultPageId && !window.location.hash) {
  window.location.hash = `#${defaultPageId}`;
}

window.addEventListener("hashchange", mount);
mount();
