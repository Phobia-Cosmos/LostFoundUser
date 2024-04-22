<template>
  <div>
    <el-menu class="el-menu-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <div class="headerleft">
        <i class="el-icon-menu header-icon" @click="showdrawer = true"></i>
      </div>
      <div class="headcenter">
        <img class="headericon" style="height: 60px;" src="@/assets/imgs/logo.png" alt="">
        <div class="title">失物招领平台</div>
      </div>
    </el-menu>

    <el-drawer :visible.sync="showdrawer" direction="ltr" :before-close="handleClose" :with-header="false" size="40%">
      <el-col :span="24">
        <el-menu class="el-menu-vertical-demo" @select="handleSelect" background-color="#545c64" text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>页面</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/home">首页</el-menu-item>
              <el-menu-item index="/item">招领广场</el-menu-item>
              <el-menu-item index="/lostitem">遗失广场</el-menu-item>
              <el-menu-item index="/myItem">发布招领</el-menu-item>
              <el-menu-item index="/mylostItem">发布失物</el-menu-item>
              <el-menu-item index="/suggestion">平台建议</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span>我的工作台</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/message">我的消息</el-menu-item>
              <el-menu-item index="update">修改个人信息</el-menu-item>
              <el-menu-item index="logout">退出登录</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-drawer>
  </div>
</template>


<script>
export default {
  data() {
    return {
      showdrawer: false,
    };
  },
  methods: {
    handleClose() {
      this.showdrawer = false;
    },
    handleSelect(selectedIndex, indexPath) {
      console.log("选中的菜单项的 index 是：", selectedIndex);
      console.log("选中菜单项的路径(indexPath)是：", indexPath);
      // 你可以在这里添加代码，比如根据选中的菜单项导航到不同的页面
      switch (selectedIndex) {


        case '/item':
        case '/message':
        case '/myItem':
        case '/suggestion':
        case '/home':
        case '/lostitem':
        case '/mylostItem':
          this.ToPage(selectedIndex);
          break;
        case 'update':
          this.updateInfo();
          break;
        case 'logout':
          this.logout();
      }
    },
    updateInfo() {
      this.showInfoDialog = true // 显示弹层
    },
    ToPage(path) {
      //通过router在内部进行页面切换，不需要多次重新加载
      this.$router.push(path);
    },
    logout() {
      localStorage.removeItem("xm-user");
      this.$router.push("/login");
    },


  }
}
</script>

<style scoped>
.el-menu-demo {
  display: flex;
  height: auto;
  width: 100%;
}

.headerleft {
  align-self: flex-start;
}

.headcenter {
  margin: auto;
  display: flex;
  align-items: center;
}

.el-menu-vertical-demo {
  font-size: 30px;
}
/deep/ .el-drawer{
  background-color: rgb(84, 92, 100) !important; /* 指定颜色 */
}
.title {
  flex: 1;
  color: #9bbabb;
  cursor: pointer;
  margin-left: 10px;
  font-size: 20px;
  font-weight: bold;
}

.header-icon {
  margin: 10px;
  font-size: 40px;
  /* 或你想要的大小 */
  color: rgb(13, 47, 80);
}

.el-submenu .el-menu-item {
  width: 100% !important;
}
</style>