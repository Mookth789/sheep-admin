import { reactive } from 'vue';
import wechat from '@/app/wechat/api';

export default function materialSelect() {
  const contentOptions = reactive({
    data: [],
    page: 1,
    list_rows: 10,
    total: 0,
  });
  async function getMaterialSelect(type) {
    const { data } = await wechat.admin.material.select({
      type: type,
      page: contentOptions.page,
      list_rows: contentOptions.list_rows,
    });
    contentOptions.page = data.current_page;
    contentOptions.list_rows = data.per_page;
    contentOptions.total = data.total;
    contentOptions.data = initData(data.data, type);
  }
  function initData(data, type) {
    let options = [];
    if (type == 'news') {
      data.forEach((i) => {
        i.content.news_item.forEach((e) => {
          options.push({
            media_id: i.media_id,
            title: e.title,
            thumb_url: e.thumb_url,
            type,
          });
        });
      });
    } else if (type == 'image') {
      data.forEach((i) => {
        options.push({
          media_id: i.media_id,
          title: i.name,
          thumb_url: i.url,
          type,
        });
      });
    } else if (type == 'video') {
      data.forEach((i) => {
        options.push({
          media_id: i.media_id,
          title: i.name,
          thumb_url: i.cover_url,
          type,
        });
      });
    } else if (type == 'voice') {
      data.forEach((i) => {
        options.push({
          media_id: i.media_id,
          title: i.name,
          thumb_url: '',
          type,
        });
      });
    } else if (type == 'text') {
      data.forEach((i) => {
        options.push({
          media_id: i.id,
          title: i.content,
          thumb_url: i.content,
          type,
        });
      });
    } else if (type == 'link') {
      data.forEach((i) => {
        options.push({
          media_id: i.id,
          title: i.content.title,
          thumb_url: i.content.image,
          description: i.content.description,
          type,
        });
      });
    }
    return options;
  }
  // 选择分页数量
  function changeSize(list_rows, type) {
    contentOptions.list_rows = list_rows;
    getMaterialSelect(type);
  }
  // 选择分页
  function changeCurrent(page, type) {
    contentOptions.page = page;
    getMaterialSelect(type);
  }

  return {
    contentOptions,
    getMaterialSelect,
    changeSize,
    changeCurrent,
  };
}
