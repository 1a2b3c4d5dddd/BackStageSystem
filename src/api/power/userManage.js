// 引入进行了二次封装后的 axios
import request from '@/utils/request'

// 获取用户的信息
export const requestUserInfo = (page,limit) => request({
  url:`/admin/acl/user/${page}/${limit}`,
  method:'get',
})

// 添加用户
export const requestAddUser = (data) => request({
  url:`/admin/acl/user/save`,
  method:'post',
  data,
})

// 获取当前用户的角色和所有角色列表
export const requestRoleList = (userId) => request({
  url:`/admin/acl/user/toAssign/${userId}`,
  method:'get',
})

// 修改当前用户的角色 --- 【roleId是个字符串，格式:'rId1,rId2,rId3'】
export const requestUserRoleList = (userId,roleId) => request({
  url:`/admin/acl/user/doAssign`,
  method:'post',
  params: {
    userId,
    roleId
  }
})

// 删除某个用户
export const requestDeleteUser = (id) => request({
  url:`/admin/acl/user/remove/${id}`,
  method:'delete',
})