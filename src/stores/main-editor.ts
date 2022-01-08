import { defineStore } from "pinia";
import type { Editor } from "@tiptap/vue-3";

export const useMainEditor = defineStore("mainEditor", {
  state: () => {
    return {
      instance: undefined as Editor | undefined,
      content: "",
    };
  },
  actions: {
    // Basic
    async init() {
      this.destroy();
      const { Editor } = await import("@tiptap/vue-3");
      const { editorOptions } = await import("../lib/tiptap-options");
      this.instance = new Editor({
        ...editorOptions,
        onUpdate: () => {
          this.content = this.instance?.getHTML() || "";
        },
      });
    },
    destroy() {
      this.instance?.destroy();
      this.instance = undefined;
      this.content = "";
    },
  },
});
