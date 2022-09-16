<template>
  <div>
    <el-card style="margin-bottom:20px">
      <CategorySelect @getCategoryId="getCategoryId" :isShowTable="showCard != 1"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="showCard == 1">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px" @click="addSpu" :disabled="!category3Id">添加属性</el-button>
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="150">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="360">
            <template slot-scope="{row,$index}">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)">添加</el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)">修改</el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu的sku列表" style="margin-right:10px" @click="showSkuList(row)">查看</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <el-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
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
        ></el-pagination>
      </div>
      <!-- 展示添加布局 -->
      <SpuForm v-show="showCard == 2" @changeScene="changeScene" ref="addSpuForm"/>
      <!-- 展示修改布局 -->
      <SpuForm v-show="showCard == 3" @changeScene="changeScene" ref="updateSpuForm"/>
      <!-- 展示给当前SPU添加SKU -->
      <SkuForm v-show="showCard == 4" @changeScene="changeScene" ref="addSkuForm"/>
    </el-card>
    <!-- 显示当前SPU的SKU列表 -->
    <el-dialog :title="`${skuInfo.spuName}的SKU列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table border :data="skuInfo.skuList" v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width" align="center"></el-table-column>
        <el-table-column prop="price" label="价格" width="120" align="center"></el-table-column>
        <el-table-column prop="weight" label="重量" width="120" align="center"></el-table-column>
        <el-table-column prop="prop" label="默认图片" width="200" align="center">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import SpuForm from './SpuForm'
  import SkuForm from './SkuForm'
  export default {
    name:'Spu',
    data() {
      return {
        page:1,
        total:0,
        limit:3,
        category1Id:'',
        category2Id:'',
        category3Id:'',
        spuList:[],
        showCard:1, // el-card的切换，默认是1==>展示列表、2==>展示添加布局、3==>展示修改布局、4==>展示当前SPU添加SKU
        dialogTableVisible:false,
        skuInfo:{  
          spuName:'',
          skuList:[]  // 存放当前SPU的sku列表数据
        },
        loading:true, // 加载效果
      }
    },
    components:{SpuForm,SkuForm},
    methods: {
      // 获取三级分类的 id
      getCategoryId({categoryId,level}){
        if (level == 1) {
          this.category1Id = categoryId
          this.category2Id = ''
          this.category3Id = ''
        } else if (level == 2) {
          this.category2Id = categoryId
          this.category3Id = ''
        } else {
          this.category3Id = categoryId
          this.getSpuList()
        }
      },
      // 获取spu列表
      async getSpuList() {
        const {page,limit,category3Id} = this
        let res = await this.$API.spu.requestGetSpuList(page,limit,category3Id)
        if (res.code == 200) {
          this.spuList = res.data.records
          this.total = res.data.total
        }
      },
      // 切换每页展示数据条数的回调
      toggleLimit(pageLimit) {
        this.limit = pageLimit
        this.getSpuList()
      },
      // 获取当前页的数据
      async getPageList(pager = 1) {
        // 分页器传入的页码数 pager
        this.page = pager;
        this.getSpuList()
      },
      // 添加 spu
      addSpu() {
        this.showCard = 2
        this.$refs.addSpuForm.getData(this.category3Id)
      },
      // 修改 spu
      updateSpu(row) {
        this.showCard = 3
        // 通知子组件发请求拿数据，并将当前spu的id传入
        this.$refs.updateSpuForm.initSpuData(row.id)
      },
      // 修改|添加的路由切换
      changeScene(value) {
        // 跳回主页面
        this.showCard = value
        // 更新数据
        this.getPageList(this.page)
      },
      // 删除 SPU
      async deleteSpu(row) {
        let res = await this.$API.spu.requestDeleteSpu(row.id)
        if (res.code == 200) {
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.getPageList( this.page)
          // 如果是删除当前页的唯一一条数据，就要跳到前一页
          if (this.spuList.length == 1 && this.page > 1) {
            this.page = this.page - 1
          }
          this.getPageList( this.page )
        } 
      },
      // 添加Sku
      addSku(row) {
        this.showCard = 4
        this.$refs.addSkuForm.getData(this.category1Id,this.category2Id,row)
      },
      // 显示当前SPU的SKU列表
      async showSkuList(row) {
        this.dialogTableVisible = true
        this.skuInfo.spuName = row.spuName
        let res = await this.$API.spu.requestSkuListBySpuId(row.id)
        if (res.code == 200) {
          this.skuInfo.skuList = res.data
          // loading效果关闭 -- 【关闭 dialog 时要变为true，不然loading只能用一次】
          this.loading = false
        }
      },
      // 显示当前SPU的SKU列表时，关闭 dialog 弹窗触发的回调
      close(done) {
        done()
        this.loading = true
        this.skuInfo.skuList = []
      }
    }
  }
</script>
