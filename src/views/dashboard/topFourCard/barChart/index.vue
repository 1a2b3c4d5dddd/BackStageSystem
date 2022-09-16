<template>
  <div ref="lineChart" class="lineChart" style="width:100%;height:100%"></div>
</template>

<script>
  import * as echarts from 'echarts'
  export default {
    name:'barChart',
    data() {
      return {

      }
    },
    mounted() {
      let lineChart = echarts.init(this.$refs.lineChart)
      lineChart.setOption({
        xAxis:{
          show:false,
          type:'category'
        },
        yAxis:{
          show:false,
        },
        series: [
          {
            type: 'bar',
            data: [50,15, 20, 36, 23, 45, 20,42,43,35,21,30],
          }
        ],
        grid:{
          left:0,
          top:10,
          right:0,
          bottom:0,
        },
        // hover时提示数据
        tooltip:{}
      })
    },
  }
</script>