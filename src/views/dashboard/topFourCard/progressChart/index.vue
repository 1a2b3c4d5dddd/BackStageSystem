<template>
  <div ref="lineChart" class="lineChart" style="width:100%;height:100%"></div>
</template>

<script>
  import * as echarts from 'echarts'
  export default {
    name:'ProgressChart',
    data() {
      return {

      }
    },
    mounted() {
      let lineChart = echarts.init(this.$refs.lineChart)
      lineChart.setOption({
        xAxis:{
          show:false,
          // 最大值和最小值的设置
          min:0,
          max:100
        },
        yAxis:{
          show:false,
          // y轴均分
          type:'category'
        },
        series: [
          {
            type: 'bar',
            data: [78],
            barWidth:10, // 柱状图的宽度
            color:'skyblue', // 柱状图的颜色
            showBackgroundStyle:true, // 为 true 时才能设置背景颜色
            backgroundStyle:{ 
              color:'#ccc'
            },
            // 文本
            label:{
              show:true,
              formatter:'|', // 文本内容
              position:'right', // 文本位置
            }
          }
        ],
        grid:{
          left:0,
          top:0,
          right:0,
          bottom:0,
        }
      })
    },
  }
</script>
