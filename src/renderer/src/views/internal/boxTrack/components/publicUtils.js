/** 按最小值排序,从小到大 */
export function minSort(arr, key) {
    let list = arr;
    function compare(a, b) {
        // 使用 toUpperCase() 忽略字符大小写 
        const bandA = a[key]
        const bandB = b[key]
        let comparison = 0;
        if (bandA > bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison;
    }
    list.sort(compare);
    return list
}
/** 按最大值排序，从大到小 */
export function maxSort(arr, key) {
    let list = arr;
    function compare2(a, b) {
        // 使用 toUpperCase() 忽略字符大小写 
        const bandA = a[key]
        const bandB = b[key]

        let comparison = 0;
        if (bandA > bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison * -1;
    }
    list.sort(compare2);
    return list
}
/** 获取当前日期的周数 */
export function getDay(day) {
    let str1 = "";
    var week = new Date(day).getDay();
    switch (week) {
        case 0:
            str1 = "周日";
            break;
        case 1:
            str1 = "周一";
            break;
        case 2:
            str1 = "周二";
            break;
        case 3:
            str1 = "周三";
            break;
        case 4:
            str1 = "周四";
            break;
        case 5:
            str1 = "周五";
            break;
        case 6:
            str1 = "周六";
            break;
    }
    return str1;
}
/** 获取周数的开始和结束日，getMonday("s", 0)代表本周的起始日*/
export function getMonday(type, dates) {
    var now = new Date();
    var nowTime = now.getTime();
    var day = now.getDay();
    var longTime = 24 * 60 * 60 * 1000;
    var n = longTime * 7 * (dates || 0);
    if (type == "s") {
        var dd = nowTime - (day - 1) * longTime + n;
    };
    if (type == "e") {
        var dd = nowTime + (7 - day) * longTime + n;
    };
    dd = new Date(dd);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    var day = y + "-" + m + "-" + d;
    return day;
};
/** 获取指定的日期，返回格式YYYY-MM-DD */
export function getDate(date, day) {
    let currentDate = new Date(date).getTime() + 1000 * 36 * 2400 * parseInt(day) - 1000 * 60 * 60 * 8;
    var time = new Date(currentDate);
    let y = time.getFullYear();
    let m = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
    let d = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    let h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    let mm = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    let s = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
    return `${y}-${m}-${d} ${h}:${mm}:${s}`
}
/**防抖方法，其中形参fn为要执行的方法，wait则代表时间间隔,v2使用方法：methods:debounce(()=>{},500),v3使用方法:const methods=debounce(()=>{},500)*/
export function debounce(fn, wait) {
    var timer = null;
    return function () {
        var _that = this;
        clearTimeout(timer)
        timer = setTimeout(function () {
            fn.apply(_that, arguments) //更改this指向，使this指向它的调用层
        }, wait)
    }
}
/**节流方法，其中形参fn为要执行的方法，wait则代表时间间隔,v2使用方法：methods:throttle(()=>{},500),v3使用方法:const methods=throttle(()=>{},500)*/
export function throttle(fn, wait) {
    var timeout, startTime = new Date();
    return function () {
        var _that = this;
        var curTime = new Date();
        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= wait) {
            fn.apply(_that, arguments);//更改this指向，使this指向它的调用层
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            timeout = setTimeout(function () {
                fn.apply(_that, arguments);//更改this指向，使this指向它的调用层
            }, wait);
        }
    };
}
/* 获取指定元素中的所有内容 */
export function filterElement(msg, el) {
    let elReg = new RegExp("<" + el + "[\\s\\S]*<\\/" + el + ">");
    console.log(elReg);
    let newEl = elReg.exec(msg);
    return newEl[0] ? newEl[0] : null
}
/* 字符串转base64 */
export function enCode(str) {
    var encode = encodeURI(str);
    var base64 = btoa(encode);
    return base64;
}
/* base64转字符串 */
export function deCode(base64) {
    var decode = atob(base64);
    var str = decodeURI(decode);
    return str;
}