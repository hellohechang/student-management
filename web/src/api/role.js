import request from './request'
// 获取角色列表数据
export const getRoleListApi = (params) => request.get('/role/rolelist', { params })

// 添加角色信息
export const addRoleApi = (data) => request.post('/role/addrole', data)

// 根据ID获取角色信息
export const getRoleApi = (id) => request.get('/role/getrole', { params: { id } })

// 更新角色信息
export const editRoleApi = (data) => request.put('/role/updaterole', data)

// 根据ID删除角色信息
export const deleteRoleApi = (id) => request.delete('/role/delrole', { params: { id } })
