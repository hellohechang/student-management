import request from './request'
// 获取课程列表
export const getCourseListApi = (params)=>request.get('/course/courselist',{params})
// 添加课程信息
export const addCourseApi = (data)=>request.post('/course/addcourse',data)
// 根据ID获取课程信息
export const getCourseApi = (id)=>request.get('/course/getcourse',{params:{id}})
// 更新课程信息
export const editCourseApi = (data)=>request.put('/course/updatecourse',data)
// 根据ID删除课程信息
export const deleteCourseApi = (id)=>request.delete('/course/delcourse',{params:{id}})
