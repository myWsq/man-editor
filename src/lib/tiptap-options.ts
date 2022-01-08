import Typography from "@tiptap/extension-typography";
import { EditorOptions } from "@tiptap/core";
import { Blockquote } from "./tiptap-extensions/blockquote";
import { Document } from "./tiptap-extensions/document";
import { Title } from "./tiptap-extensions/title";
import { StarterKit } from "./tiptap-extensions/startkit";
import { Placeholder } from "./tiptap-extensions/placeholder";
import { TableCombine } from "./tiptap-extensions/table";
import { AutoNewLine } from "./tiptap-extensions/auto-new-line";

export const editorOptions: Partial<EditorOptions> = {
  extensions: [
    Document,
    Title,
    Blockquote,
    StarterKit,
    Typography,
    Placeholder,
    TableCombine,
    AutoNewLine,
  ],

  editorProps: {
    attributes: {
      spellcheck: "true",
      class: "typography",
    },
  },
};
