import BuildInPlaceholder from "@tiptap/extension-placeholder";

export const Placeholder = BuildInPlaceholder.configure({
  showOnlyCurrent: false,
  placeholder: ({ node }) => {
    if (node.type.name === "title") {
      return "请输入标题";
    }
    return "";
  },
});
