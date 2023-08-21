import { request } from './index';

// 导出并自动下载
export const EXPORT = async (url, params) => {
  const res = await request({
    url,
    method: 'GET',
    params,
    responseType: 'blob',
    timeout: 800000,
    options: {
      showLoading: true,
    },
  });
  const contentType = res.headers['content-type'];
  const filename = contentType.substring(contentType.lastIndexOf('name=') + 5, contentType.length);

  const downloadurl = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = downloadurl;
  link.setAttribute('download', decodeURIComponent(filename));
  document.body.appendChild(link);
  link.click();
};
