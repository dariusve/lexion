import adapterExamples from "../../../docs/ADAPTER_EXAMPLES.md?raw";
import architectureGuide from "../../../docs/ARCHITECTURE_GUIDE.md?raw";
import backendServices from "../../../docs/BACKEND_SERVICES.md?raw";
import dataExamples from "../../../docs/DATA_EXAMPLES.md?raw";
import extensionDevelopment from "../../../docs/EXTENSION_DEVELOPMENT.md?raw";
import extensionsReference from "../../../docs/EXTENSIONS_REFERENCE.md?raw";
import gettingStarted from "../../../docs/GETTING_STARTED.md?raw";
import licensingModel from "../../../docs/LICENSING_MODEL.md?raw";
import lexionOverview from "../../../docs/LEXION_OVERVIEW.md?raw";
import packageApis from "../../../docs/PACKAGE_APIS.md?raw";
import releaseProcess from "../../../docs/RELEASE_PROCESS.md?raw";

export interface DocPage {
  readonly id: string;
  readonly title: string;
  readonly category: "Foundations" | "Guides" | "Reference" | "Operations";
  readonly summary: string;
  readonly sourcePath: string;
  readonly markdown: string;
}

export const pages: readonly DocPage[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    category: "Foundations",
    summary: "Environment prerequisites, workspace commands, and local startup workflow.",
    sourcePath: "/docs/GETTING_STARTED.md",
    markdown: gettingStarted
  },
  {
    id: "lexion-overview",
    title: "Lexion Overview",
    category: "Foundations",
    summary: "What Lexion is and why ProseMirror is used for the document model and engine.",
    sourcePath: "/docs/LEXION_OVERVIEW.md",
    markdown: lexionOverview
  },
  {
    id: "licensing-model",
    title: "Licensing Model",
    category: "Foundations",
    summary: "Open-core package boundaries and the dual-license distribution model.",
    sourcePath: "/docs/LICENSING_MODEL.md",
    markdown: licensingModel
  },
  {
    id: "architecture-guide",
    title: "Architecture Guide",
    category: "Guides",
    summary: "Detailed implementation-oriented architecture guidance for all Lexion layers.",
    sourcePath: "/docs/ARCHITECTURE_GUIDE.md",
    markdown: architectureGuide
  },
  {
    id: "extension-development",
    title: "Extension Development",
    category: "Guides",
    summary: "Extension contract, lifecycle hooks, and concrete extension implementation templates.",
    sourcePath: "/docs/EXTENSION_DEVELOPMENT.md",
    markdown: extensionDevelopment
  },
  {
    id: "adapter-examples",
    title: "Adapter Examples",
    category: "Guides",
    summary: "Toolbar and custom-adapter patterns for web, React, and Vue integrations.",
    sourcePath: "/docs/ADAPTER_EXAMPLES.md",
    markdown: adapterExamples
  },
  {
    id: "package-apis",
    title: "Package APIs",
    category: "Reference",
    summary: "Core, adapters, tools, and backend package API surfaces and usage contracts.",
    sourcePath: "/docs/PACKAGE_APIS.md",
    markdown: packageApis
  },
  {
    id: "data-examples",
    title: "Data Examples",
    category: "Reference",
    summary: "Concrete examples of JSON documents, adapter values, HTML/text output, and service payloads.",
    sourcePath: "/docs/DATA_EXAMPLES.md",
    markdown: dataExamples
  },
  {
    id: "extensions-reference",
    title: "Extensions Reference",
    category: "Reference",
    summary: "Canonical API reference for starter kit, AI, and collaboration extensions.",
    sourcePath: "/docs/EXTENSIONS_REFERENCE.md",
    markdown: extensionsReference
  },
  {
    id: "backend-services",
    title: "Backend Services",
    category: "Reference",
    summary: "Fastify API and collaboration server protocols with operational commands.",
    sourcePath: "/docs/BACKEND_SERVICES.md",
    markdown: backendServices
  },
  {
    id: "release-process",
    title: "Release Process",
    category: "Operations",
    summary: "Changesets workflow, CI/release automation, and required publication secrets.",
    sourcePath: "/docs/RELEASE_PROCESS.md",
    markdown: releaseProcess
  }
];

export const categoryOrder: readonly DocPage["category"][] = [
  "Foundations",
  "Guides",
  "Reference",
  "Operations"
];
