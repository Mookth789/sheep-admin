<template>
  <el-container class="panel-block">
    <el-header class="sa-header">
      <div class="sa-title sa-flex sa-row-between">
        <span class="label sa-flex">
          <span class="left">角色列表</span>
        </span>
        <div>
          <el-button class="sa-button-refresh" icon="RefreshRight" @click="getData"></el-button>
          <el-button v-auth="'admin.auth.role.add'" icon="Plus" type="primary" @click="addRow">
            新建
          </el-button>
        </div>
      </div>
    </el-header>
    <el-main class="sa-tree-table sa-p-0" v-loading="loading">
      <div v-if="tree.data.length > 0" class="sa-tree-table-wrap">
        <div class="sa-tree-table-header sa-flex">
          <div class="sa-flex sa-row-between sa-flex-1">
            <template v-for="tc in treeColumn" :key="tc">
              <span class="item" :style="{ 'min-width': tc.width, width: tc.width }">
                {{ tc.label }}
              </span>
            </template>
          </div>
        </div>
        <div class="sa-tree-table-content sa-flex">
          <el-tree
            :data="tree.data"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :props="{ class: customNodeClass }"
            :indent="0"
            empty-text="无数据，请去添加吧"
          >
            <template #default="{ node, data }">
              <div class="sa-flex custom-tree-node">
                <template v-for="tc in treeColumn" :key="tc">
                  <template v-if="tc.type != 'oper'" class="sa-flex">
                    <!-- expanded -->
                    <span
                      v-if="tc.type == 'expanded'"
                      class="item sa-line-1"
                      :style="{
                        'padding-left': 10 + 20 * (node.level - 1) + 'px',
                        'min-width': tc.width,
                      }"
                    >
                      <span class="tree-arrow">
                        <el-icon
                          v-if="data.children?.length > 0"
                          @click="() => isexpanded(node)"
                          :class="node.expanded ? 'arrow-open' : 'arrow-close'"
                        >
                          <ArrowRight />
                        </el-icon>
                      </span>
                      {{ data[tc.field] }}
                    </span>
                    <!-- 状态 -->
                    <span
                      v-else-if="tc.type == 'status'"
                      class="item"
                      :style="{ 'min-width': tc.width, width: tc.width }"
                    >
                      <el-tag :type="data.status == 'normal' ? 'success' : 'info'">
                        {{ data.status_text }}
                      </el-tag>
                    </span>
                    <!-- text形式的数据 -->
                    <span
                      v-else
                      class="item item-text sa-line-1"
                      :style="{ 'min-width': tc.width, width: tc.width }"
                    >
                      {{ data[tc.field] || '-' }}
                    </span>
                  </template>
                  <span
                    v-else
                    class="item"
                    :style="{
                      'min-width': tc.width,
                      width: tc.width,
                    }"
                  >
                    <template v-if="account.role_id != data.id">
                      <el-button
                        v-auth="'admin.auth.role.detail'"
                        class="is-link"
                        type="primary"
                        @click="editRow(data)"
                        >编辑</el-button
                      >
                      <el-popconfirm
                        width="fit-content"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        title="确认删除这条记录?"
                        @confirm="deleteRow(data)"
                      >
                        <template #reference>
                          <el-button
                            v-auth="'admin.auth.role.delete'"
                            class="is-link"
                            type="danger"
                          >
                            删除
                          </el-button>
                        </template>
                      </el-popconfirm>
                    </template>
                  </span>
                </template>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
      <sa-empty v-if="tree.data.length == 0 && !loading"></sa-empty>
    </el-main>
  </el-container>
</template>

<script setup>
  import { onMounted, reactive, ref, computed } from 'vue';
  import admin from '@/app/admin/api';
  import { useModal } from '@/sheep/hooks';
  import sheep from '@/sheep';
  import RoleEdit from './edit.vue';

  const accountStore = sheep.$store('account');
  const account = computed(() => accountStore.info);

  const treeColumn = [
    { label: 'ID', field: 'id', width: '100px' },
    { type: 'expanded', label: '角色名称', field: 'name', width: '300px' },
    { label: '标识', field: 'code', width: '100px' },
    {
      label: '描述',
      field: 'description',
      width: '100px',
    },
    {
      type: 'status',
      label: '状态',
      field: 'status',
      width: '80px',
    },
    {
      label: '创建时间',
      field: 'create_time',
      width: '172px',
    },
    {
      label: '更新时间',
      field: 'update_time',
      width: '172px',
    },
    {
      type: 'oper',
      label: '操作',
      width: '120px',
    },
  ];

  const tree = reactive({
    data: [],
  });
  const loading = ref(null);
  async function getData() {
    loading.value = true;
    const { error, data } = await admin.auth.role.list();
    error === 0 && (tree.data = data);
    loading.value = false;
  }

  // 折叠展开子集
  function isexpanded(data) {
    data.expanded = !data.expanded;
  }

  function customNodeClass(data, node) {
    let cls = null;
    // 斑马线
    if (node.id % 2 == 0) {
      cls = 'is-striped';
    }
    return cls;
  }

  // dialog 添加 编辑 删除
  function addRow() {
    useModal(
      RoleEdit,
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
      RoleEdit,
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
  async function deleteRow(row) {
    await admin.auth.role.delete(row.id);
    getData();
  }

  onMounted(() => {
    getData();
  });
</script>
