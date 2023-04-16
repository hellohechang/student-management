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
//获取班级列表
route.get('/gradeclasslist', async (req, res) => {
  try {
    let { pageIndex = 1,
      pageSize = 10,
      searchValue = '' } = req.query;
    let classArr = await queryData('s_grade_class', "*")
    let studentArr = await queryData('s_student', "*")
    classArr.reverse()
    let resArr = []
    classArr.forEach(item => {
      let { code, grade, name, id } = item;
      let students = studentArr.filter(item => item.grade_class_id === id)
      let str = `${code}|${grade}|${name}`
      if (!str.includes(searchValue)) return;
      resArr.push({
        ...item,
        students
      })
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
//添加班级
route.post('/addgradeclass', async (req, res) => {
  try {
    let { name,
      code,
      clazz,
      grade,
      remarks } = req.body;
    let id = nanoid()
    let time = Date.now()
    await insertData('s_grade_class', [{
      id,
      create_time: time,
      create_by: req._userInfo.id,
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      code,
      clazz,
      grade,
      name
    }])
    _success(res, '添加班级成功')
  } catch (error) {
    _err(res)
  }
})
//删除班级
route.delete('/delgradeclass', async (req, res) => {
  try {
    let { id } = req.query;
    await deleteData('s_grade_class', `WHERE id=?`, [id])
    _success(res, '删除班级成功')
  } catch (error) {
    _err(res)
  }
})

//获取班级信息
route.get('/getgradeclass', async (req, res) => {
  try {
    let { id } = req.query;
    let gradeclass = await queryData('s_grade_class', '*', `WHERE id=?`, [id])
    if (gradeclass.length === 0) {
      _err(res)
      return
    }
    _success(res, 'ok', gradeclass[0])
  } catch (error) {
    _err(res)
  }
})

// 更新班级信息
route.put('/updategradeclass', async (req, res) => {
  try {
    let {
      id,
      name,
      code,
      clazz,
      grade,
      remarks } = req.body;
    let time = Date.now()
    await updateData('s_grade_class', {
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      name,
      code,
      clazz,
      grade
    }, `WHERE id=?`, [id])

    _success(res, '更新班级信息成功')
  } catch (error) {
    _err(res)
  }
})



module.exports = route