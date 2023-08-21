<template>
  <el-container>
    <el-main>
      <el-form ref="formRef" :model="form.model" :rules="form.rules" label-width="120px">
        <el-form-item
          :label="`充值${modal.params.type == 'money' ? '金额' : '积分'}`"
          prop="amount"
        >
          <el-input v-model="form.model.amount" type="number" placeholder="负数则为扣除" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.model.memo" />
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="sa-footer--submit">
      <el-button v-throttle type="primary" @click="onConfirm">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script setup>
  import { reactive, ref, unref } from 'vue';
  import userApi from '@/app/user/api';
  import { cloneDeep } from 'lodash';

  const emit = defineEmits(['modalCallBack']);
  const props = defineProps(['modal']);

  const formRef = ref();
  const form = reactive({
    model: {
      id: props.modal.params.id,
      type: props.modal.params.type,
      amount: '',
      memo: '',
    },
    rules: {
      amount: [{ required: true, message: '请输入', trigger: 'blur' }],
    },
  });

  function onConfirm() {
    unref(formRef).validate(async (valid) => {
      if (!valid) return;
      let submitForm = cloneDeep(form.model);
      const { error } = await userApi.recharge(submitForm);
      error == 0 && emit('modalCallBack', { event: 'confirm' });
    });
  }
</script>
