<template>
  <el-container>
    <el-header class="sa-header">
      <div class="sa-title sa-flex sa-row-between">
        <div class="label sa-flex">
          <span class="left">会员管理</span>
          <search-condition
            :conditionLabel="filterParams.conditionLabel"
            @deleteFilter="deleteFilter"
          ></search-condition>
        </div>
        <div>
          <el-button
            v-auth="'user.admin.user.list'"
            class="sa-button-refresh"
            icon="RefreshRight"
            @click="getData()"
          ></el-button>
          <el-button class="sa-button-refresh" icon="Search" @click="openFilter"></el-button>
        </div>
      </div>
    </el-header>
    <el-main class="sa-p-0" v-loading="table.loading">
      <el-table class="sa-table" height="100%" :data="table.data" stripe @sort-change="fieldFilter">
        <template #empty>
          <sa-empty />
        </template>
        <el-table-column sortable="custom" prop="id" label="ID" min-width="80" />
        <el-table-column label="用户信息" min-width="150">
          <template #default="scope">
            <sa-user-profile :user="scope.row" :id="scope.row.id" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="120" align="center" />
        <el-table-column prop="mobile" label="手机号" min-width="120" align="center" />
        <el-table-column
          sortable="custom"
          prop="commission"
          label="佣金"
          min-width="110"
          align="center"
        />
        <el-table-column
          sortable="custom"
          prop="total_consume"
          label="总消费"
          min-width="110"
          align="center"
        />
        <el-table-column
          sortable="custom"
          prop="score"
          label="积分"
          min-width="110"
          align="center"
        />
        <el-table-column
          sortable="custom"
          prop="money"
          label="余额"
          min-width="110"
          align="center"
        />
        <el-table-column
          sortable="custom"
          prop="create_time"
          label="注册时间"
          min-width="172"
          align="center"
        />
        <el-table-column
          sortable="custom"
          prop="login_time"
          label="上次登录"
          min-width="172"
          align="center"
        />
        <el-table-column label="操作" min-width="120" fixed="right">
          <template #default="scope">
            <el-button
              v-auth="'user.admin.user.detail'"
              class="is-link"
              type="primary"
              @click="onDetail(scope.row.id)"
              >查看</el-button
            >
            <el-popconfirm
              width="fit-content"
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="确认删除这条记录?"
              @confirm="onDelete(scope.row.id)"
            >
              <template #reference>
                <el-button v-auth="'user.admin.user.delete'" class="is-link" type="danger">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
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
    name: 'user.admin',
  };
</script>

<script setup>
  import { onMounted, reactive } from 'vue';
  import userApi from '@/app/user/api';
  import { usePagination, useSearch, useModal } from '@/sheep/hooks';
  import { composeFilter } from '@/sheep/utils';
  import UserDetail from './detail.vue';
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
            label: '用户ID',
            value: 'id',
          },
          {
            label: '用户名',
            value: 'username',
          },
          {
            label: '昵称',
            value: 'nickname',
          },
          {
            label: '手机号',
            value: 'mobile',
          },
          {
            label: '邮箱',
            value: 'email',
          },
        ],
      },
      create_time: {
        type: 'tdatetimerange',
        label: '注册时间',
        field: 'create_time',
        value: [],
      },
      login_time: {
        type: 'tdatetimerange',
        label: '上次登录',
        field: 'login_time',
        value: [],
      },
    },
    data: {
      user: { field: 'id', value: '' },
      create_time: [],
      login_time: [],
    },
    conditionLabel: {},
  });
  const { openFilter, deleteFilter } = useSearch({ filterParams, getData });

  const table = reactive({
    loading: false,
    data: [],
    order: '',
    sort: '',
  });

  const { pageData } = usePagination();

  async function getData(page) {
    table.loading = true;
    if (page) pageData.page = page;
    let tempSearch = cloneDeep(filterParams.data);
    let search = composeFilter(tempSearch, {
      username: 'like',
      nickname: 'like',
      mobile: 'like',
      email: 'like',
      create_time: 'range',
      login_time: 'range',
    });
    const { error, data } = await userApi.list({
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
    table.loading = false;
  }

  function fieldFilter({ prop, order }) {
    table.order = order == 'ascending' ? 'asc' : 'desc';
    table.sort = prop;
    getData();
  }

  function onDetail(id) {
    useModal(UserDetail, {
      title: '会员详情',
      id,
    });
  }

  async function onDelete(id) {
    const { error } = await userApi.delete(id);
    error == 0 && getData();
  }

  onMounted(() => {
    getData();
  });
</script>
