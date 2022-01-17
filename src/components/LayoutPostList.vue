<script lang="ts" setup>
import { useWorkspace } from "../stores/workspace";

const workspace = useWorkspace();
</script>
<template>
  <template v-if="workspace.currentPostList">
    <div
      class="pt-12 text-center text-neutral-400"
      v-if="!workspace.currentPostList.length"
    >
      这个文件夹是空的
    </div>
    <template v-else>
      {{ workspace.currentPostList }}
    </template>
  </template>
</template>
