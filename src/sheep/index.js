import { onBeforeUpdate, ref } from 'vue';
// 极验
import '@/sheep/utils/gt';
// 图片剪裁
import 'cropperjs/dist/cropper.css';
// 事件通讯
import mitt from '@/sheep/utils/mitt';
// svg图标注册
import 'virtual:svg-icons-register';
// 时间格式化
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

import $store from '@/sheep/store';
import $storage from '@/sheep/utils/storage';

import { registerGlobalComponents } from '@/sheep/components';
import { registerGlobalDirectives } from '@/sheep/directives';
import { loadTheme } from '@/sheep/hooks/useTheme';

const sheep = {
  $store,
  $storage,
};
// 核心入口
export async function setupSheep(app) {
  app.provide('mitt', mitt);

  // 注册全局组件
  registerGlobalComponents(app);

  // 注册全局指令
  registerGlobalDirectives(app);

  // 主题
  loadTheme();

  // 系统初始化
  await $store('app').init();
}

export default sheep;
