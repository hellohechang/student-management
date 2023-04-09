let express = require('express'),
  route = express.Router();

const { queryData, insertData, runSqlite, deleteData, updateData } = require('../sqlite');
const { _err, encryption, _setTimeout, nanoid, jwten, _success, _nologin } = require('../utils');

// queryData('user', 'id').then(() => { }).catch(async () => {
//   try {
//     await runSqlite(`CREATE TABLE user (
//       id           TEXT PRIMARY KEY
//                         UNIQUE
//                         NOT NULL,
//       name         TEXT,
//       password     TEXT,
//       sex          TEXT DEFAULT (0),
//       email        TEXT,
//       phone        TEXT,
//       departmentId TEXT NOT NULL,
//       jobId        TEXT NOT NULL,
//       [desc]       TEXT,
//       time         TEXT,
//       state        TEXT DEFAULT (0) 
//   );`)
//     await runSqlite(`CREATE TABLE department (
//       id     TEXT PRIMARY KEY
//                   UNIQUE
//                   NOT NULL,
//       name   TEXT,
//       [desc],
//       time   TEXT,
//       state  TEXT DEFAULT (0) 
//   );`)
//     await runSqlite(`CREATE TABLE job (
//       id     TEXT PRIMARY KEY
//                   UNIQUE
//                   NOT NULL,
//       name   TEXT,
//       [desc] TEXT,
//       power  TEXT,
//       time   TEXT,
//       state  TEXT DEFAULT (0) 
//   );`)
//     await runSqlite(`CREATE TABLE customer (
//     id           TEXT PRIMARY KEY
//                       UNIQUE
//                       NOT NULL,
//     name         TEXT,
//     sex          TEXT DEFAULT (0),
//     email        TEXT,
//     phone        TEXT NOT NULL,
//     QQ           TEXT,
//     weixin       TEXT,
//     type         TEXT,
//     address      TEXT,
//     userId       TEXT NOT NULL,
//     departmentId TEXT NOT NULL,
//     time         TEXT,
//     state        TEXT DEFAULT (0) 
//   );`)
//     await runSqlite(`CREATE TABLE visit (
//       id         TEXT PRIMARY KEY
//                       UNIQUE
//                       NOT NULL,
//       customerId TEXT NOT NULL,
//       visitText  TEXT NOT NULL,
//       visitTime  TEXT NOT NULL,
//       time       TEXT,
//       state      TEXT DEFAULT (0) 
//   );`)
//     let id = nanoid();
//     await insertData('department', [{
//       "id": id,
//       "name": "总裁办",
//       "desc": "公司最高组织机构层，负责公司全面运营管理",
//       "time": 1568640222269,
//       "state": 0
//     }])
//     await insertData('job', [{
//       "id": 'root',
//       "name": "管理员",
//       "desc": "系统最高权限拥有者",
//       "power": "userhandle|departhandle|jobhandle|departcustomer|allcustomer|resetpassword",
//       "time": 1568640222269,
//       "state": 0
//     }])
//     await insertData('user', [{
//       "id": 'root',
//       "name": "admin",
//       "password": "90089e402b00",
//       "sex": "0",
//       "email": "xxxxxxx@qq.com",
//       "phone": "16600000000",
//       "departmentId": id,
//       "jobId": 'root',
//       "desc": "最高管理员账户",
//       "time": 1651999915097,
//       "state": 0
//     }])
//   } catch (error) {
//   }
// })

//登录接口
route.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    // password = encryption(password)
    let _ip = req._ip;
    let ruser = await queryData('sys_user', '*', `WHERE (id=? OR username=? OR realname=? OR email=?) AND status=?`, [username, username, username, username, '1'])
    if (ruser.length === 0) {
      _err(res, '账号不存在~');
      return;
    }
    //验证密码
    let _userinfo = ruser.find(item => item.password === password);
    if (_userinfo) {
      let token = jwten(_userinfo.id);
      let role = await queryData('sys_role', "*", `WHERE id=?`, [_userinfo.role_id])
      role = role.length > 0 ? role[0] : ''
      delete _userinfo.state
      delete _userinfo.password
      _success(res, '登录成功~', { ..._userinfo, token, role });
    } else {
      _err(res, '登录密码错误~')
    }
  } catch (error) {
    _err(res)
  }
});
route.use((req,res,next)=>{
  if(!req._userInfo.id){
    _nologin(res)
    return
  }
  next()
})
//获取用户列表
route.get('/userlist', async (req, res) => {
  try {
    let { pageIndex = 1, pageSize = 10, status: sta, searchValue = '' } = req.query;
    let userList = await queryData('sys_user', '*')
    let roleArr = await queryData('sys_role', "*")
    let resArr = []
    userList.reverse()
    userList = userList.forEach(item => {
      let { id, username, realname, sex, email, status, create_time, role_id ,remarks} = item;
      let role = roleArr.find(item => item.id === role_id)
      role = role || {}
      let str = `${username}|${realname}|${sex}|${email}|${role.name || ''}`
      if (!str.includes(searchValue)) return;
      if (!sta) {
        resArr.push({
          id, username, realname, sex, email, status, create_time, role_id, sysRole: role,remarks
        })
      } else {
        if (sta == status) {
          resArr.push({
            id, username, realname, sex, email, status, create_time, role_id, sysRole: role,remarks
          })
        }
      }
    })
    let totalNum = resArr.length;
    let totalPage = Math.ceil(totalNum / pageSize)
    pageIndex < 0 ? pageIndex = 0 : (pageIndex > totalNum ? pageIndex = totalNum : null)
    let content = resArr.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    _success(res, 'ok', {
      totalNum,
      totalPage,
      pageIndex,
      content
    })
  } catch (error) {
    _err(res)
  }
})

//获取所有角色
route.get('/allrole', async (req, res) => {
  try {
    let roleArr = await queryData('sys_role', "*")
    _success(res, 'ok', roleArr)
  } catch (error) {
    _err(res)
  }
})
//添加用户
route.post('/adduser', async (req, res) => {
  try {
    let { username,
      password,
      status = 1,
      realname,
      email,
      sex = '男',
      remarks,
      roleId } = req.body;
    let id = nanoid()
    let time = Date.now()
    await insertData('sys_user', [{
      id,
      create_time: time,
      create_by: req._userInfo.id,
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      password,
      realname,
      sex,
      status,
      username,
      email,
      role_id: roleId
    }])
    _success(res, '添加用户成功')
  } catch (error) {
    _err(res)
  }
})

//删除用户
route.delete('/deluser', async (req, res) => {
  try {
    let { id } = req.query;
    await deleteData('sys_user', `WHERE id=?`, [id])
    _success(res, '删除用户成功')
  } catch (error) {
    _err(res)
  }
})

//获取用户信息
route.get('/getuser', async (req, res) => {
  try {
    let { id } = req.query;
    let user = await queryData('sys_user', '*', `WHERE id=?`, [id])
    if (user.length === 0) {
      _err(res)
      return
    }
    let obj = user[0]
    let role = await queryData('sys_role', "*",`WHERE id=?`,[obj.role_id])
    role = role[0] || {}
    _success(res, 'ok', {
      ...obj,
      roleId: role.id||''
    })
  } catch (error) {
    _err(res)
  }
})

// 更新用户信息
route.put('/updateuser', async (req, res) => {
  try {
    let {
      id,
      username,
      password,
      status = 1,
      realname,
      email,
      sex = '男',
      remarks,
      roleId } = req.body;
    let time = Date.now()
    await updateData('sys_user', {
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      password,
      realname,
      sex,
      status,
      username,
      email,
      role_id: roleId
    }, `WHERE id=?`, [id])

    _success(res, '更新用户信息成功')
  } catch (error) {
    _err(res)
  }
})








module.exports = route;