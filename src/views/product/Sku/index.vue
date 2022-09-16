<template>
  <div>
    <el-table border tooltip-effect="dark" style="width: 100%" :data="skuList">
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column label="名称" prop="skuName" width="width" align="center"></el-table-column>
      <el-table-column label="描述" prop="skuDesc" width="width" align="center"></el-table-column>
      <el-table-column label="默认图片" prop="prop" width="150" align="center">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" width="80" align="center"></el-table-column>
      <el-table-column label="价格" prop="price" width="80" align="center"></el-table-column>
      <el-table-column label="操作" prop="prop" width="180" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" 
            :type="row.isSale == 1?'success':'info'"
            :icon="row.isSale == 1?'el-icon-bottom':'el-icon-top'" 
            @click="editSku(row)"
          >{{row.isSale == 1?'下架':'上架'}}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="info" size="mini" icon="el-icon-info" style="margin:10px 0 0;float:left;" @click="lookSku(row)">查看</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-top:10px; float: left;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 展示当前 SKU 的信息 -->
    <el-drawer title="我是标题" :visible.sync="isShowDrawer" :with-header="false">
      <el-form ref="form" label-width="100px">
        <el-form-item label="名称">{{skuInfo.skuName}}</el-form-item>
        <el-form-item label="描述">{{skuInfo.skuDesc}}</el-form-item>
        <el-form-item label="价格">{{skuInfo.price}}</el-form-item>
        <el-form-item label="平台属性">
          <el-tag type="success" v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin-right:10px">{{item.attrName}}：{{item.valueName}}</el-tag>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-table :data="skuInfo.skuImageList" border :show-header="false" size="small" style="width:50%">
            <el-table-column prop="prop" align="center">
              <template slot-scope="{row}">
                <img :src="row.imgUrl" style="width:100px;height:100px">
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-pagination
      style="margin-top: 30px; text-align: center"
      :current-page="page"
      :total="total"
      :page-count="7"
      :page-size="limit"
      :page-sizes="[10,15,20]"
      @size-change="toggleLimit"
      @current-change="getPageList"
      layout="prev,pager,next,jumper,->,sizes,total"
    >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name:'Sku',
    data() {
      return {
        page:1,
        total:0,
        limit:10,
        skuList:[],  // sku列表
        skuInfo:{},  // sku信息
        isShowDrawer:false
      }
    },
    mounted() {
      this.getSkuList()
    },
    methods: {
      async getSkuList() {
        let res = await this.$API.sku.requestGetSkuList(this.page,this.limit)
        if (res.code == 200) {
          this.total = res.data.total
          this.skuList = res.data.records
        }
      },
      toggleLimit(pageLimit) {
        this.limit = pageLimit
        this.getSkuList()
      },
      getPageList(page) {
        this.page = page
        this.getSkuList()
      },
      // SKU的上下架
      async editSku(row) {
        // isSale 值为 1，点击就下架
        if (row.isSale) {
          let res = await this.$API.sku.requestSkuCancelSale(row.id)
          if (res.code == 200) {
            this.$message({
              type:'success',
              message:'下架成功'
            })
          }
        } else {
          let result = await this.$API.sku.requestSkuOnSale(row.id)
          if (result.code == 200) {
            this.$message({
              type:'success',
              message:'上架成功'
            })
          }
        }
        this.getSkuList()
      },
      // 查看 SKU 信息
      async lookSku(row) {
        let res = await this.$API.sku.requestLookSkuInfo(row.id)
        if (res.code == 200) {
          this.skuInfo = res.data
          this.isShowDrawer = true
        }
      },
      onSwiper() {

      },
      onSlideChange() {

      }
    }
  }
</script>
<style>
.swiper {
  width: 50%;
  height: 50%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  width: 100%;
  height: 100%;
  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>