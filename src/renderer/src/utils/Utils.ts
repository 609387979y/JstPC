/**
 * 返回与当前日期相差 day 天数的日期字符串
 * 格式为 yyyy-MM-dd
 * @param {*} gap 相差天数 负数代表day天前，正数代表day天后，不传返回当前日期字符串
 */
function getDate(gap: number) {
  let date = new Date();

  if (gap) {
    date = new Date(date.getTime() + gap * 24 * 3600 * 1000);
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
/**
 * 日期字符串最小保留到日
 *
 *
 */
function formaDate(date: string) {
  var newDate: any = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date);
  newDate = newDate[0];
  return newDate;
}
/**
 * 横杠替换斜杠
 *
 *
 */
function replaceHg(e: string) {
  let text = e.replace("-", "/");
  return text;
}
/**
 * 是否是及时通客户端内嵌的页面
 */
function isFromJustomClient() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf(" electron/") > -1) {
    return true;
  }
  return false
}

export default {
  getDate,
  formaDate,
  replaceHg,
  isFromJustomClient,
};
