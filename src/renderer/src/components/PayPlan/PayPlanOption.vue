<template>
    <div class="option-item">
      <div class="option-content">
        <div class="option-info">
          <img class="option-icon" src="@/assets/payplan-icon.svg" alt="">
          <div>
            <slot></slot>
          </div>
        </div>
        <div @click="onTap" class="option-button"  :class="disabled?'disabled':''">{{ btnText }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue"
  export default defineComponent({
    name: 'PayPlanOption',
    props: {
      // 是否禁用按钮
      disabled: {
        type: Boolean,
        default: false
      },
      // 按钮文本
      btnText: {
        type: String,
        required: true
      }
    },
    methods: {
      onTap() {
        if (this.disabled) {
          return;
        }
        this.$emit('btnClick');
      }
    }
  });
  </script>
  
  <style lang="scss" scoped>
  .option-item {
    height: 71px;
    padding: 0 12px;
    background-image: linear-gradient(90deg, #F1F8FF 0%, #FDFEFE 100%);
    border: 1px solid rgba(205, 221, 255, 1);
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
  
  .option-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .option-button {
    background: #FFFFFF;
    border: 1px solid rgba(205, 221, 255, 1);
    border-radius: 31px;
    font-size: 14px;
    color: #212121;
    letter-spacing: -1.14px;
    font-weight: 400;
    padding: 5px 16px;
    cursor: pointer;
    &:hover{
      opacity: 0.8;
    }
    &.disabled{
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  

  
  .option-info {
    display: flex;
    align-items: center;
  }
  
  .option-icon {
    width: 13px;
    height: 13px;
    margin-top: 2px;
    margin-right: 12px;
  }
  
  .option-title {
    font-size: 14px;
    color: #212121;
    letter-spacing: -1.14px;
    font-weight: 600;
  }
  
  .option-sub {
    font-size: 12px;
    color: #212121;
    letter-spacing: -0.98px;
    font-weight: 400;
    margin-top: 10px;
  }
  </style>