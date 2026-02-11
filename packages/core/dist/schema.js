import { Schema } from "prosemirror-model";
const coreNodeSpecs = {
    doc: {
        content: "block+"
    },
    paragraph: {
        group: "block",
        content: "inline*",
        parseDOM: [{ tag: "p" }],
        toDOM() {
            return ["p", 0];
        }
    },
    text: {
        group: "inline"
    },
    hard_break: {
        inline: true,
        group: "inline",
        selectable: false,
        parseDOM: [{ tag: "br" }],
        toDOM() {
            return ["br"];
        }
    }
};
const coreMarkSpecs = {};
export const createCoreSchema = () => new Schema({
    nodes: coreNodeSpecs,
    marks: coreMarkSpecs
});
export const coreSchema = createCoreSchema();
//# sourceMappingURL=schema.js.map