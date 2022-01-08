import Heading from "@tiptap/extension-heading";

export const Title = Heading.extend({
  name: "title",
  content: "inline*",
  group: "",
  selectable: false,
  draggable: false,
}).configure({
  levels: [1],
});
