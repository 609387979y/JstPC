// db.ts
import Dexie, { Table } from "dexie";

import * as tables from "./tables";

export class Database extends Dexie {
  logs!: Table<tables.SystemLog>;

  // 如果有新版本 按顺序在下面添加
  /*
    db.version(2).stores({
    friends: "++id,name,birthdate,sex"
        }).upgrade (trans => {
            从上个版本升级所需要进行的数据操作
        });
    */
  constructor() {
    super("justom");
    this.version(1).stores({
       // 不怎么需要被where的
      // 表: ++主键,索引1,索引2
      logs: `++id,from,report,createTime`,
    });
  }
}

export const db = new Database();

export default db;
