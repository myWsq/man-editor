<script setup lang="ts">
import LayoutFinder from "./LayoutFinder.vue";
import PanelDocumentsLoading from "./PanelDocumentsLoading.vue";
import { useWorkspace } from "../stores/workspace";
import LayoutPostList from "./LayoutPostList.vue";
import LayoutTopbar from "./LayoutTopbar.vue";

const workspace = useWorkspace();
</script>

<template>
  <div class="flex flex-col h-screen bg-neutral-50">
    <nav class="bg-white">
      <layout-topbar></layout-topbar>
    </nav>
    <div class="flex flex-grow min-h-0">
      <aside class="flex-shrink-0 min-h-0 border-r w-72 border-neutral-200">
        <n-scrollbar>
          <layout-finder></layout-finder>
        </n-scrollbar>
      </aside>
      <main class="relative flex-grow min-w-0 min-h-0">
        <panel-documents-loading
          v-if="workspace.isLoadingDocuments"
        ></panel-documents-loading>
        <n-scrollbar v-else>
          <layout-post-list></layout-post-list>
        </n-scrollbar>
        <!-- <NScrollbar x-scrollable>
          <MainEditor></MainEditor>
        </NScrollbar> -->
      </main>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
