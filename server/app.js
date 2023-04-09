const os = require("os");

const express = require("express");

const app = express();

const bodyParser = require("body-parser");

// 获取访问设备信息
const UAParser = require("ua-parser-js");

// 操作SQLite数据库
let { queryData } = require('./sqlite.js');

let {
  getClientIp,
  _err,
  jwtde,
} = require('./utils')
let myconfig = require('./config')
app.listen(myconfig.port, () => {
  let arr = getLocahost().map(item => `http://${item}${myconfig.port == 80 ? '' : `:${myconfig.port}`}`)
  console.log(`服务开启成功，访问地址为：\n${arr.join('\n')}`);
})

//设置bodyParser
app.use(bodyParser.json({ limit: "50mb", parameterLimit: 1000000 }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 1000000,
    extended: false,
  })
);

//访问拦截
app.use(async (req, res, next) => {
  try {
    let _token = req.headers['token'],//读取token
      uobj = {},
      obj = jwtde(_token);//解密token
      let userinfo = await queryData('sys_user', '*', `WHERE id = ? AND status=?`, [ obj.id,'1']);
    if (userinfo.length > 0) {
      uobj = userinfo[0];
    }
    req._userInfo = uobj;
    req._ip = getClientIp(req);
    req._pathUrl = req.url.split('?')[0];
    let _clientConfig = new UAParser(req.headers['user-agent']).getResult();//获取访问设备信息
    req._os = (_clientConfig.os.name || 'other') + (_clientConfig.device.vendor ? `(${_clientConfig.device.vendor || ''} ${_clientConfig.device.model || ''})` : '');
    next();
  } catch (error) {
    console.log(error);
    _err(res)
  }
});

app.use('/user', require('./routes/user'))
app.use('/role', require('./routes/role'))
app.use('/student', require('./routes/student'))
app.use('/teacher', require('./routes/teacher'))
app.use('/course', require('./routes/course'))
app.use('/gradeclass', require('./routes/gradeclass'))
app.use('/scores', require('./routes/scores'))

app.use(express.static(__dirname + '/dist'))
// 获取本地ip地址
function getLocahost() {
  let obj = os.networkInterfaces()
  let arr = []
  Object.keys(obj).forEach(item => {
    let value = obj[item]
    if (Object.prototype.toString.call(value).slice(8, -1) === 'Array') {
      arr = [...arr, ...value.filter(item => item.family == 'IPv4').map(item => item.address)]
    }
  })
  return arr;
}