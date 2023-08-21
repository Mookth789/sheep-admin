<template>
  <el-sub-menu :index="menuItem.name">
    <template #title>
      <sa-icon class="sa-m-r-8" size="16" :icon="menuItem.icon" />
      <span>{{ menuItem.title }}</span>
    </template>
    <slot />
  </el-sub-menu>
</template>
<script setup>
  const props = defineProps(['menuItem']);
</script>
