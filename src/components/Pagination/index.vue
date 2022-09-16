<template>
  <div>
    <el-pagination
      style="margin-top: 30px; text-align: center"
      :current-page="page"
      :total="total"
      :page-count="7"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      @size-change="toggleLimit"
      @current-change="getPageList"
      layout="prev,pager,next,jumper,->,sizes,total"
    >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name:'Pagination',
    data() {
      return {

      }
    },
    props:['page','total','limit'],
    methods: {
      // 获取当前页的数据展示条数
      toggleLimit(pageLimit) {
        this.$emit('update:limit',pageLimit)
      },
      // 获取当前页
      getPageList(page) {
        this.$emit('update:page',page)
      },
    }
  }
</script>
