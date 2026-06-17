
import TableOption from "./tableOption";
export default function usePageTableOption(option?:TableOption): TableOption {
  
    let defaultOpt: TableOption = {
      page: 1,
      pageSize: 15,
      pageSizes: [15, 20, 50, 100, 200],
      total: 0,
      selected: [],
      loading:false,
      selectFilter(items){
          return items;
      }
    };
  
    if(option){
  
      for(let key in defaultOpt){
         if(option[key] != null && option[key] != undefined){
              defaultOpt[key] = option[key];
         }
      }
  
    }
  
    return defaultOpt;
  }
  
  