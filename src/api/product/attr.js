// 平台属性管理模块 相关的服务器请求

// 引入二次封装的 axios
import request from '@/utils/request'

// 获取一级分类的数据
export const requestCategory1List = () => request({
  url:`/admin/product/getCategory1`,
  method:'get'
})

// 获取二级分类的数据
export const requestCategory2List = (category1Id) => request({
  url:`/admin/product/getCategory2/${category1Id}`,
  method:'get'
})

// 获取三级分类的数据
export const requestCategory3List = (category2Id) => request({
  url:`/admin/product/getCategory3/${category2Id}`,
  method:'get'
})

// 根据筛选条件向服务器拿数据
export const requestAttrList = (category1Id,category2Id,category3Id) => request({
  url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method:'get'
})

// 添加|修改属性
export const requestAddAttr = (data) => request({
  url: `/admin/product/saveAttrInfo`,
  method:'post',
  data
})

// 删除属性
export const requestDeleteAttr = (attrId) => request({
  url: `/admin/product/deleteAttr/${attrId}`,
  method:'delete',
})