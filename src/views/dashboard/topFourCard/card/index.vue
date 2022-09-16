<template>
  <div class="card">
    <div class="title">{{title}}<i class="el-icon-info"></i></div>
    <div class="sum">{{count}}</div>
    <div class="dataChart">
      <slot name="container"></slot>
    </div>
    <div class="dateNum">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name:'Card',
    props:['title','count'],
    data() {
      return {

      }
    },
  }
</script>

<style scoped>
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #999;
  }
  .sum {
    font-size: 30px;
    margin: 10px 0 ;
  }
  .dataChart {
    height: 50px;
    font-size: 16px;
    color: #666;
  }
  .dateNum {
    border-top: 1px solid #ccc;
    margin-top: 10px;
    padding-top: 10px;
  }
</style>
