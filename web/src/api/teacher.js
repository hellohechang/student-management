import request from './request'
// 获取教师列表
export const getTeacherListApi=(params) =>request.get('/teacher/teacherlist',{params})
// 添加教师信息
export const addTeacherApi = (data)=>request.post('/teacher/addteacher',data)
// 获取所有课程列表
export const getAllCourseListApi = ()=>request.get('/teacher/allcourse')
// 根据ID获取教师信息
export const getTeacherApi = (id)=>request.get('/teacher/getteacher',{params:{id}})
// 更新教师信息
export const editTeacherApi = (data)=>request.put('/teacher/updateteacher',data)
// 根据ID删除教师信息
export const deleteTeacherApi = (id)=>request.delete('/teacher/delteacher',{params:{id}})
