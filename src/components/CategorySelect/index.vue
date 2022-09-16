<template>
  <div>
    <el-form :inline="true" :model="categoryId">
      <el-form-item label="一级分类">
        <el-select v-model="categoryId.categoryId1" placeholder="请选择" @change="handleOne" :disabled="isShowTable">
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryId.categoryId2" placeholder="请选择" @change="handleTwo" :disabled="isShowTable">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryId.categoryId3" placeholder="请选择" @change="handleThree" :disabled="isShowTable">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name:'CategorySelect',
    data() {
      return {
        list1:[],  // 一级分类得到数据
        list2:[],  // 二级分类得到数据
        list3:[],  // 三级分类得到数据
        categoryId:{
          categoryId1:"",
          categoryId2:"",
          categoryId3:"",
        },
      }
    },
    props:['isShowTable'],
    mounted() {
      this.getCategory1List()
    },
    methods: {
      // 获取一级分类的列表数据
      async getCategory1List() {
        let result = await this.$API.attr.requestCategory1List()
        if (result.code == 200) {
          this.list1 = result.data
        }
      },
      // 一级分类选中数据
      async handleOne() {
        // 切换选项后，请空之前的数据
        this.list2 = []
        this.list3 = []
        this.categoryId.categoryId2 = ''
        this.categoryId.categoryId3 = ''
        // 请求数据
        let result = await this.$API.attr.requestCategory2List(this.categoryId.categoryId1)
        if (result.code == 200) {
          this.list2 = result.data
        }
        this.$emit('getCategoryId',{categoryId:this.categoryId.categoryId1,level:1})
      },
      // 二级分类选中数据
      async handleTwo() {
        // 切换选项后，请空之前的数据
        this.list3 = []
        this.categoryId.categoryId3 = ''
        let result = await this.$API.attr.requestCategory2List(this.categoryId.categoryId2)
        if (result.code == 200) {
          this.list3 = result.data
        }
        this.$emit('getCategoryId',{categoryId:this.categoryId.categoryId2,level:2})
      },
      // 三级分类选中数据
      handleThree() {
        this.$emit('getCategoryId',{categoryId:this.categoryId.categoryId3,level:3})
      }
    }
  }
</script>
