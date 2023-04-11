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
//获取课程列表
route.get('/courselist', async (req, res) => {
  try {
    let { pageIndex = 1,
      pageSize = 10,
      searchValue = '' } = req.query;

    let courseArr = await queryData('s_course', "*")
    courseArr.reverse()
    let resArr = []
    courseArr.forEach(item => {
      let { course_name, course_no } = item;
      let str = `${course_name}|${course_no}`
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
//添加课程
route.post('/addcourse', async (req, res) => {
  try {
    let { course_no,
      course_name,
      remarks } = req.body;
    let id = nanoid()
    let time = Date.now()
    await insertData('s_course', [{
      id,
      create_time: time,
      create_by: req._userInfo.id,
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      course_name,
      course_no
    }])
    _success(res, '添加课程成功')
  } catch (error) {
    _err(res)
  }
})
//删除课程
route.delete('/delcourse', async (req, res) => {
  try {
    let { id } = req.query;
    await deleteData('s_course', `WHERE id=?`, [id])
    _success(res, '删除课程成功')
  } catch (error) {
    _err(res)
  }
})

//获取课程信息
route.get('/getcourse', async (req, res) => {
  try {
    let { id } = req.query;
    let course = await queryData('s_course', '*', `WHERE id=?`, [id])
    if (course.length === 0) {
      _err(res)
      return
    }
    _success(res, 'ok', course[0])
  } catch (error) {
    _err(res)
  }
})

// 更新课程信息
route.put('/updatecourse', async (req, res) => {
  try {
    let {
      id,
      course_no,
      course_name,
      remarks } = req.body;
    let time = Date.now()
    await updateData('s_course', {
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      course_name,
      course_no
    }, `WHERE id=?`, [id])

    _success(res, '更新课程信息成功')
  } catch (error) {
    _err(res)
  }
})


module.exports = route