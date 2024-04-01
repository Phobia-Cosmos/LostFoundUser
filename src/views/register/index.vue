<template>
  <div class="container">

    <div style="width: 400px; padding: 30px; background-color: white; border-radius: 5px;">
      <div style="text-align: center; font-size: 20px; margin-bottom: 20px; color: #333">注册</div>

      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入手机号/邮箱" v-model="form.username"
                    clearable></el-input>
        </el-form-item>

        <el-form-item prop="verifyCode">
          <el-input v-model="form.code" placeholder="请输入验证码">
            <template slot="append">
              <verification-code-input :username="form.username" :disabled="isButtonDisabled" @send="updateVerifyCode"></verification-code-input>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" show-password
                    v-model="form.password" clearable></el-input>
        </el-form-item>

        <el-form-item prop="confirmPass">
          <el-input prefix-icon="el-icon-lock" placeholder="请确认密码" show-password
                    v-model="form.confirmPass"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button style="width: 100%; background-color: #333; border-color: #333; color: white" @click="register">注
            册
          </el-button>
        </el-form-item>

        <div style="display: flex; align-items: center">
          <div style="flex: 1"></div>
          <div style="flex: 1; text-align: right">
            已有账号？请 <a href="/login">登录</a>
          </div>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script>
import {registerUser} from "@/apis/user";
import VerificationCodeInput from './components/VerificationCodeInput.vue';


export default {
  name: "Register",
  components: {
    VerificationCodeInput
  },
  data() {
    // 验证码校验
    const validatePassword = (rule, confirmPass, callback) => {
      if (confirmPass === '') {
        callback(new Error('请确认密码'))
      } else if (confirmPass !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: '',
        code: '',
        password: '',
        confirmPass: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
        ],
        confirmPass: [
          {validator: validatePassword, trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    isButtonDisabled() {
      return !this.form.username; // Disable the button if username is not provided
    }
  },
  created() {

  },
  methods: {
    async register() {
      this.$refs['formRef'].validate(async (valid) => {
        if (valid) {
          try {
            // Call the registerUser function to register the user
            const res = await registerUser(this.form);
            if (res.code === 200) {
              this.$router.push('/'); // Redirect to the login page
              this.$message.success('注册成功');
            } else {
              this.$message.error(res.msg);
            }
          } catch (error) {
            console.error(error);
            this.$message.error('注册失败，请稍后重试。');
          }
        }
      });
    },
    updateVerifyCode() {
      // this.$message.success("验证码已发送")
    },
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/imgs/bg1.jpg");
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

a {
  color: #2a60c9;
}
</style>
