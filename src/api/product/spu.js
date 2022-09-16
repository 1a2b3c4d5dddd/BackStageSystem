// spu模块 相关的服务器请求

// 引入二次封装的 axios
import request from '@/utils/request'

// 获取 spu 列表 ---- 当前页、每页的展示条数和三级分类的id
export const requestGetSpuList = (page,limit,category3Id) => request({
  url:`/admin/product/${page}/${limit}`,
  method:'get',
  params:{category3Id}
})

// 通过id获取当前SPU的信息  ---- 修改SPU时，获取数据
export const requestGetSpuDateById = (spuId) => request({
  url:`/admin/product/getSpuById/${spuId}`,
  method:'get',
})

// 获取当前SPU的品牌信息  ---- 修改SPU时，获取数据
export const requestGetSpuBrandInfo = () => request({
  url:`/admin/product/baseTrademark/getTrademarkList`,
  method:'get',
})

// 获取当前SPU的图片  ---- 修改SPU时，获取数据
export const requestGetSpuImg = (spuId) => request({
  url:`/admin/product/spuImageList/${spuId}`,
  method:'get',
})

// 获取当前SPU的销售属性  ---- 修改SPU时，获取数据
export const requestGetSpuSaleAttrList = () => request({
  url:`/admin/product/baseSaleAttrList`,
  method:'get',
})

// 保存当前 SPU 的信息【修改|新增】
export const requestAddOrUpdateSpu = (spuInfo) => {
  // 有id为修改，反之新增
  if (spuInfo.id) {
    return request({url:`/admin/product/updateSpuInfo`,method:'post',data:spuInfo})
  } else {
    return request({url:`/admin/product/saveSpuInfo`,method:'post',data:spuInfo})
  }
}

// 删除当前 SPU
export const requestDeleteSpu = (spuId) => request({
  url:`/admin/product/deleteSpu/${spuId}`,
  method:'delete',
})

// 获取 SKU 的图片数据【spu界面给当前spu添加sku】  ----- 根据当前 SPU 的 id 来找
export const requestSkuImgList = (spuId) => request({
  url:`/admin/product/spuImageList/${spuId}`,
  method:'get',
})

// 获取销售属性的数据【spu界面给当前spu添加sku】
export const requestSpuSaleAttrList = (spuId) => request({
  url:`/admin/product/spuSaleAttrList/${spuId}`,
  method:'get',
})

// 获取平台属性的数据【spu界面给当前spu添加sku】
export const requestAttrList = (category1Id,category2Id,category3Id) => request({
  url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method:'get',
})

// 保存sku信息【spu界面给当前spu添加sku】
export const requestSaveSku = (spuInfo) => request({
  url:`/admin/product/saveSkuInfo`,
  method:'post',
  data:spuInfo
})

// 获取当期SPU的SKU列表信息
export const requestSkuListBySpuId = (spuId) => request({
  url:`/admin/product/findBySpuId/${spuId}`,
  method:'get',
})