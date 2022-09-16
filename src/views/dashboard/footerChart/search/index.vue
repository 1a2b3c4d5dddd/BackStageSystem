<template>
  <div class="search">
    <div class="title">
      <span>{{title}}</span><i class="el-icon-info"></i>
    </div>
    <div class="count">
      <span>34855</span>
      <span>17.2
        <i class="triangle" :class="{up:triangle == 'up',down:triangle == 'down'}">
        {{triangle=='up'?'⬆':'⬇'}}</i>
      </span>
    </div>
    <div class="echart" ref="echart"></div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  export default {
    name:'Search',
    props:['title','triangle','data'],
    mounted() {
      let Echarts = echarts.init(this.$refs.echart)
      Echarts.setOption({
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
            data: this.data,
            // 拐点的样式
            itemStyle:{
              opacity:0
            },
            // 线条的样式
            lineStyle:{
              color:'#6997E5'
            },
            // 设置填充色
            areaStyle:{
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#D8E7FC'},
                    {offset: 1, color: '#fff'}
                  ]
                )
              },
              global: false // 缺省为 false
            },
            // 设置弧形线条
            smooth:true,
          }
        ],
        grid:{
          left:-20,
          top:10,
          right:0,
          bottom:0,
        }
      })
    },
  }
</script>

<style scoped>
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    color:#aaa;
  }
  .title i {
    margin-left: 10px;
  }

  .count span:nth-child(1) {
    font-size: 28px;
  }
  .count span:nth-child(2) {
    margin-left: 20px;
    color: #aaa;
  }

  .echart {
    width: 100%;
    height: 50px;
  }

  /* 倒三角形 */
  >>>.triangle {
    display: inline-block;
    padding: 0 4px;
  }
  >>>.triangle.up {
    color:green
  }
  >>>.triangle.down {
    color: red;
  }
</style>