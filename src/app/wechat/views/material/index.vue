<template>
  <el-container class="material-view panel-block">
    <el-header class="sa-header">
      <el-alert class="sa-alert sa-m-t-16">
        <template #title>
          素材管理中图文消息、图片、视频、音频，需要您在公众号平台进行上传。
          <a href="https://mp.weixin.qq.com" target="_blank">微信公众号管理</a>
        </template>
      </el-alert>
      <el-tabs class="sa-tabs" v-model="tabModel" @tab-change="onChangeTab">
        <el-tab-pane label="图文消息" name="news"> </el-tab-pane>
        <el-tab-pane label="图片" name="image"> </el-tab-pane>
        <el-tab-pane label="视频" name="video"> </el-tab-pane>
        <el-tab-pane label="语音" name="voice"> </el-tab-pane>
        <el-tab-pane label="文本" name="text"> </el-tab-pane>
        <el-tab-pane label="链接" name="link"> </el-tab-pane>
      </el-tabs>
      <div v-if="tabModel == 'text' || tabModel == 'link'" class="sa-title sa-flex sa-row-right">
        <div>
          <el-button class="sa-button-refresh" icon="RefreshRight" @click="getData()"></el-button>
          <el-button v-auth="'wechat.admin.material.add'" icon="Plus" type="primary" @click="onAdd"
            >新建文本</el-button
          >
        </div>
      </div>
    </el-header>
    <el-main
      class="sa-p-l-0 sa-p-r-0"
      :class="tabModel == 'text' || tabModel == 'link' ? 'sa-p-t-2' : ''"
      v-loading="state.loading"
    >
      <el-row v-if="state.materialData.length > 0" :gutter="16">
        <el-col v-for="k in state.materialData" :key="k" :xs="12" :sm="8" :md="6" :lg="4" :xl="4">
          <div :class="`${tabModel}-content`">
            <template v-if="tabModel == 'news'">
              <div class="item">
                <a
                  v-for="(it, index) in k.content.news_item"
                  :key="it"
                  :class="index == 0 ? 'frist-news' : 'other-news'"
                  :href="it.url"
                  target="_blank"
                >
                  <div class="sa-flex sa-row-between sa-line-1">
                    <div class="title sa-line-1">{{ it.title }}</div>
                    <sa-image :url="it.thumb_url" fit="cover"></sa-image>
                  </div>
                </a>
              </div>
            </template>
            <template v-if="tabModel == 'image'">
              <div class="item">
                <sa-image :url="k.url" fit="cover"></sa-image>
                <div class="name sa-line-1">{{ k.name }}</div>
              </div>
            </template>
            <template v-if="tabModel == 'video'">
              <div class="item sa-flex">
                <div class="video-image">
                  <sa-image :url="k.cover_url"></sa-image>
                  <div class="video-mask sa-flex sa-row-center">
                    <sa-svg name="sa-play" size="20"></sa-svg>
                  </div>
                </div>
                <div class="sa-m-l-12 sa-line-1">
                  <div class="name sa-line-1">{{ k.name }}</div>
                  <div class="description sa-line-1">
                    {{ k.description }}
                  </div>
                </div>
              </div>
            </template>
            <template v-if="tabModel == 'voice'">
              <div class="item sa-flex">
                <div class="voice-svg sa-flex sa-row-center">
                  <sa-svg name="sa-play" size="20"></sa-svg>
                </div>
                <div class="sa-m-l-12 sa-line-1">
                  <div class="name sa-line-1">{{ k.name }}</div>
                  <div class="description">{{ k.description }}</div>
                </div>
              </div>
            </template>
            <template v-if="tabModel == 'text'">
              <div class="item">
                <div class="item-content sa-line-2" v-html="k.content"></div>
                <div class="sa-flex sa-row-right sa-m-b-10">
                  <el-button
                    v-auth="'wechat.admin.material.detail'"
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
                      <el-button
                        v-auth="'wechat.admin.material.delete'"
                        class="is-link"
                        type="danger"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </template>
            <template v-if="tabModel == 'link'">
              <div class="item">
                <div v-if="k.content" class="sa-flex">
                  <sa-image :url="k.content.image" size="40"></sa-image>
                  <div class="sa-m-l-12 sa-line-1">
                    <div class="title sa-line-1">{{ k.content.title }}</div>
                    <div class="description sa-line-1">
                      {{ k.content.description }}
                    </div>
                  </div>
                </div>
                <div class="sa-flex sa-row-right sa-m-b-10">
                  <el-button
                    v-auth="'wechat.admin.material.detail'"
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
                      <el-button
                        v-auth="'wechat.admin.material.delete'"
                        class="is-link"
                        type="danger"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </template>
          </div>
        </el-col>
      </el-row>
      <sa-empty v-if="state.materialData.length == 0" />
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
    name: 'wechat.admin.material',
  };
</script>

<script setup>
  import { reactive, ref, onMounted } from 'vue';
  import wechat from '@/app/wechat/api';
  import { useModal } from '@/sheep/hooks';
  import { usePagination } from '@/sheep/hooks';
  import MaterialEdit from './edit.vue';

  let tabModel = ref('news');
  function onChangeTab() {
    state.materialData = [];
    pageData.page = 1;
    getData();
  }

  const state = reactive({
    loading: false,
    materialData: [],
  });

  const { pageData } = usePagination();

  async function getData() {
    state.loading = true;
    const { error, data } = await wechat.admin.material.list({
      type: tabModel.value,
      page: pageData.page,
      list_rows: pageData.list_rows,
    });
    if (error === 0) {
      state.materialData = data.data;
      pageData.page = data.current_page;
      pageData.list_rows = data.per_page;
      pageData.total = data.total;
    }

    state.loading = false;
  }

  function onAdd() {
    useModal(
      MaterialEdit,
      {
        title: '新建',
        type: 'add',
        materialType: tabModel.value,
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
      MaterialEdit,
      {
        title: '编辑',
        type: 'edit',
        id: row.id,
        materialType: tabModel.value,
      },
      {
        confirm: () => {
          getData();
        },
      },
    );
  }
  async function onDelete(ids) {
    await wechat.admin.material.delete(ids);
    getData();
  }

  onMounted(() => {
    getData();
  });
</script>
<style lang="scss" scoped>
  .material-view {
    .el-main {
      overflow-x: hidden;
    }
    .sa-image {
      color: var(--sa-subtitle) !important;
    }
    .sa-alert {
      a:link {
        color: inherit;
        text-decoration: underline;
      }
      a:visited {
        color: inherit;
        text-decoration: underline;
      }
    }
    .item {
      padding: 12px 14px !important;
      line-height: 1;
      margin-bottom: 24px;
      box-shadow: 0 1px 6px rgba(89, 89, 89, 0.12);
      border-radius: 8px;
      border: 1px solid var(--sa-space);
      &:hover {
        box-shadow: 0 3px 12px rgba(89, 89, 89, 0.2);
        transform: translateY(-4px);
      }
    }
    .news-content {
      .item {
        padding: 0 !important;
        min-height: 144px;
        .frist-news {
          & > div {
            position: relative;
          }
          .sa-image {
            width: 100%;
            height: 144px;
          }
          .title {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 32px;
            line-height: 32px;
            padding: 0 12px;
            background: rgba(38, 38, 38, 0.5);
            backdrop-filter: blur(1px);
            font-size: 12px;
            color: #fff;
            z-index: 1;
          }
        }
        .other-news {
          height: 40px;
          padding: 0 12px !important;
          display: flex;
          align-items: center;
          > div {
            width: 100%;
          }
          .title {
            flex: 1;
            font-size: 12px;
            color: var(--sa-subtitle);
          }
          .sa-image {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
          }
        }
      }
    }
    .image-content {
      .item {
        padding: 0 !important;
      }
      .sa-image {
        width: 100%;
        height: 144px;
        border-radius: 0;
        border: 1px solid var(--sa-space);
      }
      .name {
        padding: 10px 12px;
        font-size: 12px;
        color: var(--sa-title);
      }
    }
    .video-content,
    .voice-content {
      .sa-image {
        width: 64px;
        height: 48px;
        border-radius: 0;
      }
      .name,
      .description {
        line-height: 16px;
        font-size: 14px;
        color: var(--sa-title);
      }
      .description {
        font-size: 12px;
        color: var(--sa-font);
        margin-top: 12px;
      }
    }
    .video-content {
      .video-image {
        position: relative;
        .video-mask {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(38, 38, 38, 0.5);
          color: var(--sa-background-assist);
          backdrop-filter: blur(1px);
          border-radius: 2px;
        }
      }
    }
    .voice-content {
      .item {
        background: var(--sa-background-assist);
        .voice-svg {
          width: 64px;
          height: 48px;
          flex-shrink: 0;
          color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          backdrop-filter: blur(2px);
          border-radius: 2px;
        }
      }
    }
    .text-content {
      .item {
        padding: 12px 14px 0 !important;
      }
      .item-content {
        font-size: 12px;
        color: var(--sa-title);
        line-height: 20px;
        height: 40px;
        word-break: break-all;
      }
    }
    .link-content {
      .item {
        padding: 12px 14px 0 !important;
      }
      .sa-image {
        width: 100%;
        flex-shrink: 0;
      }
      .title,
      .description {
        line-height: 16px;
        font-size: 14px;
        color: var(--sa-title);
      }
      .description {
        font-size: 12px;
        color: var(--sa-font);
        margin-top: 4px;
      }
    }
  }
</style>
