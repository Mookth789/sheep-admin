import $store from '@/sheep/store';
import $storage from '@/sheep/utils/storage';

// 加载主题设置
export function loadTheme() {
  setTheme();
  setDarkMode();
}
// 设置主题
export function setTheme(themeName = '') {
  if (themeName == '') {
    themeName = $storage.get('theme') || 'sheep';
  }
  $store('app').setTheme(themeName);
  $storage.set('theme', themeName);
  createThemeLink();
}
// 设置暗黑模式
export function setDarkMode(modeName = '') {
  if (modeName == '') {
    modeName = $storage.get('darkMode') || 'light';
  }
  $store('app').setDarkMode(modeName);
  $storage.set('darkMode', modeName);
  createThemeLink();
}
// 引入主题样式
function createThemeLink() {
  const appLayout = $store('app').layout;
  const html = document.querySelector('html');
  html.className = '';
  html.classList.add('mode-' + appLayout.darkMode);
  html.classList.add('theme-' + appLayout.theme);
}

export default { loadTheme, setTheme, setDarkMode };
