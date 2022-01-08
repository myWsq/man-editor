import { defineStore } from "pinia";

export const useCommonStore = defineStore("common", {
  state: () => {
    return {
      _preventCloseLock: 0,
    };
  },
  getters: {
    shouldPreventClose: (state) => !!state._preventCloseLock,
  },
  actions: {
    acquireClose() {
      this._preventCloseLock++;
    },
    releaseClose() {
      this._preventCloseLock--;
    },
  },
});
