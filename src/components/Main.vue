<script setup lang="ts">
import MainEditor from "./MainEditor.vue";
import Topbar from "./Topbar.vue";
import Finder from "./Finder.vue";
import Operation from "./Operation.vue";
import { NScrollbar } from "naive-ui";
</script>

<template>
  <div class="flex flex-col h-screen bg-neutral-50">
    <nav class="bg-white">
      <Topbar></Topbar>
    </nav>
    <div class="flex flex-grow min-h-0">
      <aside class="flex-shrink-0 min-h-0 border-r w-72 border-neutral-200">
        <NScrollbar>
          <Finder></Finder>
        </NScrollbar>
      </aside>
      <main class="relative flex-grow min-w-0 min-h-0">
        <NScrollbar x-scrollable>
          <MainEditor></MainEditor>
        </NScrollbar>
      </main>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
