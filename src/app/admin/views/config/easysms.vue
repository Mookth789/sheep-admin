<template>
  <el-container class="panel-block">
    <el-header class="sa-header">
      <el-tabs class="sa-tabs">
        <el-tab-pane label="短信配置"></el-tab-pane>
      </el-tabs>
    </el-header>
    <el-main class="sa-p-t-30">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="20" :md="18" :lg="14" :xl="14">
          <el-form
            :model="easysms.model"
            :rules="easysms.rules"
            ref="easysmsRef"
            label-width="180px"
          >
            <el-form-item label="默认发送网关" prop="gateways" required>
              <el-radio-group v-model="easysms.model.gateways">
                <el-radio label="aliyun">阿里云</el-radio>
                <el-radio label="qcloud">腾讯云</el-radio>
                <el-radio label="huawei">华为云</el-radio>
                <el-radio label="smsbao">短信宝</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 阿里云 -->
            <template v-if="easysms.model.gateways == 'aliyun'">
              <div class="sa-title--line sa-m-b-30">阿里云</div>
              <el-form-item label="AccessKeyId" prop="gateways_aliyun.access_key_id">
                <el-input
                  placeholder="请输入AccessKeyId"
                  v-model="easysms.model.gateways_aliyun.access_key_id"
                ></el-input>
              </el-form-item>
              <el-form-item label="AccessKeySecret" prop="gateways_aliyun.access_key_secret">
                <el-input
                  placeholder="请输入AccessKeySecret"
                  v-model="easysms.model.gateways_aliyun.access_key_secret"
                ></el-input>
              </el-form-item>
              <el-form-item label="短信签名" prop="gateways_aliyun.sign_name">
                <el-input
                  placeholder="请输入短信签名"
                  v-model="easysms.model.gateways_aliyun.sign_name"
                ></el-input>
              </el-form-item>
              <!-- template 内容 -->
              <el-form-item label="短信模板">
                <div class="warning"> 请不要随意修改和删除下面的默认模板事件 </div>
                <div class="sa-template-wrap">
                  <div class="title sa-flex">
                    <div class="key">事件</div>
                    <div class="value">模板ID</div>
                    <div class="oper">操作</div>
                  </div>
                  <sa-draggable
                    v-model="easysms.model.gateways_aliyun.template"
                    :animation="300"
                    handle=".sortable-drag"
                    item-key="element"
                  >
                    <template #item="{ element, index }">
                      <div class="item">
                        <el-form-item
                          class="key"
                          :prop="'gateways_aliyun.template.' + index + '.event'"
                          :rules="templateRules.event"
                        >
                          <el-input placeholder="请输入键" v-model="element.event"></el-input>
                        </el-form-item>
                        <el-form-item
                          class="value"
                          :prop="'gateways_aliyun.template.' + index + '.value'"
                          :rules="templateRules.value"
                        >
                          <el-input placeholder="请输入值" v-model="element.value"></el-input>
                        </el-form-item>
                        <el-form-item class="oper">
                          <el-button @click="onDeleteTemplate('aliyun', index)" type="danger" plain
                            >删除</el-button
                          >
                          <sa-svg class="sa-m-l-8 sortable-drag" name="sa-round"></sa-svg>
                        </el-form-item>
                      </div>
                    </template>
                  </sa-draggable>
                  <el-button
                    @click="onAddTemplate('aliyun')"
                    class="sa-m-l-16"
                    type="primary"
                    plain
                    icon="Plus"
                    >追加</el-button
                  >
                </div>
              </el-form-item>
            </template>
            <!-- 腾讯云 -->
            <template v-if="easysms.model.gateways == 'qcloud'">
              <div class="sa-title--line sa-m-b-30">腾讯云</div>
              <el-form-item label="AppKey" prop="gateways_qcloud.app_key">
                <el-input
                  placeholder="请输入AppKey"
                  v-model="easysms.model.gateways_qcloud.app_key"
                ></el-input>
              </el-form-item>
              <el-form-item label="SdkAppId" prop="gateways_qcloud.sdk_app_id">
                <el-input
                  placeholder="请输入SdkAppId"
                  v-model="easysms.model.gateways_qcloud.sdk_app_id"
                ></el-input>
              </el-form-item>
              <el-form-item label="短信签名" prop="gateways_qcloud.sign_name">
                <el-input
                  placeholder="请输入短信签名"
                  v-model="easysms.model.gateways_qcloud.sign_name"
                ></el-input>
              </el-form-item>
              <!-- template 内容 -->
              <el-form-item label="短信模板">
                <div class="warning"> 请不要随意修改和删除下面的默认模板事件 </div>
                <div class="sa-template-wrap">
                  <div class="title sa-flex">
                    <div class="key">事件</div>
                    <div class="value">模板ID</div>
                    <div class="oper">操作</div>
                  </div>
                  <sa-draggable
                    v-model="easysms.model.gateways_qcloud.template"
                    :animation="300"
                    handle=".sortable-drag"
                    item-key="element"
                  >
                    <template #item="{ element, index }">
                      <div class="item">
                        <el-form-item
                          class="key"
                          :prop="'gateways_qcloud.template.' + index + '.event'"
                          :rules="templateRules.event"
                        >
                          <el-input placeholder="请输入键" v-model="element.event"></el-input>
                        </el-form-item>
                        <el-form-item
                          class="value"
                          :prop="'gateways_qcloud.template.' + index + '.value'"
                          :rules="templateRules.value"
                        >
                          <el-input placeholder="请输入值" v-model="element.value"></el-input>
                        </el-form-item>
                        <el-form-item class="oper">
                          <el-button @click="onDeleteTemplate('qcloud', index)" type="danger" plain
                            >删除</el-button
                          >
                          <sa-svg class="sa-m-l-8 sortable-drag" name="sa-round"></sa-svg>
                        </el-form-item>
                      </div>
                    </template>
                  </sa-draggable>
                  <el-button
                    @click="onAddTemplate('qcloud')"
                    class="sa-m-l-16"
                    type="primary"
                    plain
                    icon="Plus"
                    >追加</el-button
                  >
                </div>
              </el-form-item>
            </template>
            <!-- 华为云 -->
            <template v-if="easysms.model.gateways == 'huawei'">
              <div class="sa-title--line sa-m-b-30">华为云</div>
              <el-form-item label="Endpoint" prop="gateways_huawei.endpoint">
                <el-input
                  placeholder="请输入Endpoint"
                  v-model="easysms.model.gateways_huawei.endpoint"
                ></el-input>
              </el-form-item>
              <el-form-item label="AppKey" prop="gateways_huawei.app_key">
                <el-input
                  placeholder="请输入AppKey"
                  v-model="easysms.model.gateways_huawei.app_key"
                ></el-input>
              </el-form-item>
              <el-form-item label="AppSecret" prop="gateways_huawei.app_secret">
                <el-input
                  placeholder="请输入AppSecret"
                  v-model="easysms.model.gateways_huawei.app_secret"
                ></el-input>
              </el-form-item>
              <el-form-item label="短信签名" prop="gateways_huawei.sign_name">
                <el-input
                  placeholder="请输入短信签名"
                  v-model="easysms.model.gateways_huawei.sign_name"
                ></el-input>
              </el-form-item>
              <!-- template 内容 -->
              <el-form-item label="短信模板">
                <div class="warning"> 请不要随意修改和删除下面的默认模板事件 </div>
                <div class="sa-template-wrap">
                  <div class="title sa-flex">
                    <div class="key">事件</div>
                    <div class="value">模板ID</div>
                    <div class="oper">操作</div>
                  </div>
                  <sa-draggable
                    v-model="easysms.model.gateways_huawei.template"
                    :animation="300"
                    handle=".sortable-drag"
                    item-key="element"
                  >
                    <template #item="{ element, index }">
                      <div class="item">
                        <el-form-item
                          class="key"
                          :prop="'gateways_huawei.template.' + index + '.event'"
                          :rules="templateRules.event"
                        >
                          <el-input placeholder="请输入键" v-model="element.event"></el-input>
                        </el-form-item>
                        <el-form-item
                          class="value"
                          :prop="'gateways_huawei.template.' + index + '.value'"
                          :rules="templateRules.value"
                        >
                          <el-input placeholder="请输入值" v-model="element.value"></el-input>
                        </el-form-item>
                        <el-form-item class="oper">
                          <el-button @click="onDeleteTemplate('huawei', index)" type="danger" plain
                            >删除</el-button
                          >
                          <sa-svg class="sa-m-l-8 sortable-drag" name="sa-round"></sa-svg>
                        </el-form-item>
                      </div>
                    </template>
                  </sa-draggable>
                  <el-button
                    @click="onAddTemplate('huawei')"
                    class="sa-m-l-16"
                    type="primary"
                    plain
                    icon="Plus"
                    >追加</el-button
                  >
                </div>
              </el-form-item>
            </template>
            <!-- 短信宝 -->
            <template v-if="easysms.model.gateways == 'smsbao'">
              <div class="sa-title--line sa-m-b-30">短信宝</div>
              <el-form-item label="账号" prop="gateways_smsbao.user">
                <el-input
                  placeholder="请输入账号"
                  v-model="easysms.model.gateways_smsbao.user"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="gateways_smsbao.password">
                <el-input
                  placeholder="请输入密码"
                  v-model="easysms.model.gateways_smsbao.password"
                ></el-input>
              </el-form-item>
              <el-form-item label="短信签名" prop="gateways_smsbao.sign_name">
                <el-input
                  placeholder="请输入短信签名"
                  v-model="easysms.model.gateways_smsbao.sign_name"
                ></el-input>
              </el-form-item>
            </template>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="sa-footer--submit">
      <el-button @click="getData">重置</el-button>
      <el-button type="primary" @click="onUpdate">保存</el-button>
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    name: 'admin.config.easysms',
  };
</script>

<script setup>
  import { onMounted, reactive, ref, unref } from 'vue';
  import admin from '@/app/admin/api';
  import SaDraggable from 'vuedraggable';

  const easysmsRef = ref();
  const easysms = reactive({
    model: {},
    rules: {
      gateways_aliyun: {
        access_key_id: [
          {
            required: true,
            message: '请输入AccessKeyId',
            trigger: 'blur',
          },
        ],
        access_key_secret: [
          {
            required: true,
            message: '请输入AccessKeySecret',
            trigger: 'blur',
          },
        ],
        sign_name: [
          {
            required: true,
            message: '请输入短信签名',
            trigger: 'blur',
          },
        ],
      },
      gateways_qcloud: {
        app_key: [
          {
            required: true,
            message: '请输入AppKey',
            trigger: 'blur',
          },
        ],
        sdk_app_id: [
          {
            required: true,
            message: '请输入SdkAppId',
            trigger: 'blur',
          },
        ],
        sign_name: [
          {
            required: true,
            message: '请输入短信签名',
            trigger: 'blur',
          },
        ],
      },
      gateways_huawei: {
        // 华为云
        app_key: [
          {
            required: true,
            message: '请输入AppKey',
            trigger: 'blur',
          },
        ],
        app_secret: [
          {
            required: true,
            message: '请输入AppSecret',
            trigger: 'blur',
          },
        ],
        endpoint: [
          {
            required: true,
            message: '请输入Endpoint',
            trigger: 'blur',
          },
        ],
        sign_name: [
          {
            required: true,
            message: '请输入短信签名',
            trigger: 'blur',
          },
        ],
      },
      gateways_smsbao: {
        user: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
        sign_name: [
          {
            required: true,
            message: '请输入短信签名',
            trigger: 'blur',
          },
        ],
      },
    },
  });

  async function getData() {
    const { data } = await admin.config.easysms();
    easysms.model = data;
  }
  // 更新
  function onUpdate() {
    unref(easysmsRef).validate(async (valid) => {
      valid && admin.config.easysms(easysms.model);
    });
  }

  const templateRules = {
    event: [
      {
        required: true,
        message: '请输入键',
        trigger: 'blur',
      },
    ],
    value: [
      {
        required: true,
        message: '请输入值',
        trigger: 'blur',
      },
    ],
  };

  function onAddTemplate(filed) {
    easysms.model['gateways_' + filed]['template'].push({
      event: '',
      value: '',
    });
  }
  function onDeleteTemplate(filed, index) {
    easysms.model['gateways_' + filed]['template'].splice(index, 1);
  }

  onMounted(() => {
    getData();
  });
</script>

<style lang="scss" scoped>
  .warning {
    margin-bottom: 8px;
    line-height: 32px;
    font-size: 14px;
  }
</style>
