import App from './App.vue';
import { createApp } from 'vue';
import { setupStore } from '@/sheep/store';
import { setupSheep } from '@/sheep';
import { setupRouter } from '@/sheep/router';
// element-plus
// import ElementPlus from 'element-plus';
// import zhCn from 'element-plus/lib/locale/lang/zh-cn';
// css reset
import 'normalize.css/normalize.css';

async function bootstrap() {
  const app = createApp(App);

  // element-plus
  app.use(ElementPlus, { locale: zhCn });

  // pinia store
  setupStore(app);

  // sheepjs init
  await setupSheep(app);

  // router
  await setupRouter(app).isReady();

  app.mount('#app');
}

bootstrap();
