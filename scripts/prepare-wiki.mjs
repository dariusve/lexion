import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const docsDir = path.resolve("docs");
const wikiDir = path.resolve("wiki");

const repoServer = process.env.GITHUB_SERVER_URL ?? "https://github.com";
const repoSlug = process.env.GITHUB_REPOSITORY;
const repoBaseUrl = repoSlug ? `${repoServer}/${repoSlug}` : null;

const pageMap = new Map([
  ["GETTING_STARTED.md", "Getting-Started.md"],
  ["LEXION_OVERVIEW.md", "Lexion-Overview.md"],
  ["ARCHITECTURE_GUIDE.md", "Architecture-Guide.md"],
  ["LICENSING_MODEL.md", "Licensing-Model.md"],
  ["PACKAGE_APIS.md", "Package-APIs.md"],
  ["DATA_EXAMPLES.md", "Data-Examples.md"],
  ["EXTENSION_DEVELOPMENT.md", "Extension-Development.md"],
  ["EXTENSIONS_REFERENCE.md", "Extensions-Reference.md"],
  ["ADAPTER_EXAMPLES.md", "Adapter-Examples.md"],
  ["BACKEND_SERVICES.md", "Backend-Services.md"],
  ["RELEASE_PROCESS.md", "Release-Process.md"],
  ["PRICING_MODEL.md", "Pricing-Model.md"],
  ["PRICING_GAP_ANALYSIS.md", "Pricing-Gap-Analysis.md"],
  ["README.md", "Project-README.md"]
]);

const sidebarSections = [
  {
    title: "Foundations",
    pages: [
      "Home.md",
      "Getting-Started.md",
      "Lexion-Overview.md",
      "Architecture-Guide.md",
      "Licensing-Model.md"
    ]
  },
  {
    title: "Reference",
    pages: [
      "Package-APIs.md",
      "Extensions-Reference.md",
      "Adapter-Examples.md",
      "Backend-Services.md",
      "Data-Examples.md"
    ]
  },
  {
    title: "Operations",
    pages: ["Extension-Development.md", "Release-Process.md", "Pricing-Model.md", "Pricing-Gap-Analysis.md", "Project-README.md"]
  }
];

const pageLabel = (filename) => filename.replace(/\.md$/, "").replace(/-/g, " ");
const pageLink = (filename) => filename.replace(/\.md$/, "");

const rewriteContent = (content) => {
  let next = content;

  for (const [source, target] of pageMap.entries()) {
    next = next.replaceAll(`](docs/${source})`, `](${pageLink(target)})`);
    next = next.replaceAll(`](./${source})`, `](${pageLink(target)})`);
    next = next.replaceAll(`](../docs/${source})`, `](${pageLink(target)})`);
    next = next.replaceAll(`](${source})`, `](${pageLink(target)})`);
  }

  next = next.replaceAll("](README.md)", "](Project-README)");

  if (repoBaseUrl) {
    next = next.replaceAll("](LICENSE)", `](${repoBaseUrl}/blob/main/LICENSE)`);
    next = next.replaceAll("](../LICENSE)", `](${repoBaseUrl}/blob/main/LICENSE)`);
    next = next.replaceAll(
      "](LICENSE-COMMERCIAL.md)",
      `](${repoBaseUrl}/blob/main/LICENSE-COMMERCIAL.md)`
    );
    next = next.replaceAll(
      "](../LICENSE-COMMERCIAL.md)",
      `](${repoBaseUrl}/blob/main/LICENSE-COMMERCIAL.md)`
    );
    next = next.replaceAll(
      "](assets/images/logo.png)",
      `](${repoBaseUrl}/raw/main/assets/images/logo.png)`
    );
  }

  return next;
};

const cleanWikiMarkdown = () => {
  for (const entry of readdirSync(wikiDir)) {
    const entryPath = path.join(wikiDir, entry);
    if (!statSync(entryPath).isFile()) {
      continue;
    }
    if (entry.endsWith(".md")) {
      rmSync(entryPath);
    }
  }
};

const syncDocs = () => {
  for (const [sourceName, targetName] of pageMap.entries()) {
    const sourcePath =
      sourceName === "README.md" ? path.resolve("README.md") : path.join(docsDir, sourceName);
    const targetPath = path.join(wikiDir, targetName);
    const content = readFileSync(sourcePath, "utf8");
    writeFileSync(targetPath, rewriteContent(content));
  }
};

const buildHome = () => `# Lexion Wiki

Welcome to the Lexion GitHub Wiki.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror and distributed as an open-core product.

## Start Here

- [Getting Started](Getting-Started)
- [Lexion Overview](Lexion-Overview)
- [Architecture Guide](Architecture-Guide)
- [Licensing Model](Licensing-Model)

## Community Packages

- \`@lexion-rte/core\`
- \`@lexion-rte/starter-kit\`
- \`@lexion-rte/tools\`
- public adapter packages

## Commercial Track

- \`@lexion-rte/ai\`
- \`@lexion-rte/collab\`
- hosted commercial services and future premium packages

## Reference

- [Package APIs](Package-APIs)
- [Extensions Reference](Extensions-Reference)
- [Adapter Examples](Adapter-Examples)
- [Backend Services](Backend-Services)
- [Data Examples](Data-Examples)

## Operations

- [Extension Development](Extension-Development)
- [Release Process](Release-Process)
- [Pricing Model](Pricing-Model)
- [Pricing Gap Analysis](Pricing-Gap-Analysis)
- [Project README](Project-README)
`;

const buildSidebar = () =>
  sidebarSections
    .map(
      (section) =>
        `## ${section.title}\n\n${section.pages
          .map((page) => `- [${pageLabel(page)}](${pageLink(page)})`)
          .join("\n")}`
    )
    .join("\n\n");

mkdirSync(wikiDir, { recursive: true });
cleanWikiMarkdown();
syncDocs();
writeFileSync(path.join(wikiDir, "Home.md"), buildHome());
writeFileSync(path.join(wikiDir, "_Sidebar.md"), buildSidebar());

if (repoBaseUrl) {
  const logoSource = path.resolve("assets/images/logo.png");
  const logoTarget = path.join(wikiDir, "logo.png");
  try {
    copyFileSync(logoSource, logoTarget);
  } catch {
    // Ignore missing local logo asset; wiki content still renders without it.
  }
}
