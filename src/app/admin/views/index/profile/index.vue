<template>
  <el-container class="profile-view">
    <el-main class="profile-main sa-p-0">
      <el-row :gutter="36">
        <el-col class="main-left" :xs="24" :sm="24" :md="24" :lg="8" :xl="10">
          <div class="sa-title">用户信息</div>
          <div class="top">
            <div class="content-name sa-m-b-16 sa-flex sa-row-between">
              <div class="sa-flex">
                <div class="sa-m-r-20">
                  <sa-image
                    v-if="state.account.avatar"
                    :url="state.account.avatar"
                    size="64"
                    radius="32"
                  ></sa-image>
                </div>
                <div>
                  <div class="name sa-m-b-8">
                    {{ state.account.account }}
                    <span class="id sa-m-l-8">#{{ state.account.id }}</span>
                  </div>
                  <div v-if="state.account.role_id">
                    {{ state.account.role.name }}
                  </div>
                </div>
              </div>
              <el-button v-auth="'admin.index.update'" @click="selectImage" type="primary"
                >上传头像</el-button
              >
            </div>
            <div class="detail">
              <div class="detail-item">
                <div class="label sa-m-b-8">用户昵称</div>
                <div class="sa-flex">
                  <el-input v-model="state.account.nickname"></el-input>
                </div>
              </div>
              <div class="detail-item">
                <div class="label sa-m-b-8">电子邮件</div>
                <el-input v-model="state.account.email" placeholder="未认证电子邮箱"></el-input>
              </div>
              <div class="detail-item">
                <div class="label sa-m-b-8">手机号码</div>
                <el-input v-model="state.account.mobile"></el-input>
              </div>
              <div class="detail-item">
                <div class="label sa-m-b-8">更改密码</div>
                <el-input
                  v-model="state.account.password"
                  placeholder="不修改密码请留空"
                ></el-input>
              </div>
              <div class="detail-item sa-flex">
                <el-button v-auth="'admin.index.update'" type="primary" @click="updateAccount"
                  >确定修改</el-button
                >
                <el-button @click="getInfo">重置</el-button>
              </div>
            </div>
          </div>
          <div class="wechat">
            <div class="sa-title">第三方账号</div>
            <div class="sa-flex sa-row-between sa-flex-wrap">
              <div class="sa-flex">
                <img v-if="!state.account.oauth_info" src="/static/images/index/wechat0.png" />
                <img v-if="state.account.oauth_info" src="/static/images/index/wechat1.png" />
                <span class="sa-m-l-12">微信公众号</span>
              </div>
              <el-button v-if="!state.account.oauth_info" type="primary" @click="getBindQrcode"
                >立即绑定</el-button
              >
              <div class="sa-flex" v-if="state.account.oauth_info">
                <div class="name sa-m-l-12 sa-table-line-1">
                  {{ state.account.oauth_info.openid }}
                </div>
              </div>
            </div>
          </div>
          <div class="login">
            <div class="sa-title">退出登录</div>
            <el-button type="danger" @click="logout">退出登录</el-button>
          </div>
        </el-col>
        <el-col class="main-right" :xs="24" :sm="24" :md="24" :lg="16" :xl="14">
          <Log />
        </el-col>
      </el-row>
    </el-main>
  </el-container>

  <el-dialog v-model="state.showBindModal" class="sa-dialog scan-dialog" title="绑定微信">
    <el-container>
      <el-main>
        <div class="profile-scan">
          <div class="scan-tip">请使用微信扫描二维码登录</div>
          <div class="scan-image">
            <sa-image v-if="state.qrcodeUrl" :url="state.qrcodeUrl" size="200"></sa-image>
            <div class="scan-image-tip sa-flex" v-if="state.qrcodeStatus === 'expired'">
              <div class="tip-code">二维码已过期</div>
              <div class="tip-refresh sa-flex sa-row-center" @click="getBindQrcode">
                <el-icon><RefreshRight /></el-icon>
                <span>点击刷新</span>
              </div>
            </div>
            <div class="scan-image-tip success sa-flex" v-if="state.qrcodeStatus === 'success'">
              <div class="tip-code">绑定中</div>
              <div class="tip-refresh sa-flex sa-row-center">
                <el-icon><SuccessFilled /></el-icon>
                <span>已扫码</span>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script setup>
  import { reactive, onMounted } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import adminApi from '@/app/admin/api';
  import wechatApi from '@/app/wechat/api';
  import Log from './components/log.vue';
  import { useFile } from '@/sheep/hooks';
  import sheep from '@/sheep';

  const accountStore = sheep.$store('account');

  let state = reactive({
    account: {},
    showBindModal: false,
    qrcodeUrl: '',
    qrcodeStatus: 'pending',
  });
  async function getInfo() {
    state.account = await accountStore.getInfo();
  }
  function updateAccount() {
    adminApi.account.update(state.account);
  }
  function logout() {
    ElMessageBox.confirm('您确定要退出登录吗？', '退出登录', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        accountStore.logout();
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消',
        });
      });
  }

  function selectImage() {
    useFile(
      {
        fileType: 'image',
      },
      {
        confirm: (data) => {
          state.account.avatar = data.url;
        },
      },
    );
  }

  let eventId = '';

  // 获取登录二维码
  async function getBindQrcode() {
    state.showBindModal = true;
    const { data, error, msg } = await wechatApi.admin.user.getQrcode({
      event: 'bind',
    });
    if (error == 0) {
      if (state.showBindModal) {
        state.qrcodeUrl = data.url;
        state.qrcodeStatus = 'pending';
        eventId = data.eventId;
        checkBindScanResult(eventId);
      }
    } else if (error == 1) {
      ElMessage({
        type: 'warning',
        message: msg,
      });
    }
  }

  // 检查二维码扫码状态
  async function checkBindScanResult(eventId) {
    if (!state.showBindModal) return;
    const { error, data, msg } = await wechatApi.admin.user.checkScan({
      event: 'bind',
      eventId,
    });
    if (error === 1) {
      state.qrcodeStatus = 'expired';
    } else if (error === -1) {
      setTimeout(function () {
        checkBindScanResult(eventId);
      }, 900);
    } else if (error === 0) {
      state.qrcodeStatus = 'success';
      setTimeout(function () {
        getInfo();
        state.showBindModal = false;
      }, 500);
    }
  }

  onMounted(() => {
    getInfo();
  });
</script>

<style lang="scss" scoped>
  .profile-view {
    .profile-main {
      overflow-x: hidden;
    }
    .main-left {
      :deep() {
        .el-input {
          width: 100%;
          max-width: 260px;
        }
      }
    }
    .top {
      background: var(--sa-table-header-bg);
      padding: 16px;
      border-radius: 4px;
      .content-name {
        color: var(--sa-font);
        font-size: 16px;
        flex-wrap: wrap;
        .name {
          font-size: 20px;
        }
        .id {
          color: var(--sa-subfont);
          font-size: 16px;
        }
      }
    }
    .detail {
      background: var(--sa-background-assist);
      padding: 16px;
      border-radius: 4px;
      .detail-item {
        font-size: 16px;
        margin: 0 0 18px 0;
        width: 100%;
        &:last-child {
          margin: 0;
        }
        .label {
          font-size: 12px;
          color: var(--sa-subfont);
        }
      }
    }
    .login,
    .wechat {
      color: var(--sa-subtitle);
      img {
        width: 32px;
        height: 32px;
      }
    }
  }
</style>

<style lang="scss">
  .el-dialog.sa-dialog.scan-dialog {
    --el-dialog-width: 400px;
    .profile-scan {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .scan-image {
      position: relative;
    }
    .scan-image-tip {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(253, 253, 253, 0.94);
      flex-direction: column;
      justify-content: center;
      .tip-code {
        font-size: 18px;
        color: var(--sa-title);
        margin-bottom: 16px;
      }

      .tip-refresh {
        font-size: 16px;
        color: var(--el-color-primary);
        cursor: pointer;

        .el-icon {
          font-size: 20px;
        }

        span {
          line-height: 1;
        }
      }
    }
  }
</style>
