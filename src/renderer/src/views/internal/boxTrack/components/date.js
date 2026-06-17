function TimeDate(str) {
    let date = new Date(str);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = Math.Mmonth < 10 ? ('0' + month) : month;
    let day = date.getDate();
    day = day < 10 ? ('0' + day) : day;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;

}
export {
    TimeDate
}