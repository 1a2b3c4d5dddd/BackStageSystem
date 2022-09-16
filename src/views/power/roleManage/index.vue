<template>
  <div>
    <div v-show="isShowPowerPage">
      <el-input v-model="searchInfo" placeholder="用户名" style="width:200px;margin-right:10px"></el-input>
      <el-button type="primary" icon="el-icon-search" :disabled="!searchInfo">查询</el-button>
      <el-button :disabled="!searchInfo" @click="searchInfo = ''">清空</el-button>
      <el-row style="margin-top:10px">
        <el-button type="primary" @click="addRole">添加</el-button>
        <el-button type="danger">批量删除</el-button>
      </el-row>
      <el-table ref="multipleTable" style="width:100%;margin-top:10px" border :data="roleList">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="80" align="center" :index="(page-1) * limit + 1"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="width" align="center"></el-table-column>
        <el-table-column prop="prop" label="操作" width="300" align="center">
          <template slot-scope="{row}">
            <el-button type="info" size="mini" icon="el-icon-user-solid" @click="lookRole(row)" title="角色授权"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRole(row)" title="编辑角色" style="margin-right:10px"></el-button>
            <el-popconfirm title="" @onConfirm="deleteRole(row)">
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
    </div>
    <!-- 给当前角色授权 -->
    <div v-show="!isShowPowerPage" >
      <el-input :value="roleName" disabled style="margin-bottom:10px"></el-input>
      <el-tree 
        :data="powerList" 
        :props="defaultProps" 
        v-loading="loading"
        ref="tree"
        node-key="id"
        show-checkbox 
        @check="handleCheckChange" 
        setChecked="setChecked"
        style="margin-bottom:10px"
      ></el-tree>
      <el-button type="primary" @click="saveRolePowerList">保存</el-button>
      <el-button @click="cancelRolePowerList">取消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name:'RoleManage',
    data() {
      return {
        searchInfo:'',
        page:1,
        total:0,
        limit:5,
        loading:true,
        isShowPowerPage:true,
        roleList:[],
        roleName:'',
        roleId:'',
        powerList:[],  // 所有权限列表
        defaultProps:{
          children:"children",
          label:'name',
        },
        isIndeterminate:true,
        filterPowerArr:[], // 存放当前角色已有的权限【是通过 -- 所有权限列表 过滤出来的】
        permissionIdList:[], // 存放当前所有选中状态的 id
      }
    },
    methods: {
      async getRoleList() {
        let res = await this.$API.roleManage.requestRoleList(this.page,this.limit)
        if (res.code == 20000) {
          this.roleList = res.data.items
          this.total = res.data.total
        }
      },
      // 角色授权
      async lookRole(row) {
        this.isShowPowerPage = false
        this.roleName = row.roleName
        this.roleId = row.id
        let res = await this.$API.roleManage.requestRolePowerList(row.id)
        if (res.code == 20000) {
          this.powerList = res.data.children
          // 将当前角色已有的权限筛选出来
          this.filterPowerList(this.powerList[0])
          // 将角色原本就有的权限的 id 收集起来 ---- 这步用于修改角色权限后保存时所有
          this.filterPowerArr.forEach(item => {
            this.permissionIdList.push(item.id)
            if (this.permissionIdList.indexOf(item.pid) == -1) {
              this.permissionIdList.push(item.pid)
            }
          })
          // 根据上面筛选的数据指定某些节点被选中
          this.$nextTick(() => {
            this.$refs.tree.setCheckedNodes(this.filterPowerArr)
            this.loading = false
          })
        }
      },
      // 筛选服务器返回的数据，将 select 属性为 true【即该角色具有的权限】筛选出来
      filterPowerList(obj) {
        if (obj.select) {
          if (obj.children.length) {
            obj.children.forEach(item => {
              this.filterPowerList(item)
            })
          } else {
            this.filterPowerArr.push(obj)
          }
        } else {
          return false
        }
      },
      // 保存对当前角色的权限修改
      async saveRolePowerList() {
        let res = await this.$API.menuManage.requestUpdateRolePower({permissionIdList:this.permissionIdList,roleId:this.roleId})
        if (res.code == 20000) {
          this.cancelRolePowerList()
          this.$message({
            type:'success',
            message:'保存成功'
          })
        }
      },
      // 取消对当前角色的权限修改
      cancelRolePowerList() {
        this.isShowPowerPage = true
        this.filterPowerArr = []
        this.loading = true
      },
      // 第二个参数:是个对象 里面的checkedNodes存放着所有选中的节点信息
      handleCheckChange(a,{checkedNodes}) {
        this.permissionIdList = []
        // 汇总所有选中的 id
        checkedNodes.forEach(item => {
          this.permissionIdList.push(item.id)
          if (this.permissionIdList.indexOf(item.pid) == -1) {
            this.permissionIdList.push(item.pid)
          }
        })
      },
      // 分页器每页切换展示条数变化的回调
      toggleLimit(pageLimit) {
        this.limit = pageLimit
        this.getRoleList()
      },
      // 分页器当前页变化的回调
      getPageList(page) {
        this.page = page
        this.getRoleList()
      },
      addRole() {},
      editRole(row) {},
      deleteRole(row) {},
    },
    mounted() {
      this.getRoleList()
    },
  }
</script>

