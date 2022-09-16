<template>
  <div class="header">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Card title="总销售额" count="￥1234">
            <template slot="container">
              <div style="padding-top:25px">
                周同比<span>56.67%<i class="triangle up">⬆</i></span>
                日同比<span>19.16%<i class="triangle down">⬇</i></span>
              </div>
            </template>
            <template slot="footer">
              日销售额 <span>￥1234</span>
            </template>
          </Card>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Card title="访问量" count="45214">
            <template slot="container">
              <LineChart/>
            </template>
            <template slot="footer">
              日访问量<span style="padding-left:10px">2345</span>
            </template>
          </Card>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Card title="支付笔数" count="7362">
            <template slot="container">
              <BarChart/>
            </template>
            <template slot="footer">
              转化率<span style="padding-left:10px">65%</span>
            </template>
          </Card>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Card title="运营活动效果" count="89%">
            <template slot="container">
              <ProgressChart/>
            </template>
            <template slot="footer">
              周同比<span>56.67%<i class="triangle up">⬆</i></span>
              日同比<span>19.16%<i class="triangle down">⬇</i></span>
            </template>
          </Card>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<!-- ⬆ ⬇ -->
<script>
  import Card from './card'
  // 引入折线图
  import LineChart from './lineChart'
  // 引入柱状图
  import BarChart from './barChart'
  // 引入进度条
  import ProgressChart from './progressChart'

  export default {
    name:'TopFourCard',
    components:{Card,LineChart,BarChart,ProgressChart},
    data() {
      return {

      }
    },
  }
</script>

<style scoped>
  el-row {
    display: flex;
    justify-content: space-between;
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
