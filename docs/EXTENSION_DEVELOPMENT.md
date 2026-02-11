# Extension Development

## Goal
Implement editor features as reusable extensions in `packages/extensions`.

## Extension Contract
A `LexionExtension` can provide:
- `key`: unique id.
- `schema`: schema instance or factory.
- `commands(context)`: command map.
- `prosemirrorPlugins(context)`: ProseMirror plugins.
- `onCreate` / `onDestroy`: lifecycle hooks.

## Minimal Template
```ts
import type { LexionExtension } from "@lexion/core";

export const myExtension: LexionExtension = {
  key: "my-extension",
  commands: () => ({
    myCommand: ({ state, dispatch }) => {
      dispatch(state.tr);
      return true;
    }
  }),
  prosemirrorPlugins: () => []
};
```

## Registering an Extension
```ts
import { LexionEditor } from "@lexion/core";
import { starterKitExtension } from "@lexion/extensions";
import { myExtension } from "./my-extension";

const editor = new LexionEditor({
  extensions: [starterKitExtension, myExtension]
});
```

## Rules for Contributors
1. Put feature logic in `packages/extensions`, not adapters.
2. Keep extension command names stable and explicit.
3. Avoid side effects in extension module scope.
4. Keep schema ownership clear: use one schema-providing extension per editor instance.

## Validation Checklist
1. `pnpm build`
2. `pnpm lint`
3. Verify behavior in `apps/vue-sample` or playground.
