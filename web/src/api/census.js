import request from './request'
export const getScoreCensusApi = (params) => request.get('/scores/scorecensus', { params })
// 班级学科成绩对比
export const getScoresContrastCensusApi = (params) => request.get('/scores/scorecontrastcensus', { params })
