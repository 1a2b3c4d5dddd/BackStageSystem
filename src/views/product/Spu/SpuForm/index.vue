<template>
  <div>
    <el-form ref="form" :model="info" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="info.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="brand" placeholder="请选择品牌">
          <el-option :label="item.tmName" v-model="item.tmName" v-for="item in brandList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" v-model="info.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- :file-list="spuImgList" 展示一排图片 spuImgList是个数组，每张图片就是个对象，且只有name和url两个属性 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImgList"
          :on-preview="handlePictureCardPreview"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="SaleAttrNameAndId" placeholder="还有未选择">
          <el-option :label="item.name" :value="`${item.name}:${item.id}`" v-for="item in unSelectAttr" :key="item.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left:20px" 
          :disabled="!SaleAttrNameAndId" @click="addSaleAttr">添加销售属性</el-button>
        <el-table border style="width: 100%;margin-top: 20px;" :data="info.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" 
                closable :disable-transitions="false" @close="handleClose(row,index)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible[$index]"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row,$index)"
                @blur="handleInputConfirm(row,$index)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput($index)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSaleAttr($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveInfo">保存</el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name:'SpuForm',
    data() {
      return {
        // 修改|添加 完成后发给服务器的数据
        info: {
          category3Id: 0,
          description: "",
          tmId: 0,
          spuImageList: [],
          spuName: "",
          spuSaleAttrList: [],
        },
        brandList:[],  // 所有品牌的列表
        brand:'', // 当前选中得到品牌
        spuImgList:[], // 当前SPU的图片列表 -- 简单处理后的结果
        saleAttrList:[], // 所有的销售属性
        dialogImageUrl: '',
        dialogVisible: false,
        inputVisible: [false,false,false],  
        inputValue: '',  // 销售属性值输入框的内容
        SaleAttrNameAndId:'', // 销售属性的名称和id
      }
    },
    methods: {
      // 上传图片 ------ 删除图片的回调【file为删除的图片信息，fileList为剩余图片列表信息】
      handleRemove(file, fileList) {
        // 整理数据
        this.info.spuImageList = fileList.map(item => {
          return {
            ...item,
            imgName:item.name,
            imgUrl:item.url,
          }
        })
      },
      // 上传图片 ------ 图片上传成功的回调
      handleAvatarSuccess(res, file) {
        // 整理数据
        this.spuImgList.push({name:file.name,url:res.data})
        this.info.spuImageList = this.spuImgList.map(item => {
          return {
            ...item,
            imgName:item.name || file.name,
            imgUrl:item.url || res.data
          }
        })
      },
      // 上传图片 ------ 预览图片的回调
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 属性值名称列表中 ------ 删除按钮的回调
      handleClose(row,index) {
        row.spuSaleAttrValueList.splice(index,1)
      },
      // 属性值名称列表中 ------ 添加按钮的回调
      showInput(index) {
        this.inputVisible.splice(index,1,true)
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // 属性值名称列表中 ------ 添加属性值的回调
      handleInputConfirm(row,index) {
        let inputValue = this.inputValue;
        // 收集数据
        let obj = {
          baseSaleAttrId:row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: ""
        }
        // 属性值去重判断
        let res = row.spuSaleAttrValueList.some(item => {
          return item.saleAttrValueName === inputValue
        })
        if (inputValue && !res) {
          obj.saleAttrValueName = inputValue
          row.spuSaleAttrValueList.push(obj);
        } else {
          this.$message({
            type:'warning',
            message:'输入不能为空且不能重复'
          })
        }
        this.inputVisible.splice(index,1,false)
        this.inputValue = '';
      },
      // 获取数据
      async initSpuData(id) {
        // 1.获取 SPU 信息
        let res = await this.$API.spu.requestGetSpuDateById(id)
        if (res.code == 200) {
          this.info = res.data
        }
        // 2.获取品牌的信息 + 获取平台所有的销售属性
        this.getData()
        // 3.获取spu图片
        let ImgResult = await this.$API.spu.requestGetSpuImg(id)
        if (ImgResult.code == 200) {
          // 因为 el-upload 组件上传图片列表的特殊性，所以对数据进行了处理
          ImgResult.data.forEach(item => {
            this.spuImgList.push({name:item.imgName,url:item.imgUrl})
          });
        }
        
      },
      // 添加和修改SPU都要获取的数据  ---- 【品牌的信息+所有的销售属性】
      async getData(category3Id) {
        // 获取品牌的信息
        let result = await this.$API.spu.requestGetSpuBrandInfo()
        if (result.code == 200) {
          this.brandList = result.data
        }
        // 获取平台所有的销售属性
        let saleResult = await this.$API.spu.requestGetSpuSaleAttrList()
        if (saleResult.code == 200) {
          this.saleAttrList = saleResult.data
        }
        this.info.category3Id = category3Id
      },
      // 添加销售属性按钮的回调
      addSaleAttr() {
        // 将属性名和id转化为数组元素
        let arr = this.SaleAttrNameAndId.split(':')
        this.info.spuSaleAttrList.push({
          baseSaleAttrId:arr[1],
          saleAttrName: arr[0], 
          spuSaleAttrValueList:[]
        })
        // 添加完后清除输入框内的该属性
        this.SaleAttrNameAndId = ''
      },
      // 删除已有的销售属性
      deleteSaleAttr(index) {
        this.info.spuSaleAttrList.splice(index,1)
      },
      // 保存按钮的回调
      async saveInfo() {
        // 1.整理参数【在上面函数里面已经整理好了 ---- spu图片、更新属性、更新某个属性的属性值】
        // 2.将数据发给服务器
        let res = await this.$API.spu.requestAddOrUpdateSpu(this.info)
        if (res.code == 200) {
          // 返回主页面，并更新数据【在父组件内完成】
          this.$emit('changeScene', 1)
          this.$message({
            type:'success',
            message:'保存成功'
          })
          // 解决数据回显问题 ---- _data可以操作data中的响应式数据
          // $options.data()可以获取配置对象的data函数执行，返回的是响应式为空的_data
          Object.assign(this._data,this.$options.data())
        } else {
          this.$message({
            type:'danger',
            message:'保存失败，请重试'
          })
        }
      },
      // 取消按钮
      cancelEdit() {
        this.$emit('changeScene',1)
        // 解决数据回显
        Object.assign(this._data,this.$options.data())
      }
    },
    computed: {
      // 当前SPU还未有的属性
      unSelectAttr: {
        get() {
          let arr = this.saleAttrList.filter(allItem => {
            // 遍历现有的属性
            let result = this.info.spuSaleAttrList.some(currentItem => {
              return allItem.name === currentItem.saleAttrName
            })
            // result 为 false 即为未找到
            if (!result) {
              return allItem
            } else {
              return false
            }
          })
          return arr
        },
        set(value) {
          
        }
      }
    }
  }
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>