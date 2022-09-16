<template>
  <div ref="lineChart" class="lineChart" style="width:100%;height:100%"></div>
</template>

<script>
  import * as echarts from 'echarts'
  export default {
    name:'LineChart',
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
            type: 'line',
            data: [50,10, 20, 36, 10, 10, 20,7,43,35,21],
            // 拐点的样式
            itemStyle:{
              opacity:0
            },
            // 线条的样式
            lineStyle:{
              color:'purple'
            },
            // 设置填充色
            areaStyle:{
              color:{
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#fff' // 0% 处的颜色
                }, {
                    offset: 1, color: '#D5ABD5' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            // 设置弧形线条
            smooth:true,
          }
        ],
        grid:{
          left:0,
          top:10,
          right:0,
          bottom:0,
        }
      })
    },
  }
</script>
