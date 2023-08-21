<template>
  <el-container>
    <el-main>
      <el-form
        v-loading="loading"
        :model="form.model"
        :rules="form.rules"
        ref="formRef"
        label-width="100px"
      >
        <!-- <el-form-item label="父级" prop="parent_id">
          <el-cascader
            ref="parentCascader"
            v-model="form.model.parent_id"
            :options="access.select"
            :props="{
              label: 'title',
              value: 'id',
              checkStrictly: true,
              emitPath: false,
            }"
            clearable
            placeholder="请选择"
            disabled
          ></el-cascader>
        </el-form-item> -->
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.model.type" @change="changeType">
            <el-radio label="menu">菜单</el-radio>
            <el-radio label="page">页面</el-radio>
            <el-radio label="modal">弹框</el-radio>
            <el-radio label="api">权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.model.title"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="name">
          <el-input v-model="form.model.name"></el-input>
        </el-form-item>
        <el-form-item v-if="form.model.type != 'api'" label="图标" prop="icon">
          <sa-uploader v-model="form.model.icon" mode="input" fileType="image"></sa-uploader>
        </el-form-item>
        <el-form-item v-if="form.model.type != 'api'" label="参数" prop="params">
          <el-input v-model="form.model.params" placeholder="请输入参数"></el-input>
        </el-form-item>
        <el-form-item label="权重" prop="weigh">
          <el-input v-model="form.model.weigh" placeholder="请输入权重" type="number"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <div>
            <el-radio-group v-model="form.model.status">
              <el-radio label="show">显示</el-radio>
              <el-radio label="hidden">隐藏</el-radio>
              <el-radio label="disabled">禁用</el-radio>
            </el-radio-group>
            <div class="tip">
              <div>显示:该权限将作为菜单展示</div>
              <div>隐藏:该权限将不在菜单中显示</div>
              <div>禁用:禁用该权限后，除了超级管理员都将无法访问此权限</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="form.model.type == 'page' && !modal.params.id" label="包含权限">
          <div class="sa-template-wrap">
            <div class="title sa-flex">
              <div class="key">名称</div>
              <div class="value">标识</div>
              <div class="oper">操作</div>
            </div>
            <sa-draggable
              v-model="form.model.api"
              :animation="300"
              handle=".sortable-drag"
              item-key="element"
            >
              <template #item="{ element, index }">
                <div class="item">
                  <el-form-item
                    class="key"
                    :prop="'api.' + index + '.title'"
                    :rules="templateRules.title"
                  >
                    <el-input placeholder="请输入名称" v-model="element.title"></el-input>
                  </el-form-item>
                  <el-form-item
                    class="value"
                    :prop="'api.' + index + '.name'"
                    :rules="templateRules.name"
                  >
                    <el-input placeholder="请输入标识" v-model="element.name"></el-input>
                  </el-form-item>
                  <el-form-item class="oper">
                    <el-button @click="deleteTemplate(index)" type="danger" plain>删除</el-button>
                    <sa-svg class="sa-m-l-8 sortable-drag" name="sa-round"></sa-svg>
                  </el-form-item>
                </div>
              </template>
            </sa-draggable>
            <el-button @click="addTemplate()" class="sa-m-l-16" type="primary" plain icon="Plus"
              >添加</el-button
            >
            <el-button
              v-if="form.model.api.length == 0"
              @click="addCurd()"
              class="sa-m-l-16"
              type="success"
              plain
              icon="Plus"
              >CRUD</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="sa-footer--submit">
      <el-button
        v-if="modal.params.type == 'add'"
        v-auth="'admin.auth.access.add'"
        type="primary"
        @click="confirm"
        >确定</el-button
      >
      <el-button
        v-if="modal.params.type == 'edit'"
        v-auth="'admin.auth.access.edit'"
        type="primary"
        @click="confirm"
        >更新</el-button
      >
    </el-footer>
  </el-container>
</template>
<script setup>
  import { onMounted, reactive, ref, unref } from 'vue';
  import { doUnique } from '@/sheep/utils/index.js';
  import admin from '@/app/admin/api';
  import SaDraggable from 'vuedraggable';
  import { cloneDeep } from 'lodash';

  const apiCrud = [
    {
      title: '查看',
      name: 'list',
    },
    {
      title: '详情',
      name: 'detail',
    },
    {
      title: '新建',
      name: 'add',
    },
    {
      title: '编辑',
      name: 'edit',
    },
    {
      title: '删除',
      name: 'delete',
    },
  ];

  const emit = defineEmits(['modalCallBack']);
  const props = defineProps({
    modal: {
      type: Object,
    },
  });

  // 添加 编辑 form
  let formRef = ref(null);
  const form = reactive({
    model: {
      parent_id: props.modal.params.parent_id,
      title: '',
      type: 'menu',
      name: '',
      icon: '',
      params: '',
      status: 'show',
      weigh: '',
      api: [],
    },
    rules: {
      title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      name: [{ required: true, message: '请输入标识', trigger: 'blur' }],
    },
  });
  // api 表单规则
  const templateRef = ref(null);
  const templateRules = {
    title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    name: [{ required: true, message: '请输入标识', trigger: 'blur' }],
  };

  const loading = ref(false);

  // 获取详情
  async function getDetail(id) {
    loading.value = true;
    const { error, data } = await admin.auth.access.detail(id);
    error === 0 && (form.model = data);

    loading.value = false;
  }
  function changeType(e) {
    if (e != 'page') form.model.api = [];
  }

  // 添加权限
  function addTemplate() {
    form.model.api.push({
      title: '',
      name: '',
    });
  }
  function addCurd() {
    form.model.api = [].concat(form.model.api, apiCrud);
  }
  function deleteTemplate(index) {
    form.model.api.splice(index, 1);
  }

  // 表单关闭时提交
  function confirm() {
    // 表单验证
    unref(formRef).validate(async (valid) => {
      if (!valid) return;
      let submitForm = cloneDeep(form.model);
      if (!submitForm.parent_id) submitForm.parent_id = 0;
      submitForm.type == 'page' ? (submitForm.api = doUnique(submitForm.api || [], 'name')) : '';
      const { error, data } =
        props.modal.params.type == 'add' || props.modal.params.type == 'append'
          ? await admin.auth.access.add(submitForm)
          : await admin.auth.access.edit(props.modal.params.id, submitForm);
      error == 0 && emit('modalCallBack', { event: 'confirm', data });
    });
  }

  onMounted(async () => {
    if (props.modal.params.type == 'edit') {
      await getDetail(props.modal.params.id);
    }
  });
</script>
