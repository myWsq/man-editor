<script lang="ts" setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  hoverEnabled: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div
    :class="[
      'flex items-center px-4 h-9 rounded text-neutral-500 select-none',
      {
        'bg-neutral-200/80 text-neutral-600': props.active,
        'hover:bg-neutral-200/40': !props.active && props.hoverEnabled,
      },
    ]"
  >
    <n-icon
      :class="[
        'flex-shrink-0 mr-3 text-[1.2em] opacity-60',
        {
          'opacity-100': props.active,
        },
      ]"
    >
      <slot name="icon"></slot>
    </n-icon>
    <slot></slot>
  </div>
</template>

<style lang="postcss" scoped></style>
