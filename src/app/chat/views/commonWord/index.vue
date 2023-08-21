<template>
  <el-container class="panel-block">
    <el-header class="sa-header">
      <div class="sa-title sa-flex sa-row-between">
        <div class="label sa-flex">
          常用语
          <search-condition
            :conditionLabel="filterParams.conditionLabel"
            @deleteFilter="deleteFilter"
          ></search-condition>
        </div>
        <div class="sa-flex">
          <el-button class="sa-button-refresh" icon="RefreshRight" @click="getData()"></el-button>
          <el-button class="sa-button-refresh" icon="Search" @click="openFilter"></el-button>
          <el-button v-auth="'chat.admin.commonword.add'" icon="Plus" type="primary" @click="addRow"
            >添加常用语</el-button
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
        <el-table-column type="selection" width="48" align="center"></el-table-column>
        <el-table-column sortable="custom" prop="id" label="ID" min-width="100"> </el-table-column>
        <el-table-column label="标题" min-width="100">
          <template #default="scope">
            <div class="sa-table-line-1">
              {{ scope.row.name || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属类别" min-width="100">
          <template #default="scope">
            <div class="sa-table-line-1">
              {{ scope.row.room_name || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="70">
          <template #default="scope">
            <el-tag :type="scope.row.status == 'normal' ? 'success' : 'info'">
              {{ scope.row.status_text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="权重" min-width="88">
          <template #default="scope">
            <div class="sa-table-line-1">{{ scope.row.weigh || 0 }}</div>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" min-width="172">
          <template #default="scope">
            {{ scope.row.update_time || '-' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button
              v-auth="'chat.admin.commonword.detail'"
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
                <el-button v-auth="'chat.admin.commonword.delete'" class="is-link" type="danger">
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
    name: 'chat.admin.commonword',
  };
</script>
<script setup>
  import { onMounted, reactive, ref, unref } from 'vue';
  import chat from '@/app/chat/api';
  import sheep from '@/sheep';
  import { ElMessageBox } from 'element-plus';
  import { useModal, useSearch, usePagination } from '@/sheep/hooks';
  import CommonWordEdit from './edit.vue';
  import { composeFilter } from '@/sheep/utils';
  import { cloneDeep } from 'lodash';

  let tselectOptionsData = [];
  async function getChatCofig() {
    const { error, data } = await chat.chatInit();
    if (error === 0) {
      data.default_rooms.forEach((item) => {
        tselectOptionsData.push({
          label: item.name,
          value: item.value,
        });
      });
    }
  }

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
            label: '标题',
            value: 'name',
          },
        ],
      },
      room_id: {
        type: 'tselect',
        label: '所属类别',
        field: 'room_id',
        value: '',
        options: {
          data: tselectOptionsData,
        },
      },
    },
    data: {
      user: { field: 'id', value: '' },
      room_id: '',
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
      name: 'like',
    });
    const { error, data } = await chat.admin.commonWord.list({
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

  function addRow() {
    useModal(
      CommonWordEdit,
      {
        title: '新建',
        type: 'add',
      },
      {
        confirm: () => {
          getData();
        },
      },
    );
  }
  function editRow(row) {
    useModal(
      CommonWordEdit,
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

  // 单删 + 批量删除
  const deleteApi = async (id) => {
    await chat.admin.commonWord.delete(id);
    getData();
  };

  // 批量操作
  const batchHandleTools = [
    {
      type: 'delete',
      label: '删除',
      auth: 'chat.admin.commonword.delete',
      class: 'danger',
    },
    {
      type: 'normal',
      label: '启用',
      auth: 'chat.admin.commonword.edit',
      class: 'success',
    },
    {
      type: 'hidden',
      label: '隐藏',
      auth: 'chat.admin.commonword.edit',
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
        await chat.admin.commonWord.edit(ids.join(','), {
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

  onMounted(async () => {
    await getChatCofig();
    getData();
  });
</script>
