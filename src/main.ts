import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerWorkspace } from "./stores/workspace";
import App from "./App.vue";
import "./assets/global.css";
import "./assets/typography-normalize.css";
import "./assets/typography.css";

const app = createApp(App);
app.use(createPinia());
registerWorkspace();
app.mount("#app");
