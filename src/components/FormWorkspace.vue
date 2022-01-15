<script lang="ts" setup>
import { ref } from "vue";
import { Workspace } from "../stores/workspace";
import { cloneDeep, uuid } from "licia-es";
import FormItemStorage from "./FormItemStorage.vue";

export interface WorkspaceFormData extends Omit<Workspace, "id"> {}

const props = defineProps<{ data?: WorkspaceFormData; disabled?: boolean }>();

const emit = defineEmits<{
  (event: "submit", data: WorkspaceFormData): void;
  (event: "cancel"): void;
}>();

const model = ref<WorkspaceFormData>(
  cloneDeep(props.data) || {
    name: "",
    metaStorageConfig: {
      type: "indexedDB",
      dbName: uuid(),
    },
  }
);
</script>
<template>
  <n-form
    :model="model"
    label-placement="left"
    label-align="left"
    :label-width="80"
    :disabled="props.disabled"
  >
    <div class="my-5 text-xs font-medium text-neutral-400">通用设置</div>
    <n-form-item label="空间名" path="name">
      <n-input v-model:value="model.name" placeholder="输入空间名" />
    </n-form-item>
    <form-item-storage
      :types="['indexedDB', 's3']"
      :model-value="model.metaStorageConfig"
      path="metaStorageConfig"
    ></form-item-storage>
    <div class="my-5 text-xs font-medium text-neutral-400">
      图床设置（对象存储需开启公有读)
    </div>
    <n-form-item label="启用图床">
      <n-switch
        :value="!!model.imageStorageConfig"
        @update:value="
          (val) => {
            model.imageStorageConfig = val
              ? {
                  type: 's3',
                  baseUrl: '',
                  endpoint: '',
                  accessKeyId: '',
                  secretAccessKey: '',
                }
              : undefined;
          }
        "
      ></n-switch>
    </n-form-item>
    <template v-if="model.imageStorageConfig">
      <n-form-item label="Base URL" path="imageStorageConfig.baseUrl">
        <n-input
          v-model:value="model.imageStorageConfig.baseUrl"
          placeholder="图片基础链接"
        />
      </n-form-item>
      <storage-form-item
        :types="['s3']"
        :model-value="model.imageStorageConfig"
        path="imageStorageConfig"
      ></storage-form-item>
    </template>
    <n-space justify="end">
      <n-button :disabled="props.disabled" @click="emit('cancel')"
        >取消</n-button
      >
      <n-button
        :disabled="props.disabled"
        type="primary"
        @click="emit('submit', model)"
        >提交</n-button
      >
    </n-space>
  </n-form>
</template>
