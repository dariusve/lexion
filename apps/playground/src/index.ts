export type { PlaygroundExampleHandle } from "./vue-examples.js";
export { mountVueControlledExample, mountVueUncontrolledExample } from "./vue-examples.js";
export {
  mountWebToolbarExample,
  SampleToolbarAdapter,
  type SampleToolbarAdapterOptions,
  type ToolbarButtonConfig
} from "./web-toolbar-example.js";

export const startPlayground = (): string => "playground-ready";
