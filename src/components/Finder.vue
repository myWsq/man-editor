<script lang="tsx" setup>
import {
  NIcon,
  NButton,
  NInput,
  NPopselect,
  NEllipsis,
  useDialog,
} from "naive-ui";
import {
  Library,
  FileTray,
  Trash,
  Document,
  Add,
  FolderOutline,
  FolderOpenOutline,
  EllipsisHorizontal,
} from "@vicons/ionicons5";
import { nextTick, ref, watch } from "vue";
import FinderMenuItem from "./FinderMenuItem.vue";
import { useWorkspace } from "../stores/workspace";
import { guard } from "../utils/guard";

const dialog = useDialog();
const workspace = useWorkspace();
const isFolderNameInputShow = ref(false);
const folderNameInput = ref("");
const currentCommandFolderId = ref("");
const currentRenamedFolderId = ref("");

const RENAME_INPUT_ID = "rename-input";

const buildInFolderIconMap: Record<string, any> = {
  all: Library,
  draft: Document,
  notInbox: FileTray,
  trash: Trash,
};

function showFolderNameInput(folderId: string = "") {
  currentRenamedFolderId.value = folderId;
  folderNameInput.value =
    workspace.documents.folders.find((item) => item.id === folderId)?.name ||
    "";
  isFolderNameInputShow.value = true;
  nextTick(() => {
    const el = document.getElementById(RENAME_INPUT_ID) as HTMLInputElement;
    guard(el);
    el.focus();
    el.select();
  });
}

function submitFolderName() {
  const name = folderNameInput.value.trim();
  if (name) {
    // 重命名
    if (currentRenamedFolderId.value) {
      workspace.renameFolder(currentRenamedFolderId.value, name);
      workspace.currentFolderId = currentRenamedFolderId.value;
    }
    // 新建文件夹
    else {
      const folder = workspace.createFolder(name);
      workspace.currentFolderId = folder.id;
    }
  }
  // 防止重复触发
  folderNameInput.value = "";
  isFolderNameInputShow.value = false;
}

function inputEventHandler(e: KeyboardEvent | WheelEvent) {
  // cancel
  if (
    (e instanceof KeyboardEvent && e.key === "Escape") ||
    e instanceof WheelEvent
  ) {
    // 清空值阻止 blur 时 submit 触发
    folderNameInput.value = "";
    isFolderNameInputShow.value = false;
  }
  // submit
  else if (e instanceof KeyboardEvent && e.key === "Enter") {
    submitFolderName();
  }
}

function commandHandler(command: string) {
  const id = currentCommandFolderId.value;
  guard(id);
  switch (command) {
    case "rename":
      showFolderNameInput(currentCommandFolderId.value);
      break;
    case "delete":
      dialog.warning({
        title: "确定删除文件夹吗?",
        content: "此操作不会删除文件夹内的文档",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick() {
          workspace.removeFolder(id);
        },
      });
      break;
    default:
      break;
  }
  // 关闭菜单
  currentCommandFolderId.value = "";
}

watch(isFolderNameInputShow, (val) => {
  if (val) {
    window.addEventListener("keydown", inputEventHandler, {
      capture: true,
      passive: true,
    });
    window.addEventListener("wheel", inputEventHandler, {
      capture: true,
      passive: true,
    });
  } else {
    window.removeEventListener("keydown", inputEventHandler, {
      capture: true,
    });
    window.removeEventListener("wheel", inputEventHandler, {
      capture: true,
    });
  }
});
</script>

<template>
  <div class="flex flex-col px-2 py-5">
    <span class="px-3 mb-3 font-medium text-neutral-400">分类</span>
    <finder-menu-item
      v-for="item in workspace.buildInFolders"
      :key="item.id"
      :active="item.id === workspace.currentFolderId"
      @click="workspace.currentFolderId = item.id"
    >
      <template #icon>
        <component :is="buildInFolderIconMap[item.id]"></component>
      </template>
      <div class="flex items-center justify-between flex-grow">
        <span class="font-medium">{{ item.name }}</span>
        <span class="text-xs text-neutral-400">{{
          workspace.folderPosts[item.id].length
        }}</span>
      </div>
    </finder-menu-item>
    <div class="flex items-center justify-between px-2 mt-5 mb-3">
      <span class="font-medium text-neutral-400">文件夹</span>
      <n-button
        tertiary
        circle
        #icon
        type="primary"
        size="tiny"
        :class="['scale-90', workspace.isLoadingDocuments && 'invisible']"
        @click="() => showFolderNameInput()"
      >
        <n-icon>
          <add></add>
        </n-icon>
      </n-button>
    </div>

    <div
      class="absolute inset-0 z-10 bg-neutral-100/70"
      v-if="isFolderNameInputShow"
    ></div>

    <!-- 虚拟的新增文件夹 -->
    <finder-menu-item
      class="relative z-10"
      v-if="isFolderNameInputShow && !currentRenamedFolderId"
      :active="false"
      :hover-enabled="false"
    >
      <template #icon>
        <folder-outline></folder-outline>
      </template>
      <n-input
        :input-props="{
          id: RENAME_INPUT_ID,
        }"
        v-model:value="folderNameInput"
        size="small"
        :theme-overrides="{
          paddingSmall: '0',
        }"
        @blur="submitFolderName"
        placeholder=""
      ></n-input>
    </finder-menu-item>

    <!-- 文件夹列表 -->
    <template v-if="!workspace.isLoadingDocuments">
      <finder-menu-item
        v-for="item in workspace.documents.folders"
        :key="item.id"
        :active="workspace.currentFolderId === item.id"
        @click="workspace.currentFolderId = item.id"
        :class="[
          'group',
          isFolderNameInputShow &&
            currentRenamedFolderId === item.id &&
            'relative z-10',
        ]"
      >
        <template #icon>
          <folder-open-outline
            v-if="workspace.currentFolderId === item.id"
          ></folder-open-outline>
          <folder-outline v-else></folder-outline>
        </template>

        <!-- 重命名的输入框 -->
        <n-input
          ref="folderNameInputElement"
          :input-props="{
            id: RENAME_INPUT_ID,
          }"
          v-if="isFolderNameInputShow && currentRenamedFolderId === item.id"
          v-model:value="folderNameInput"
          size="small"
          :theme-overrides="{
            paddingSmall: '0',
          }"
          @blur="submitFolderName"
          placeholder=""
        ></n-input>

        <!-- 文件夹主要内容 -->
        <div class="flex justify-between flex-grow min-w-0" v-else>
          <n-ellipsis class="flex-grow">{{ item.name }}</n-ellipsis>
          <!-- 操作图标 -->
          <div class="flex items-center flex-shrink-0 space-x-1">
            <n-popselect
              size="small"
              :animated="false"
              placement="bottom-start"
              :flip="false"
              trigger="click"
              :options="[
                {
                  label: '重命名',
                  value: 'rename',
                },
                {
                  label: '删除',
                  value: 'delete',
                },
              ]"
              :show="currentCommandFolderId === item.id"
              @update:show="
                (val) => {
                  if (!val) {
                    currentCommandFolderId = '';
                  }
                }
              "
              @update:value="commandHandler"
            >
              <n-button
                size="tiny"
                :class="[
                  'scale-75',
                  {
                    // 菜单出现时不执行消失逻辑
                    'invisible group-hover:visible':
                      currentCommandFolderId !== item.id,
                  },
                ]"
                tertiary
                #icon
                circle
                @click.stop="
                  () => {
                    currentCommandFolderId = item.id;
                  }
                "
              >
                <n-icon>
                  <ellipsis-horizontal></ellipsis-horizontal>
                </n-icon>
              </n-button>
            </n-popselect>
            <span class="text-xs text-neutral-400">{{
              workspace.folderPosts[item.id].length
            }}</span>
          </div>
        </div>
      </finder-menu-item>
    </template>
    <span
      v-if="
        !workspace.documents.folders.length &&
        !workspace.isLoadingDocuments &&
        !isFolderNameInputShow
      "
      class="px-3 text-neutral-400"
      >创建文件夹以组织文件</span
    >
  </div>
</template>

<style lang="postcss" scoped></style>
