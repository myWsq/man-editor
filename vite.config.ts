import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { visualizer } from "rollup-plugin-visualizer";
import components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    components({
      dirs: [],
      resolvers: [NaiveUiResolver()],
    }),
  ],
  build: {
    rollupOptions: {
      plugins: [
        // 需要分析包大小时打开
        // visualizer()
      ],
    },
  },
});
