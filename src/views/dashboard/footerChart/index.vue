<template>
  <div class="footer">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>线上热门搜索</span>
            <el-dropdown :hide-on-click="false"  style="float: right;">
              <span class="el-icon-more"></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-row :gutter="10">
            <el-col :span="12"><Search title="搜索用户数" triangle="up" :data="dataOne" /></el-col>
            <el-col :span="12"><Search title="人均搜索数" triangle="down" :data="dataTwo" /></el-col>
          </el-row>
          <el-table border style="width: 100%;margin-top:20px">
            <el-table-column prop="date" label="排名" width="80" align="center"></el-table-column>
            <el-table-column prop="date" label="搜索关键字" width="width" align="center"></el-table-column>
            <el-table-column prop="date" label="用户数" width="width" align="center" sortable></el-table-column>
            <el-table-column prop="date" label="周涨幅" width="width" align="center" sortable></el-table-column>
          </el-table>
          <el-pagination
            :page-size="1"
            :pager-count="7"
            layout="prev, pager, next"
            :total="100"
            style="float:right;margin: 5px 0;"
          >
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix box">
            <span>销售额类别占比</span>
            <span class="btn">
              <el-radio-group value="全部渠道" style="float:right" size="small">
                <el-radio-button label="全部渠道"></el-radio-button>
                <el-radio-button label="线上"></el-radio-button>
                <el-radio-button label="门店"></el-radio-button>
              </el-radio-group>
            </span>
          </div>
          <div class="pieChart" ref="pieChart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import Search from './search'
  export default {
    name:'FooterChart',
    components:{Search},
    data() {
      return {
        dataOne:[12,8,2,10,22,4,13,18],
        dataTwo:[11,12,5,12,22,10,13,23]
      }
    },
    mounted() {
      let pieChart = echarts.init(this.$refs.pieChart)
      pieChart.setOption({
        title:{
          text:'视频',
          subtext:1048,
          left:'center',
          top:'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside'
            },
            labelLine: {
              show: true
            },
            data: [
              { value: 1048, name: '搜索引擎：1084' },
              { value: 735, name: '直接访问：735' },
              { value: 580, name: '邮件营销：580' },
              { value: 484, name: '联盟广告：484' },
              { value: 300, name: '视频广告：300' }
            ]
          }
        ]
      })
      // 绑定事件 --- 实现标题跟随鼠标移动变化【接收的参数当前触发该事件触发对象】
      pieChart.on('mouseover',params => {
        const {value} = params.data
        let arr = params.name.split('：')
        // 重新设置标题
        pieChart.setOption({
          title:{
            text:arr[0],
            subtext:value
          }
        })
        // console.log(arr);
      })
    },
  }
</script>

<style scoped>
  .footer {
    margin-top: 10px;
  }
  .clearfix.box {
    position: relative;
  }
  .clearfix.box .btn {
    position: absolute;
    top:-7px;
    right: 0;
  }
  .pieChart {
    width: 100%;
    height: 300px;
  }
</style>