import { useDrawer } from '@/sheep/hooks';
export function useSearch(options) {
  const openFilter = () => {
    useDrawer({
      ...options,
      confirm: (data) => {
        options.filterParams.tools = data.tools;
        options.filterParams.data = data.data;
        options.filterParams.conditionLabel = data.conditionLabel;
        options.getData(1);
      },
      reset: (data) => {
        options.filterParams.tools = data.tools;
        options.filterParams.data = data.data;
        options.filterParams.conditionLabel = data.conditionLabel;
        options.getData(1);
      },
      close: (data) => {},
    });
  };
  const deleteFilter = (key) => {
    if (options.filterParams.tools[key].type == 'tinputprepend') {
      options.filterParams.data[key] =
        options.filterParams.tools[key][options.filterParams.tools[key].field];
    } else {
      options.filterParams.data[key] = options.filterParams.tools[key].value;
    }
    delete options.filterParams.conditionLabel[key];

    options.getData(1);
  };
  return {
    openFilter,
    deleteFilter,
  };
}
