<template>
  <div>
    <el-form ref="form" label-width="100px">
      <el-form-item label="SPU名称">{{spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="info.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" v-model="info.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(kg)">
        <el-input placeholder="重量(kg)" v-model="info.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" v-model="info.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-select v-model="item.attrIdAndValueId" :placeholder="`请选择${item.attrName}`" style="margin-right:20px"
          v-for="item in attrList" :key="item.id"
        >
          <el-option :label="itemTwo.valueName" :value="`${item.id}:${itemTwo.id}`" v-for="itemTwo in item.attrValueList" :key="itemTwo.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="item.attrIdAndValueId" :placeholder="`请选择${item.saleAttrName}`" style="margin-right:20px"
          v-for="item in spuSaleAttrList" :key="item.id"
        >
          <el-option :label="itemTwo.saleAttrValueName" :value="`${item.id}:${itemTwo.id}`" v-for="itemTwo in item.spuSaleAttrValueList" :key="itemTwo.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table ref="multipleTable" border :data="spuImgList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="图片" width="300" align="center">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;height: 100px;">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" width="width" align="center">
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini" v-if="row.isDefault == 0" @click="setDefaultImg(row)">设为默认</el-button>
              <el-button type="success" size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveInfo(spuName)">保存</el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name:'SkuForm',
    data() {
      return {
        spuName:'',  // 当前spu的名称
        spuImgList:[], // 服务器返回的 spu图片列表
        spuSaleAttrList:[],  // 服务器返回的 spu销售属性列表
        attrList:[],  // 服务器返回的 平台属性列表
        checkedImg:[],  // 选中的图片列表 --- 保存时要进行处理
        info:{
          category3Id: 0,
          spuId: 0,
          tmId: 0,
          // 平台属性
          skuAttrValueList: [],
          skuDefaultImg: "",  // 默认图片的URL
          skuDesc: "",
          weight: "",
          price: 0,
          // 图片数据
          skuImageList: [],
          skuName: "",
          // 销售属性
          skuSaleAttrValueList: [],
        },
      }
    },
    methods: {
      // table表格勾选框状态变化的回调 --- 会接收一个参数 list 是个数组，存放当前所有选中的列表数据
      handleSelectionChange(list) {
        this.checkedImg = list
      },
      // 获取数据
      async getData(category1Id,category2Id,row) {
        // 先收集父组件传过来的数据
        this.spuName = row.spuName
        this.info.category3Id = row.category3Id
        this.info.spuId = row.spuId
        this.info.tmId = row.tmId
        // 1.获取图片数据
        let res = await this.$API.spu.requestSkuImgList(row.id)
        if (res.code == 200) {
          // 将服务器返回的数据加上 isDefault 属性，值为1时，该图片为默认图片
          this.spuImgList = res.data.map(item => {
            return { ...item , isDefault: 0 }
          });
        }
        // 2.获取销售属性的数据
        let result = await this.$API.spu.requestSpuSaleAttrList(row.id)
        if (result.code == 200) {
          this.spuSaleAttrList = result.data
        }
        // 3.获取销售属性的数据
        let attrResult = await this.$API.spu.requestAttrList(category1Id,category2Id,row.category3Id)
        if (attrResult.code == 200) {
          this.attrList = attrResult.data
        }
      },
      // 设置默认图片
      setDefaultImg(row) {
        this.spuImgList.forEach(item => {
          item.isDefault = 0
        });
        row.isDefault = 1
        // 收集默认图片
        this.info.skuDefaultImg = row.imgUrl
      },
      // 保存按钮
      async saveInfo(spuName) {
        // 1.整理数据 ---- 【平台属性和销售属性 --- 把两个id分开存储】
        // (1). 平台属性
        this.attrList.forEach(item => {
          if (item.attrIdAndValueId) {
            let attrListArr = item.attrIdAndValueId.split(':')
            this.info.skuAttrValueList.push({
              attrId: attrListArr[0],
              valueId: attrListArr[1],
            })
          } else {
            return false
          }
        })
        // (2). 销售属性
        this.spuSaleAttrList.forEach(item => {
          if (item.attrIdAndValueId) {
            let saleAttrListArr = item.attrIdAndValueId.split(':')
            this.info.skuSaleAttrValueList.push({
              saleAttrId: saleAttrListArr[0],
              saleAttrValueId: saleAttrListArr[1],
            })
          } else {
            return false
          }
        })
        // (3). 整理图片 --- 这里就简单处理一下
        this.info.skuImageList = this.checkedImg.map(item => {
          return {
            ...item,
            id:undefined
          }
        })
        // 2.发请求
        let res = await this.$API.spu.requestSaveSku(this.info)
        if (res.code == 200) {
          // 弹出成功提示，回到主页面(留在当前spu所在页码)，清除数据，解决数据回显问题
          this.cancelEdit()
          this.$message({
            type:'success',
            message:`成功给${spuName}添加sku`
          })
        }
      },
      // 取消按钮的回调
      cancelEdit() {
        this.$emit('changeScene',1)
        Object.assign(this._data,this.$options.data())
      }
    }
  }
</script>