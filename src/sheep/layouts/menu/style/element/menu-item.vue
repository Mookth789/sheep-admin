<template>
  <el-menu-item :index="menuItem.name">
    <sa-icon class="sa-m-r-8" size="16" :icon="menuItem.icon" />
    <template #title>
      <span>{{ menuItem.title }}</span>
    </template>
  </el-menu-item>
</template>
<script setup>
  const props = defineProps(['menuItem']);
</script>
