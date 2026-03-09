import type { LexionStatusBarAlignment, LexionStatusBarItem } from "./types.js";
export interface LexionStatusBarAppearance {
    readonly className: "lexion-editor-status-bar";
    readonly groupClassName: "lexion-editor-status-bar-group";
    readonly itemClassName: "lexion-editor-status-item";
    readonly style: Readonly<Record<string, string>>;
    readonly groupStyles: Readonly<Record<LexionStatusBarAlignment, Readonly<Record<string, string>>>>;
}
export declare const lexionStatusBarAppearance: LexionStatusBarAppearance;
export declare const lexionBrandingStatusItem: LexionStatusBarItem;
//# sourceMappingURL=branding.d.ts.map