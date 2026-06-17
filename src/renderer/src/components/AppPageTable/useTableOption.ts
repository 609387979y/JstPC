import TableOption from "./tableOption";
import { reactive } from "vue";
export default function useTableOption(option?: TableOption): TableOption {
  let defaultOpt: TableOption = {
    page: 1,
    pageSize: 15,
    pageSizes: [15, 20, 50, 100, 200],
    total: 0,
    selected: [],
    loading: false,
    selectFilter(item) {
      return item;
    },
    reset(){}
  };

  if (option) {
    for (let key in defaultOpt) {
      if (option[key] != null && option[key] != undefined) {
        defaultOpt[key] = option[key];
      }
    }
  }

  return reactive(defaultOpt);
}
