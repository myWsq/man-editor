import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerWorkspace } from "./stores/workspace";
import App from "./App.vue";

import "./assets/global.css";
import "./assets/typography.css";

const app = createApp(App);
app.use(createPinia());
registerWorkspace();

// 调整 Style 位置
// @see https://www.naiveui.com/zh-CN/dark/docs/style-position
const meta = document.createElement("meta");
meta.name = "naive-ui-style";
document.head.appendChild(meta);

app.mount("#app");
