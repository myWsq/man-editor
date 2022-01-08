import BuildInStarterKit from "@tiptap/starter-kit";

export const StarterKit = BuildInStarterKit.configure({
  document: false,
  blockquote: false,
  heading: {
    levels: [2, 3, 4],
  },
  codeBlock: {
    HTMLAttributes: {
      spellcheck: "false",
    },
  },
  code: {
    HTMLAttributes: {
      spellcheck: "false",
    },
  },
  dropcursor: {
    class: "drop-cursor",
    width: 2,
    color: "none",
  },
});
