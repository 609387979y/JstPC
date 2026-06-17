<template>
  <div class="update-status" :title="date" :class="custom ? customclassName : className">{{ custom ? customText : dateText }}
  </div>

</template>

<script>
import { defineComponent } from "vue";
import dayjs from "dayjs";
export default defineComponent({
  props: {
    date: {
      type: String,
      default: "",
    },
    custom: {
      type: Boolean,
      default: false
    },
    customText: {
      type: String,
      default: ""
    },
    customclassName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    className() {
      const date = dayjs(this.date);
      const today = dayjs();
      // 判断时间
      const pastMinutes = today.diff(date, "minute");
      const pastDay = today.diff(date, "day");
      if (pastMinutes <= 60) {
        return "latest";
      } else if (pastMinutes > 60 && pastMinutes <= 300) {
        return "over_1_hour";
      } else if (pastMinutes > 60 && pastMinutes <= 180) {
        return "over_5_hour";
      } else if (
        pastMinutes > 180 &&
        today.format("YYYY-MM-DD") == date.format("YYYY-MM-DD")
      ) {
        // 大于3个小时 但是在今天内
        return "in_today";
      } else if (pastDay > 1 && pastDay <= 3) {
        return "before_today";
      } else if (pastDay > 3 && pastDay <= 7) {
        return "before_3_day";
      } else {
        return "before_7_day";
      }
    },
    dateText() {
      let text = ``;
      switch (this.className) {
        case "latest":
          text = "刚刚更新";
          break;
        case "over_1_hour":
          text = "1小时前";
          break;
        case "over_5_hour":
          text = "5小时前";
          break;
        case "in_today":
          text = "今日更新";
          break;
        case "before_today":
          text = "昨天更新";
          break;
        case "before_3_day":
          text = "3天前";
          break;
        case "before_7_day":
          text = "超过7天";
          break;
      }
      return text;
    },
  },
  methods: {},
  mounted() { },
});
</script>

<style lang="scss" scoped>
// 更新状态标签
.update-status {
  font-size: 12px;
  color: #ffffff;
  letter-spacing: -0.86px;
  line-height: 20px;
  padding: 0 4px;
  display: inline-block;
  border-radius: 2px;
}

.latest {
  background: #67c23a;
}

.over_1_hour {
  background: #f7b500;
}

.over_5_hour {
  background: #3a8ee6;
}

.in_today {
  background: #ef4333;
}

.before_today {
  background: #c8c9cc;
}

.before_7_day {
  background: #dcdfe6;
}

.before_3_day {
  background: #dcdfe6;
}

.just-now {
  background: #67c23a;
}

.one-hour {
  background: #f7b500;
}

.five-hour {
  background: #3a8ee6;
}

.today {
  background: #ef4333;
}

.yesteday {
  background: #c8c9cc;
}
</style>
