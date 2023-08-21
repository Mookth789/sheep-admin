<template>
  <el-container class="panel-block">
    <el-header class="sa-header">
      <div class="sa-title sa-flex sa-row-between">
        <div class="label sa-flex">
          <span class="left">管理员列表</span>
          <search-condition
            :conditionLabel="filterParams.conditionLabel"
            @deleteFilter="deleteFilter"
          ></search-condition>
        </div>
        <div>
          <el-button class="sa-button-refresh" icon="RefreshRight" @click="getData()"></el-button>
          <el-button class="sa-button-refresh" icon="Search" @click="openFilter"></el-button>
          <el-button v-auth="'admin.auth.admin.add'" icon="Plus" type="primary" @click="addRow"
            >新建</el-button
          >
        </div>
      </div>
    </el-header>
    <el-main class="sa-p-0" v-loading="loading">
      <el-table
        class="sa-table"
        height="100%"
        :data="table.data"
        @selection-change="changeSelection"
        @sort-change="fieldFilter"
        @row-dblclick="editRow"
        stripe
      >
        <template #empty>
          <sa-empty />
        </template>
        <el-table-column
          :selectable="checkSelect"
          type="selection"
          width="48"
          align="center"
        ></el-table-column>
        <el-table-column sortable="custom" prop="id" label="ID" min-width="100"> </el-table-column>
        <el-table-column prop="account" label="账号" min-width="100">
          <template #default="scope">
            <div class="sa-table-line-1">
              {{ scope.row.account || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="头像" min-width="60">
          <template #default="scope">
            <sa-preview :url="scope.row.avatar" :size="32"></sa-preview>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="160">
          <template #default="scope">
            <div class="sa-table-line-1">
              {{ scope.row.nickname || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="roles" label="角色组" min-width="160">
          <template #default="scope">
            {{ scope.row.role?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" min-width="110">
          <template #default="scope">
            <div class="sa-table-line-1">
              {{ scope.row.mobile || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180">
          <template #default="scope">
            <div class="sa-table-line-1">
              {{ scope.row.email || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="login_time" label="上次登录" min-width="160">
          <template #default="scope">
            <div class="login-time" v-if="scope.row.login_time">
              {{ scope.row.login_time }}
            </div>
            <span v-if="!scope.row.login_time">-</span>
            <el-tag v-if="scope.row.login_ip" type="info">
              {{ scope.row.login_ip }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="70">
          <template #default="scope">
            <el-tag :type="scope.row.status == 'normal' ? 'success' : 'info'">
              {{ scope.row.status_text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <template v-if="account.id != scope.row.id">
              <el-button
                v-auth="'admin.auth.admin.detail'"
                class="is-link"
                type="primary"
                @click="editRow(scope.row)"
                >编辑</el-button
              >
              <el-popconfirm
                width="fit-content"
                confirm-button-text="确认"
                cancel-button-text="取消"
                title="确认删除这条记录?"
                @confirm="deleteApi(scope.row.id)"
              >
                <template #reference>
                  <el-button v-auth="'admin.auth.admin.delete'" class="is-link" type="danger">
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
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
    name: 'admin.auth.admin',
  };
</script>
<script setup>
  import { onMounted, reactive, ref, unref, computed } from 'vue';
  import admin from '@/app/admin/api';
  import { ElMessageBox } from 'element-plus';
  import { useModal, useSearch, usePagination } from '@/sheep/hooks';
  import sheep from '@/sheep';
  import AdminEdit from './edit.vue';
  import { composeFilter } from '@/sheep/utils';
  import { cloneDeep } from 'lodash';

  const accountStore = sheep.$store('account');
  const account = computed(() => accountStore.info);

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
            value: 'mobile',
          },
        ],
      },
      role_id: {
        type: 'tcascader',
        label: '角色组',
        field: 'role_id',
        value: '',
        options: {
          data: [],
          props: {
            children: 'children',
            label: 'name',
            value: 'id',
            checkStrictly: true,
            emitPath: false,
          },
        },
      },
      status: {
        type: 'tselect',
        label: '活动类型',
        field: 'status',
        value: '',
        options: {
          data: [
            {
              label: '启用',
              value: 'normal',
            },
            {
              label: '禁用',
              value: 'disabled',
            },
          ],
        },
      },
    },
    data: {
      user: { field: 'id', value: '' },
      role_id: '',
      status: '',
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
      mobile: 'like',
      role_id: {
        spacer: ',',
      },
    });
    const { error, data } = await admin.auth.admin.list({
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

  // 默认管理员自己不可操作
  function checkSelect(row) {
    if (row.role_id == unref(account).role_id) {
      return false;
    }
    return true;
  }

  // open 打开之后操作类型
  function addRow() {
    useModal(
      AdminEdit,
      { title: '新建', type: 'add' },
      {
        confirm: () => {
          getData();
        },
      },
    );
  }
  function editRow(row) {
    useModal(
      AdminEdit,
      {
        title: '编辑',
        type: 'edit',
        id: row.id,
      },
      {
        confirm: () => {
          getData();
        },
      },
    );
  }
  // 删除api 单独批量可以直接调用
  async function deleteApi(id) {
    await admin.auth.admin.delete(id);
    getData();
  }

  const batchHandleTools = [
    {
      type: 'delete',
      label: '删除',
      auth: 'admin.auth.admin.delete',
      class: 'danger',
    },
    {
      type: 'normal',
      label: '启用',
      auth: 'admin.auth.admin.edit',
      class: 'success',
    },
    {
      type: 'disabled',
      label: '禁用',
      auth: 'admin.auth.admin.edit',
      class: 'info',
    },
  ];
  async function batchHandle(type) {
    let ids = [];
    table.selected.forEach((row) => {
      ids.push(row.id);
    });
    switch (type) {
      case 'delete':
        ElMessageBox.confirm('此操作将删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          deleteApi(ids.join(','));
        });
        break;
      default:
        await admin.auth.admin.edit(ids.join(','), {
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

  // 角色组
  const role = reactive({
    select: [],
  });
  async function getRoles() {
    const { data } = await admin.auth.role.select();
    filterParams.tools.role_id.options.data = data;
  }
  onMounted(async () => {
    getRoles();
    await getData();
  });
</script>
<style lang="scss" scoped>
  .login-time {
    font-size: 12px;
    color: var(--sa-font);
  }
</style>
