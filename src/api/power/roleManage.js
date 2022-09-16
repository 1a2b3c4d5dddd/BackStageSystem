// 引入进行了二次封装后的 axios
import request from '@/utils/request'

// 获取角色列表
export const requestRoleList = (page,limit) => request({
  url:`/admin/acl/role/${page}/${limit}`,
  method:'get',
})

// 获取角色所有权限列表
export const requestRolePowerList = (roleId) => request({
  url:`/admin/acl/permission/toAssign/${roleId}`,
  method:'get',
})
