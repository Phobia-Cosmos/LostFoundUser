<!--<template>-->
<!--  <div>-->
<!--    <el-input v-model="verificationCode" placeholder="请输入验证码" prefix-icon="el-icon-s-check">-->
<!--      <template slot="append">-->
<!--        <el-button :disabled="disableSendButton" @click="sendVerificationCode">{{ buttonText }}</el-button>-->
<!--      </template>-->
<!--    </el-input>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  props: ['value'],-->
<!--  data() {-->
<!--    return {-->
<!--      disableSendButton: false,-->
<!--      buttonText: '发送验证码',-->
<!--      timeRemaining: 0,-->
<!--      timer: null-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    sendVerificationCode() {-->
<!--      // Simulate sending verification code-->
<!--      console.log('Sending verification code:');-->

<!--      // Disable send button-->
<!--      this.disableSendButton = true;-->

<!--      // Start timer-->
<!--      this.timeRemaining = 60;-->
<!--      this.timer = setInterval(() => {-->
<!--        this.timeRemaining&#45;&#45;;-->
<!--        if (this.timeRemaining <= 0) {-->
<!--          clearInterval(this.timer);-->
<!--          this.timer = null;-->
<!--          this.disableSendButton = false;-->
<!--          this.buttonText = '发送验证码'; // Reset button text after countdown ends-->
<!--        } else {-->
<!--          this.buttonText = `${this.timeRemaining} s`; // Update button text with remaining time-->
<!--        }-->
<!--      }, 1000);-->

<!--      // Emit send event with verification code-->
<!--      this.$emit('send', "s");-->
<!--    }-->
<!--  },-->
<!--  beforeDestroy() {-->
<!--    // Clear timer when component is destroyed-->
<!--    if (this.timer) {-->
<!--      clearInterval(this.timer);-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->
<template>
  <div>
    <el-button :disabled="disableSendButton || shouldDisableButton" @click="sendVerificationCode">{{
        buttonText
      }}
    </el-button>
  </div>
</template>

<script>
import {getCode} from "@/apis/user";

export default {
  props: ['username'],
  data() {
    return {
      buttonText: '发送验证码',
      disableSendButton: false,
      timeRemaining: 0,
      timer: null
    };
  },
  computed: {
    shouldDisableButton() {
      return !this.username; // Disable button if username is not provided
    }
  },
  methods: {
    async getCode() {
      try {
        const res = await getCode(this.username);
        // console.log(this.username)
        if (res.code === 200) {
          this.$message.success('验证码发送成功');
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        console.error(error);
        this.$message.error('验证码发送失败，请稍后重试。');
      }
    },
    sendVerificationCode() {
      // If username is not provided, don't send verification code
      if (!this.username) {
        return;
      }

      this.getCode()
      // Simulate sending verification code
      console.log('Sending verification code:', this.username);

      // Disable send button
      this.disableSendButton = true;

      // Start timer
      this.timeRemaining = 60;
      this.timer = setInterval(() => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.disableSendButton = false;
          this.buttonText = '发送验证码'; // Reset button text after countdown ends
        } else {
          this.buttonText = `${this.timeRemaining} s`; // Update button text with remaining time
        }
      }, 1000);

      // Emit send event
      this.$emit('send');
    }
  },
  beforeDestroy() {
    // Clear timer when component is destroyed
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>
