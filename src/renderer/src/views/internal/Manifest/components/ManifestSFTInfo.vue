<template>
  <div>
    <!-- 发货人 -->
    <table class="mainifest-table">
      <caption style="border-top: 1px solid #dcdfe6">
        <div class="caption-right"></div>
      </caption>
      <tbody>
        <tr>
          <td class="group-title" rowspan="6">发货人</td>
          <td class="row-title">国家代码</td>
          <td class="td-content">{{ form.SH_CNTRY }}</td>
        </tr>
        <tr>
          <td class="row-title">代码</td>
          <td class="td-content">{{ form.SH_CODE }}</td>
        </tr>

        <tr>
          <td class="row-title">名称</td>
          <td class="td-content">{{ form.SH_NAME }}</td>
        </tr>
        <tr>
          <td class="row-title">地址</td>
          <td class="td-content">{{ form.SH_ADDR }}</td>
        </tr>
        <tr>
          <td class="row-title">电话</td>
          <td class="td-content">{{ form.SH_TEL }}</td>
        </tr>
        <tr>
          <td class="row-title">AEO编码(选填)</td>
          <td class="td-content">{{ form.SH_AEO }}</td>
        </tr>
      </tbody>
    </table>
    <!-- 收货人 -->
    <table class="mainifest-table">
      <caption>
        <div class="caption-right"></div>
      </caption>
      <tbody>
        <tr>
          <td class="group-title" rowspan="8">收货人</td>
          <td class="row-title">国家代码</td>
          <td class="td-content">{{ form.CN_CNTRY }}</td>
        </tr>
        <tr>
          <td class="row-title">代码</td>
          <td class="td-content">{{ form.CN_CODE }}</td>
        </tr>

        <tr>
          <td class="row-title">名称</td>
          <td class="td-content">{{ form.CN_NAME }}</td>
        </tr>
        <tr>
          <td class="row-title">地址</td>
          <td class="td-content">{{ form.CN_ADDR }}</td>
        </tr>
        <tr>
          <td class="row-title">电话</td>
          <td class="td-content">{{ form.CN_TEL }}</td>
        </tr>
        <tr>
          <td class="row-title">AEO编码(选填)</td>
          <td class="td-content">
            {{ form.CN_AEO }}
          </td>
        </tr>

        <tr>
          <td class="row-title">具体联系人</td>
          <td class="td-content">
            {{ form.CN_ATTN }}
          </td>
        </tr>

        <tr>
          <td class="row-title">联系人电话</td>
          <td class="td-content">
            {{ form.CN_ATTN_TEL }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 通知人 -->
    <table class="mainifest-table">
      <caption>
        <div class="caption-right"></div>
      </caption>
      <tbody>
        <tr>
          <td class="group-title" rowspan="6">通知人</td>
          <td class="row-title">国家代码</td>
          <td class="td-content">
            {{ form.NT_CNTRY }}
          </td>
        </tr>
        <tr>
          <td class="row-title">代码</td>
          <td class="td-content">
            {{ form.NT_CODE }}
          </td>
        </tr>

        <tr>
          <td class="row-title">名称</td>
          <td class="td-content">
            {{ form.NT_NAME }}
          </td>
        </tr>
        <tr>
          <td class="row-title">地址</td>
          <td class="td-content">
            {{ form.NT_ADDR }}
          </td>
        </tr>
        <tr>
          <td class="row-title">电话</td>
          <td class="td-content">
            {{ form.NT_TEL }}
          </td>
        </tr>
        <tr>
          <td class="row-title">AEO编码(选填)</td>
          <td class="td-content">
            {{ form.NT_AEO }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  computed,
  watch,
} from "vue";
import country from "./country";

export default defineComponent({
  props: {
    form: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 基础代码数据
      basicCode: ["ID", "PASSPORT", "8888", "9999"],
    };
  },
  methods: {},
  created() {},
});
</script>

<style lang="scss" scoped>
@import "@/styles/mainifest/mainifestStyle.scss";

.mainifest-table {
  caption {
    text-align: center !important;
    color: #000 !important;
    border: 1px solid #dcdfe6;
    border-bottom: none;
    border-top: none;
  }

  .group-title {
    @include field-title;
    width: 114px;
  }
  .row-title {
    @include field-title;
    text-align: left;
    padding-left: 5px;
    width: 114px;
    height: 32px !important;
    line-height: 32px !important;
  }
}
.td-content {
  padding: 10px;
}
</style>