const express = require('express');
const { _success, _err, nanoid, _nologin } = require('../utils');
const { queryData, insertData, deleteData, updateData } = require('../sqlite');
const route = express.Router();

route.use((req, res, next) => {
  if (!req._userInfo.id) {
    _nologin(res);
    return;
  }
  next();
});
//获取成绩列表
route.get('/scoreslist', async (req, res) => {
  try {
    let {
      pageIndex = 1,
      pageSize = 10,
      searchValue = '',
      courseId,
      gradeClassId,
    } = req.query;
    let scoresArr = [];
    if (courseId && gradeClassId) {
      scoresArr = await queryData(
        's_student_score',
        '*',
        `WHERE course_id=? AND gradeclass_id=?`,
        [courseId, gradeClassId]
      );
    } else {
      scoresArr = await queryData('s_student_score', '*');
    }
    let studentArr = await queryData('s_student', '*');
    let courseArr = await queryData('s_course', '*');
    scoresArr.reverse();
    let resArr = [];
    scoresArr.forEach((item) => {
      let { student_id, course_id } = item;
      let student = studentArr.find((item) => item.id === student_id);
      let course = courseArr.find((item) => item.id === course_id);
      course = course || {};
      student = student || {};
      let { name: stuName, stuno } = student;
      let { course_name } = course;
      let str = `${stuName}|${stuno}|${course_name}`;
      if (str.includes(searchValue)) {
        resArr.push({
          ...item,
          student,
          course,
        });
      }
    });
    let totalNum = resArr.length;
    let totalPage = Math.ceil(totalNum / pageSize);
    pageIndex < 0
      ? (pageIndex = 0)
      : pageIndex > totalNum
      ? (pageIndex = totalNum)
      : null;
    let content = resArr.slice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize
    );
    _success(res, 'ok', {
      totalNum,
      totalPage,
      pageIndex,
      content,
    });
  } catch (error) {
    _err(res);
  }
});
//登记学科成绩
route.post('/registerscores', async (req, res) => {
  try {
    let { gradeClassId, courseId } = req.body;
    let time = Date.now();
    let studentArr = await queryData(
      's_student',
      '*',
      `WHERE grade_class_id=?`,
      [gradeClassId]
    );
    let studentScore = studentArr.map((item) => {
      let id = nanoid();
      return {
        id,
        create_time: time,
        create_by: req._userInfo.id,
        remarks: '',
        update_by: req._userInfo.id,
        update_time: time,
        score: 0,
        type: '未批改',
        course_id: courseId,
        student_id: item.id,
        gradeclass_id: gradeClassId,
      };
    });
    if (studentScore.length > 0) {
      await insertData('s_student_score', studentScore);
    }
    _success(res, '登记成功');
  } catch (error) {
    console.log(error);
    _err(res);
  }
});
//删除成绩
route.delete('/delscores', async (req, res) => {
  try {
    let { id } = req.query;
    await deleteData('s_student_score', `WHERE id=?`, [id]);
    _success(res, '删除成绩成功');
  } catch (error) {
    _err(res);
  }
});

// 更新成绩信息
route.put('/updatescores', async (req, res) => {
  try {
    let { id, score } = req.body;
    let time = Date.now();
    await updateData(
      's_student_score',
      {
        update_by: req._userInfo.id,
        update_time: time,
        score,
        type: '已批改',
      },
      `WHERE id=?`,
      [id]
    );

    _success(res, '更新成绩信息成功');
  } catch (error) {
    console.log(error);
    _err(res);
  }
});

// 班级科目成绩
route.get('/scorecensus', async (req, res) => {
  try {
    let { courseId, gradeClassId } = req.query;
    let scoresArr = await queryData(
      's_student_score',
      '*',
      `WHERE course_id=? AND gradeclass_id=?`,
      [courseId, gradeClassId]
    );
    _success(res, 'ok', scoresArr);
  } catch (error) {
    console.log(error);
    _err(res);
  }
});

module.exports = route;
