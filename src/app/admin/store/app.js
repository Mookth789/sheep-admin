/**
 * @description 应用数据、加载
 */
import admin from '@/app/admin/api';
import $storage from '@/sheep/utils/storage';
import { getBrowser, checkUpdate } from '@/sheep/utils';
import { defineStore } from 'pinia';
import $store from '@/sheep/store';

const browser = getBrowser();

const app = defineStore({
  id: 'app',
  persist: {
    key: `${import.meta.env.SHEEP_CACHE_PREFIX}store-app`,
    paths: ['info', 'layout', 'taskbar', 'currentAppName'],
  },
  state: () => ({
    inited: false, // 应用加载状态
    info: {
      // 应用信息
      name: 'sheepjs',
      logo: '',
      version: '',
      domainurl: '',
      filesystem: '',
    },
    layout: {
      // 布局
      showTaskbar: true, // 是否显示任务栏
      collapse: browser.isMini,
      theme: '', // 主题
      darkMode: '', // 暗黑模式 light | dark | system
      pageLoading: false,
    },
    browser,
    taskbar: {
      list: [], // 任务栏列表
      history: [], // 任务栏访问历史
    },
    currentAppName: '',
    requestCounter: 0, // 请求计数器
  }),
  getters: {
    // 应用配置
    all: (state) => state,
  },
  actions: {
    /**
     * @description 初始化信息
     */
    async init() {
      const { error, data } = await admin.init();
      // 安装流程
      if (error === 1001) {
        window.location.replace(location.pathname + '#/install');
        return;
      }
      // 初始化信息
      if (error === 0) {
        this.info = data;
        checkUpdate(this.info.sheep_version);
        if ($store('account').isLogin) {
          await this.appLoad();
        }
        return data;
      }
    },

    /**
     * @description 加载app
     * @param {*} route
     */
    async appLoad() {
      const account = $store('account');
      account.getInfo();
      await account.getRules();
      this.inited = true;
    },

    changeApp(name) {
      this.currentAppName = name;
    },

    /**
     * @description 设置主题
     * @param {*} name
     */
    setTheme(name = '') {
      this.layout.theme = name;
      $storage.set('theme', this.theme);
    },

    /**
     * @description 设置暗黑模式
     * @param {*} name
     */
    setDarkMode(name = '') {
      this.layout.darkMode = name;
      $storage.set('darkMode', this.darkMode);
    },

    /**
     * @description 设置任务栏列表
     * @param {*} payload
     */
    setTaskbar(payload) {
      this.taskbar = payload;
    },

    // 收起左侧菜单
    menuCollapse(val = false) {
      this.layout.collapse = val;
    },

    // 页面加载
    setPageLoading() {
      let that = this;
      that.layout.pageLoading = true;
      setTimeout(() => {
        that.layout.pageLoading = false;
      }, 500);
    },

    // 设置请求计数器
    setRequestCounter(num) {
      this.requestCounter += num;
      if (this.requestCounter <= 0) {
        this.requestCounter = 0;
      }
    },
  },
});

export default app;
