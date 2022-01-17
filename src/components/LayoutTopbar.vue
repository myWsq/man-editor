<script lang="ts" setup>
import DropdownWorkspace from "./DropdownWorkspace.vue";
import { CreateOutline as ICreate } from "@vicons/ionicons5";
import { useWorkspace } from "../stores/workspace";

const workspace = useWorkspace();

function createPostHandler() {
  const post = workspace.createPost();
  workspace.currentFolderId = post.folderId || "notInbox";
  workspace.currentPostId = post.id;
}
</script>
<template>
  <div class="flex h-14">
    <div class="flex h-full px-4 overflow-hidden border-r w-72 bg-neutral-50">
      <div class="nav-item">
        <img src="../assets/logo.svg" class="w-8" />
        <span class="ml-2 text-base font-medium">漫笔记</span>
      </div>
    </div>
    <div class="flex flex-grow h-full pr-8 border-b">
      <div class="flex-grow"></div>
      <div class="mr-3 nav-item">
        <n-button
          strong
          quaternary
          size="medium"
          type="primary"
          :disabled="workspace.isLoadingDocuments"
          @click="createPostHandler"
        >
          <template #icon>
            <n-icon>
              <i-create></i-create>
            </n-icon>
          </template>
        </n-button>
      </div>
      <div class="nav-item">
        <dropdown-workspace></dropdown-workspace>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.nav-item {
  @apply flex items-center;
}
</style>
