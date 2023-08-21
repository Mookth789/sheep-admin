// 路由
import { rootRoute, errorRoutes, loginRoute } from './basic';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { setupRouterGuard } from './guard';
import { registerDynamicRoutes } from './merge';

const routes = [rootRoute, loginRoute, ...errorRoutes];
// const routes = [rootRoutes, loginRoute, ...appRoutes, ...errorRoutes];
const routerMode = 'hash';
const router = createRouter({
  history: routerMode === 'history' ? createWebHistory() : createWebHashHistory(),
  routes,
});

export function setupRouter(app) {
  registerDynamicRoutes(router);
  app.use(router);
  setupRouterGuard(router);
  return router;
}

export default router;
