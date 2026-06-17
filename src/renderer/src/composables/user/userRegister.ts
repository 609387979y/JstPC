import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";
import { utils } from "justom-share";
import request from "@/public/request";

/**
 * 用户注册 Step1:  验证手机号
 * @returns
 */
export function useUserRegisterMobilePhone(success: (token: string) => any) {
  // 锁定发送验证码按钮
  const disabledSendVerCode = ref(true);
  const rules = reactive({
    mobilePhone: [
      {
        message: "请输入正确的手机号",
        validator: (rule:any, value:string, callback:Function) => {
          if (utils.checkMobilePhone(value)) {
            callback();
            if (
              disabledSendVerCode.value == true
            ) {
              disabledSendVerCode.value = false;
            }
          } else {
            callback(new Error("请输入正确的手机号"));
            disabledSendVerCode.value = true;
          }
        },
        trigger: "blur",
      },
    ],
    verCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  });

  const data = ref({
    mobilePhone: "",
    verCode: "",
    read: false,
  });

  // 提交按钮锁定状态
  const submitButtonLock = computed(() => {
    // 手机/验证码/条款勾选  ->  可以点击提交按钮
    if (data.value.mobilePhone && data.value.verCode) {
      return false;
    }
    return true;
  });

  /**
   * 发送手机验证码
   */
  async function sendVerCode() {
    if (utils.checkMobilePhone(data.value.mobilePhone) == false) {
      ElMessage.warning("请输入正确的手机号");
      return;
    }
    disabledSendVerCode.value = true;
    let res = await request.post("/api/UserVerCode/SendVerCode", {
      mobilePhone: data.value.mobilePhone,
      type: 2,
    });
    if (res.Status) {
      ElMessage.success("验证码发送成功");
      setTimeout(() => {
        // 一分钟后解锁
        disabledSendVerCode.value = false;
      }, 60000);
      return true;
    } else {
      ElMessage.error(res.Message);
      // 出现错误 马上解锁
      disabledSendVerCode.value = false;
      return false;
    }
  }

  const formRef = ref<any>(null);
  async function submit(skipValidate: boolean = false) {

    // if (skipValidate == false) {
    //   await formRef.value.validate();
    // }

    // let res = await request.post("/api/AuthUser/StartRegister", {
    //   mobilePhone: data.value.mobilePhone,
    //   verCode: data.value.verCode,
    // });

    // if (!res.Status) {
    //   ElMessage.error(res.Message);
    //   return;
    // }

    // // 验证通过  前往第二步验证
    // success(res.Data);
  }


  return {
    rules,
    data,
    submitButtonLock,
    disabledSendVerCode,
    sendVerCode,
    submit,
    formRef
  };
}
