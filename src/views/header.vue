<template>
    <div>
        <el-menu class="el-menu-demo header" mode="horizontal" @select="handleSelect" background-color="#545c64"
            text-color="#fff" active-text-color="#ffd04b">
            <div class="front-header-left">
                <img class="headericon" style="height: 60px;" src="@/assets/imgs/logo.png" alt="">
                <div class="title">失物招领平台</div>
            </div>
            <el-menu-item index="/home">首页</el-menu-item>
            <el-menu-item index="/item">招领广场</el-menu-item>
            <el-menu-item index="/lostitem">遗失广场</el-menu-item>
            <el-menu-item index="/myItem">发布招领</el-menu-item>
            <el-menu-item index="/mylostItem">发布失物</el-menu-item>
            <el-menu-item index="/suggestion">平台建议</el-menu-item>
            <div class="chatpage">
                <el-badge :value="megnum" class="item">
                    <el-button size="small" @click="$router.push('/chat')" type="info" style="font-size: 16px;">
                        <i class="el-icon-chat-dot-round" style="font-weight: bolder;">聊天消息</i>
                    </el-button>
                </el-badge>
            </div>

            <!-- 这里不再需要额外的div -->
            <el-submenu index="2" class="mydesk">

                <template slot="title">我的工作台</template>
                <div class="selectiontext" style="width: 100px;">
                    <el-menu-item index="/message">我的消息</el-menu-item>
                    <el-menu-item index="update">修改个人信息</el-menu-item>
                    <el-menu-item index="logout">退出登录</el-menu-item>
                </div>

            </el-submenu>
        </el-menu>
        <el-dialog width="500px" title="修改个人信息" :visible.sync="showInfoDialog" @close="btnCancelInfo">
            <!-- 放置表单 -->
            <el-form ref="infoForm" label-width="120px" :model="infoForm" :rules="rules">
                <div style="margin: 15px; text-align: center">
                    <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
                        :on-success="handleAvatarSuccess">
                        <img v-if="infoForm.avatar" :src="infoForm.avatar" style="height: 200px;width: auto;"
                            class="avatar" />
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

<style></style>

<script>
export default {
    data() {
        return {
            megnum:12,
            top: '还未想好',
            item: [],
            showInfoDialog: false,
            infoForm: {
                username: '', // 用户名
                name: '', // 姓名
                phone: '', // 电话
                email: '', // 邮箱
                school: '',
                avatar: ''
            },
            uploadUrl: 'http://localhost:9090/admin/v2/user/upload',
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
        };
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
        handleSelect(selectedIndex, indexPath) {
            //根据选中的菜单项导航到不同的页面
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
        //这个函数是用来干嘛的？？？
        async handleAvatarSuccess(response) {
            this.user.avatar = response.data;
            this.infoForm.avatar = response.data;
            console.log(this.infoForm.avatar)
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
        updateInfo() {
            this.showInfoDialog = true // 显示弹层
        },
        navTo(url) {
            //导航到网址，完全重新加载页面
            location.href = url;
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

<style>
.header {
    display: flex;
    flex-direction: row;
}

.mydesk {
    margin-left: auto;
    /* 自动推到最右侧 */
}


.selectiontext {
    text-align: center !important;
}

.submenu-popper .el-menu--popup {
    transform: translateX(-200%) !important;
    width: 100px !important;
    min-width: 100px !important;
}

.el-menu--popup {
    width: 100px !important;
    min-width: 100px !important;
}

.el-submenu .el-menu-item {
    width: 100px;
    min-width: 100px;
}
.chatpage{
    display:flex;
    justify-content: end;
    align-items: center;
    background-color: rgb(0, 0, 0,0);
    width: 40%;
}
</style>