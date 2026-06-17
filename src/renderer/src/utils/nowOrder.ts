import dayjs from "dayjs";
import { reactive, computed, ref } from "vue";
import { utils } from "justom-share";

/***
 * 倒计时
 */
export function useTimeCountDown() {
  function getCountDownText(s: number): string {
    let hours = Math.round((s - 30 * 60) / (60 * 60));
    let minutes = Math.round((s - 30) / 60) % 60;
    let seconds = s % 60;
    return (
      (minutes > 0 ? minutes + "分钟" : "") +
      (seconds > 0 ? seconds + "秒" : "")
    );
  }

  /**
   * 开启一个倒计时
   * @param seconds  倒计时时间
   * @returns
   */
  function startBySeconds(seconds: number = 15 * 60) {
    return startByCreateTime(dayjs().format("YYYY-MM-DD HH:mm:ss"), seconds);
  }

  /**
   * 通过创建日期开始倒计时
   * @param createTime 创建时间
   * @param limitSeconds 几秒后结束
   * @returns
   */
  function startByCreateTime(
    createTime: string,
    limitSeconds: number = 15 * 60,
    currentTime:string = ""
  ) {
    if(currentTime === ""){
      currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    }
    // 创建时间 + limitSeconds = 结束时间
    let endTime = dayjs(createTime).add(limitSeconds, "second");
    // 结束时间 - 当前时间 = 剩余时间
    const leftSeconds = ref(endTime.diff(dayjs(currentTime), "second"));
    // 倒计时
    const interval = setInterval(() => {
      leftSeconds.value =leftSeconds.value-1;
      if (leftSeconds.value <= 0) {
        clearInterval(interval);
      }
    },1000);
    return computed<string>(() => {
      return getCountDownText(leftSeconds.value);
    });
  }

  return reactive({
    startByCreateTime,
    startBySeconds,
  });
}

/**
 * 处理金额
 */
export function parseAmount(row: any) {
  // cnttype

  row.Box_20GP = "--";
  row.Box_20GP_Stock = "";
  row.Box_40GP = "--";
  row.Box_20GP_Stock = "";
  row.Box_40HQ = "--";
  row.Box_20GP_Stock = "";
  row.Box_45HQ = "--";
  row.Box_20GP_Stock = "";
  row.Box_40NOR = "--";
  row.Box_20GP_Stock = "";

  let fields = {
    price: "seaprice",
    priceCurrency: "seapricemnyno",
    count: "cncount",
  };

  if (row.number != undefined) {
    fields.price = "oceanfreight";
    fields.priceCurrency = "USD";
    fields.count = "number";
  }

  switch (row.cnttype) {
    // 20GP
    case 1:
      row.Box_20GP = utils.formatAmount(
        row[fields.price],
        row[fields.priceCurrency] ?? "USD"
      );
      row.Box_20GP_Stock = `舱位：${row[fields.count]}`;
      break;
    // 40GP
    case 2:
      row.Box_40GP = utils.formatAmount(
        row[fields.price],
        row[fields.priceCurrency] ?? "USD"
      );
      row.Box_40GP_Stock = `舱位：${row[fields.count]}`;
      break;
    // 40HQ
    case 3:
      row.Box_40HQ = utils.formatAmount(
        row[fields.price],
        row[fields.priceCurrency] ?? "USD"
      );
      row.Box_40HQ_Stock = `舱位：${row[fields.count]}`;
      break;
  }
}
