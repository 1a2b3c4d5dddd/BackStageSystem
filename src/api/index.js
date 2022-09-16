// 统一管理项目所有的数据请求 API

import * as trademark from '@/api/product/trademark'
import * as spu from '@/api/product/spu'
import * as sku from '@/api/product/sku'
import * as attr from '@/api/product/attr'
import * as userManage from '@/api/power/userManage'
import * as roleManage from '@/api/power/roleManage'
import * as menuManage from '@/api/power/menuManage'

export default {
  trademark,
  spu,
  sku,
  attr,
  userManage,
  roleManage,
  menuManage,
}