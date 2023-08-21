<template>
  <el-container v-loading="state.loading">
    <el-header class="header-box">
      <div class="install-header sa-flex sa-col-center sa-row-between">
        <div class="">
          <img class="install-header-logo" src="/static/images/install/logo.png" />
        </div>
        <div class="install-header-list sa-flex sa-row-center">
          <div class="item-title" :class="{ 'activite-title': state.currentStep === 'protocol' }">
            用户协议
            <div class="item-line"></div>
          </div>
          <div class="item-title" :class="{ 'activite-title': state.currentStep === 'checkEnv' }">
            检测环境
            <div class="item-line"></div>
          </div>
          <div class="item-title" :class="{ 'activite-title': state.currentStep === 'setting' }">
            配置
            <div class="item-line"></div>
          </div>
          <div class="item-title" :class="{ 'activite-title': state.currentStep === 'install' }">
            安装
            <div class="item-line"></div>
          </div>
        </div>
        <div class="install-header-link sa-flex sa-row-right">
          <button class="sa-reset-button official-btn" @click="onOfficialSite">官网</button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="main-box">
        <el-row>
          <el-col :md="3" :lg="5"></el-col>
          <el-col v-if="!state.installed" :md="18" :lg="14">
            <!-- 阅读协议 -->
            <div class="main-content sa-p-24" v-if="state.currentStep === 'protocol'">
              <div class="sa-flex sa-m-b-38">
                <div class="main-line sa-m-r-10"></div>
                <div class="main-content-headline">用户协议</div>
              </div>

              <div class="richtext-title">
                <div class="richtext-title">
                  作者：SheepJS团队<br />
                  更新时间：2022-10-12<br /><br />
                  感谢您选择SheepJS - Shopro商城（以下简称Shopro，Shopro基于 PHP +
                  MySQL的技术开发，全部源码开放。
                  为了使你正确并合法的使用本软件，请你在使用前务必阅读清楚下面的协议条款：<br /><br />
                  一、本授权协议适用且仅适用于Shopro商城(Shopro商城是由SheepJS团队开发并支持的一套完整B2C商城系统.
                  以下简称Shopro)任何版本，SheepJS官方对本授权协议的最终解释权。<br /><br />
                  二、协议许可的权利<br />
                  您可以在支付商业域名授权完成并完全遵守本最终用户授权协议的基础上，将本软件应用于商业用途，而不必支付其它软件版权授权费用。
                  您可以在协议规定的约束和限制范围内修改Shopro源代码或界面风格以适应您的网站要求。
                  您拥有使用本软件构建的网站全部内容所有权，并独立承担与这些内容的相关法律义务。
                  获得商业授权之后，您可以将本软件应用于商业用途，同时依据所购买的授权类型中确定的技术支持内容，自购买时刻起，在技术支持期限内拥有通过指定的方式获得指定范围内的技术支持服务。商业授权用户享有反映和提出意见的权力，相关意见将被作为首要考虑，但没有一定被采纳的承诺或保证。<br /><br />
                  三、协议规定的约束和限制<br />
                  未获商业授权之前，不得将本软件用于商业用途（包括但不限于企业网站、经营性网站、以营利为目的或实现盈利的网站）。
                  未经官方许可，不得对本软件或与之关联的商业授权进行出租、出售、抵押或发放子许可证。
                  未经官方许可，禁止在Shopro的整体或任何部分基础上以发展任何派生版本、修改版本或第三方版本用于重新分发。
                  如果您未能遵守本协议的条款，您的授权将被终止，所被许可的权利将被收回，并承担相应法律责任。<br /><br />
                  四、有限担保和免责声明<br />
                  本软件及所附带的文件是作为不提供任何明确的或隐含的赔偿或担保的形式提供的。
                  用户出于自愿而使用本软件，您必须了解使用本软件的风险，在尚未购买产品技术服务之前，我们不承诺对免费用户提供任何形式的技术支持、使用担保，也不承担任何因使用本软件而产生问题的相关责任。
                  电子文本形式的授权协议如同双方书面签署的协议一样，具有完全的和等同的法律效力。您一旦开始确认本协议并安装
                  Shopro，即被视为完全理解并接受本协议的各项条款，在享有上述条款授予的权力的同时，受到相关的约束和限制。协议许可范围以外的行为，将直接违反本授权协议并构成侵权，我们有权随时终止授权，责令停止损害，并保留追究相关责任的权力。
                  如果本软件带有其它软件的整合API示范例子包，这些文件版权不属于本软件官方，并且这些文件是没经过授权发布的，请参考相关软件的使用许可合法的使用。<br /><br />
                  2021~2022 SheepJS™团队版权所有并保留所有权利。
                </div>
              </div>
            </div>
            <!-- 检查环境 -->
            <div class="main-content sa-p-24" v-if="state.currentStep === 'checkEnv'">
              <div class="sa-flex sa-m-b-28">
                <div class="main-line sa-m-r-10"></div>
                <div class="main-content-headline">系统环境</div>
              </div>
              <div class="sa-flex-col sa-col-center">
                <div
                  v-for="i in state.checkEnvResult.output"
                  :key="i"
                  class="sa-flex sa-col-center sa-m-b-28"
                >
                  <div class="output-title">
                    {{ i.item }}
                  </div>
                  <div class="icon-box">
                    <el-icon class="success-icon" v-if="i.error === 0"
                      ><CircleCheckFilled
                    /></el-icon>
                    <el-icon class="filled-icon" v-if="i.error === 1"
                      ><CircleCloseFilled
                    /></el-icon>
                    <el-icon class="warning-icon" v-if="i.error === 2"><WarningFilled /></el-icon>
                  </div>
                  <div class="output-msg">
                    {{ i.msg }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 配置 -->
            <div v-if="state.currentStep === 'setting'">
              <div>
                <el-collapse v-model="state.showMysql">
                  <el-collapse-item name="showMysql">
                    <template #title>
                      <div class="sa-flex">
                        <div class="main-line sa-m-r-10"></div>
                        <div class="main-content-headline">MySQL</div>
                      </div>
                      <div class="main-content-headline"></div>
                    </template>
                    <el-form
                      :model="form.model"
                      :rules="form.rules"
                      ref="formRef"
                      label-width="120px"
                      label-position="right"
                    >
                      <el-form-item label="数据库地址" prop="mysql_hostname">
                        <el-input class="sa-w-240" v-model="form.model.mysql_hostname"></el-input>
                      </el-form-item>
                      <el-form-item label="端口" prop="mysql_hostport">
                        <el-input class="sa-w-240" v-model="form.model.mysql_hostport"></el-input>
                      </el-form-item>
                      <el-form-item label="数据库名" prop="mysql_database">
                        <el-input class="sa-w-240" v-model="form.model.mysql_database"></el-input>
                      </el-form-item>
                      <el-form-item label="登录账号" prop="mysql_username">
                        <el-input class="sa-w-240" v-model="form.model.mysql_username"></el-input>
                      </el-form-item>
                      <el-form-item label="登录密码">
                        <el-input class="sa-w-240" v-model="form.model.mysql_password"></el-input>
                      </el-form-item>
                      <el-form-item label="数据库表前缀">
                        <el-input class="sa-w-240" v-model="form.model.mysql_prefix"></el-input>
                      </el-form-item>
                      <el-form-item label="安装测试数据">
                        <el-switch
                          class="sa-w-240"
                          v-model="form.model.is_test_data"
                          style="--el-switch-on-color: #806af6; --el-switch-off-color: #bfbfbf"
                          :active-value="1"
                          :inactive-value="0"
                        />
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div class="redis-box sa-m-t-24">
                <el-collapse v-model="state.showRedis" @change="onRedis">
                  <el-collapse-item name="showRedis">
                    <template #title>
                      <div class="redis-box-header sa-flex sa-row-between">
                        <div class="sa-flex">
                          <div class="main-line sa-m-r-10"></div>
                          <div class="redis-box-title">Redis</div>
                        </div>
                        <el-switch
                          v-model="form.model.check_redis"
                          style="--el-switch-on-color: #806af6; --el-switch-off-color: #bfbfbf"
                          :active-value="1"
                          :inactive-value="0"
                        />
                      </div>
                    </template>
                    <div></div>
                    <el-form
                      :model="form.model"
                      :rules="form.rules"
                      ref="formRef"
                      label-width="120px"
                      label-position="right"
                    >
                      <el-form-item label="redis地址" prop="redis_host">
                        <el-input class="sa-w-240" v-model="form.model.redis_host"></el-input>
                      </el-form-item>
                      <el-form-item label="端口" prop="redis_port">
                        <el-input class="sa-w-240" v-model="form.model.redis_port"></el-input>
                      </el-form-item>
                      <el-form-item label="连接密码">
                        <el-input class="sa-w-240" v-model="form.model.redis_password"></el-input>
                      </el-form-item>
                      <el-form-item label="db库1-15" prop="redis_select">
                        <el-input class="sa-w-240" v-model="form.model.redis_select"></el-input>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div class="main-content sa-p-24 sa-m-t-24">
                <div class="sa-flex sa-m-b-28">
                  <div class="main-line sa-m-r-10"></div>
                  <div class="main-content-headline">登录信息</div>
                </div>
                <el-form
                  :model="form.model"
                  :rules="form.rules"
                  ref="formRef"
                  label-width="120px"
                  label-position="right"
                >
                  <el-form-item label="登录账号" prop="admin_account">
                    <el-input class="sa-w-240" v-model="form.model.admin_account"></el-input>
                  </el-form-item>
                  <el-form-item label="登录密码" prop="admin_password">
                    <el-input class="sa-w-240" v-model="form.model.admin_password"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <!-- 安装成功 -->
            <div
              class="install-box sa-flex-col sa-row-center sa-col-center"
              v-if="state.currentStep === 'install'"
            >
              <div class="ss-m-b-60">
                <img class="install-img" src="/static/images/install/img-01.png" />
              </div>
              <div class="content sa-flex-col sa-row-center sa-col-center">
                <div class="content-title sa-m-t-32 sa-m-b-18">系统信息</div>
                <div class="content-msg sa-flex sa-row-between sa-m-b-40">
                  <div class="content-msg-title">
                    <div class="sa-m-b-12">后台访问地址：</div>
                    <div class="sa-flex">
                      <div>{{ pathname }}</div>
                      <button class="sa-reset-button sa-m-l-10" @click="onCopy()">复制</button>
                    </div>
                  </div>
                  <div class="content-msg-title">
                    <div class="sa-m-b-12">登录账号：</div>
                    <div>{{ form.model.admin_account }}</div>
                  </div>
                </div>
                <button class="sa-reason-button sa-m-b-24 goback-btn" @click="onHome">
                  进入后台
                </button>
              </div>
              <div class="sa-m-t-24">
                <div class="sa-flex sa-row-center install-foot-title sa-m-b-12">
                  <a class="link sa-m-r-60" href="https://www.sheepjs.com/" target="_blank"
                    >官方网站</a
                  >
                  <a class="link" href="https://doc.sheepjs.com/" target="_blank">开发文档</a>
                </div>
                <div class="install-foot-title"> Copyright © 星品科技 All Rights Reserverd. </div>
              </div>
            </div>
          </el-col>
          <el-col v-else :md="18" :lg="14">
            <!-- 已安装 -->
            <div class="install-msg">
              {{ state.installErrorMessage }}
            </div>
          </el-col>
          <el-col :md="3" :lg="5"></el-col>
        </el-row>
      </div>
    </el-main>
    <el-footer>
      <div class="foot-box" v-if="state.currentStep != 'install'">
        <el-row>
          <el-col :md="3" :lg="5"></el-col>
          <el-col :md="18" :lg="14">
            <div
              v-if="state.installed"
              class="foot-content sa-flex sa-row-right sa-col-center sa-p-r-20"
            >
              <el-button type="primary" @click="onHome">返回首页</el-button>
            </div>
            <div v-else class="foot-content sa-flex sa-row-right sa-col-center sa-p-r-20">
              <el-button v-if="showLastStep" type="default" plain @click="onLastStep"
                >上一步</el-button
              >
              <el-button v-if="state.currentStep === 'protocol'" type="primary" @click="onAgree"
                >同意并继续</el-button
              >

              <el-button
                v-if="state.currentStep === 'checkEnv' && !state.loading"
                type="default"
                plain
                @click="onCheckEnv"
                >重新检测</el-button
              >
              <el-button
                type="default"
                plain
                v-if="state.currentStep === 'checkEnv' && state.loading"
                >检测中...</el-button
              >
              <el-button
                v-if="
                  state.currentStep === 'checkEnv' &&
                  state.checkEnvResult.error === 0 &&
                  !state.loading
                "
                type="primary"
                @click="onNextStep('setting')"
                >下一步</el-button
              >

              <el-button
                v-if="state.currentStep === 'setting'"
                type="primary"
                @click="onSubmitInstall"
                >确认安装</el-button
              >

              <el-button
                type="default"
                plain
                v-if="state.currentStep === 'setting' && state.loading"
                >安装中...</el-button
              >
            </div>
          </el-col>
          <el-col :md="3" :lg="5"></el-col>
        </el-row>
      </div>
    </el-footer>
  </el-container>
</template>
<script>
  export default {
    name: 'install.admin',
  };
</script>
<script setup>
  import { reactive, onMounted, unref, ref, computed } from 'vue';
  import installApi from '@/app/install/api';
  import { cloneDeep } from 'lodash';
  import handleClipboard from '@/sheep/utils/clipboard';

  // 步进映射
  const stepMap = ['protocol', 'checkEnv', 'setting', 'install'];

  const state = reactive({
    loading: true, // 加载状态
    installed: true, // 应用是否安装
    installErrorMessage: '', // 安装错误信息
    currentStep: 'protocol', // 当前步骤
    checkEnvResult: {},
    showMysql: 'showMysql',
    showRedis: 'showRedis',
  });

  // 是否显示上一步
  const showLastStep = computed(() => {
    const currentIndex = stepMap.findIndex((item) => state.currentStep === item);
    if (currentIndex > 0 && currentIndex < stepMap.length) {
      return true;
    }
    return false;
  });

  // 点击上一步
  function onLastStep() {
    const currentIndex = stepMap.findIndex((item) => state.currentStep === item);
    state.currentStep = stepMap[currentIndex - 1];
  }

  // 点击下一步
  function onNextStep(tabName) {
    state.currentStep = tabName;
  }

  function onRedis(e) {
    if (e[0] === 'showRedis') {
      form.model.check_redis = 1;
    } else {
      form.model.check_redis = 0;
    }
  }

  function onCopy() {
    handleClipboard(pathname);
  }

  // 添加 编辑 form
  let formRef = ref(null);
  const form = reactive({
    model: {
      mysql_database: '',
      mysql_hostname: '',
      mysql_hostport: '',
      mysql_password: '',
      mysql_prefix: '',
      mysql_username: '',

      check_redis: 0,
      redis_host: '',
      redis_password: '',
      redis_port: '',
      redis_select: '',

      admin_account: '',
      admin_password: '',
    },
    rules: {
      mysql_hostname: [{ required: true, message: '请输入数据库地址', trigger: 'blur' }],
      mysql_hostport: [{ required: true, message: '请输入端口', trigger: 'blur' }],
      mysql_database: [{ required: true, message: '请输入数据库名', trigger: 'blur' }],
      mysql_username: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
      redis_host: [{ required: true, message: '请输入redis地址', trigger: 'blur' }],
      redis_port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
      redis_select: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
      admin_account: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
      admin_password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
    },
  });

  const pathname = window.location.origin + window.location.pathname;

  // 去官网
  function onOfficialSite() {
    window.open('https://www.sheepjs.com', '_blank');
  }
  // 去授权
  function onBuy() {
    window.open('https://www.sheepjs.com/buy', '_blank');
  }
  // 同意并继续
  function onAgree() {
    state.currentStep = 'checkEnv';
    onCheckEnv();
  }

  // 返回首页
  function onHome() {
    window.location.href = window.location.pathname;
  }

  // 检测服务端环境
  async function onCheckEnv() {
    state.loading = true;
    const { error, data } = await installApi.check();
    setTimeout(function () {
      state.loading = false;
    }, 300);
    if (error === 0) {
      state.checkEnvResult = data;
    }
  }

  async function getInit() {
    const res = await installApi.init();
    state.loading = false;
    if (res.error === 0) {
      form.model = {
        ...form.model,
        ...res.data.mysql,
        ...res.data.redis,
      };
      state.installed = false;
    } else {
      state.installErrorMessage = res.msg || '网络出现问题';
    }

    if (form.model.check_redis === 1) {
      state.showRedis = 'showRedis';
    }
  }

  // 表单关闭时提交
  function onSubmitInstall() {
    // 表单验证
    unref(formRef).validate(async (valid) => {
      if (!valid) return;
      state.loading = true;
      let submitForm = cloneDeep(form.model);
      submitForm.is_install = 1;
      const { error } = await installApi.install(submitForm);
      if (error === 0) {
        state.currentStep = 'install';
      }
      state.loading = false;
    });
  }

  onMounted(() => {
    getInit();
  });
</script>
<style lang="scss" scoped>
  a:visited {
    color: #fff;
  }
  .el-collapse {
    border: none;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    padding: 0 24px;
    --el-collapse-content-bg-color: #ffffff;
    --el-collapse-header-bg-color: #ffffff;
  }
  .redis-box {
    :deep(.el-collapse-item__arrow) {
      display: none;
    }
    .redis-box-header {
      width: 100%;
    }
    .redis-box-title {
      color: #262626;
      font-weight: 600 !important;
      font-size: 18px;
      line-height: 20px;
    }
  }
  .el-form-item {
    justify-content: center;
  }
  :deep() {
    .el-form-item__content {
      flex: none;
    }
    .el-collapse-item__header {
      border-bottom: none;
      font-weight: 600;
    }
    .el-collapse-item__wrap {
      border-bottom: none;
    }
    .el-form-item__label {
      font-size: 16px;
    }
    .el-textarea__inner {
      font-size: 16px;
    }
    .el-form-item__error {
      font-size: 14px;
    }
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 3px solid #ffffff;
  }
  .header-box {
    z-index: 2001;
    --el-header-padding: 0;
  }
  .install-header {
    width: 100%;
    height: 60px;
    background: var(--el-color-primary);
    box-sizing: border-box;
    padding: 0 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
  }
  .official-btn {
    color: #fdfdfd;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
  }
  .install-header-logo {
    width: 146px;
    height: 32px;
  }
  .install-header-link {
    width: 146px;
  }
  .install-header-list {
    width: 100%;
    .menu-box {
      border-bottom: 0;
    }

    .item-title {
      font-size: 18px;
      margin-right: 40px;
      height: 60px;
      display: flex;
      align-items: center;
      color: #d7d1fb;
      cursor: default;
      :last-child {
        margin-right: 0;
      }
    }
    .activite-title {
      color: #fdfdfd;
      position: relative;
      .item-line {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        width: 40px;
        height: 3px;
        background: #ffffff;
      }
    }
  }
  .install-box {
    width: 100%;
    height: 628px;
    background: var(--el-color-primary) url('/static/images/install/bg.png') no-repeat top center /
      100% auto;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    .install-img {
      width: 200px;
      height: 200px;
    }
    .content {
      width: 72%;
      background: #8d79f7;
      border-radius: 12px;
      .content-title {
        font-weight: 500;
        font-size: 24px;
        line-height: 24px;
        color: #fdfdfd;
      }
      .content-msg {
        width: 80%;
        .content-msg-title {
          font-weight: 500;
          font-size: 16px;
          line-height: 18px;
          color: #fdfdfd;
        }
      }
      .goback-btn {
        width: 104px;
        height: 40px;
        background: #fdfdfd;
        border-radius: 4px;
        color: #806af6;
        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
      }
    }
    .install-foot-title {
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      color: #fdfdfd;
      .link {
        color: #fff;
      }
    }
  }
  .main-line {
    width: 4px;
    height: 30px;
    background: var(--el-color-primary);
  }
  .main-content-headline {
    color: #262626;
    font-weight: 600;
    font-size: 18px;
    line-height: 20px;
  }
  .buy-link {
    color: #806af6;
  }
  .install-msg {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 160px);
  }
  .main-content {
    width: 100%;
    background: #ffffff;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
    border-radius: 8px;

    .richtext-title {
      color: #595959;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      width: inherit;
      text-align: justify;
      // white-space: pre-line;
      box-sizing: border-box;
      overflow: hidden;
      word-wrap: break-word;
    }
    .richtext-title-headline {
      text-align: center;
    }
    .icon-box {
      margin: 0 16px 0 32px;
    }
    .success-icon {
      color: #52c41a;
      font-size: 20px;
    }
    .filled-icon {
      color: #ff4d4f;
      font-size: 20px;
    }
    .warning-icon {
      color: #faad14;
      font-size: 20px;
    }
    .output-title {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: #434343;
      width: 220px;
      display: flex;
      justify-content: flex-end;
    }
    .output-msg {
      font-weight: 400;
      font-size: 16px;
      line-height: 18px;
      color: #595959;
      width: 300px;
      word-wrap: break-word;
    }
  }
  .foot-box {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    background: #fdfdfd;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
    z-index: 2001;
    .foot-content {
      height: 60px;
    }
  }
  @media only screen and (max-width: 768px) {
    .install-header-list {
      display: none;
    }
    .install-header {
      padding: 0 30px;
    }
    .foot-content {
      margin: 0 24px;
    }
    .icon-box {
      margin: 0 12px 0 20px !important;
    }
    .success-icon {
      font-size: 14px !important;
    }
    .filled-icon {
      font-size: 14px !important;
    }
    .warning-icon {
      font-size: 14px !important;
    }
    .output-title {
      font-size: 14px !important;
    }
    .output-msg {
      font-size: 14px !important;
    }
  }
</style>
