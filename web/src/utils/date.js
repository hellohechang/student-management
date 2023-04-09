//templete:时间格式，timestamp：时间戳 不传默认当前时间
export function formatTime(templete, timestamp) {
  templete ? null : templete = "{0}年{1}月{2}日 {3}时{4}分{5}秒 星期{6}"
  let currentDate = timestamp ? new Date(+timestamp) : new Date();
  let year = currentDate.getFullYear(),
    month = currentDate.getMonth() + 1,
    date = currentDate.getDate(),
    hour = currentDate.getHours(),
    minute = currentDate.getMinutes(),
    second = currentDate.getSeconds(),
    weekArr = ["日","一","二","三","四","五","六"],
    n_day = currentDate.getDay();
  let formattedDateString = `${year}-${month}-${date}-${hour}-${minute}-${second}-${n_day}`,
    timeArr = formattedDateString.match(/\d+/g);
    return templete.replace(/\{(\d+)\}/g, (...arg) => {
    if(arg[1] === '6'){
      return weekArr[timeArr[arg[1]]]
    }else{
      let time = timeArr[arg[1]] || "00";
      return time.length < 2 ? "0" + time : time;
    }
  });
}
/**
* 计算天数
* @param time
*/
export function calculateDays(time) {
  if (!time) return ''
  else {
      let day = Math.floor(new Date().getTime() / 1000) - (new Date(+time)
                  .getTime() /
              1000),
          day2 = Math.floor(day / (24 * 3600));
      return day2
  }

}

