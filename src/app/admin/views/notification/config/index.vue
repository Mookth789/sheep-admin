<template>
  <el-container class="notificationConfig-page panel-block">
    <el-header class="sa-header">
      <el-tabs class="sa-tabs" v-model="configType" @tab-change="getData()">
        <el-tab-pane label="通知用户" name="user"></el-tab-pane>
        <el-tab-pane label="通知管理员" name="admin"></el-tab-pane>
      </el-tabs>
      <div class="sa-title sa-flex sa-row-between">
        <div class="label sa-flex">消息配置</div>
        <el-button class="sa-button-refresh" icon="RefreshRight" @click="getData()"></el-button>
      </div>
      <el-alert class="sa-alert">
        <template #title>
          <div class="sa-m-b-6">
            1、消息通知仅用于向用户发送重要的服务通知，只能用于符合其要求的服务场景如：拼团成功通知、商品发货通知等。不支持广告等营销类消息以及其它所有可能对用户造成骚扰的消息；
          </div>
          <div class="sa-m-b-6">
            2、小程序必须选择：生活服务/百货/超市/便利店 类目；公众号必须选择：互联网/电子商务
            类目；
          </div>
          <div>3、公众号和小程序必须选择上面对应的类目才可以自动获取模板。</div>
        </template>
      </el-alert>
    </el-header>
    <el-main class="sa-p-0 sa-p-t-20">
      <div class="sa-table-wrap" v-loading="loading">
        <template v-if="table.data.length > 0">
          <el-table height="100%" class="sa-table" :data="table.data" row-key="id" stripe>
            <el-table-column label="消息类别" min-width="160" align="center">
              <template #default="scope">
                <span class="sa-table-line-1">
                  {{ scope.row.name || '-' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column min-width="344">
              <template #header>
                <div class="sa-flex sa-row-center">
                  <img
                    src="/static/images/platform/wechat/officialAccount.png"
                    class="header-icon sa-m-r-8"
                  />
                  <div>公众号模版通知</div>
                </div>
              </template>
              <template #default="scope">
                <div class="sa-flex sa-row-center">
                  <div v-if="scope.row.channels">
                    <el-button
                      v-auth="'admin.notification.config.detail'"
                      type="primary"
                      color="#07C160"
                      class="edit-btn"
                      :disabled="!scope.row.channels.includes('WechatOfficialAccount')"
                      @click="editRow(scope.row.event, 'WechatOfficialAccount')"
                      >编辑配置</el-button
                    >
                  </div>
                  <div class="sa-flex" v-if="scope.row.configs">
                    <div class="official-time sa-flex sa-row-center sa-m-r-12">
                      已发送{{ scope.row.configs.WechatOfficialAccount?.send_num || 0 }}次
                    </div>
                    <el-button v-auth="'admin.notification.config.setstatus'" link>
                      <el-switch
                        v-if="scope.row.channels.includes('WechatOfficialAccount')"
                        v-model="scope.row.configs.WechatOfficialAccount.status"
                        active-value="enable"
                        inactive-value="disabled"
                        @change="setStatus($event, scope.row.event, 'WechatOfficialAccount')"
                      />
                      <el-switch v-else model-value="false" disabled />
                      <span
                        class="sa-m-l-8"
                        :class="
                          scope.row.configs.WechatOfficialAccount?.status == 'enable' &&
                          'open-switch'
                        "
                        >{{
                          scope.row.configs.WechatOfficialAccount?.status == 'enable'
                            ? '开启'
                            : '关闭'
                        }}
                      </span>
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="344">
              <template #header>
                <div class="sa-flex sa-row-center">
                  <img
                    src="/static/images/platform/wechat/miniProgram.png"
                    class="header-icon sa-m-r-8"
                  />
                  <div>微信小程序通知</div>
                </div>
              </template>
              <template #default="scope">
                <div class="sa-flex sa-row-center">
                  <div v-if="scope.row.channels">
                    <el-button
                      v-auth="'admin.notification.config.detail'"
                      type="primary"
                      color="#6F74E9"
                      class="edit-btn"
                      :disabled="!scope.row.channels.includes('WechatMiniProgram')"
                      @click="editRow(scope.row.event, 'WechatMiniProgram')"
                      >编辑配置</el-button
                    >
                  </div>
                  <div class="sa-flex" v-if="scope.row.configs">
                    <div class="official-time mini-time sa-flex sa-row-center sa-m-r-12">
                      已发送{{ scope.row.configs.WechatMiniProgram?.send_num || 0 }}次
                    </div>
                    <el-button v-auth="'admin.notification.config.setstatus'" link>
                      <el-switch
                        v-if="scope.row.channels.includes('WechatMiniProgram')"
                        v-model="scope.row.configs.WechatMiniProgram.status"
                        active-value="enable"
                        inactive-value="disabled"
                        @change="setStatus($event, scope.row.event, 'WechatMiniProgram')"
                      />
                      <el-switch v-else model-value="false" disabled />
                      <span
                        class="sa-m-l-8"
                        :class="
                          scope.row.configs.WechatMiniProgram?.status == 'enable' && 'open-switch'
                        "
                        >{{
                          scope.row.configs.WechatMiniProgram?.status == 'enable' ? '开启' : '关闭'
                        }}
                      </span>
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="344">
              <template #header>
                <div class="sa-flex sa-row-center">
                  <img src="/static/images/notification/sms.png" class="header-icon sa-m-r-8" />
                  <div>短信通知</div>
                </div>
              </template>
              <template #default="scope">
                <div class="sa-flex sa-row-center">
                  <div v-if="scope.row.channels">
                    <el-button
                      v-auth="'admin.notification.config.detail'"
                      type="primary"
                      color="#806AF6"
                      class="edit-btn"
                      :disabled="!scope.row.channels.includes('Sms')"
                      @click="editRow(scope.row.event, 'Sms')"
                      >编辑配置</el-button
                    >
                  </div>
                  <div class="sa-flex" v-if="scope.row.configs">
                    <div class="official-time sms-time sa-flex sa-row-center sa-m-r-12">
                      已发送{{ scope.row.configs.Sms?.send_num || 0 }}次
                    </div>
                    <el-button v-auth="'admin.notification.config.setstatus'" link>
                      <el-switch
                        v-if="scope.row.channels.includes('Sms')"
                        v-model="scope.row.configs.Sms.status"
                        active-value="enable"
                        inactive-value="disabled"
                        @change="setStatus($event, scope.row.event, 'Sms')"
                      />
                      <el-switch v-else model-value="false" disabled />
                      <span
                        class="sa-m-l-8"
                        :class="scope.row.configs.Sms?.status == 'enable' && 'open-switch'"
                        >{{ scope.row.configs.Sms?.status == 'enable' ? '开启' : '关闭' }}</span
                      >
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="344">
              <template #header>
                <div class="sa-flex sa-row-center">
                  <img src="/static/images/notification/email.png" class="header-icon sa-m-r-8" />
                  <div>邮件通知</div>
                </div>
              </template>
              <template #default="scope">
                <div class="sa-flex sa-row-center">
                  <div v-if="scope.row.channels">
                    <el-button
                      v-auth="'admin.notification.config.detail'"
                      type="primary"
                      color="#409EFF"
                      class="edit-btn"
                      :disabled="!scope.row.channels.includes('Email')"
                      @click="editRow(scope.row.event, 'Email')"
                      >编辑配置</el-button
                    >
                  </div>
                  <div class="sa-flex" v-if="scope.row.configs">
                    <div class="official-time email-time sa-flex sa-row-center sa-m-r-12">
                      已发送{{ scope.row.configs.Email?.send_num || 0 }}次
                    </div>
                    <el-button v-auth="'admin.notification.config.setstatus'" link>
                      <el-switch
                        v-if="scope.row.channels.includes('Email')"
                        v-model="scope.row.configs.Email.status"
                        active-value="enable"
                        inactive-value="disabled"
                        @change="setStatus($event, scope.row.event, 'Email')"
                      />
                      <el-switch v-else model-value="false" disabled />
                      <span
                        class="sa-m-l-8"
                        :class="scope.row.configs.Email?.status == 'enable' && 'open-switch'"
                        >{{ scope.row.configs.Email?.status == 'enable' ? '开启' : '关闭' }}</span
                      >
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-if="table.data.length == 0 && !loading">
          <sa-empty></sa-empty>
        </template>
      </div>
    </el-main>
  </el-container>
</template>
<script setup>
  import { onMounted, reactive, ref, computed } from 'vue';
  import admin from '@/app/admin/api';
  import { useModal } from '@/sheep/hooks';
  import ConfigEdit from './edit.vue';

  const configType = ref('user');
  const loading = ref(true);
  const table = reactive({
    data: [],
    order: '',
    sort: '',
    selected: [],
  });
  async function getData() {
    loading.value = true;
    let receiver_type = configType.value;
    const { error, data } = await admin.notification.config(receiver_type, null);
    error === 0 && (table.data = data);
    loading.value = false;
  }
  // 状态
  async function setStatus(val, e, type) {
    await admin.notification.setStatus(e, type, { status: val });
    getData();
  }
  function editRow(e, channel) {
    useModal(
      ConfigEdit,
      {
        title: '编辑配置',
        type: 'edit',
        event: e,
        platform: channel,
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
  .notificationConfig-page {
    .el-main {
      background: var(--sa-background-assist);
      .sa-table-wrap {
        height: 100%;
      }
      .header-icon {
        width: 16px;
        height: 16px;
      }
      .edit-btn {
        border-radius: 4px 0 0 4px;
        color: var(--sa-background-assist);
      }
      .official-time {
        width: 140px;
        height: 32px;
        background: rgba(7, 193, 96, 0.1);
        border-radius: 0 4px 4px 0;
        color: #07c160;
      }
      .mini-time {
        background: rgba(111, 116, 233, 0.1);
        color: #6f74e9;
      }
      .sms-time {
        background: rgba(128, 106, 246, 0.1);
        color: #806af6;
      }
      .email-time {
        background: rgba(64, 158, 255, 0.1);
        color: #409eff;
      }
      .open-switch {
        color: var(--el-color-primary);
      }
    }
    :deep() {
      .el-alert__content {
        padding: 0;
      }
      // .el-alert--info.is-light {
      //   background: var(--sa-background-hex-hover);
      // }
    }
  }
</style>
