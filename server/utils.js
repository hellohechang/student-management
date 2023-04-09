const fs = require('fs')
// token加密
const jwt = require('jsonwebtoken');

// 客户端ip获取
function getClientIp(req) {
  let ip = '';
  try {
    ip = req.headers["x-forwarded-for"] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      "";
  } catch (error) {
    ip = '';
  }
  let reg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/;
  ip = ip.match(reg);
  return ip ? ip[0] : '0.0.0.0';
}
// 格式化当前日期或时间戳日期
function newDate(templete, timestamp) {
  templete ? null : (templete = "{0}年{1}月{2}日 {3}时{4}分{5}秒 星期{6}");
  let currentDate = timestamp ? new Date(+timestamp) : new Date();
  let year = currentDate.getFullYear(),
    month = currentDate.getMonth() + 1,
    date = currentDate.getDate(),
    hour = currentDate.getHours(),
    minute = currentDate.getMinutes(),
    second = currentDate.getSeconds(),
    weekArr = ["日", "一", "二", "三", "四", "五", "六"],
    n_day = currentDate.getDay();
  let formattedDateString = `${year}-${month}-${date}-${hour}-${minute}-${second}-${n_day}`,
    timeArr = formattedDateString.match(/\d+/g);
  return templete.replace(/\{(\d+)\}/g, (...arg) => {
    if (arg[1] === "6") {
      return weekArr[timeArr[arg[1]]];
    } else {
      let time = timeArr[arg[1]] || "00";
      return time.length < 2 ? "0" + time : time;
    }
  });
}

// 用户密码二次加密
function encryption(str) {
  return str.slice(10, -10).split('').reverse().join('');
}
//处理返回的结果
function _send(res, options) {
  res.status(200);
  res.type('application/json');
  res.send(Object.assign({
    status: 200,
    message: 'OK',
    result: null
  }, options));
}
function _success(res, message = "操作成功~", result = null) {
  _send(res, {
    result,
    message
  });
}
function _nologin(res) {
  _send(res, {
    status: 2,
    message: `当前未登录，请登录后再操作~`
  });
}
function _nothing(res) {
  _send(res, {
    status: 3,
  });
}
function _err(res, message = "操作失败，请稍后再试~", result = null) {
  _send(res, {
    status: 1,
    message,
    result
  });
}
// 定时器
function _setTimeout(callback, time) {
  let timer = setTimeout(() => {
    clearTimeout(timer)
    timer = null;
    callback()
  }, time);
  return timer;
}
let myconfig = require('./config')
// 生成token
function jwten(id) {
  return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3), id }, myconfig.tokenKey)
}
// 解密token
function jwtde(token) {
  try {
    let obj = jwt.verify(token, myconfig.tokenKey);
    return obj
  } catch (error) {
    return {}
  }
}
function nanoid() {
  return (+(Date.now() + Math.random().toFixed(5).slice(-5))).toString(16);
}
// 混合排序
function mixedSort(a, b) {
  if (/^\d+/.test(a) && /^\d+/.test(b)) {
    return /^\d+/.exec(a) - /^\d+/.exec(b);
  } else if (isChinese(a) && isChinese(b)) {
    return a.localeCompare(b, 'zh-CN')
  } else {
    return a.localeCompare(b, 'en');
  }
}
function isChinese(str) {
  if (/^[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]+/.test(str)) {
    return true;
  } else {
    return false;
  }
}
module.exports = {
  mixedSort,
  getClientIp,
  newDate,
  encryption,
  _send,
  _success,
  _nologin,
  _nothing,
  _err,
  _setTimeout,
  jwten,
  jwtde,
  nanoid
}
