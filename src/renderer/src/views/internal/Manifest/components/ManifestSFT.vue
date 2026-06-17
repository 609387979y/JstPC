<template>
  <div>
    <!-- 发货人 -->
    <table class="mainifest-table">
      <caption style="border-top: 1px solid #ebeef5">
        请注意"收发通" 的代码填写规则。
        <template v-if="showTemplate">
          <el-button @click="saveToTemplate" type="text">此收发通存为模板</el-button>
          <div class="caption-right">
            <el-button @click="openSFTSelector" class="btn_right" type="text">选择收发通模板</el-button>
          </div>
        </template>
      </caption>
      <tbody>
        <tr>
          <td class="group-title" rowspan="6">发货人</td>
          <td class="row-title">国家代码</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="SH_CNTRY">
              <ManifestErrorTips field="SH_CNTRY">
                <el-select
                  v-model="form.SH_CNTRY"
                  filterable
                  placeholder="请选择国家代码"
                  @change="
                    getSFTCodeSelectList('SH_CNTRY', 'SH_CODE', 'fhrList', true)
                  "
                >
                  <el-option v-for="(val, key) in countryCode" :key="key" :label="key" :value="key">
                    <span>{{ val }}</span>
                  </el-option>
                </el-select>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">代码</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="SH_CODE">
              <ManifestErrorTips field="SH_CODE">
                <div style="display: flex; line-height: 32px; border: 0px">
                  <el-select clearable placeholder="请选择代码" v-model="form.SH_CODE_PREFIX">
                    <el-option v-for="item in fhrList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>+
                  <el-input
                    placeholder="请输入代码"
                    v-model="form.SH_CODE_SUFFIX"
                    @input="
                      form.SH_CODE_SUFFIX = inputToUp(form.SH_CODE_SUFFIX)
                    "
                  ></el-input>
                </div>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>

        <tr>
          <td class="row-title">名称</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="SH_NAME">
              <ManifestErrorTips field="SH_NAME">
                <el-input
                  placeholder="请输入名称"
                  v-model="form.SH_NAME"
                  @input="form.SH_NAME = inputToUp(form.SH_NAME)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">地址</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="SH_ADDR">
              <ManifestErrorTips field="SH_ADDR">
                <el-input
                  placeholder="请输入地址"
                  v-model="form.SH_ADDR"
                  @input="form.SH_ADDR = inputToUp(form.SH_ADDR)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">电话</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="SH_TEL">
              <ManifestErrorTips field="SH_TEL">
                <el-input
                  placeholder="请输入电话"
                  v-model="form.SH_TEL"
                  @input="form.SH_TEL = inputToUp(form.SH_TEL)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">AEO编码(选填)</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="SH_AEO">
              <ManifestErrorTips field="SH_AEO">
                <el-input
                  placeholder="请输入AEO编码"
                  v-model="form.SH_AEO"
                  @input="form.SH_AEO = inputToUp(form.SH_AEO)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 收货人 -->
    <table class="mainifest-table">
      <caption>
      TO ORDER 点此复制通知人
        <el-button type="text" @click="copyTzrToShr">复制</el-button>
      </caption>
      <tbody>
        <tr>
          <td class="group-title" rowspan="8">收货人</td>
          <td class="row-title">国家代码</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="CN_CNTRY">
              <ManifestErrorTips field="CN_CNTRY">
                <el-select
                  v-model="form.CN_CNTRY"
                  filterable
                  placeholder="请选择国家代码"
                  @change="
                    getSFTCodeSelectList('CN_CNTRY', 'CN_CODE', 'shrList', true)
                  "
                >
                  <el-option v-for="(val, key) in countryCode" :key="key" :label="key" :value="key">
                    <span>{{ val }}</span>
                  </el-option>
                </el-select>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">代码</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="CN_CODE">
              <ManifestErrorTips field="CN_CODE">
                <div style="display: flex; line-height: 32px; border: 0px">
                  <el-select clearable placeholder="请选择代码" v-model="form.CN_CODE_PREFIX">
                    <el-option v-for="item in shrList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>+
                  <el-input
                    placeholder="请输入代码"
                    v-model="form.CN_CODE_SUFFIX"
                    @input="
                      form.CN_CODE_SUFFIX = inputToUp(form.CN_CODE_SUFFIX)
                    "
                  ></el-input>
                </div>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>

        <tr>
          <td class="row-title">名称</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="CN_NAME">
              <ManifestErrorTips field="CN_NAME">
                <el-input
                  placeholder="请输入名称"
                  v-model="form.CN_NAME"
                  @input="form.CN_NAME = inputToUp(form.CN_NAME)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">地址</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="CN_ADDR">
              <ManifestErrorTips field="CN_ADDR">
                <el-input
                  placeholder="请输入地址"
                  v-model="form.CN_ADDR"
                  @input="form.CN_ADDR = inputToUp(form.CN_ADDR)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">电话</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="CN_TEL">
              <ManifestErrorTips field="CN_TEL">
                <el-input
                  placeholder="请输入电话"
                  v-model="form.CN_TEL"
                  @input="form.CN_TEL = inputToUp(form.CN_TEL)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">AEO编码(选填)</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="CN_AEO">
              <ManifestErrorTips field="CN_AEO">
                <el-input
                  placeholder="请输入AEO编码"
                  v-model="form.CN_AEO"
                  @input="form.CN_AEO = inputToUp(form.CN_AEO)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>

        <tr>
          <td class="row-title">具体联系人</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="CN_ATTN">
              <ManifestErrorTips field="CN_ATTN">
                <el-input
                  placeholder="请输入具体联系人"
                  v-model="form.CN_ATTN"
                  @input="form.CN_ATTN = inputToUp(form.CN_ATTN)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>

        <tr>
          <td class="row-title">联系人电话</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="CN_ATTN_TEL">
              <ManifestErrorTips field="CN_ATTN_TEL">
                <el-input
                  placeholder="请输入联系人电话"
                  v-model="form.CN_ATTN_TEL"
                  @input="
                    form.CN_ATTN_TEL = inputToUp(form.CN_ATTN_TEL)
                  "
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 通知人 -->
    <table class="mainifest-table">
      <caption>
        复制收货人信息到通知人栏目
        <el-button type="text" @click="copyShrToTzr">复制</el-button>
      </caption>
      <tbody>
        <tr>
          <td class="group-title" rowspan="6">通知人</td>
          <td class="row-title">国家代码</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="NT_CNTRY">
              <ManifestErrorTips field="NT_CNTRY">
                <el-select
                  v-model="form.NT_CNTRY"
                  filterable
                  placeholder="请选择国家代码"
                  @change="
                    getSFTCodeSelectList('NT_CNTRY', 'NT_CODE', 'tzrList', true)
                  "
                >
                  <el-option v-for="(val, key) in countryCode" :key="key" :label="key" :value="key">
                    <span>{{ val }}</span>
                  </el-option>
                </el-select>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">代码</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="NT_CODE">
              <ManifestErrorTips field="NT_CODE">
                <div style="display: flex; line-height: 32px; border: 0px">
                  <el-select clearable placeholder="请选择代码" v-model="form.NT_CODE_PREFIX">
                    <el-option v-for="item in tzrList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>+
                  <el-input
                    placeholder="请输入代码"
                    v-model="form.NT_CODE_SUFFIX"
                    @input="
                      form.NT_CODE_SUFFIX = inputToUp(form.NT_CODE_SUFFIX)
                    "
                  ></el-input>
                </div>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>

        <tr>
          <td class="row-title">名称</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="NT_NAME">
              <ManifestErrorTips field="NT_NAME">
                <el-input
                  placeholder="请输入名称"
                  v-model="form.NT_NAME"
                  @input="form.NT_NAME = inputToUp(form.NT_NAME)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">地址</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="NT_ADDR">
              <ManifestErrorTips field="NT_ADDR">
                <el-input
                  placeholder="请输入地址"
                  v-model="form.NT_ADDR"
                  @input="form.NT_ADDR = inputToUp(form.NT_ADDR)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">电话</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="NT_TEL">
              <ManifestErrorTips field="NT_TEL">
                <el-input
                  placeholder="请输入电话"
                  v-model="form.NT_TEL"
                  @input="form.NT_TEL = inputToUp(form.NT_TEL)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="row-title">AEO编码(选填)</td>
          <td class="cover-el-input">
            <el-form-item :rules="{ validator: validator, trigger: 'blur' }" prop="NT_AEO">
              <ManifestErrorTips field="NT_AEO">
                <el-input
                  placeholder="请输入AEO编码"
                  v-model="form.NT_AEO"
                  @input="form.NT_AEO = inputToUp(form.NT_AEO)"
                ></el-input>
              </ManifestErrorTips>
            </el-form-item>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <ManifestSFTSelectorVue @choose="chooseTpl" ref="sftSelector"></ManifestSFTSelectorVue>
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
import ManifestErrorTips from "./editor/ManifestErrorTips.vue"
import ManifestSFTSelectorVue from "./ManifestSFTSelector.vue";
export default defineComponent({
  props: {
    form: {
      type: Object,
      default: () => { },
    },
    type: {},
    /**
     * 显示模板相关功能
     */
    showTemplate: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ManifestErrorTips,
    ManifestSFTSelectorVue
  },
  inject: {
    validator: "manifest-form-validator"
  },
  data() {
    return {
      countryCode: country.countryCode,
      codeData: country.codeData,
      // 基础代码数据
      basicCode: ["ID", "PASSPORT", "8888", "9999"],
      fhrList: [],
      shrList: [],
      tzrList: [],

    };
  },
  methods: {
    set(object, key, value) {
      object[key] = value
    },
    // 获取收发通代码下拉列表
    getSFTCodeSelectList(cnCodeKey, codeKey, codeList, isChange) {
      this[codeList] = [];

      if (this.codeData[this.form[cnCodeKey]]) {
        // 在 codeData 中找到国家代码对应的值，把这些值赋值给代码的下拉
        let codes = this.codeData[this.form[cnCodeKey]];
        this[codeList] = codes.concat(this.basicCode);
      } else {
        // 在 codeData 中找不到对应的，取 代码中 + 之前的那个值
        if (
          this.form[codeKey] &&
          this.form[codeKey].split("+")[0]
        ) {
          this[codeList] = this.basicCode
            .slice(0)
            .unshift(this.form[codeKey].split("+")[0]);
        }
      }

      if (
        this.form[codeKey] &&
        this.form[codeKey].split("+")[0] &&
        !isChange
      ) {
        this.set(
          this.form,
          `${codeKey}_PREFIX`,
          this.form[codeKey].split("+")[0]
        );
      } else {
        
        // 国家 选择变化时
        // 判断如果为空 不做处理  非空默认选择第一个

        if(this.form[`${codeKey}_PREFIX`]){
          this.set(this.form, `${codeKey}_PREFIX`, this[codeList][0]);
        }else{
          this.set(this.form, `${codeKey}_PREFIX`, '');
        }
        

      }
      this.set(
        this.form,
        `${codeKey}_SUFFIX`,
        this.form[codeKey] && this.form[codeKey].split("+")[1]
          ? this.form[codeKey].split("+")[1]
          : ""
      );
    },
    inputToUp(val) {
      if (val == null || val == "") {
        return "";
      }
      var reg = /[^\x00-\xff]/gim;
      val = val.replace(reg, "");
      val = val.toString();
      return val.toUpperCase();
    },

    // 复制收货人信息到通知人栏目
    copyShrToTzr() {
      // 复制代码下拉选择列表
      this.tzrList = this.shrList.slice(0);

      // 复制其他信息
      this.form.NT_CNTRY = this.form.CN_CNTRY;
      this.form.NT_CODE = this.form.CN_CODE;
      this.form.NT_CODE_PREFIX = this.form.CN_CODE_PREFIX;
      this.form.NT_CODE_SUFFIX = this.form.CN_CODE_SUFFIX;

      this.form.NT_NAME = this.form.CN_NAME;
      this.form.NT_ADDR = this.form.CN_ADDR;
      this.form.NT_TEL = this.form.CN_TEL;
      this.form.NT_AEO = this.form.CN_AEO;
    },
        // 复制收货人信息到通知人栏目
    copyTzrToShr() {
      // 复制代码下拉选择列表
      this.tzrList = this.shrList.slice(0);

      // 复制其他信息
      this.form.CN_CNTRY = this.form.NT_CNTRY;
      this.form.CN_CODE = this.form.NT_CODE;
      this.form.CN_CODE_PREFIX = this.form.NT_CODE_PREFIX;
      this.form.CN_CODE_SUFFIX = this.form.NT_CODE_SUFFIX;

      this.form.CN_NAME = this.form.NT_NAME;
      this.form.CN_ADDR = this.form.NT_ADDR;
      this.form.CN_TEL = this.form.NT_TEL;
      this.form.CN_AEO = this.form.NT_AEO;
    },
    /**
     * 保存收发通模板
     */
    async saveToTemplate() {
      let { value } = await this.$prompt('请输入模板名称', '保存收发通模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入模板名称'
      });

      let res = await this.$http.post("/api/CargoEDISFTTemp/Create", {
        TempName: value,
        ...this.form
      });
      if (!res.Status) {
        this.$message.error(res.Message);
        return;
      }
      this.$message.success("保存成功")
    },

    chooseTpl(item) {
      // this.form
      let fieldPrefix = ["CompanyId", "EmployeeId", "Id", "UpdateTime", "CreateTime", "TempName"];

      for (let key in item) {
        if (fieldPrefix.indexOf(key) != -1) {
          continue;
        }
        this.set(
          this.form,
          key,
          item[key]
        );
      }
      if (item.SH_CODE) {
        let arr = item.SH_CODE.split("+");
        this.set(this.form, `SH_CODE_PREFIX`, arr[0]);
        this.set(this.form, `SH_CODE_SUFFIX`, arr[1]);
      }
      if (item.CN_CODE) {
        let arr = item.CN_CODE.split("+");
        this.set(this.form, `CN_CODE_PREFIX`, arr[0]);
        this.set(this.form, `CN_CODE_SUFFIX`, arr[1]);
      }
      if (item.NT_CODE) {
        let arr = item.NT_CODE.split("+");
        this.set(this.form, `NT_CODE_PREFIX`, arr[0]);
        this.set(this.form, `NT_CODE_SUFFIX`, arr[1]);
      }

    },
    // 打开选择dialog
    openSFTSelector() {
      this.$refs.sftSelector.openSelector()
    }
  },
  created() {


  },
  mounted() {
    //初始化代码
    if (this.type != 0) {
      setTimeout(() => {
        this.getSFTCodeSelectList("SH_CNTRY", "SH_CODE", "fhrList", true);
        this.getSFTCodeSelectList("CN_CNTRY", "CN_CODE", "shrList", true);
        this.getSFTCodeSelectList("NT_CNTRY", "NT_CODE", "tzrList", true);
      }, 100);
    }

  },
  computed: {},
  watch: {
    "form.SH_CODE_PREFIX"(val) {
      if (this.form.SH_CODE_SUFFIX) {

        this.form.SH_CODE = val + "+" + this.form.SH_CODE_SUFFIX;
      } else {
        this.form.SH_CODE = val;
      }
    },
    "form.SH_CODE_SUFFIX"(val) {
      if (val) {
        this.form.SH_CODE = this.form.SH_CODE_PREFIX + "+" + val;
      } else {
        this.form.SH_CODE = this.form.SH_CODE_PREFIX;
      }
    },
    "form.CN_CODE_PREFIX"(val) {
      if (this.form.CN_CODE_SUFFIX) {
        this.form.CN_CODE = val??"" + "+" + this.form.CN_CODE_SUFFIX;
      } else {
        this.form.CN_CODE = val??"";
      }
    },
    "form.CN_CODE_SUFFIX"(val) {
      if (val) {
        this.form.CN_CODE = this.form.CN_CODE_PREFIX + "+" + val??"";
      } else {
        this.form.CN_CODE = this.form.CN_CODE_PREFIX;
      }
    },
    "form.NT_CODE_PREFIX"(val) {
      if (this.form.NT_CODE_SUFFIX) {
        this.form.NT_CODE = val??"" + "+" + this.form.NT_CODE_SUFFIX;
      } else {
        this.form.NT_CODE = val??"";
      }
    },
    "form.NT_CODE_SUFFIX"(val) {
      if (val) {
        this.form.NT_CODE = this.form.NT_CODE_PREFIX + "+" + val??"";
      } else {
        this.form.NT_CODE = this.form.NT_CODE_PREFIX;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/mainifest/mainifestStyle.scss";

.mainifest-table {
  :deep(.el-input__inner) {
    border: none;
  }
  caption {
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    text-align: center !important;
    color: #000 !important;
    caption-side: top;
    line-height: 32px;
    height: 32px;
    background-color: #f2f3f5;
    .btn_right {
      right: 0;
    }
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

  :deep(.el-form-item--small.el-form-item) {
    margin-bottom: 0px;
  }
  :deep(.el-form-item.is-error) {
    background-color: #f9eeea;
  }
  :deep(.el-input__inner) {
    background: rgba(0, 0, 0, 0);
  }
}
.caption-right {
  position: absolute;
  right: 10px;
  top: 0px;
}
</style>