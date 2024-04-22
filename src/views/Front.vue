<template>
  <div>
    <Header v-show="media==0"></Header>
    <Minheader v-show="media==1"></Minheader>
    <div class="front-notice"><i class="el-icon-bell" style="margin-right: 2px"></i>公告：{{ top }}</div>

    <!--主体-->
    <div class="main-body">
      <router-view ref="child" @update:user="updateUser" />
    </div>

  </div>

</template>

<script>
import Header from '@/views/header.vue';
import { updateUser } from "@/apis/user";
import Minheader from "@/views/minheader.vue";
export default {
  name: "FrontLayout",
  components: {
    Header,
    Minheader
  },
  mounted(){
    document.body.style.backgroundImage = `url(${this.backimgurl})`;
  },
  data() {
    return {
      backimgurl: require('@/assets/imgs/backimg.jpg') ,
      media:0,
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
    console.log(this.user);
    //根据分辨率选择不同的显示
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
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
          const res = await updateUser({ ...this.infoForm, id: this.user.id })
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
    handleResize(){
      //根据分辨率改变显示
      this.media = window.innerWidth < 1000? 1:0;
    },
  }

}
</script>

<style scoped>
@import "@/assets/css/front.css";
</style>
