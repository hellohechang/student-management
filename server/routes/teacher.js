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
//获取教师列表
route.get('/teacherlist', async (req, res) => {
  try {
    let { pageIndex = 1,
      pageSize = 10,
      searchValue = '' } = req.query;

    let teacherArr = await queryData('s_teacher', "*")
    let courseArr = await queryData('s_course', "*")
    teacherArr.reverse()
    let resArr = []
    teacherArr.forEach(item => {
      let { name, phone, qq, sex, course_id, teach_no } = item;
      let course = courseArr.find(item => item.id == course_id)
      course = course || {}
      let str = `${name}|${phone}|${qq}|${sex}|${teach_no}|${course.course_name || ''}`
      if (!str.includes(searchValue)) return;
      resArr.push({
        ...item,
        course
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
    console.log(error);
    _err(res)
  }
})
//获取所有课程列表
route.get('/allcourse', async (req, res) => {
  try {
    let courseArr = await queryData('s_course', "*")
    _success(res, 'ok', courseArr)
  } catch (error) {
    _err(res)
  }
})
//添加教师
route.post('/addteacher', async (req, res) => {
  try {
    let { name,
      teach_no,
      sex,
      phone,
      courseId,
      qq,
      remarks } = req.body;
    let id = nanoid()
    let time = Date.now()
    await insertData('s_teacher', [{
      id,
      create_time: time,
      create_by: req._userInfo.id,
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      name,
      phone,
      qq,
      sex,
      teach_no,
      course_id: courseId
    }])
    _success(res, '添加教师成功')
  } catch (error) {
    _err(res)
  }
})
//删除学生
route.delete('/delteacher', async (req, res) => {
  try {
    let { id } = req.query;
    await deleteData('s_teacher', `WHERE id=?`, [id])
    _success(res, '删除教师成功')
  } catch (error) {
    _err(res)
  }
})

//获取教师信息
route.get('/getteacher', async (req, res) => {
  try {
    let { id } = req.query;
    let teacher = await queryData('s_teacher', '*', `WHERE id=?`, [id])
    if (teacher.length === 0) {
      _err(res)
      return
    }
    let course = await queryData('s_course', "*", `WHERE id=?`, [teacher[0].course_id])
    course = course[0] || {}
    _success(res, 'ok', {
      ...teacher[0],
      courseId: course.id || ''
    })
  } catch (error) {
    _err(res)
  }
})

// 更新教师信息
route.put('/updateteacher', async (req, res) => {
  try {
    let {
      id,
      name,
      teach_no,
      sex,
      phone,
      courseId,
      qq,
      remarks } = req.body;
    let time = Date.now()
    await updateData('s_teacher', {
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      teach_no,
      sex,
      phone,
      course_id: courseId,
      qq,
      name
    }, `WHERE id=?`, [id])

    _success(res, '更新教师信息成功')
  } catch (error) {
    _err(res)
  }
})















module.exports = route