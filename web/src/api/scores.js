import request from './request'
// 获取成绩列表
export const getScoresListApi = (params) => request.get('/scores/scoreslist', { params })
// 登记学科成绩
export const registerScoresApi = (data) => request.post('/scores/registerscores', data)
// 更新成绩
export const editScoresApi = (data) => request.put('/scores/updatescores', data)
// 根据ID删除成绩信息
export const deleteScoresApi = (id) => request.delete('/scores/delscores', { params: { id } })
