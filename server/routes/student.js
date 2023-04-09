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
//获取学生列表
route.get('/studentlist', async (req, res) => {
  try {
    let { pageIndex = 1,
      pageSize = 10,
      searchValue = '' } = req.query;

    let studentArr = await queryData('s_student', "*")
    let classArr = await queryData('s_grade_class', "*")
    studentArr.reverse()
    let resArr = []
    studentArr.forEach(item => {
      let { name, phone, qq, sex, grade_class_id, stuno } = item;
      let gradeClass = classArr.find(item => item.id === grade_class_id)
      gradeClass = gradeClass || {}
      let str = `${name}|${phone}|${qq}|${sex}|${stuno}`
      if (!str.includes(searchValue)) return;
      resArr.push({
        ...item,
        gradeClass
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
//获取所有班级
route.get('/allgradeclass', async (req, res) => {
  try {
    let classArr = await queryData('s_grade_class', "*")
    _success(res, 'ok', classArr)
  } catch (error) {
    _err(res)
  }
})
//添加学生
route.post('/addstudent', async (req, res) => {
  try {
    let { name,
      stuno,
      sex,
      phone,
      gradeClassId,
      qq,
      remarks } = req.body;
    let id = nanoid()
    let time = Date.now()
    await insertData('s_student', [{
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
      stuno,
      grade_class_id: gradeClassId
    }])
    _success(res, '添加学生成功')
  } catch (error) {
    _err(res)
  }
})
//删除学生
route.delete('/delstudent', async (req, res) => {
  try {
    let { id } = req.query;
    await deleteData('s_student', `WHERE id=?`, [id])
    _success(res, '删除学生成功')
  } catch (error) {
    _err(res)
  }
})

//获取学生信息
route.get('/getstudent', async (req, res) => {
  try {
    let { id } = req.query;
    let student = await queryData('s_student', '*', `WHERE id=?`, [id])
    if (student.length === 0) {
      _err(res)
      return
    }
    let cla = await queryData('s_grade_class', "*", `WHERE id=?`, [student[0].grade_class_id])
    cla = cla[0] || {}
    _success(res, 'ok', {
      ...student[0],
      gradeClassId: cla.id || ''
    })
  } catch (error) {
    _err(res)
  }
})

// 更新学生信息
route.put('/updatestudent', async (req, res) => {
  try {
    let {
      id,
      name,
      stuno,
      sex,
      phone,
      gradeClassId,
      qq,
      remarks } = req.body;
    let time = Date.now()
    await updateData('s_student', {
      remarks,
      update_by: req._userInfo.id,
      update_time: time,
      stuno,
      sex,
      phone,
      grade_class_id:gradeClassId,
      qq,
      name
    }, `WHERE id=?`, [id])

    _success(res, '更新学生信息成功')
  } catch (error) {
    _err(res)
  }
})















module.exports = route