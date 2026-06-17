<template>
  <div>
    <input type="file" @change="inputChange" ref="fileInput"   :accept="accept"  hidden />
    <div @click="areaClick" :style="areaStyle" ref="drag" class="drag-area">
      <div v-if="list.length == 0" class="empty-container">
        <slot name="empty">
          <div class="empty-content">
            <div>
              <!-- <i class="icon el-icon-upload"></i> -->
              <img style="width:60px" src="@/assets/images/l-excel.svg" alt="">
            </div>
            <div style="margin-top: 5px" class="remark">
              {{ text.emptyRemark }}
            </div>
            <div>
              <el-button @click.stop="triggerUploadDialog" size="small" type="text">
                <span style="text-decoration:underline;color:#fd953e">{{ text.emptyBtnText }}</span>
              </el-button>
            </div>
          </div>
        </slot>
      </div>
      <div v-else>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    areaStyle: {
      type: Object,
      default: () => {
        return {
          height: "300px",
          cursor: "pointer",
        };
      },
    },
    text: {
      type: Object,
      default: () => {
        return {
          emptyBtnText: "或点击添加文件",
          emptyRemark: "将托书文件拖拽到此处",
        };
      },
    },
    accept:{
      type:String,
      default:"*/*"
    },
    list:{
      type:Array,
      default:()=>[]
    }
  },
  components: {},
  data() {
    return {

    };
  },
  methods: {
    // 捕获拖拽事件
    handleDragEvent(){
      this.$refs.fileInput.value=""
      this.$refs.drag.ondragleave = (e) => {
        e.preventDefault(); // 阻止离开时的浏览器默认行为
      };
      this.$refs.drag.ondrop = (e) => {
        e.preventDefault();
        this.upload(e.dataTransfer.files)
      };
      this.$refs.drag.ondragenter = (e) => {
        e.preventDefault();
        this.$refs.drag.borderColor = "#409eff";

      };
      this.$refs.drag.ondragover = (e) => {
        e.preventDefault();

      };
    },
    // 触发上传文件的点击事件
    triggerUploadDialog(){
      this.$refs.fileInput.value=""
      this.$refs.fileInput.click();
    },
    // 点击区域
    areaClick(){
      if(this.list.length != 0){
        return;
      }
      this.triggerUploadDialog();
    },
    inputChange(e){
      if(e.target.files == null || e.target.files.length == 0){
        return;
      }
      this.upload(e.target.files);
    },
    upload(files){
      this.$emit("upload",files);
    },



  },
  mounted() {
    this.handleDragEvent();
  },
};
</script>

<style lang='scss' scoped>
.drag-area {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 100%;
  min-height: 50px;

  &:hover {
    border-color: #409eff;
  }
}
.empty-container {
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
}
.empty-content {
  margin: 0 auto;
  text-align: center;
  .icon {
    font-size: 60px;
    color: #ecebeb;
  }
}
.remark {
  color: #909399;
  font-size: 12px;
}
</style>
