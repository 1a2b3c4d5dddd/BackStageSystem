<template>
  <el-card class="box-card">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="boeder-card">
      <el-tab-pane label="销售额" name="first">
        <el-row>
          <el-col :span="18">
            <div class="saleChart" ref="saleChart" style="width:100%;height:300px"></div>
          </el-col>
          <el-col :span="6">
            <div class="rankingChart">
              <h4>门店销售额排名</h4>
              <ul>
                <li>
                  <span>1</span>
                  <span>肯德基</span>
                  <span>35342</span>
                </li>
                <li>
                  <span>2</span>
                  <span>麦当劳</span>
                  <span>1234342</span>
                </li>
                <li>
                  <span>3</span>
                  <span>肯德基</span>
                  <span>352342</span>
                </li>
                <li>
                  <span>4</span>
                  <span>肯德基</span>
                  <span>35266662</span>
                </li>
                <li>
                  <span>5</span>
                  <span>肯德基</span>
                  <span>352342</span>
                </li>
                <li>
                  <span>6</span>
                  <span>肯德基</span>
                  <span>352</span>
                </li>
                <li>
                  <span>7</span>
                  <span>肯德基</span>
                  <span>32</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="访问量" name="second"></el-tab-pane>
    </el-tabs>
    <div class="right">
      <span>今日</span>
      <span>本周</span>
      <span>本月</span>
      <span>本年</span>
      <div class="block">
        <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
  </el-card>
</template>

<script>
  import * as echarts from 'echarts'
  export default {
    name:'CenterChart',
    data() {
      return {
        activeName:'first',
      }
    },
    methods: {
      handleClick() {},
    },
    mounted() {
      let saleEcharts = echarts.init(this.$refs.saleChart)
      saleEcharts.setOption({
        title:{
          text: '销售额报表',
          textStyle: {
            color: '#999',
            fontWeight: 400,
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: true,
            }
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: [400,220,267,120,34,151,289,123,412,320,100,300,100]
          }
        ]
      })
    },
  }
</script>

<style scoped>
  >>>ul {
    padding: 0;
  }
  >>>li {
    list-style: none;
  }
   .box-card {
    margin-top: 10px;
    position: relative;
  }
  >>>.el-tabs__item {
    margin-bottom: 10px;
    font-size: 20px;
  }
  
  .right {
    position: absolute;
    top: 15px;
    right: 20px;
    display: flex;
    justify-content: space-between;
  }
  .right span {
    padding: 12px 0;
    margin: 0 10px;
  }
  .rankingChart ul li {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .rankingChart ul li span {
    display: inline-block;
  }
  .rankingChart ul li span:nth-child(1) {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    font-size: 14px;
  }
  .rankingChart ul li span:nth-child(2) {
    flex:1;
    margin-left: 50px;
  }
  .rankingChart ul li:nth-child(-n+3) span:nth-child(1) {
    color: #fff;
    background-color: #000;
  }
</style>
