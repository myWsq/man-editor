<script setup lang="ts">
import type { Editor, EditorContent } from "@tiptap/vue-3";
import { computed, onMounted, onUnmounted, shallowRef, watch } from "vue";
import { useEditingPost } from "../stores/editing-post";
import { useMainEditor } from "../stores/main-editor";

const post = useEditingPost();
const editor = useMainEditor();
/** 修复 pinia 导致的类型错误 */
const editorInstance = computed(() => editor.instance as Editor | undefined);

const EditorComponent = shallowRef<typeof EditorContent | null>(null);

watch(
  () => editor.content,
  (val) => {
    post.content = val;
  },
  {
    immediate: true,
  }
);

onMounted(async () => {
  await editor.init();
  const { EditorContent } = await import("@tiptap/vue-3");
  EditorComponent.value = EditorContent;
  editor.instance?.commands.setContent(
    `
    <h1>Table</h1>
    `
  );
});

onUnmounted(() => {
  editor.destroy();
});
</script>

<template>
  <div class="editor-container">
    <component
      v-if="EditorComponent"
      :is="EditorComponent"
      class="editor-component"
      :editor="editorInstance"
    ></component>
  </div>
</template>

<style lang="postcss" scoped>
.editor-component {
  @apply flex justify-center bg-white;
}
.editor-container:deep(.ProseMirror) {
  @apply max-w-full px-16 pt-32 pb-[80vh] w-[780px];
  .is-empty:not(.ProseMirror-selectednode)::before {
    content: attr(data-placeholder);
    float: left;
    color: #ced4da;
    pointer-events: none;
    height: 0;
  }
  .ProseMirror-selectednode {
    @apply cursor-default outline outline-pink-200;
  }
}
</style>
