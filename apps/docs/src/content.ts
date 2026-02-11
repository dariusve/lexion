import aiContract from "../../../AI_CONTRACT.md?raw";
import architecture from "../../../ARCHITECTURE.md?raw";
import projectMap from "../../../PROJECT_MAP.md?raw";
import taskList from "../../../TASK_LIST.md?raw";
import adapterExamples from "../../../docs/ADAPTER_EXAMPLES.md?raw";
import architectureGuide from "../../../docs/ARCHITECTURE_GUIDE.md?raw";
import backendServices from "../../../docs/BACKEND_SERVICES.md?raw";
import extensionDevelopment from "../../../docs/EXTENSION_DEVELOPMENT.md?raw";
import extensionsReference from "../../../docs/EXTENSIONS_REFERENCE.md?raw";
import gettingStarted from "../../../docs/GETTING_STARTED.md?raw";
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
    id: "ai-contract",
    title: "AI Contract",
    category: "Foundations",
    summary: "Non-negotiable engineering constraints for core, adapters, and typing safety.",
    sourcePath: "/AI_CONTRACT.md",
    markdown: aiContract
  },
  {
    id: "architecture-overview",
    title: "Architecture",
    category: "Foundations",
    summary: "High-level responsibilities across core, adapters, extensions, collaboration, and AI.",
    sourcePath: "/ARCHITECTURE.md",
    markdown: architecture
  },
  {
    id: "project-map",
    title: "Project Map",
    category: "Foundations",
    summary: "System scope, package ownership, data flow, and feature placement rules.",
    sourcePath: "/PROJECT_MAP.md",
    markdown: projectMap
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
  },
  {
    id: "task-list",
    title: "Task List",
    category: "Operations",
    summary: "Implementation status tracker of completed, in-progress, and pending milestones.",
    sourcePath: "/TASK_LIST.md",
    markdown: taskList
  }
];

export const categoryOrder: readonly DocPage["category"][] = [
  "Foundations",
  "Guides",
  "Reference",
  "Operations"
];
