<template>
  <div class="container">
    <div style="display: flex;background-color: white;width: 60%;border-radius: 10px;overflow: hidden;height: 400px;">

      <div style="flex:1">
        <img src="@/assets/imgs/login.png" alt="" style="width: 100%;">
      </div>

      <div style="flex:1;display: flex;align-items: center;justify-content: center">
        <el-form :model="form" style="width: 80%" :rules="rules" ref="formRef">

          <div style="font-size: 30px;font-weight: bold;text-align: center;margin-bottom: 20px">校园失物招领</div>

          <!--TODO:在输入框左侧添加图标或符号。该图标通常用于提供可视化上下文或指示字段中预期的输入类型。-->
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user" placeholder="请输入账号" v-model="form.username" clearable></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" clearable show-password
                      v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <div style="display: flex">
              <el-input style="flex: 1" size="medium" v-model="code"></el-input>
              <Identify :identifyCode="identifyCode"/>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
          </el-form-item>

          <a href="#" @click.prevent="qqLogin">
            <img src="@/assets/imgs/01_qq_logo.jpg" alt="QQ登录" style="width: 32px; height: 18px;">
          </a>

          <div style="display: flex">
            <div style="flex: 1; text-align: right">
              还没有账号？请 <a href="/register">注册</a>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Identify from "@/components/Identify.vue";
import {loginUser, qqLogin} from '@/apis/user.js';

export default {
  name: "Login",
  components: {
    Identify
  },
  data() {
    return {
      form: {
        // TODO:这个不需要
        username: '2078719076@qq.com',
        password: 'lzh2003'
      },
      rules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
      code: '',//表单绑定的属性，验证码
      identifyCode: '',
      identifyCodes: '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    }
  },
  created() {
    this.refreshCode()
    this.code = this.identifyCode
  },
  methods: {
    async qqLogin() {
      await qqLogin()
    },
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[Math.floor(Math.random() * (this.identifyCodes.length))]
      }
      console.log(this.identifyCode)
    },
    login() {
      if (!this.code) {
        this.$message.warning('请输入验证码')
        // TODO：这里不应该是直接刷新吧，还有就是当我们点击验证码时应该要刷新！下方的输入错误也应该不刷新！
        // this.refreshCode()
        return
      }
      if (this.code !== this.identifyCode) {
        this.$message.warning('验证码输入错误')
        // this.refreshCode()
        return
      }
      this.$refs['formRef'].validate(async (valid) => {
        if (valid) {
          try {
            // 这里应该是一个异步调用，还有就是下面的状态码是数字而不是字符串
            const res = await loginUser(this.form);
            if (res.code === 200) {
              localStorage.setItem("xm-user", JSON.stringify(res.data)); // Store user data
              location.href = '/'; // Redirect to the homepage
              this.$message.success('登录成功');
            } else {
              this.$message.error(res.msg);
            }
          } catch (error) {
            console.error(error);
            this.$message.error('An error occurred during registration.');
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("@/assets/imgs/bg.jpg");
  width: 100%;
  position: fixed;
  background-size: 100% 100%;
}

a {
  color: #2a60c9;
}
</style>
