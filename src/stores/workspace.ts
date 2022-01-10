import { defineStore } from "pinia";
import { uuid, remove, pick } from "licia-es";
import { StorageAdapter } from "../lib/storage-adapter";
import { StorageAdapterS3Options } from "../lib/storage-adapters/s3";
import { StorageAdapterIndexedDbOptions } from "../lib/storage-adapters/indexed-db";
import { guard } from "../utils/guard";
import { STORAGE_KEY } from "../consts/storage-key";
import { useCommonStore } from "./common";
import { watch } from "vue";

export interface MetaStorageConfigS3 extends StorageAdapterS3Options {
  type: "s3";
}

export interface MetaStorageConfigIndexedDB
  extends StorageAdapterIndexedDbOptions {
  type: "indexedDB";
}

type MetaStorageConfig = MetaStorageConfigIndexedDB | MetaStorageConfigS3;

type ImageStorageConfig = MetaStorageConfigS3 & {
  baseUrl: string;
};

export interface Workspace {
  id: string;
  name: string;
  metaStorageConfig: MetaStorageConfig;
  imageStorageConfig?: ImageStorageConfig;
}

export interface PostNode {
  id: string;
  title: string;
  isInTrash: boolean;
  isDraft: boolean;
  folderId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FolderNode {
  id: string;
  name: string;
}

export const useWorkspace = defineStore("workspace", {
  state: () => {
    return {
      currentWorkspaceId: "",
      currentFolderId: "all",
      currentPostId: "",
      workspaceList: [] as Workspace[],
      buildInFolders: [
        { id: "all", name: "全部文档" },
        { id: "draft", name: "草稿" },
        { id: "notInbox", name: "未归档" },
        { id: "trash", name: "废纸篓" },
      ] as FolderNode[],
      documents: {
        posts: [] as PostNode[],
        folders: [] as FolderNode[],
      },
      isLoadingDocuments: false,
    };
  },
  getters: {
    currentWorkspaceConfig: (state) =>
      state.workspaceList.find((val) => val.id === state.currentWorkspaceId),

    folderPosts: (state) => {
      const { posts, folders } = state.documents;
      let map: Record<string, PostNode[]> = {
        all: posts.filter((item) => !item.isInTrash),
        draft: posts.filter((item) => !item.isInTrash && item.isDraft),
        notInbox: posts.filter(
          (item) =>
            !item.isInTrash &&
            (!item.folderId ||
              !state.documents.folders.find(
                (folder) => folder.id === item.folderId
              ))
        ),
        trash: posts.filter((item) => item.isInTrash),
      };

      for (const folder of folders) {
        map[folder.id] = posts.filter(
          (item) =>
            !item.isInTrash &&
            item.folderId &&
            state.documents.folders.find((each) => each.id === folder.id)
        );
      }

      return map;
    },

    currentPostList(): PostNode[] {
      return this.folderPosts[this.currentFolderId];
    },

    isImageStorageEnabled(): boolean {
      return !!this.currentWorkspaceConfig?.imageStorageConfig;
    },
  },
  actions: {
    loadWorkspace() {
      const data = localStorage.getItem(STORAGE_KEY.workspaceConfig);
      if (data) {
        this.$patch(JSON.parse(data));
      }

      // 初始化默认 workspace
      if (!this.workspaceList.length) {
        const item = this.createWorkspace({
          name: "默认空间",
          metaStorageConfig: {
            type: "indexedDB",
            dbName: uuid(),
          },
        });
        this.currentWorkspaceId = item.id;
      }

      // 如果已经存在 workspace 配置，自动将第一个作为当前空间
      else if (!this.currentWorkspaceConfig) {
        this.currentWorkspaceId = this.workspaceList[0].id;
      }
    },

    createWorkspace(options: Omit<Workspace, "id">) {
      const id = uuid();
      const item: Workspace = {
        id,
        ...options,
      };
      this.workspaceList.push(item);
      return item;
    },

    updateWorkspace(id: string, options: Omit<Workspace, "id">) {
      this.workspaceList.splice(
        this.workspaceList.findIndex((item) => item.id === id),
        1,
        {
          ...options,
          id,
        }
      );
    },

    removeWorkspace(id: string) {
      remove(this.workspaceList, (val) => val?.id === id);
      this.currentWorkspaceId = this.workspaceList[0].id;
    },

    saveWorkspace() {
      localStorage.setItem(
        STORAGE_KEY.workspaceConfig,
        JSON.stringify(pick(this, ["currentWorkspaceId", "workspaceList"]))
      );
    },

    async createStorage(
      config: ImageStorageConfig | MetaStorageConfig
    ): Promise<StorageAdapter> {
      let instance: StorageAdapter | undefined;

      // IndexedDb
      if (config.type === "indexedDB") {
        const { StorageAdapterIndexedDb } = await import(
          "../lib/storage-adapters/indexed-db"
        );
        instance = new StorageAdapterIndexedDb(config);
      }

      // S3
      else if (config.type === "s3") {
        // aws sdk 需要全局 global
        (window as any).global = window;
        const { StorageAdapterS3 } = await import("../lib/storage-adapters/s3");
        instance = new StorageAdapterS3(config);
      }

      guard(instance);
      return instance;
    },

    createFolder(name: string) {
      const folder = {
        id: uuid(),
        name,
      };
      this.documents.folders.unshift(folder);
      return folder;
    },

    removeFolder(id: string) {
      remove(this.documents.folders, (item) => item?.id === id);
      if (id === this.currentFolderId) {
        this.currentFolderId = "";
      }
    },

    renameFolder(id: string, newName: string) {
      const current = this.documents.folders.find((item) => item.id === id);
      guard(current);
      current.name = newName;
    },

    async loadDocuments() {
      try {
        this.isLoadingDocuments = true;
        const metaConfig = this.currentWorkspaceConfig?.metaStorageConfig;
        guard(metaConfig);
        const storage = await this.createStorage(metaConfig);
        const data = await storage.getItem(STORAGE_KEY.workspaceDocuments);
        if (data) {
          this.documents = JSON.parse(data.toString());
        }
      } finally {
        this.isLoadingDocuments = false;
      }
    },

    async saveDocuments() {
      const common = useCommonStore();
      common.acquireClose();
      try {
        const metaConfig = this.currentWorkspaceConfig?.metaStorageConfig;
        guard(metaConfig);
        const storage = await this.createStorage(metaConfig);
        await storage.setItem(
          STORAGE_KEY.workspaceDocuments,
          JSON.stringify(this.documents)
        );
      } finally {
        common.releaseClose();
      }
    },
  },
});

export function registerWorkspace() {
  const workspace = useWorkspace();

  (() => {
    // 从 local storage 中加载初始状态
    workspace.loadWorkspace();

    // 监听 workspace 状态存储至 local storage
    watch(
      [() => workspace.currentWorkspaceId, () => workspace.workspaceList],
      () => {
        workspace.saveWorkspace();
      },
      {
        deep: true,
      }
    );
  })();

  (async () => {
    watch(
      () => workspace.currentWorkspaceConfig,
      (val) => {
        if (val) {
          workspace.loadDocuments();
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );

    // 监听 documents 状态变化存储至 storage
    watch(
      () => workspace.documents,
      () => {
        workspace.saveDocuments();
      },
      {
        deep: true,
      }
    );
  })();
}
