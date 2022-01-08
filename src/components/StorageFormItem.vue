<script lang="ts" setup>
import {
  NFormItem,
  NSelect,
  NInput,
  NInputGroup,
  NInputGroupLabel,
} from "naive-ui";
import { useVModel } from "@vueuse/core";
import {
  MetaStorageConfigIndexedDB,
  MetaStorageConfigS3,
} from "../stores/workspace";

type FormData = MetaStorageConfigIndexedDB | MetaStorageConfigS3;

const typeTextMap = {
  s3: "S3",
  indexedDB: "IndexedDB",
};

const props = defineProps<{
  types: (keyof typeof typeTextMap)[];
  path: string;
  modelValue: FormData;
}>();

const model = useVModel(props, "modelValue");

function genPath(nestedPath: string) {
  return props.path + "." + nestedPath;
}
</script>

<template>
  <n-form-item label="存储类型" :path="genPath('type')">
    <n-select
      v-model:value="model.type"
      :options="
        types.map((item) => ({
          label: typeTextMap[item],
          value: item,
        }))
      "
    ></n-select>
  </n-form-item>
  <template v-if="model.type === 's3'">
    <n-form-item label="Endpoint" :path="genPath('endpoint')">
      <n-input-group>
        <n-input-group-label>https://</n-input-group-label>
        <n-input
          v-model:value="model.endpoint"
          placeholder="S3 Bucket Endpoint"
        ></n-input>
      </n-input-group>
    </n-form-item>
    <n-form-item label="AK" :path="genPath('accessKeyId')">
      <n-input
        v-model:value="model.accessKeyId"
        placeholder="S3 accessKeyId"
      ></n-input>
    </n-form-item>
    <n-form-item label="SK" :path="genPath('secretAccessKey')">
      <n-input
        type="password"
        v-model:value="model.secretAccessKey"
        placeholder="S3 secretAccessKey"
      ></n-input>
    </n-form-item>
  </template>
</template>
