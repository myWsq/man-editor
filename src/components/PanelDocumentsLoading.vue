<script lang="ts" setup></script>
<template>
  <div class="flex flex-col flex-grow max-w-sm mt-12 ml-12">
    <p class="flex items-center text-2xl text-neutral-400">
      <n-icon :size="40">
        <n-spin size="small" stroke="rgb(163,163,163)"></n-spin> </n-icon
      >正在加载工作区文档信息...
    </p>
    <p class="mt-3 text-neutral-400">
      加载速度可能因存储介质和文档数量不同而出现差异。如加载时间过长，请检查存储介质是否正常工作。
    </p>
  </div>
</template>
