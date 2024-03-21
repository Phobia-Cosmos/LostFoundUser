<template>
  <div>
    <div class="front-notice"><i class="el-icon-bell" style="margin-right: 2px"></i>公告：{{ top }}</div>
    <!--头部-->
    <div class="front-header">
      <div class="front-header-left">
        <img src="@/assets/imgs/logo.png" alt="">
        <div class="title">失物招领平台</div>
      </div>

      <div class="front-header-center">
        <div class="front-header-nav">
          <el-menu :default-active="$route.path" mode="horizontal" router>
            <el-menu-item index="/front/home">首页</el-menu-item>
            <el-menu-item index="/front/item">失物招领广场</el-menu-item>
            <el-menu-item index="/front/suggestion">平台建议</el-menu-item>
          </el-menu>
        </div>
      </div>

      <!--      这个是用户的荣誉数量-->
      <!--      <div style="margin-left: 5px;font-size: 30px">-->
      <!--        <span style="margin-right: 5px;cursor: pointer;" @click=""><i style="color: #ea3f3f" class="el-icon-flower"></i>10</span>-->
      <!--      </div>-->

      <div class="front-header-right">
        <div v-if="!user.username">
          <el-button @click="$router.push('/login')">登录</el-button>
          <el-button @click="$router.push('/register')">注册</el-button>
        </div>

        <div v-else>
          <el-dropdown>
            <div class="front-header-dropdown">
              <img :src="user.avatar" alt="">
              <div style="margin-left: 10px">
                <span>{{ user.name }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div style="text-decoration: none" @click="navTo('/front/myItem')">我的失物招领</div>
              </el-dropdown-item>
              <!--              TODO:这里后续要修改逻辑与后端-->
              <!--              <el-dropdown-item>-->
              <!--                <div style="text-decoration: none" @click="navTo('/front/message')">我的消息</div>-->
              <!--              </el-dropdown-item>-->
              <!--              <el-dropdown-item>-->
              <!--                <div style="text-decoration: none" @click="navTo('/front/person')">个人中心</div>-->
              <!--              </el-dropdown-item>-->
              <a target="_blank" @click.prevent="updateInfo">
                <el-dropdown-item>修改个人信息</el-dropdown-item>
              </a>
              <el-dropdown-item>
                <div style="text-decoration: none" @click="logout">退出</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!--主体-->
    <div class="main-body">
      <router-view ref="child" @update:user="updateUser"/>
    </div>

    <el-dialog width="500px" title="修改个人信息" :visible.sync="showInfoDialog" @close="btnCancelInfo">
      <!-- 放置表单 -->
      <el-form ref="infoForm" label-width="120px" :model="infoForm" :rules="rules">
        <div style="margin: 15px; text-align: center">
          <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="infoForm.avatar" :src="infoForm.avatar" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="infoForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="infoForm.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="infoForm.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="infoForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="学校" prop="school">
          <el-input v-model="infoForm.school" placeholder="学校"></el-input>
        </el-form-item>
        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="primary" @click="update">保 存</el-button>
          <el-button size="mini" @click="btnCancelInfo">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>

import {updateUser} from "@/apis/user";

export default {
  name: "FrontLayout",

  data() {
    return {
      top: '还未想好',
      item: [],
      showInfoDialog: false,
      uploadUrl: 'http://localhost:9090/admin/v2/user/upload',
      infoForm: {
        username: '', // 用户名
        name: '', // 姓名
        phone: '', // 电话
        email: '', // 邮箱
        school: '',
        avatar: ''
      },
      user: JSON.parse(localStorage.getItem("xm-user") || '{}'),
      rules: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '电话不能为空',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入有效的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    // TODO:把这个拦截放到permission中，而不是这里
    if (!this.user.id) {
      this.$router.push('/login')
    }
    this.infoForm.username = this.user.username || '';
    this.infoForm.name = this.user.name || '';
    this.infoForm.phone = this.user.phone || '';
    this.infoForm.email = this.user.email || '';
    console.log(this.user)
  },
  methods: {
    async handleAvatarSuccess(response) {
      this.user.avatar = response.data;
      this.infoForm.avatar = response.data;
      console.log(this.infoForm.avatar)
    },
    updateInfo() {
      this.showInfoDialog = true // 显示弹层
    },
    update() {
      this.$refs.infoForm.validate(async isOK => {
        if (isOK) {
          const res = await updateUser({...this.infoForm, id: this.user.id})
          this.$message.success(res.msg)
          this.btnCancelInfo()
        }
      })
    },
    btnCancelInfo() {
      this.$refs.infoForm.resetFields()
      // 关闭弹层
      this.showInfoDialog = false
    },

    updateUser() {
      this.user = JSON.parse(localStorage.getItem('xm-user') || '{}')   // 重新获取下用户的最新信息
    },
    logout() {
      localStorage.removeItem("xm-user");
      this.$router.push("/login");
    },
    navTo(url) {
      location.href = url;
    },
  }

}
</script>

<style scoped>
@import "@/assets/css/front.css";
</style>
