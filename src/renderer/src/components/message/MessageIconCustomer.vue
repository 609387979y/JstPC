<template>
  <span v-if="unReadCount != null">
    <el-popover popper-class="message-icon-popper" placement="bottom" :width="300" trigger="click">
      <template #reference>
        <div class="bell-icon-out" :class="messegeShow ? 'active' : ''" @click="messegeShow = !messegeShow">
          <el-icon :size="18" :class="isWhite ? 'isWhite' : 'isBlack'">
            <el-badge :value="unReadCount" :hidden="unReadCount == 0" :max="99" type="danger">
              <bell />
            </el-badge>
          </el-icon>
        </div>
      </template>
      <div class="message-box">
        <el-scrollbar max-height="400px">
          <template v-if="messages.length != 0">
            <MessageInfo v-for="item in messages" :key="item.Id" :title="item.msgTitle"
              :description="item.msgDescription" :time="item.time" :isRead="item.IsRead" @click="choose(item)">
            </MessageInfo>
          </template>
          <template v-else>
            <el-empty description="暂无消息"></el-empty>
          </template>
        </el-scrollbar>

        <div class="btns">
          <el-row>
            <el-col :span="12">
              <div @click="setAllReadStatus" class="opt-btn" style="border-right: 1px solid #f0f0f0">
                全部已读
              </div>
            </el-col>
            <el-col :span="12">
              <div @click="toMoreMessages" class="opt-btn">查看更多</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-popover>
  </span>
</template>

<script>
import { defineComponent } from "vue";
import { Bell } from "@element-plus/icons";
import MessageInfo from "./MessageListItem.vue";
export default defineComponent({
  props: {
    /**
     * 是否是外部的 / 内部的
     */
    isExternal: {
      type: Boolean,
      default: false,
    },
    isWhite: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Bell,
    MessageInfo,
  },
  data() {
    return {
      unReadCount: 0,
      chooseTab: "unRead",
      messages: [],
    };
  },
  methods: {
    async getUnreadCount() {
      this.unReadCount = await this.$http.get("/api/Message/UnReadMessageCount", {
        onlyUser: this.onlyUser,
      });
    },
    async getMessages() {
      // 获取一页的消息
      let messages = await this.$http.get("/api/Message/GetSystemMessages", {
        Page: 1,
        Limit: 15,
        status: -1,
        onlyUser: this.onlyUser,
      });
      if (messages) {
        for (let msg of messages.Rows) {
          msg.msgTitle = `${msg.GroupName} - ${msg.ItemName}`;
          msg.msgDescription = msg.Title;
          msg.time = msg.CreateTime;
          /*
        CreateTime: "2021-09-15 18:05:12"
GroupName: "公司申请"
Id: 1
IsRead: false
ItemName: "入驻申请"
Title: "您的申请入驻审核通过"
UserId: 3

        */
        }
        this.messages = messages.Rows;
      }
    },
    reload() {
      this.getMessages();
      this.getUnreadCount();
    },
    /**
     * 全部已读
     */
    async setAllReadStatus() {
      let res = await this.$http.post("/api/Message/SetReadAllStatus", {
        onlyUser: this.onlyUser,
      });
      if (res.Status) {
        this.$message.success("设置成功");
        this.reload();
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
    /**
     * 查看更多
     */
    toMoreMessages() {
      // if (this.onlyUser) {
      //   this.$router.push("/external/message");
      // } else {
      //   this.$router.push("/system/message");
      // }
      this.$router.push("/system/message")
    },
  },
  created() {
    this.getUnreadCount();
    this.getMessages();
  },
  computed: {
    // 外部只看发到user的消息     内部看这个员工收到的消息
    onlyUser() {
      return this.isExternal ? true : false;
    },
    unReadText() {
      if (this.unReadCount == 0) {
        return `未读`;
      }
      return `未读(${this.i})`;
    },
  },
});
</script>

<style lang="scss" scoped>
.message-box {
  max-width: 336px;
}

.bell-icon-out {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  margin: 0 0 0 8px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
    // border:1px solid rgba(0, 0, 0, 0.2);
    // background: #fafaff;
  }

  &.active {
    background: rgba(0, 0, 0, 0.15);
  }
}

.isWhite {
  color: white;
}

.isBlack {
  color: #000 !important;
}

.btns {
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
  border-top: 1px solid #f0f0f0;

  .opt-btn {
    text-align: center;
    height: 47px;
    line-height: 47px;
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }

  .split {
    border-left: 1px solid #f0f0f0;
  }
}
</style>
<style lang="scss">
.el-popover.message-icon-popper.el-popper {
  padding: 0px 0px 0px 0px;
}
</style>
