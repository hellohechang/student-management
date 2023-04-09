import request from './request'

export const getStudentListApi = (params) => request.get('/student/studentlist', { params })
// 添加学生信息
export const addStudentApi = (data) => request.post('/student/addstudent', data)
// 获取所有班级列表
export const gradeClassListApi = () => request.get('/student/allgradeclass')
// 根据ID获取学生信息
export const getStudentApi = (id) => request.get('/student/getstudent', { params: { id } })
// 更新学生信息
export const editStudentApi = (data) => request.put('/student/updatestudent', data)
// 根据ID删除学生信息
export const deleteStudentApi = (id) => request.delete('/student/delstudent', { params: { id } })
