<script lang="tsx" setup>
import testImageUrl from "../assets/logo.png";
import { uuid } from "licia-es";
import axios from "axios";

import { useWorkspace, Workspace } from "../stores/workspace";
import { reactive, ref } from "vue";
import FormWorkspace, { WorkspaceFormData } from "./FormWorkspace.vue";
import {
  NButton,
  NPopover,
  NIcon,
  NModal,
  useNotification,
  useDialog,
} from "naive-ui";

import {
  Cog as ICog,
  SadOutline as ISadOutline,
  HappyOutline as IHappyOutline,
} from "@vicons/ionicons5";

const workspace = useWorkspace();
const dropdownItemClass = "p-3 py-2 rounded hover:bg-neutral-100 text-sm";
const isShowPop = ref(false);
const isShowFormModal = ref(false);
const editingWorkspace = ref<Workspace | undefined>(undefined);
const notification = useNotification();
const dialog = useDialog();
const isTesting = ref(false);

function useStepIterator(messages: string[]) {
  const steps = reactive(
    messages.map((item, i) => ({
      index: i,
      text: item,
      isSuccess: false,
      isError: false,
      errorMessage: "",
    }))
  );

  const current = ref(0);

  const next = () => {
    steps[current.value].isSuccess = true;
    current.value += 1;
  };

  const error = (msg?: string) => {
    steps[current.value].isError = true;
    steps[current.value].errorMessage = msg || "";
    current.value++;
  };

  return {
    steps,
    current,
    next,
    error,
  };
}

async function onSubmit(data: WorkspaceFormData) {
  isTesting.value = true;

  const { steps, next, error, current } = useStepIterator([
    "创建通用存储实例",
    "测试通用存储实例",
    ...(data.imageStorageConfig
      ? ["创建图床存储实例", "测试图床存储实例", "上传图片测试"]
      : []),
  ]);

  const errorMsg = ref("");

  const handle = notification.create({
    type: "info",
    content: () => (
      <div>
        <div class="mb-2 text-base font-semibold">
          {handle.type === "success" && "配置检查通过"}
          {handle.type === "error" && "配置检查失败"}
          {handle.type === "info" && "正在检查配置..."}
        </div>
        {steps.map((item) => (
          <div
            class={[
              "flex items-center text-neutral-400 mb-1",
              {
                "text-blue-500": item.index === current.value,
                "text-green-600": item.isSuccess,
                "text-red-500": item.isError,
              },
            ]}
          >
            <NIcon class="inline-block mr-1">
              {item.isSuccess && <IHappyOutline />}
              {item.isError && <ISadOutline></ISadOutline>}
            </NIcon>
            {item.text}
          </div>
        ))}
        <div class="mt-2 text-red-400">{errorMsg.value}</div>
      </div>
    ),
    closable: false,
    duration: 0,
  });

  try {
    const metaStorage = await workspace.createStorage(data.metaStorageConfig);
    next();
    await metaStorage.check();
    next();
    if (data.imageStorageConfig) {
      const imageStorage = await workspace.createStorage(
        data.imageStorageConfig
      );
      next();
      await imageStorage.check();
      next();
      // 测试上传图片
      const { data: blob } = await axios.get(testImageUrl, {
        responseType: "blob",
      });
      const ext = testImageUrl.split(".").pop();
      const key = uuid() + "." + (ext || "");
      await imageStorage.setItem(key, blob);
      const url = data.imageStorageConfig.baseUrl + "/" + key;
      await axios.get(url).catch((err) => {
        throw new Error(`图片请求失败: ${url}, ${err}`);
      });
      next();
    }
    handle.type = "success";

    setTimeout(() => {
      handle.destroy();
    }, 1000);

    // 测试完成, 执行创建/更新逻辑
    // 正在更新
    if (editingWorkspace.value) {
      workspace.updateWorkspace(editingWorkspace.value.id, data);
    }
    // 正在创建
    else {
      const newSpace = workspace.createWorkspace(data);
      workspace.currentWorkspaceId = newSpace.id;
    }
    isShowFormModal.value = false;
  } catch (err) {
    error();
    errorMsg.value = String(err);
    handle.closable = true;
    handle.type = "error";
  } finally {
    isTesting.value = false;
  }
}
</script>

<template>
  <n-popover
    v-model:show="isShowPop"
    v-if="workspace.currentWorkspaceConfig"
    trigger="click"
    :show-arrow="false"
    :theme-overrides="{
      padding: '6px',
    }"
    :width="280"
  >
    <template #trigger>
      <n-button v-bind="$attrs" strong quaternary>{{
        workspace.currentWorkspaceConfig.name
      }}</n-button>
    </template>
    <template #header>
      <div
        :class="[
          dropdownItemClass,
          'flex justify-between items-center group cursor-default',
        ]"
        strong
        quaternary
        v-for="item in workspace.workspaceList"
        :key="item.id"
        @click="
          () => {
            workspace.currentWorkspaceId = item.id;
            isShowPop = false;
          }
        "
      >
        <span
          :class="{
            'text-pink-500 font-semibold':
              item.id === workspace.currentWorkspaceConfig.id,
          }"
        >
          {{ item.name }}
        </span>
        <n-icon
          :size="16"
          class="hidden cursor-pointer text-neutral-400 hover:text-neutral-500 group-hover:block"
          @click.stop="
            () => {
              editingWorkspace = item;
              isShowPop = false;
              isShowFormModal = true;
            }
          "
        >
          <i-cog></i-cog>
        </n-icon>
      </div>
    </template>
    <div
      @click="
        () => {
          isShowPop = false;
          editingWorkspace = undefined;
          isShowFormModal = true;
        }
      "
      :class="[dropdownItemClass, 'text-neutral-500']"
    >
      创建新空间
    </div>
    <div
      v-if="workspace.workspaceList.length > 1"
      @click="
        () => {
          isShowPop = false;
          dialog.warning({
            title: `确定删除空间吗?`,
            content: `此操作仅删除配置，不会对数据造成影响。如需删除数据，可以根据存储介质自行删除源数据。`,
            positiveText: `确定`,
            negativeText: `取消`,
            onPositiveClick: () => {
              workspace.removeWorkspace(workspace.currentWorkspaceId);
            },
          });
        }
      "
      :class="[dropdownItemClass, 'text-red-500']"
    >
      删除当前空间
    </div>
  </n-popover>
  <n-modal
    v-model:show="isShowFormModal"
    preset="card"
    :title="editingWorkspace ? `修改 - ${editingWorkspace.name}` : '创建新空间'"
    class="max-w-md"
    :mask-closable="false"
    :closable="false"
  >
    <form-workspace
      :data="editingWorkspace"
      @cancel="isShowFormModal = false"
      @submit="onSubmit"
      :disabled="isTesting"
    ></form-workspace>
  </n-modal>
</template>
