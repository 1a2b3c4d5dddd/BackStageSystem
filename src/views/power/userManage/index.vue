<template>
  <div>
    <el-input v-model="searchInfo" placeholder="用户名" style="width:200px;margin-right:10px"></el-input>
    <el-button type="primary" icon="el-icon-search" :disabled="!searchInfo">查询</el-button>
    <el-button :disabled="!searchInfo" @click="searchInfo = ''">清空</el-button>
    <el-row style="margin-top:10px">
      <el-button type="primary" @click="addUser">添加</el-button>
      <el-button type="danger">批量删除</el-button>
    </el-row>
    <el-table ref="multipleTable" style="width:100%;margin-top:10px" border :data="userInfo">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="55" align="center" :index="(page-1) * limit + 1"></el-table-column>
      <el-table-column prop="username" label="用户名" width="150" align="center"></el-table-column>
      <el-table-column prop="nickName" label="用户昵称" width="150" align="center"></el-table-column>
      <el-table-column prop="roleName" label="权限列表" width="width" align="center"></el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="width" align="center"></el-table-column>
      <el-table-column prop="gmtModified" label="更新时间" width="width" align="center"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" icon="el-icon-user-solid" @click="addRole(row)" title="修改角色权限"></el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(row)" title="编辑角色" style="margin-right:10px"></el-button>
          <el-popconfirm :title="`是否删除用户：${row.username}`" @onConfirm="deleteUser(row)">
            <el-button type="danger" size="mini" icon="el-icon-delete" title="删除角色" slot="reference"></el-button>
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
      :page-sizes="[5,10,15]"
      @size-change="toggleLimit"
      @current-change="getPageList"
      layout="prev,pager,next,jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 给当前用户设置角色的对话框 -->
    <el-dialog title="设置角色" :visible.sync="dialogVisible" :show-close="false">
      <el-form>
        <el-form-item label="用户名" label-width="80px">
          <el-input :value="addRoleData.userName" :disabled="true"></el-input>
        </el-form-item> 
        <el-form-item label="角色列表" label-width="80px">
          <el-checkbox :indeterminate="addRoleData.isIndeterminate" v-model="addRoleData.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group @change="handleCheckedRoleChange" v-model="addRoleData.checkedRole">
            <el-checkbox v-for="(item,index) in addRoleData.roleArr" :label="item" :key="index">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSafe">取 消</el-button>
        <el-button type="primary" @click="sureSafe">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible">
      <el-form>
        <el-form-item label="用户名" label-width="80px" required>
          <el-input v-model="addUserInfo.username" placeholder="请输入用户名"></el-input>
        </el-form-item> 
        <el-form-item label="用户昵称" label-width="80px">
          <el-input v-model="addUserInfo.nickName" placeholder="请输入用户昵称"></el-input>
        </el-form-item> 
        <el-form-item label="用户密码" label-width="80px" required>
          <el-input v-model="addUserInfo.password" placeholder="请输入用户密码"></el-input>
        </el-form-item> 
        <el-form-item>
          <el-button type="primary" @click="submitUserInfo">立即创建</el-button>
          <el-button @click="resetUserInfo">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'UserManage',
    data() {
      return {
        searchInfo:'',
        page:1,
        total:0,
        limit:5,
        userInfo:[],
        dialogVisible: false,
        addUserDialogVisible:false,
        // 修改用户的角色相关的数据
        addRoleData:{
          wholeRoleArr:[], // 保存着所有角色的完整信息【有id...】
          roleArr:[],  // 只保存着所有角色的角色名
          isIndeterminate:true,
          userName:'',
          userId:'',
          checkedRole:[],
          checkAll:false
        },
        // 新增用户的数据
        addUserInfo: {
          nickName: "",
          password: "",
          roleName: "",
        },
      }
    },
    mounted() {
      this.getUserInfo()
    },
    methods: {
      // 分页器每页切换展示条数变化的回调
      toggleLimit(pageLimit) {
        this.limit = pageLimit
        this.getUserInfo()
      },
      // 分页器当前页变化的回调
      getPageList(page) {
        this.page = page
        this.getUserInfo()
      },
      async getUserInfo() {
        let res = await this.$API.userManage.requestUserInfo(this.page,this.limit)
        if (res.code == 20000) {
          this.userInfo = res.data.items
          this.total = res.data.total
        }
      },
      // 添加用户
      addUser() {
        this.addUserDialogVisible = true
      },
      // 添加用户 ---- 对话框的取消按钮
      resetUserInfo() {
        this.addUserInfo.username = ''
        this.addUserInfo.nickName = ''
        this.addUserInfo.password = ''
        this.addUserDialogVisible = false
      },
      // 添加用户 ---- 对话框的创建按钮
      async submitUserInfo() {
        let res = await this.$API.userManage.requestAddUser(this.addUserInfo)
        if (res.code == 20000) {
          this.resetUserInfo()
          this.getUserInfo()
        }
      },
      // 编辑用户
      editUser(row) {

      },
      // 删除用户
      async deleteUser(row) {
        let res = await this.$API.userManage.requestDeleteUser(row.id)
        if (res.code == 20000) {
          this.getUserInfo()
          this.$message({
            type:'success',
            message:'删除成功'
          })
        }
      },
      // 修改当前用户的角色 --- 获取数据并显示对话框
      async addRole(row) {
        this.dialogVisible = true
        this.addRoleData.userName = row.username
        this.addRoleData.userId = row.id
        let res = await this.$API.userManage.requestRoleList(row.id)
        if (res.code == 20000) {
          // 保存一份完整的角色信息，用于最后整理数据发请求
          this.addRoleData.wholeRoleArr = res.data.allRolesList
          res.data.allRolesList.filter(item => {
            this.addRoleData.roleArr.push(item.roleName)
          })
          res.data.assignRoles.filter(item => {
            this.addRoleData.checkedRole.push(item.roleName)
          })
        }
      },
      // 修改当前用户角色 ---- 全选按钮的回调
      handleCheckAllChange(val) {
        this.addRoleData.checkedRole = val ? this.addRoleData.roleArr : [];
        this.isIndeterminate = false;
      },
      // 修改当前用户角色 ---- 多选按钮变化的回调
      handleCheckedRoleChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.addRoleData.roleArr.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.addRoleData.roleArr.length;
      },
      // 修改当前用户角色 ---- 取消按钮的回调
      cancelSafe() {
        this.dialogVisible = false
        this.addRoleData.roleArr = []
        this.addRoleData.checkedRole = []
      },
      // 修改当前用户角色 ---- 确认按钮的回调
      async sureSafe() {
        // 整理数据
        let arr = []
        this.addRoleData.checkedRole.forEach(item => {
          this.addRoleData.wholeRoleArr.forEach(element => {
            if (item === element.roleName){
              arr.push(element.id)
            }
          })
        });
        let res = await this.$API.userManage.requestUserRoleList(this.addRoleData.userId,arr.join())
        if (res.code == 20000) {
          this.cancelSafe()
          this.getUserInfo()
          this.$message({
            type:'success',
            message:'成功设置角色'
          })
        }
      },
      // 搜索用户
      searchUser() {

      }
    },
  }
</script>