// 请求
import axios from 'axios';
import $store from '@/sheep/store';
import $storage from '@/sheep/utils/storage';
import { ElMessage, ElMessageBox } from 'element-plus';
import { isNil } from 'lodash';
import { baseURL } from '@/sheep/config';

const options = {
  // 显示操作成功消息 默认不显示
  showSuccessMessage: false,
  // 显示失败消息 默认显示

  showErrorMessage: true,
  // 显示请求Loading 默认不显示
  showLoading: false,
  // ...
};

/**
 * @description axios请求基础配置 可直接使用访问自定义请求
 */
export const request = axios.create({
  baseURL,
  timeout: 8000,
  method: 'GET',
  headers: {
    // "Accept": "*/*",
    'Content-Type': 'application/json;charset=UTF-8',
  },
  options,
});

/**
 * @description axios请求拦截器
 */
request.interceptors.request.use(
  (config) => {
    $store('app').setRequestCounter(1);
    const token = $storage.get('token');
    if (token) config.headers['Authorization'] = token;
    return config;
  },
  (error) => {
    $store('app').setRequestCounter(-1);
    return Promise.reject(error);
  },
);

/**
 * @description axios响应拦截器
 */
request.interceptors.response.use(
  (response) => {
    $store('app').setRequestCounter(-1);
    // 自动刷新令牌
    if (response.headers.authorization) {
      $store('account').setToken(response.headers.authorization);
    }
    // 导出&下载文件
    if (response.config.responseType === 'blob' && response.data.size > 0) {
      return Promise.resolve(response);
    }
    if (response.data.error !== 0) {
      if (response.config.options.showErrorMessage)
        ElMessage.error(response.data.msg || '操作失败');
    } else {
      response.config.options.showSuccessMessage &&
        ElMessage.success(response.data.msg || '操作成功');
    }
    return Promise.resolve(response.data);
  },
  (error) => {
    $store('app').setRequestCounter(-1);
    let errorMessage = '未知错误';
    if (!isNil(error.response)) {
      switch (error.response?.status) {
        case 400:
          errorMessage = '请求错误';
          break;
        case 401:
          errorMessage = '未授权，请重新登录';
          if (document.getElementsByClassName('el-message-box').length === 0) {
            ElMessageBox.alert(error.response.data.msg || errorMessage, '认证失败', {
              confirmButtonText: '重新登陆',
            }).then(() => {
              $store('account').logout(true);
            });
          }
          return Promise.reject(error.response);
          break;
        case 403:
          errorMessage = '拒绝访问';
          break;
        case 404:
          errorMessage = '请求出错';
          break;
        case 408:
          errorMessage = '请求超时';
          break;
        case 429:
          errorMessage = '请求频繁, 请稍后再访问';
          break;
        case 500:
          errorMessage = '服务器开小差了,请稍后再试~';
          break;
        case 501:
          errorMessage = '服务未实现';
          break;
        case 502:
          errorMessage = '网络错误';
          break;
        case 503:
          errorMessage = '服务不可用';
          break;
        case 504:
          errorMessage = '网络超时';
          break;
        case 505:
          errorMessage = 'HTTP版本不受支持';
          break;
      }
      ElMessage.error(error.response.data.msg || errorMessage);
    } else {
      ElMessage.error(errorMessage);
    }
    return false;
  },
);
