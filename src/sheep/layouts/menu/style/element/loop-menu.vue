<template>
  <component :is="componentId" :menuItem="menuItem">
    <loop-menu v-for="menu in menuItem.children" :key="menu" :menuItem="menu"></loop-menu>
  </component>
</template>
<script>
  import MenuItem from './menu-item.vue';
  import SubMenu from './sub-menu.vue';
  export default {
    components: {
      MenuItem,
      SubMenu,
    },
  };
</script>
<script setup>
  import { computed } from 'vue';
  import { isEmpty } from 'lodash';

  const props = defineProps(['menuItem']);

  let componentId = computed(() => (!isEmpty(props.menuItem.children) ? 'sub-menu' : 'menu-item'));
</script>
