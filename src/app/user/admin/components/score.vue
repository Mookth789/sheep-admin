<template>
  <el-table class="sa-table" :data="log.data" height="520" v-loading="log.loading">
    <el-table-column prop="create_time" label="交易时间" min-width="172" align="center" />
    <el-table-column prop="amount" label="变动积分" min-width="120" align="center" />
    <el-table-column prop="before" label="变更前" min-width="120" align="center" />
    <el-table-column prop="after" label="剩余积分" min-width="120" align="center" />
    <el-table-column label="操作人" min-width="160">
      <template #default="scope">
        <sa-user-profile type="oper" :user="scope.row.oper" :id="scope.row.oper_id" />
      </template>
    </el-table-column>
    <el-table-column label="备注" min-width="160" align="center">
      <template #default="scope">
        {{ scope.row.event_text }}{{ scope.row.memo ? ':' + scope.row.memo : '' }}
      </template>
    </el-table-column>
  </el-table>
  <sa-view-bar>
    <template #right>
      <sa-pagination :pageData="pageData" @updateFn="getData" />
    </template>
  </sa-view-bar>
</template>

<script setup>
  import { onMounted, reactive, watch } from 'vue';
  import userApi from '@/app/user/api';
  import { usePagination } from '@/sheep/hooks';

  const emit = defineEmits(['updateRefresh']);
  const props = defineProps(['id', 'refresh']);

  const log = reactive({
    data: [],
    loading: false,
  });

  const { pageData } = usePagination();

  async function getData() {
    log.loading = true;
    const { error, data } = await userApi.walletLog.score(props.id, {
      page: pageData.page,
      list_rows: pageData.list_rows,
    });
    if (error === 0) {
      log.data = data.data;
      pageData.page = data.current_page;
      pageData.list_rows = data.per_page;
      pageData.total = data.total;
    }
    log.loading = false;
    emit('updateRefresh', false);
  }

  function onChangeLogTabName() {
    pageData.page = 1;
    pageData.list_rows = 10;
    pageData.total = 0;
    getData();
  }

  watch(
    () => props.refresh,
    () => {
      if (props.refresh) {
        onChangeLogTabName();
      }
    },
  );

  onMounted(() => {
    onChangeLogTabName();
  });
</script>
