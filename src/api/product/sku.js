// sku模块 相关的服务器请求

// 引入二次封装的 axios
import request from '@/utils/request'

// 获取 SKU 列表
export const requestGetSkuList = (page,limit) => request({
  url:`/admin/product/list/${page}/${limit}`,
  method:'get',
})

// SKU 上架
export const requestSkuOnSale = (skuId) => request({
  url:`/admin/product/onSale/${skuId}`,
  method:'get',
})

// SKU 下架
export const requestSkuCancelSale = (skuId) => request({
  url:`/admin/product/cancelSale/${skuId}`,
  method:'get',
})

// 查看 SKU 信息
export const requestLookSkuInfo = (skuId) => request({
  url:`/admin/product/getSkuById/${skuId}`,
  method:'get',
})