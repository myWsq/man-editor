<script setup lang="ts">
import LayoutMain from "./components/LayoutMain.vue";
import { GlobalThemeOverrides } from "naive-ui";

const theme: GlobalThemeOverrides = {
  common: {
    fontFamily: "MI Lan Pro",
    primaryColor: "#ec4899",
    primaryColorHover: "#f472b6",
    primaryColorSuppl: "#f472b6",
    primaryColorPressed: "#be185d",
    scrollbarHeight: "8px",
    scrollbarWidth: "8px",
  },
};
</script>

<template>
  <n-config-provider :theme-overrides="theme">
    <n-global-style></n-global-style>
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <layout-main></layout-main>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="postcss" scoped></style>
