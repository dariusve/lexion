export interface DocSection {
  readonly id: string;
  readonly title: string;
  readonly body: readonly string[];
}

export const sections: readonly DocSection[] = [
  {
    id: "overview",
    title: "Overview",
    body: [
      "Lexion is a framework-agnostic, headless rich text editor built on ProseMirror.",
      "Feature logic lives in extensions. UI adapters only bind framework lifecycles."
    ]
  },
  {
    id: "core",
    title: "Core",
    body: [
      "@lexion/core hosts editor lifecycle, command execution, extension loading, and JSON document APIs.",
      "Use LexionEditor with extensions to define schema, commands, and ProseMirror plugins."
    ]
  },
  {
    id: "extensions",
    title: "Extensions",
    body: [
      "@lexion/extensions contains starter kit, collaboration extension hooks, and AI extension primitives.",
      "New features should be implemented here, not in adapters."
    ]
  },
  {
    id: "adapters",
    title: "Adapters",
    body: [
      "@lexion/react, @lexion/vue, and @lexion/web provide controlled/uncontrolled editor mounting.",
      "Adapters can create an internal editor with starterKitExtension or accept an external editor instance."
    ]
  },
  {
    id: "backend",
    title: "Backend",
    body: [
      "apps/api exposes Fastify endpoints for document transforms and command execution.",
      "apps/collab-server provides a Yjs update relay over WebSocket for collaborative editing."
    ]
  }
];
