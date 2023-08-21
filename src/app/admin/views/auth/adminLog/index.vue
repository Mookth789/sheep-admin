<template>
  <el-container class="adminlog-view panel-block">
    <el-header class="sa-header">
      <div class="sa-title sa-flex sa-row-between">
        <div class="label sa-flex">
          <span class="left">操作纪录</span>
          <search-condition
            :conditionLabel="filterParams.conditionLabel"
            @deleteFilter="deleteFilter"
          ></search-condition>
        </div>
        <div>
          <el-button class="sa-button-refresh" icon="RefreshRight" @click="getData()"></el-button>
          <el-button class="sa-button-refresh" icon="Search" @click="openFilter"></el-button>
        </div>
      </div>
    </el-header>
    <el-main class="sa-p-0" v-loading="loading">
      <el-table class="sa-table" height="100%" :data="table.data" @row-dblclick="detailRow" stripe>
        <template #empty>
          <sa-empty />
        </template>
        <el-table-column prop="id" label="ID" min-width="100"> </el-table-column>
        <el-table-column label="访问地址" min-width="160">
          <template #default="scope">
            <span class="sa-table-line-1">
              {{ scope.row.url || '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="260">
          <template #default="scope">
            <div class="sa-table-line-1">{{ scope.row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column label="请求参数" min-width="260">
          <template #default="scope">
            <div class="sa-flex">
              <el-input v-model="scope.row.params" disabled>
                <template #append>
                  <span class="cursor-pointer" @click="useClip(scope.row.params)">复制</span>
                </template>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="IP" min-width="140">
          <template #default="scope">
            <div class="table-ip">
              {{ scope.row.ip || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="管理员" min-width="160">
          <template #default="scope">
            <sa-user-profile :user="scope.row.admin" :id="scope.row.admin_id" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="172">
          <template #default="scope">
            {{ scope.row.create_time || '-' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button class="is-link" type="primary" @click="detailRow(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <sa-view-bar>
      <template #right>
        <sa-pagination :pageData="pageData" @updateFn="getData" />
      </template>
    </sa-view-bar>
  </el-container>
</template>

<script>
  export default {
    name: 'admin.auth.adminlog',
  };
</script>

<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import admin from '@/app/admin/api';
  import { useModal, useSearch, usePagination } from '@/sheep/hooks';
  import useClip from '@/sheep/utils/clipboard.js';
  import AdminLogDetail from './detail.vue';
  import { composeFilter } from '@/sheep/utils';
  import { cloneDeep } from 'lodash';

  const filterParams = reactive({
    tools: {
      keyword: {
        type: 'tinputprepend',
        placeholder: '请输入查询内容',
        field: 'keyword',
        keyword: {
          field: 'id',
          value: '',
        },
        options: [
          {
            label: 'ID',
            value: 'id',
          },
          {
            label: '访问地址',
            value: 'url',
          },
          {
            label: '描述',
            value: 'description',
          },
        ],
      },
      admin: {
        type: 'tinputprepend',
        placeholder: '请输入查询内容',
        field: 'admin',
        admin: {
          field: 'admin_id',
          value: '',
        },
        options: [
          {
            label: '管理员ID',
            value: 'admin_id',
          },
          {
            label: '账号',
            value: 'admin.account',
          },
          {
            label: '昵称',
            value: 'admin.nickname',
          },
          {
            label: '手机号',
            value: 'admin.mobile',
          },
        ],
      },
      create_time: {
        type: 'tdatetimerange',
        label: '更新时间',
        field: 'create_time',
        value: [],
      },
    },
    data: {
      keyword: { field: 'id', value: '' },
      admin: { field: 'admin_id', value: '' },
      create_time: [],
    },
    conditionLabel: {},
  });
  const { openFilter, deleteFilter } = useSearch({
    filterParams,
    getData,
  });

  const { pageData } = usePagination();

  // 列表
  const table = reactive({
    data: [],
    order: '',
    sort: '',
  });
  const loading = ref(true);
  // 获取
  async function getData(page) {
    loading.value = true;
    if (page) pageData.page = page;
    let tempSearch = cloneDeep(filterParams.data);
    let search = composeFilter(tempSearch, {
      url: 'like',
      description: 'like',
      'admin.account': 'like',
      'admin.nickname': 'like',
      'admin.mobile': 'like',
      create_time: 'range',
    });
    const { error, data } = await admin.auth.adminLog.list({
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

  function detailRow(row) {
    useModal(
      AdminLogDetail,
      {
        title: '详情',
        type: 'detail',
        detail: row,
      },
      {
        confirm: () => {
          getData();
        },
      },
    );
  }

  onMounted(() => {
    getData();
  });
</script>
<style lang="scss" scoped>
  .adminlog-view {
    .table-ip {
      color: var(--el-color-primary);
    }
  }
</style>
