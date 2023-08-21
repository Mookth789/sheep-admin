<template>
  <el-container class="menu-view panel-block">
    <el-header class="sa-header">
      <div class="sa-title sa-flex sa-row-between">
        <div class="label menu-label sa-m-r-24">当前菜单</div>
        <div class="menu-input sa-flex">
          <div class="menu-tags sa-flex">
            <template v-for="t in state.current" :key="t">
              <el-tag class="sa-m-r-8">{{ t.name }}</el-tag>
            </template>
          </div>
          <el-button v-auth="'wechat.admin.menu.copy'" type="primary" @click="onCopy(0)"
            >复制</el-button
          >
        </div>
      </div>
      <div class="sa-space"></div>
      <div class="sa-title sa-flex sa-row-between">
        <div class="label">菜单管理</div>
        <div>
          <el-button class="sa-button-refresh" icon="RefreshRight" @click="getData()"></el-button>
          <el-button v-auth="'wechat.admin.menu.add'" type="primary" icon="Plus" @click="onAdd"
            >新建菜单
          </el-button>
        </div>
      </div>
    </el-header>
    <el-main class="sa-p-0" v-loading="state.loading">
      <el-table
        class="sa-table"
        height="100%"
        stripe
        :data="state.menuData"
        @sort-change="fieldFilter"
      >
        <template #empty>
          <sa-empty />
        </template>
        <el-table-column sortable="custom" prop="id" label="ID" min-width="104"> </el-table-column>
        <el-table-column label="名称" min-width="160">
          <template #default="scope">
            <div class="sa-table-line-1">
              {{ scope.row.name || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="菜单名称" min-width="260">
          <template #default="scope">
            <div class="sa-flex">
              <template v-for="t in scope.row.rules" :key="t">
                <el-tag class="sa-m-r-8">{{ t.name }}</el-tag>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="update_time" label="更新时间" width="172">
          <template #default="scope">
            {{ scope.row.update_time || '-' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="菜单状态" width="100">
          <template #default="scope">
            <div
              class="sa-dot-wrap"
              :class="scope.row.status == 0 ? 'sa-dot-info' : 'sa-dot-normal'"
            >
              <div class="sa-dot"></div>
              <span>{{ scope.row.status == 0 ? '未发布' : '已发布' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200">
          <template #default="scope">
            <el-button
              v-auth="'wechat.admin.menu.publish'"
              class="is-link"
              type="primary"
              @click="onPublish(scope.row.id)"
              >发布</el-button
            >
            <el-button
              v-auth="'wechat.admin.menu.detail'"
              class="is-link"
              type="primary"
              @click="onEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-auth="'wechat.admin.menu.copy'"
              class="is-link"
              type="primary"
              @click="onCopy(scope.row.id)"
              >复制</el-button
            >
            <el-popconfirm
              width="fit-content"
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="确认删除这条记录?"
              @confirm="onDelete(scope.row.id)"
            >
              <template #reference>
                <el-button v-auth="'wechat.admin.menu.delete'" class="is-link" type="danger">
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
    name: 'wechat.admin.menu',
  };
</script>
<script setup>
  import { onMounted, reactive } from 'vue';
  import wechat from '@/app/wechat/api';
  import { useModal } from '@/sheep/hooks';
  import { usePagination } from '@/sheep/hooks';
  import MenuEdit from './edit.vue';
  // 数据
  const state = reactive({
    loading: false,
    current: [],
    menuData: [],
    order: '',
    sort: '',
  });

  const { pageData } = usePagination();

  async function getData() {
    state.loading = true;
    const { error, data } = await wechat.admin.menu.list({
      page: pageData.page,
      list_rows: pageData.list_rows,
      order: state.order,
      sort: state.sort,
    });
    if (error === 0) {
      state.current = data.current;
      state.menuData = data.list.data;
      pageData.page = data.list.current_page;
      pageData.list_rows = data.list.per_page;
      pageData.total = data.list.total;
    }
    state.loading = false;
  }
  // table 字段排序
  function fieldFilter({ prop, order }) {
    state.order = order == 'ascending' ? 'asc' : 'desc';
    state.sort = prop;
    getData();
  }

  function onAdd() {
    useModal(
      MenuEdit,
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
  function onEdit(row) {
    useModal(
      MenuEdit,
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
  async function onDelete(id) {
    await wechat.admin.menu.delete(id);
    getData();
  }
  async function onCopy(id) {
    await wechat.admin.menu.copy(id);
    getData();
  }
  async function onPublish(id) {
    await wechat.admin.menu.publish(id);
    getData();
  }

  onMounted(() => {
    getData();
  });
</script>
<style lang="scss" scoped>
  .menu-view {
    .menu-label {
      font-size: 14px;
      color: var(--sa-subtitle);
    }
    .menu-input {
      flex: 1;
      height: 32px;
      line-height: 32px;
      border: 1px solid var(--sa-border);
      border-radius: 4px;
      .menu-tags {
        flex: 1;
        padding: 0 0 0 8px;
      }
    }
  }
</style>
