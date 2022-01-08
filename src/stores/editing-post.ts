import { defineStore } from "pinia";

export const useEditingPost = defineStore("post", {
  state: () => {
    return {
      /** 文章标题 */
      title: "",
      /** 文章内容 */
      content: "",
      /** 是否显示封面图片 */
      isShowCover: false,
      /** 封面图片链接 */
      coverLink: "",
    };
  },
});
