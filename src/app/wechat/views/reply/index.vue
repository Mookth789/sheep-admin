<template>
  <el-container class="reply-view panel-block">
    <el-header class="sa-header">
      <el-tabs class="sa-tabs" v-model="tabModel" @tab-change="onChangeTab">
        <el-tab-pane label="关键字回复" name="keywords"></el-tab-pane>
        <el-tab-pane label="关注回复" name="subscribe"></el-tab-pane>
        <el-tab-pane label="默认回复" name="default"></el-tab-pane>
      </el-tabs>
      <div class="sa-title sa-flex sa-row-right">
        <div>
          <el-button class="sa-button-refresh" icon="RefreshRight" @click="getData()"></el-button>
          <el-button v-auth="'wechat.admin.reply.add'" icon="Plus" type="primary" @click="onAdd"
            >新建</el-button
          >
        </div>
      </div>
    </el-header>
    <el-main class="sa-p-t-2" v-loading="state.loading">
      <el-row v-if="state.replyData.length > 0" :gutter="16">
        <el-col v-for="k in state.replyData" :key="k" :xs="12" :sm="8" :md="6" :lg="4" :xl="4">
          <div class="iktem">
            <div class="item-type">{{ k.type_text }}</div>
            <div class="item-content sa-line-2">{{ k.content }}</div>
            <template v-if="tabModel == 'keywords'">
              <div class="item-keywords sa-flex">
                <el-tag v-for="key in k.keywords" :key="key">
                  {{ key }}
                </el-tag>
              </div>
            </template>
            <div class="sa-flex sa-row-between">
              <div>
                <el-button v-auth="'wechat.admin.reply.edit'" link>
                  <el-tooltip effect="dark" :content="k.status_text" placement="top-start">
                    <el-switch
                      v-model="k.status"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value="enable"
                      inactive-value="disabled"
                      @change="onChangeStatus(k)"
                    />
                  </el-tooltip>
                </el-button>
              </div>
              <div class="sa-flex oper-wrap">
                <el-button
                  v-auth="'wechat.admin.reply.detail'"
                  class="is-link"
                  type="primary"
                  @click="onEdit(k)"
                  >编辑</el-button
                >
                <el-popconfirm
                  width="fit-content"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  title="确认删除这条记录?"
                  @confirm="onDelete(k.id)"
                >
                  <template #reference>
                    <el-button v-auth="'wechat.admin.reply.delete'" class="is-link" type="danger">
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <sa-empty v-if="state.replyData.length == 0" />
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: 'wechat.admin.reply',
  };
</script>

<script setup>
  import { reactive, ref, onMounted } from 'vue';
  import wechat from '@/app/wechat/api';
  import { useModal } from '@/sheep/hooks';
  import ReplyEdit from './edit.vue';

  // 切换选项卡
  let tabModel = ref('keywords');
  function onChangeTab() {
    state.replyData = [];
    getData();
  }

  const state = reactive({
    loading: false,
    replyData: [],
  });
  async function getData() {
    state.loading = true;
    const { error, data } = await wechat.admin.reply.list({ group: tabModel.value });
    error === 0 && (state.replyData = data);
    state.loading = false;
  }

  async function onChangeStatus(row) {
    await wechat.admin.reply.edit(row.id, { status: row.status });
    getData();
  }
  function onAdd(row) {
    useModal(
      ReplyEdit,
      {
        title: '新建',
        type: 'add',
        id: row.id,
        group: tabModel.value,
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
      ReplyEdit,
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
  async function onDelete(ids) {
    await wechat.admin.reply.delete(ids);
    getData();
  }

  onMounted(() => {
    getData();
  });
</script>
<style lang="scss" scoped>
  .reply-view {
    .el-main {
      --el-main-padding: 20px 0;
      overflow-x: hidden;
    }
    .iktem {
      padding: 12px 14px 0 !important;
      line-height: 1;
      margin-bottom: 24px;
      box-shadow: 0 1px 6px rgba(89, 89, 89, 0.12);
      border-radius: 8px;
      border: 1px solid var(--sa-space);
      &:hover {
        box-shadow: 0 3px 12px rgba(89, 89, 89, 0.2);
        transform: translateY(-4px);
      }
      .item-type {
        font-size: 12px;
        color: var(--sa-subfont);
        margin-bottom: 12px;
      }
      .item-content {
        font-size: 12px;
        color: var(--sa-subfont);
        margin-bottom: 12px;
        line-height: 20px;
        height: 40px;
        word-break: break-all;
      }
      .item-keywords {
        font-size: 14px;
        color: var(--sa-subtitle);
        overflow: auto;
        margin-bottom: 10px;
        height: 24px;
        &::-webkit-scrollbar {
          display: none;
        }
        .el-tag {
          margin-right: 4px;
          border-radius: 12px;
          line-height: 24px;
          border: none;
        }
      }
      .oper-wrap {
        height: 32px;
      }
    }
  }
</style>
