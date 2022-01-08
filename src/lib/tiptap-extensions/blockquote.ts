import BuildInBlockquote from "@tiptap/extension-blockquote";

export const Blockquote = BuildInBlockquote.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      color: {
        default: "#f5f5f5",
        parseHTML: (element) => element.getAttribute("data-color"),
        renderHTML: (attributes) => {
          return {
            "data-color": attributes.color,
            style: `--tg-blockquote: ${attributes.color}`,
          };
        },
      },
      type: {
        default: "focus",
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => {
          return {
            "data-type": attributes.type,
          };
        },
      },
    };
  },
});
