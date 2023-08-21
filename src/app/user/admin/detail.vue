<template>
  <el-container class="admin-detail">
    <el-main class="sa-p-b-0">
      <el-row :gutter="24">
        <el-col class="sa-col-24" :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="title">基本信息</div>
          <div class="bottom">
            <div class="sa-flex sa-row-between sa-m-b-16">
              <div class="sa-flex sa-flex-1">
                <sa-image :url="detail.data.avatar" size="64" radius="32" />
                <div class="sa-m-l-20 sa-flex-1">
                  <div class="nickname sa-m-b-8 sa-table-line-1">
                    {{ detail.data.nickname }}
                  </div>
                  <div class="id">#{{ detail.data.id }}</div>
                </div>
              </div>
              <el-button v-auth="'user.admin.user.edit'" type="primary" @click="onUpload"
                >更换头像</el-button
              >
            </div>
            <div class="info">
              <el-row :gutter="24">
                <el-col class="item sa-col-12" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="label">昵称</div>
                  <div class="content">
                    <el-input v-model="detail.data.nickname" />
                  </div>
                </el-col>
                <el-col class="item sa-col-12" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="label">性别</div>
                  <div class="content">
                    <el-radio-group v-model="detail.data.gender">
                      <el-radio :label="0">未知</el-radio>
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                  </div>
                </el-col>
                <el-col class="item sa-col-12" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="label">用户名</div>
                  <div class="content">
                    <el-input v-model="detail.data.username" placeholder="首位需为字母且不少五位">
                      <template #suffix>
                        <span v-html="settingStatus('username')"></span>
                      </template>
                    </el-input>
                  </div>
                </el-col>
                <el-col class="item sa-col-12" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="label">密码</div>
                  <div class="content">
                    <el-input v-model="detail.data.password" placeholder="不修改则留空">
                      <template #suffix>
                        <span v-html="settingStatus('password')"></span>
                      </template>
                    </el-input>
                  </div>
                </el-col>
                <el-col class="item sa-col-12" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="label">手机号</div>
                  <div class="content">
                    <el-input v-model="detail.data.mobile" type="number">
                      <template #suffix>
                        <span v-html="settingStatus('mobile')"></span>
                      </template>
                    </el-input>
                  </div>
                </el-col>
                <el-col class="item sa-col-12" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="label">电子邮箱</div>
                  <div class="content">
                    <el-input v-model="detail.data.email">
                      <template #suffix>
                        <span v-html="settingStatus('email')"></span>
                      </template>
                    </el-input>
                  </div>
                </el-col>
                <el-col class="item sa-col-12" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="label">状态</div>
                  <div class="content">
                    <el-radio-group v-model="detail.data.status">
                      <el-radio label="normal">正常</el-radio>
                      <el-radio label="disabled">禁用</el-radio>
                    </el-radio-group>
                  </div>
                </el-col>
                <el-col class="item sa-col-12" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="label"></div>
                  <div class="content sa-flex sa-row-right">
                    <el-button v-auth="'user.admin.user.detail'" @click="getDetail">重置</el-button>
                    <el-button
                      v-throttle
                      v-auth="'user.admin.user.edit'"
                      type="primary"
                      @click="onSave"
                      >保存</el-button
                    >
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col class="sa-col-24" :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
          <el-row :gutter="24">
            <el-col class="sa-col-24" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <div class="title">账户信息</div>
              <div class="bottom">
                <div class="info">
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                      <div class="item">
                        <div class="label">余额</div>
                        <div class="content sa-flex">
                          {{ detail.data.money }}
                          <el-button
                            v-auth="'user.admin.user.recharge'"
                            class="is-link sa-m-l-12"
                            type="primary"
                            @click="onRecharge('money')"
                            >充值</el-button
                          >
                        </div>
                      </div>
                      <div class="item">
                        <div class="label">积分</div>
                        <div class="content sa-flex">
                          {{ detail.data.score }}
                          <el-button
                            v-auth="'user.admin.user.recharge'"
                            class="is-link sa-m-l-12"
                            type="primary"
                            @click="onRecharge('score')"
                            >充值</el-button
                          >
                        </div>
                      </div>
                      <div class="item">
                        <div class="label">总计消费</div>
                        <div class="content">
                          {{ detail.data.total_consume }}
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                      <div class="item">
                        <div class="label">佣金</div>
                        <div class="content">{{ detail.data.commission }}</div>
                      </div>
                      <div class="item">
                        <div class="label">上次登陆时间</div>
                        <div class="content">{{ detail.data.login_time }}</div>
                      </div>
                      <div class="item">
                        <div class="label">登录IP</div>
                        <div class="content">{{ detail.data.login_ip }}</div>
                      </div>
                      <div class="item">
                        <div class="label">注册时间</div>
                        <div class="content">{{ detail.data.create_time }}</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col class="third-oauth sa-col-24" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <div class="title">第三方账号</div>
              <div class="bottom">
                <el-row class="info">
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div class="item" v-for="item in detail.data.third_oauth" :key="item.id">
                      <div class="content sa-flex sa-row-between">
                        <div class="sa-flex">
                          <img
                            :src="`./static/images/platform/${item.provider}/${item.platform}.png`"
                          />
                          <span class="sa-m-l-16">
                            {{ platform[item.provider][item.platform] }}
                          </span>
                        </div>
                        <el-popover popper-class="sa-popper" placement="top-start" trigger="hover">
                          <div>
                            <div class="item sa-flex">
                              <div class="label">登录次数:</div>
                              <div class="content">{{ item.login_num }}</div>
                            </div>
                            <div class="item sa-flex">
                              <div class="label">Openid:</div>
                              <div class="content">{{ item.openid }}</div>
                            </div>
                            <div v-if="item.unionid" class="item sa-flex">
                              <div class="label">Unionid:</div>
                              <div class="content">{{ item.unionid }}</div>
                            </div>
                            <div class="item sa-flex">
                              <div class="label">更新时间:</div>
                              <div class="content">{{ item.update_time }}</div>
                            </div>
                          </div>
                          <template #reference>
                            <div class="sa-flex">
                              <sa-image :url="item.avatar" size="32" />
                              <span class="name sa-m-l-12">
                                {{ item.nickname }}
                              </span>
                            </div>
                          </template>
                        </el-popover>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col class="log sa-col-24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="title sa-flex"> 用户动态 </div>
              <div class="bottom">
                <el-tabs v-model="log.tabName">
                  <el-tab-pane label="余额记录" name="money"></el-tab-pane>
                  <el-tab-pane label="积分记录" name="score"></el-tab-pane>
                  <el-tab-pane label="佣金记录" name="commission"></el-tab-pane>
                </el-tabs>
                <component
                  :is="`${log.tabName}-log`"
                  :id="modal?.params?.id"
                  :refresh="log.refresh"
                  @updateRefresh="(val) => (log.refresh = val)"
                />
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import CommissionLog from './components/commission.vue';
  import MoneyLog from './components/money.vue';
  import ScoreLog from './components/score.vue';

  export default {
    components: {
      CommissionLog,
      MoneyLog,
      ScoreLog,
    },
  };
</script>

<script setup>
  import { onMounted, reactive } from 'vue';
  import userApi from '@/app/user/api';
  import { useFile, useModal } from '@/sheep/hooks';
  import AdminRecharge from './recharge.vue';

  const props = defineProps(['modal']);

  const detail = reactive({
    loading: false,
    data: {},
  });

  async function getDetail() {
    detail.loading = true;
    const { error, data } = await userApi.detail(props.modal.params.id);
    error === 0 && (detail.data = data);
    detail.loading = false;
  }

  function settingStatus(key) {
    let flag = detail.data.verification?.[key];
    return `<span style="color:${flag ? 'var(--el-color-success)' : 'var(--el-color-warning)'}">
  ${flag ? '已' : '未'}${key == 'username' || key == 'password' ? '设置' : '认证'}
  </span>`;
  }

  const platform = {
    wechat: {
      openPlatform: '微信开放平台',
      miniProgram: '微信小程序',
      officialAccount: '微信公众平台',
    },
  };

  const log = reactive({
    tabName: 'money',
    refresh: false,
  });

  function onUpload() {
    useFile(
      {
        fileType: 'image',
      },
      {
        confirm: (data) => {
          detail.data.avatar = data.url;
        },
      },
    );
  }

  async function onSave() {
    const { error } = await userApi.edit(props.modal.params.id, detail.data);
    error == 0 && getDetail();
  }

  function onRecharge(type) {
    useModal(
      AdminRecharge,
      {
        title: '充值',
        id: props.modal.params.id,
        type,
      },
      {
        confirm: () => {
          getDetail();
          log.refresh = true;
        },
      },
    );
  }

  onMounted(() => {
    getDetail();
  });
</script>

<style lang="scss" scoped>
  .admin-detail {
    .title {
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      color: var(--sa-subtitle);
      margin-bottom: 8px;
    }

    .bottom {
      padding: 16px;
      background: var(--sa-table-header-bg);
      border-radius: 8px;
      margin-bottom: 20px;

      .nickname {
        line-height: 20px;
        font-size: 20px;
        font-weight: 500;
        color: var(--sa-subtitle);
      }

      .id {
        line-height: 16px;
        font-size: 16px;
        font-weight: 500;
        color: var(--sa-subfont);
      }

      .info {
        padding: 16px 16px 0;
        background: var(--sa-background-assist);
        border-radius: 4px;

        .item {
          margin-bottom: 16px;

          .label {
            height: 12px;
            line-height: 12px;
            font-size: 12px;
            font-weight: 500;
            color: var(--sa-subfont);
            margin-bottom: 8px;
          }

          .content {
            line-height: 32px;
            font-size: 14px;
            font-weight: 400;
            color: var(--sa-subtitle);
          }
        }
      }
    }

    .third-oauth {
      .info {
        padding: 20px 16px 0;

        .item {
          margin-bottom: 24px;

          img {
            width: 32px;
            height: 32px;
          }

          .name {
            color: var(--sa-font);
          }

          .none {
            color: #999;
          }
        }
      }
    }

    .log {
      .bottom {
        padding: 0;
        background: var(--sa-background-assist);

        :deep() {
          .el-tabs__nav-wrap::after {
            height: 0;
          }
        }

        .sa-table {
          height: 300px;
        }

        :deep() {
          .oper-type {
            font-size: 12px;
            color: var(--sa-subtitle);
          }

          .system {
            font-size: 14px;
            color: var(--sa-subtitle);

            img {
              width: 32px;
              height: 32px;
              margin-right: 8px;
            }
          }
        }
      }
    }

    @media only screen and (max-width: 1200px) {
      @for $i from 0 through 24 {
        .sa-col-#{$i} {
          max-width: calc(calc($i * 100%) / 24) !important;
          flex: 0 0 calc(calc($i * 100%) / 24) !important;
        }
      }
    }
  }
</style>
