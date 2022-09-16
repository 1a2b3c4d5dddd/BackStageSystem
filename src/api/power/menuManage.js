// 引入进行了二次封装后的 axios
import request from '@/utils/request'

// 修改当前角色的权限
export const requestUpdateRolePower = (data) => request({
  url:`/admin/acl/permission/doAssignAcl`,
  method:'post',
  data
})