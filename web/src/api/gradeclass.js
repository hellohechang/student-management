import request from './request'
// 获取班级列表
export const getGradeClassListApi = (params) => request.get('/gradeclass/gradeclasslist', { params })
// 添加班级信息
export const addGradeClassApi = (data) => request.post('/gradeclass/addgradeclass', data)
// 根据ID获取班级信息
export const getGradeClassApi = (id) => request.get('/gradeclass/getgradeclass', { params: { id } })
// 更新班级信息
export const editGradeClassApi = (data) => request.put('/gradeclass/updategradeclass', data)
// 根据ID删除班级信息
export const deleteGradeClassApi = (id) => request.delete('/gradeclass/delgradeclass', { params: { id } })
