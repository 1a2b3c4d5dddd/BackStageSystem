<template>
  <div>
    <el-card style="margin-bottom:20px">
      <CategorySelect @getCategoryId="getCategoryId" :isShowTable="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px" @click="addAttr" :disabled="!attrList.length">添加属性</el-button>
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="item in row.attrValueList" :key="item.id" style="margin-right:10px">
                {{item.valueName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="180">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性名</el-button>
        <el-button @click="cancelAddAttr">取消</el-button>
        <el-table border style="width: 100%; margin: 20px 0px" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input 
                placeholder="请输入属性名" 
                size="mini" 
                v-model.trim="row.valueName" 
                ref="elInput"
                v-if="row.isShowIpt"
                @blur="blurTest(row)"
              ></el-input>
              <p v-else style="margin:0" @dblclick="dbtest(row)">{{row.valueName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框  onConfirm 与 comfirm 是不同版本 -->
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteAttrValue($index)">
                <el-button 
                  type="danger" 
                  icon="el-icon-delete" 
                  slot="reference"
                  size="mini" 
                >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button 
          type="primary" 
          icon="el-icon-plus" 
          :disabled="!attrInfo.attrValueList[0]"
          @click="saveAttr"
        >保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  // 按需引入 lodash 中的 深拷贝函数 cloneDeep()
  import cloneDeep from 'lodash/cloneDeep'
  export default {
    name:'Attr',
    data() {
      return {
        category1Id:'',
        category2Id:'',
        category3Id:'',
        // isShowIpt:true,  // 添加|修改属性值里 input 和 span的切换
        attrList:[],
        isShowTable: true, // 是否显示 table
        // 添加|修改属性的数据
        attrInfo:{
          attrName: "",  // 属性名
          attrValueList: [], // 属性值列表【每个属性都是一个对象】
          categoryId: 0,  // 三级分类的id
          categoryLevel: 3,   // 服务器也要区分几级分类
        }
      }
    },
    methods: {
      // 接收CategorySelect组件传过来的数据【子=>父】---- 因为三级分类甚至二级分类有时候会没数据，所以
      // 在子组件中，只要id一改就将数据传过来，而不是等选中三级分类后再把数据一起传过来
      getCategoryId({categoryId,level}){
        if (level == 1) {
          this.category1Id = categoryId
          this.category2Id = ''
          this.category3Id = ''
        } else if (level == 2) {
          this.category2Id = categoryId
          this.category3Id = ''
        } else {
          this.category3Id = categoryId
          this.getAttrList()
        }
      },
      // 获取商品信息
      async getAttrList() {
        const {category1Id,category2Id,category3Id} = this
        let result = await this.$API.attr.requestAttrList(category1Id,category2Id,category3Id)
        if (result.code == 200) {
          this.attrList = result.data
        }
      },
      // 添加属性
      addAttr() {
        this.isShowTable = false
        // 数据回显【清除上一次添加的内容，同时收集三级分类的id】
        this.attrInfo = {
          attrName: "", 
          attrValueList: [], 
          categoryId: this.category3Id,
          categoryLevel: 3, 
        }
      },
      // 修改属性
      updateAttr(row) {
        this.isShowTable = false
        // 这里给每个添加一个属性 isShowIpt ，是为了实现 input 框与 p标签的切换
        row.attrValueList.forEach(item => {
          this.$set(item,'isShowIpt',false)
        });
        // 这里因为数据结构复杂，所以要用深拷贝【使用 lodash 库中的 深拷贝函数 cloneDeep】
        this.attrInfo = cloneDeep(row)
      },
      // 删除属性
      async deleteAttr(row) {
        let res = await this.$API.attr.requestDeleteAttr(row.id)
        if (res.code == 200) this.getAttrList()
      },
      // 添加属性值
      addAttrValue() {
        this.attrInfo.attrValueList.push({
          attrId:undefined,  // 属性值的id是服务器给的，这里只是占位
          valueName:'',
          isShowIpt:true  // 用于实现  添加属性值里 input 和 p标签的切换。服务器不返回这个属性
        })
        // 点击添加属性值是，input默认获取焦点
        this.$nextTick(() => {
          this.$refs.elInput.focus()
        })
        // 让 input 显示
        this.isShowIpt = true
      },
      // 取消添加属性
      cancelAddAttr() {
        this.attrInfo.attrName = ''
        this.attrInfo.attrValueList = []
      },
      // 删除某个属性值 --- 【添加和修改界面中的删除按钮】
      deleteAttrValue(index) {
        this.attrInfo.attrValueList.splice(index,1)
        // console.log(1);
      },
      // 保存按钮保存添加|修改属性的内容
      async saveAttr() {
        // 去除属性值为空的
        this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
          if (item.valueName != '')  return true
        })
        try {
          await this.$API.attr.requestAddAttr(this.attrInfo)
          this.isShowTable = true
          this.$message({
            type:'success',
            message:'保存成功'
          })
          this.getAttrList()
        } catch (error) {
          
        }
      },
      // 添加|修改属性值里 input 和 span的切换【双击切换】
      dbtest(row) {
        row.isShowIpt = true
        this.$nextTick(() => {
          this.$refs.elInput.focus()
        })
      },
      // 输入框失去焦点的回调
      blurTest(row) {
        // 1. 输入为空的处理
        if (row.valueName.trim() == '') {
          row.isShowIpt = true
          // this.$refs.elInput.focus()
          this.msg = this.$message({
            message: '属性值不能为空',
            type: 'warning'
          });
        } else {
          row.isShowIpt = false
        }
        // 2. 属性值重复处理 --- 注意：遍历的元素应该是除自身之外的其他数组元素
        let isRepat = this.attrInfo.attrValueList.some(item => {
          // row是当前更改的元素，只有非当前元素才能进入判断，返回一个布尔值
          if (row != item) { 
            return row.valueName === item.valueName
          }
        })
        // isRepat 为真时，即找到重复的属性值，弹窗警告
        if (isRepat) {
          row.isShowIpt = true
          this.$refs.elInput.focus()
          this.msg = this.$message({
            message: '属性值不能重复',
            type: 'warning'
          });
        }
      }
    }
  }
</script>

