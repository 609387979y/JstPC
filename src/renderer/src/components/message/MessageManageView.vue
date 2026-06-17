<template>
  <JstCardLayout border>
    <template #title>消息管理</template>

    <JstListLayout withoutContainer>
      <template #toolbarLeft>
        <el-button @click="setAllReadStatus" type="primary">全部已读</el-button>
        <el-button @click="deleteMessage(null)">删除</el-button>
      </template>
      <template #toolbarRight>
        <el-input
          prefix-icon="el-icon-search"
          v-model="search.title"
          @change="searchChange"
          placeholder="消息标题"
        ></el-input>
      </template>
      <template #table>
        <JstPageTable @change="getList" :data="data" :option="tableOption">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="Title" label="标题">
            <template #default="scope">
              <el-link
                @click.prevent="choose(scope.row)"
                :type="scope.row.IsRead == true ? 'info' : 'primary'"
              >{{ scope.row.Title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="GroupName" label="消息类型"></el-table-column>
          <el-table-column prop="ItemName" label="消息子类型"></el-table-column>
          <el-table-column prop="CreateTime" label="接收时间"></el-table-column>
          <el-table-column prop="opt" label="操作">
            <template #default="scope">
              <el-button type="text" @click="deleteMessage(scope.row.Id)">删除</el-button>
            </template>
          </el-table-column>
        </JstPageTable>
      </template>
    </JstListLayout>
  </JstCardLayout>
</template>

<script>
import { defineComponent } from "vue"
import { useTableOption, utils } from "justom-share"

export default defineComponent({
  components: {

  },
  props: {
    /**
     * 是否是外部界面 / 内部
     */
    isExternal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: {
        title: ""
      },
      data: [],
      tableOption: useTableOption({
        selectFilter(item) {
          return item.Id
        }
      })
    }
  },
  methods: {
    async getList() {
      let res = await this.$http.get("/api/Message/GetSystemMessages", {
        Page: this.tableOption.page,
        Limit: this.tableOption.pageSize,
        status: -1,
        title: this.search.title
      })
      this.tableOption.total = res.Total;
      this.data = res.Rows;
      this.$store.dispatch("message/getMessageCount")
    },
    /**
     * 删除消息
     */
    async deleteMessage(id) {
      let ids = [];
      if (id) {
        ids.push(id)
      } else {
        if (this.tableOption.selected.length == 0) {
          this.$message.warning("请选中一行")
          return;
        }
        ids = this.tableOption.selected;
      }

      let res = await this.$http.post("/api/Message/DeleteMessage", {
        msgIdList: ids
      })
      if (!res.Status) {
        this.$message.error(res.Message ?? '失败')
        return;
      }
      this.$message.success('成功');
      this.getList();
    },
    async setAllReadStatus() {
      let res = await this.$http.post("/api/Message/SetReadAllStatus", {

      })
      if (res.Status) {
        this.$message.success("设置成功");
        this.getList();
      }
    },
    /**
     * 选中其中一条
     */
    async choose(msg) {
      this.$http.post("/api/Message/SetReadStatus", {
        msgId: msg.Id
      }).then(() => {
        msg.IsRead = true;
        return this.$store.dispatch("message/getMessageCount");
      });

      // 跳转到详情页
      this.$router.push({
        path: "/system/messageDetail",
        query: {
          id: msg.Id
        }
      })
    },
    searchChange: utils.debounce(function () {
      this.getList();
    })

  },
  computed: {
    // 外部只看发到user的消息     内部看这个员工收到的消息
    onlyUser() {
      return this.isExternal ? true : false
    },
  },
  created() {
    this.getList();
  }
})
</script>

<style lang='scss' scoped>
</style>