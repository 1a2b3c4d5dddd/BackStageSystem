<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="add">
      添加
    </el-button>
    <!-- 
      表格组件：
          1. border --- 给表格加边框
          2. column --- 列属性
          3. label  --- 标题内容
          4. width  --- 对应列的宽度
          5. align  --- 文本对齐方式
          6. prop   --- 对应列内容的字段名
     -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center"></el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px"/>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updata(row)">
            修改
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器 【当前页、数据总条数、每页展示条数、连续页码数】
          1. page-sizes 是可切换的连续页码数，默认是 5 页
          2. layout 是这些结构的布局位置 【里面有个 -> 表示将该符号右边的结构靠右对齐】
          3. page-count 是按钮的数量;  连续的页码数 = page-count - 2
          4. current-change 事件---当当前页变化时会触发，并把当前页的页码传给对应的回调
          5. size-change 事件---当每页展示的商品数量变化时触发，并把每页展示的商品数量传给对应的回调
    -->
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
    <!-- 对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- form表单中的 :model 属性 --- 将该表单的数据收集到后面的值(tmFrom)里，将来表单验证也需要这个属性 -->
      <el-form :model="tmFrom" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" style="width:80%" v-model="tmFrom.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传图片 action 属性用来指定图片上传的地址【要加前缀 /dev-api 即走代理，向服务器发送数据】 -->
          <el-upload
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            ref="uploadTrademark"
          >
            <i class="el-icon-plus"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="tmFrom.logoUrl">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="addOrUpdataTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1, // 当前页
      list: [], // 商品数据
      limit: 3, // 每页展示的商品数
      total: 0, // 总共的商品数
      dialogFormVisible:false, // 对话框的显示与隐藏
      dialogVisible: false,
      tmFrom: {   // 收集添加|修改的品牌名称和图片，key要与服务器接收的名字相同
        tmName:'',
        logoUrl:''
      },
      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO', trigger: 'change'}
        ]
      }
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取当前页的数据
    async getPageList(pager = 1) {
      // 分页器传入的页码数 pager
      this.page = pager;
      let result = await this.$API.trademark.requestTrademarkList(this.page,this.limit);
      if (result.code == 200) {
        this.list = result.data.records;
        this.total = result.data.total;
      }
    },
    // // 切换每页展示的商品数量
    toggleLimit(pageSize) {
      this.limit = pageSize;
      this.getPageList();
    },
    // 添加品牌
    add() {
      this.dialogFormVisible = true
      // 先清除上一次添加|修改的内容
      this.tmFrom = {tmName:'',logoUrl:''}
    },
    // 修改品牌  --- row为当前点击修改的商品信息
    updata(row) {
      this.dialogFormVisible = true
      // 注意：这里不能直接赋值(深拷贝)，会导致当我们修改数据的时候，页面的数据会跟随变化
      this.tmFrom = {...row}    // 浅拷贝
    },
    // 删除品牌
    remove(row) {
      this.$confirm(`是否删除${row.tmName}品牌？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {    // 点击确定按钮对应的回调
        let res = await this.$API.trademark.requestRemoveTrademark(row.id)
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getPageList( this.page)
          // 如果是删除当前页的唯一一条数据，就要跳到前一页
          if (this.list.length == 1 && this.page > 1) {
            this.page = this.page - 1
          }
          this.getPageList( this.page )
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        }
      }).catch(() => {  // 点击取消按钮对应的回调
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 点击对话框中的确定按钮对应的回调
    addOrUpdataTrademark() {
      this.$refs.ruleForm.validate(async (success) => {
        // 表单验证成功后再进行操作
        if (success) {
          this.dialogFormVisible = false
          this.tmFrom.logoUrl = ''
          // 将收集好的数据向服务器发请求
          let result = await this.$API.trademark.requestAddOrUpdateTrademark(this.tmFrom)
          if (result.code == 200) {
            // 弹出提示，还是根据携带的数据是否有 id 来判断是 修改 还是 添加【type设置弹框的样式】
            this.$message({
              type:'success',
              message:this.tmFrom.id?'修改品牌成功':'添加品牌成功'
            })
            // 重新获取品牌列表数据 -- 这要进行判断：添加品牌时，完成后留在第1页。修改品牌时，修改完成后留在当前页
            this.getPageList(this.tmFrom.id?this.page:1)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 对话框的取消按钮
    resetForm() {
      // resetFields() --- 清除该表单所有的校验结果和输入的内容，重置为初识值
      this.$refs.ruleForm.resetFields();
      // 隐藏对话框
      this.dialogFormVisible = false
    },
    // 图片成功上传时触发  file 里面有很多属性，res为其中的一个属性，res.data就是该图片在服务器的地址
    handleAvatarSuccess(res, file) {
      this.tmFrom.logoUrl = res.data
      // 清除校验结果
      this.$refs.ruleForm.validate((success) => {
        if (!success) {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 图片上传前触发 【判断图片是否为 jpg 格式且 图片大小小于 2M】
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
  },
};
</script>
