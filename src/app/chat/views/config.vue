<template>
  <el-container class="panel-block">
    <el-header class="sa-header">
      <el-tabs class="sa-tabs" v-model="configType" @tab-change="getData">
        <el-tab-pane v-for="c in configList" :key="c" :label="c.label" :name="c.api"></el-tab-pane>
      </el-tabs>
    </el-header>
    <el-main class="sa-p-t-30">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="20" :md="18" :lg="14" :xl="14">
          <template v-if="configType == 'chat.admin.config.basic'">
            <el-form
              :model="state.basic.model"
              :rules="state.basic.rules"
              ref="basicRef"
              label-width="180px"
            >
              <el-form-item label="客服分配方式" prop="allocate">
                <div>
                  <el-radio-group v-model="state.basic.model.allocate">
                    <el-radio label="busy">忙碌程度</el-radio>
                    <el-radio label="turns">轮流</el-radio>
                    <el-radio label="random">随机</el-radio>
                  </el-radio-group>
                  <div class="tip">
                    <span v-if="state.basic.model.allocate == 'busy'">
                      忙碌程度：根据客服最优接待人数，和当前已接待人数，计算客服忙碌度
                    </span>
                    <span v-if="state.basic.model.allocate == 'turns'">
                      轮流：根据最后接入时间正序排列，取最后接入时间最小的客服接入
                    </span>
                    <span v-if="state.basic.model.allocate == 'random'">
                      随机：随机取出一个在线客服接入
                    </span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="自动分配客服" prop="auto_customer_service">
                <el-switch
                  v-model="state.basic.model.auto_customer_service"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item>
              <el-form-item
                label="默认上次客服"
                prop="last_customer_service"
                v-if="state.basic.model.auto_customer_service == 1"
              >
                <el-switch
                  v-model="state.basic.model.last_customer_service"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-form>
          </template>
          <template v-if="configType == 'chat.admin.config.system'">
            <el-form
              :model="state.system.model"
              :rules="state.system.rules"
              ref="systemRef"
              label-width="180px"
            >
              <el-alert class="sa-alert sa-m-b-16">
                <template #title>
                  <div>修改完下面配置，请一定重启客服进程</div>
                </template>
              </el-alert>
              <el-form-item label="内部通讯地址" prop="inside_host">
                <el-input placeholder="请输入内部通讯地址" v-model="state.system.model.inside_host">
                </el-input>
              </el-form-item>
              <el-form-item label="内部通讯端口" prop="inside_port">
                <el-input
                  placeholder="请输入内部通讯端口"
                  type="number"
                  v-model="state.system.model.inside_port"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="外部服务端口" prop="port">
                <el-input
                  placeholder="请输入外部服务端口"
                  type="number"
                  v-model="state.system.model.port"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="证书模式" prop="ssl">
                <div>
                  <el-radio-group v-model="state.system.model.ssl">
                    <el-radio label="none">不开启</el-radio>
                    <el-radio label="cert">证书</el-radio>
                    <el-radio label="reverse_proxy">反向代理</el-radio>
                  </el-radio-group>
                  <div class="tip">
                    <span v-if="state.system.model.ssl == 'cert'">
                      证书：请先配置好 https，下面输入框配置 https 的证书文件绝对路径
                    </span>
                    <span v-if="state.system.model.ssl == 'reverse_proxy'">
                      反向代理：请先配置好https，使用 nginx 反向代理 wss
                    </span>
                  </div>
                </div>
              </el-form-item>
              <template v-if="state.system.model.ssl == 'cert'">
                <el-form-item label="ssl证书" prop="ssl_cert">
                  <el-input
                    placeholder="请输入ssl证书(绝对地址)"
                    v-model="state.system.model.ssl_cert"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="ssl key" prop="ssl_key">
                  <el-input
                    placeholder="请输入ssl key(绝对地址)"
                    v-model="state.system.model.ssl_key"
                  >
                  </el-input>
                </el-form-item>
              </template>
            </el-form>
          </template>
          <template v-if="configType == 'chat.admin.config.application'">
            <el-form
              :model="state.application.model.shop"
              :rules="state.application.rules.shop"
              ref="applicationRef"
              label-width="180px"
            >
              <el-form-item label="选择客服分类">
                <div>
                  <!-- <el-cascader
                    v-model="state.application.model.shop.room_id"
                    :options="roomIdSelect"
                    :props="{
                      label: 'name',
                      value: 'value',
                      checkStrictly: true,
                      emitPath: false,
                    }"
                    clearable
                    placeholder="请选择"
                  >
                  </el-cascader> -->
                  <el-select
                    v-model="state.application.model.shop.room_id"
                    placeholder="请选择客服分类"
                  >
                    <el-option
                      v-for="item in roomIdSelect"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <div class="tip sa-m-t-8"> 顾客只能和添加到同样分类的客服进行连接 </div>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="sa-footer--submit">
      <el-button @click="getData">重置</el-button>
      <el-button type="primary" @click="onUpdate"> 保存 </el-button>
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    name: 'chat.admin.config',
  };
</script>

<script setup>
  import { reactive, ref, onMounted, computed, getCurrentInstance } from 'vue';
  import sheep from '@/sheep';
  import api from '@/app/chat/api';
  import { checkAuth } from '@/sheep/directives/auth';

  const { proxy } = getCurrentInstance();

  const configList = computed(() => {
    const config = [
      { label: '客服配置', api: 'chat.admin.config.basic' },
      { label: '系统配置', api: 'chat.admin.config.system' },
      { label: '应用配置', api: 'chat.admin.config.application' },
    ];
    return config.filter((c) => {
      if (checkAuth(c.api)) return c;
    });
  });
  const configType = ref(configList.value.length > 0 ? configList.value[0].api : '');

  // 表单数据
  const state = reactive({
    basic: {
      model: {},
      rules: {},
    },
    system: {
      model: {},
      rules: {},
    },
    application: {
      model: {
        official: {},
        shop: {},
      },
      rules: {
        official: {},
        shop: {},
      },
    },
  });
  // 所属分类选项
  let roomIdSelect = ref([]);
  async function getChatCofig() {
    const { error, data } = await api.chatInit();
    if (error === 0) {
      roomIdSelect.value = data.default_rooms;
    }
  }

  // 获取配置信息
  async function getData() {
    let type = configType.value.split('.').pop();
    const { data } = await api.config[type]();
    state[type].model = { ...state[type].model, ...data };
    if (type == 'application') {
      const { official, shop } = data;
      state.application.model.official = official;
      state.application.model.shop = shop;
    }
  }

  // 提交保存
  function onUpdate() {
    let type = configType.value.split('.').pop();
    const form = proxy.$refs[type + 'Ref'];
    form.validate((valid) => {
      valid && api.config[type](state[type].model);
    });
  }

  onMounted(async () => {
    getChatCofig();
    if (configList.value.length > 0) {
      getData();
    }
  });
</script>
