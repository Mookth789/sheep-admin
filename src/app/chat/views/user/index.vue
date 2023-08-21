<template>
  <el-container class="panel-block">
    <el-header class="sa-header">
      <div class="sa-title sa-flex sa-row-between">
        <div class="label sa-flex">
          会话管理
          <search-condition
            :conditionLabel="filterParams.conditionLabel"
            @deleteFilter="deleteFilter"
          ></search-condition>
        </div>
        <div class="sa-flex">
          <el-button class="sa-button-refresh" icon="RefreshRight" @click="getData()"></el-button>
          <el-button class="sa-button-refresh" icon="Search" @click="openFilter"></el-button>
        </div>
      </div>
    </el-header>
    <el-main class="sa-p-0">
      <el-table
        class="sa-table"
        height="100%"
        :data="table.data"
        @selection-change="changeSelection"
        @sort-change="fieldFilter"
        @row-dblclick="checkRow"
        stripe
      >
        <template #empty>
          <sa-empty />
        </template>
        <el-table-column type="selection" width="48" align="center"></el-table-column>
        <el-table-column sortable="custom" prop="id" label="ID" min-width="100"> </el-table-column>
        <el-table-column label="用户信息" min-width="160">
          <template #default="scope">
            <div class="sa-flex sa-col-center">
              <el-avatar class="sa-m-r-12" :size="32" :src="checkUrl(scope.row.avatar)">
                <img src="/static/images/chat/head.png" />
              </el-avatar>
              <div>
                <div class="sa-table-line-1">
                  {{ scope.row.nickname || '-' }}
                </div>
                <div class="user-auth">
                  {{ scope.row.auth_id ? '用户' : '游客' }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" min-width="100">
          <template #default="scope">
            <div class="sa-table-line-1">
              {{ scope.row.user?.mobile || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最后会话客服" min-width="160">
          <template #default="scope">
            <div class="sa-flex sa-col-center">
              <el-avatar
                class="sa-m-r-12"
                :size="32"
                :src="checkUrl(scope.row.customer_service?.avatar)"
              >
                <img src="/static/images/chat/head.png" />
              </el-avatar>
              <div>
                <div class="sa-table-line-1">
                  {{ scope.row.customer_service?.name || '-' }}
                </div>
                <div class="user-auth">
                  {{ scope.row.customer_service?.room_name }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最后会话时间" min-width="172">
          <template #default="scope">
            {{ scope.row.last_time || '-' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button
              v-auth="'chat.admin.record.list'"
              class="is-link"
              type="primary"
              @click="checkRow(scope.row)"
              >查看</el-button
            >
            <el-popconfirm
              width="fit-content"
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="此操作会删除当前会话所有聊天记录，是否确定？"
              @confirm="deleteApi(scope.row.id)"
            >
              <template #reference>
                <el-button v-auth="'chat.admin.user.delete'" class="is-link" type="danger">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <sa-view-bar>
      <template #left>
        <sa-batch-handle
          :batchHandleTools="batchHandleTools"
          :selectedLeng="table.selected.length"
          @batchHandle="batchHandle"
        ></sa-batch-handle>
      </template>
      <template #right>
        <sa-pagination :pageData="pageData" @updateFn="getData" />
      </template>
    </sa-view-bar>
  </el-container>
</template>
<script>
  export default {
    name: 'chat.admin.user',
  };
</script>
<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import chat from '@/app/chat/api';

  import { ElMessageBox } from 'element-plus';
  import { useModal, useSearch, usePagination } from '@/sheep/hooks';
  import { checkUrl } from '@/sheep/utils/checkUrlSuffix';
  import UserDetail from './detail.vue';
  import { composeFilter } from '@/sheep/utils';
  import { cloneDeep } from 'lodash';

  const filterParams = reactive({
    tools: {
      user: {
        type: 'tinputprepend',
        placeholder: '请输入查询内容',
        field: 'user',
        user: {
          field: 'id',
          value: '',
        },
        options: [
          {
            label: 'ID',
            value: 'id',
          },
          {
            label: '昵称',
            value: 'nickname',
          },
          {
            label: '手机号',
            value: 'user.mobile',
          },
        ],
      },
    },
    data: {
      user: { field: 'id', value: '' },
    },
    conditionLabel: {},
  });
  const { openFilter, deleteFilter } = useSearch({
    filterParams,
    getData,
  });

  const { pageData } = usePagination();

  // 表格状态
  const table = reactive({
    data: [],
    page: 1,
    list_rows: 10,
    total: 0,
    order: '',
    sort: '',
    selected: [],
  });
  const loading = ref(true);

  // 获取数据
  async function getData(page) {
    loading.value = true;
    if (page) pageData.page = page;
    let tempSearch = cloneDeep(filterParams.data);
    let search = composeFilter(tempSearch, {
      nickname: 'like',
      'user.mobile': 'like',
    });
    const { error, data } = await chat.admin.user.list({
      page: pageData.page,
      list_rows: pageData.list_rows,
      ...search,
      order: table.order,
      sort: table.sort,
    });
    if (error === 0) {
      table.data = data.data;
      pageData.page = data.current_page;
      pageData.list_rows = data.per_page;
      pageData.total = data.total;
    }
    loading.value = false;
  }

  function checkRow(row) {
    useModal(
      UserDetail,
      {
        title: '查看记录',
        type: 'detail',
        id: row.id,
        nickname: row.nickname,
      },
      {
        confirm: () => {
          getData();
        },
      },
    );
  }

  // 单删 + 批量删除
  const deleteApi = async (id) => {
    await chat.admin.user.delete(id);
    getData();
  };

  // 批量操作
  // 批量操作
  const batchHandleTools = [
    {
      type: 'delete',
      label: '删除',
      auth: 'chat.admin.user.delete',
      class: 'danger',
    },
  ];
  async function batchHandle(type) {
    let ids = [];
    table.selected.forEach((row) => {
      ids.push(row.id);
    });
    switch (type) {
      case 'delete':
        ElMessageBox.confirm('此操作会删除当前会话所有聊天记录，是否确定？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          deleteApi(ids.join(','));
        });
        break;
      default:
        await chat.admin.user.edit(ids.join(','), {
          status: type,
        });
        getData();
    }
  }
  // table 字段排序
  function fieldFilter({ prop, order }) {
    table.order = order == 'ascending' ? 'asc' : 'desc';
    table.sort = prop;
    getData();
  }
  // table 批量选择
  function changeSelection(row) {
    table.selected = row;
  }
  onMounted(() => {
    getData();
  });
</script>
<style lang="scss" scoped>
  .user-auth {
    color: var(--sa-subfont);
  }
</style>
