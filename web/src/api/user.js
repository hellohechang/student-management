import request from './request';

// 获取用户列表数据
export const getUserListApi = (params) =>
  request.get('/user/userlist', { params });
// 添加用户信息
export const addUserApi = (data) => request.post('/user/adduser', data);
// 根据ID获取用户信息
export const getUserApi = (id) =>
  request.get('/user/getuser', { params: { id } });
// 更新用户信息
export const editUserApi = (data) => request.put('user/updateuser', data);
// 根据ID删除用户信息
export const deleteUserApi = (id) =>
  request.delete('/user/deluser', { params: { id } });
// 更新个人信息
export function updateInfoApi(data) {
  return request({
    url: 'user/updateInfo',
    method: 'put',
    data,
  });
}
// 发送验证码
export function sendEmailApi(email) {
  return request({
    url: 'user/sendEmail',
    method: 'get',
    params: {
      email,
    },
  });
}

// 校验用户输入验证码是否正确
export function verifyCodeApi(code) {
  return request({
    url: 'user/verifyCode',
    method: 'get',
    params: {
      code,
    },
  });
}

// 更改绑定邮箱
export function updateEmailApi(email, code) {
  return request({
    url: 'user/updateEmail',
    method: 'put',
    params: {
      email,
      code,
    },
  });
}
// 更改个人密码
export function updatePwdApi(data) {
  return request({
    url: 'user/updatePwd',
    method: 'put',
    data,
  });
}

// 获取所有角色列表
export const getAllRoleListApi = () => request.get('/user/allrole');
// 获取首页数据
export const getTotalDataApi = () => request.get('/user/totaldata');
