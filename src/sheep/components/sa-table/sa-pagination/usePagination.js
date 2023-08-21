import { reactive } from 'vue';

const usePagination = () => {
  const pageData = reactive({
    page: 1,
    list_rows: 10,
    total: 0,
  });
  return { pageData };
};

export { usePagination };
