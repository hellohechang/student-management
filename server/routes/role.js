const express = require('express');
const { _success, _err, nanoid, _nologin } = require('../utils');
const { queryData, insertData, deleteData, updateData } = require('../sqlite');
const route = express.Router()

route.use((req, res, next) => {
  if (!req._userInfo.id) {
    _nologin(res)
    return
  }
  next()
})
route.use((req, res, next) => {
  let role = req._userInfo.role
  if (role && role.code === 'ROLE_ADMIN') {
    next();
  } else {
    _nologin(res);
  }
});
//获取角色列表
route.get('/rolelist', async (req, res) => {
  try {
    let { pageIndex = 1,
      pageSize = 10,
      searchValue = '' } = req.query;

    let roleArr = await queryData('sys_role', "*")
    roleArr.reverse()
    let resArr = []
    roleArr.forEach(item => {
      let { name, code } = item;
      let str = `${name}|${code}`
      if (!str.includes(searchValue)) return;
      resArr.push(item)
    });
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
//添加角色
route.post('/addrole', async (req, res) => {
  try {
    let { name,
      code,
      remarks } = req.body;
    let id = nanoid()
    let time = Date.now()
    await insertData('sys_role', [{
      id,
      create_time: time,
      create_by: req._userInfo.id,
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      name,
      code
    }])
    _success(res, '添加角色成功')
  } catch (error) {
    _err(res)
  }
})
//删除角色
route.delete('/delrole', async (req, res) => {
  try {
    let { id } = req.query;
    await deleteData('sys_role', `WHERE id=?`, [id])
    _success(res, '删除角色成功')
  } catch (error) {
    _err(res)
  }
})

//获取角色信息
route.get('/getrole', async (req, res) => {
  try {
    let { id } = req.query;
    let user = await queryData('sys_role', '*', `WHERE id=?`, [id])
    if (user.length === 0) {
      _err(res)
      return
    }
    _success(res, 'ok', user[0])
  } catch (error) {
    _err(res)
  }
})

// 更新角色信息
route.put('/updaterole', async (req, res) => {
  try {
    let {
      id,
      code,
      name,
      remarks } = req.body;
    let time = Date.now()
    await updateData('sys_role', {
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      code,
      name
    }, `WHERE id=?`, [id])

    _success(res, '更新角色信息成功')
  } catch (error) {
    _err(res)
  }
})















module.exports = route