// 品牌管理模块 相关的服务器请求

// 引入二次封装的 axios
import request from '@/utils/request'

// 获取商品的分页列表
export const requestTrademarkList = (page,limit) => request({
  url:`/admin/product/baseTrademark/${page}/${limit}`,
  method:'get',
})

// 添加|修改品牌 ---- 【因为他俩的区别是否携带 id，添加不需要带 id，修改则要 id】
export const requestAddOrUpdateTrademark = (data) => {
  if (data.id) {
    return request({url:`/admin/product/baseTrademark/update`,method:'put',data})
  } else {
    return request({url:`/admin/product/baseTrademark/save`,method:'post',data})
  }
}

// 删除品牌
export const requestRemoveTrademark = (id) => request({
  url:`/admin/product/baseTrademark/remove/${id}`,
  method:'delete',
})