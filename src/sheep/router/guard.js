import { addTaskbar } from '@/sheep/hooks/useTaskbar';
import $store from '@/sheep/store';

export function setupRouterGuard(router) {
  router.beforeEach((to, from, next) => {
    let nextPath = '';

    const appStore = $store('app');
    const isLogin = $store('account').isLogin;
    const taskbar = appStore.taskbar;

    // 强制登录
    if (!isLogin && to.meta.login !== false && to.path !== '/login') {
      nextPath = '/login';
    }
    // 进入首页
    if (isLogin && to.path === '/') {
      // 默认进入个人页
      nextPath = '/admin/profile';
      // 查找历史记录
      if (taskbar.history.length > 0 && taskbar.list.length > 0) {
        let key = taskbar.list.findIndex((page) => page.name === taskbar.history[0]);
        if (key !== -1) {
          nextPath = taskbar.list[key].path || '/admin/profile';
        }
      }
    }

    if (nextPath === '') {
      next();
    } else {
      next(nextPath);
    }
  });

  router.afterEach(async (to, from) => {
    // 设置标题
    document.title = `<${to.meta.title}> ${$store('app').info.name}`;
    // 添加任务栏历史
    if (to.meta.taskbar !== false) {
      addTaskbar({
        title: to.meta.title,
        name: to.name,
        path: to.path,
        query: to.query,
        icon: to.meta.icon,
      });
    }
  });
}
