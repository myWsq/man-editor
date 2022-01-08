import { Extension } from "@tiptap/core";

export const AutoNewLine = Extension.create({
  name: "autoNewLine",
  onUpdate() {
    const lastChild = this.editor.state.doc.lastChild;

    // 已经存在空行
    if (
      lastChild &&
      lastChild.type.name === "paragraph" &&
      lastChild.childCount === 0
    ) {
      return;
    }

    // 添加空行
    this.editor.commands.insertContent(
      {
        type: "paragraph",
      },
      {
        updateSelection: false,
      }
    );
  },
});
