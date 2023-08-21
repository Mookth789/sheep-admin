<template>
  <sa-access type="list" :role_id="roleId"> </sa-access>
</template>
<script>
  export default {
    name: 'admin.auth.access',
  };
</script>
<script setup>
  import { computed } from 'vue';
  import SaAccess from './components/sa-access.vue';
  import $store from '@/sheep/store';

  const roleId = computed(() => $store('account').info.role_id);
</script>
