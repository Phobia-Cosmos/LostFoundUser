<template>
  <el-dialog title="修改招领信息" :visible.sync="updateVisible" width="80%" @close="btnCancelUpdate"
             destroy-on-close>
    <!--不写rules，更新的值可以为空-->
    <el-form ref="updateForm" label-width="100px" style="padding-right: 50px" :model="updateForm">
      <el-form-item prop="img" label="物品图片">
        <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            list-type="picture"
            :headers="{ authentication: user.token }"
            :on-success="handleAvatarSuccess"
            :file-list="formattedFileList">
          <el-button type="primary">上传招领物品图片</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item prop="name" label="物品名称">
        <el-input v-model="updateForm.name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="isLost" label="物品状态">
        <el-select v-model="updateForm.isLost" placeholder="请选择状态" style="width: 100%">
          <el-option label="失物" :value="1"></el-option>
          <el-option label="招领" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="description" label="物品描述">
        <div id="editor">
        </div>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" type="primary" @click="modifyItem">确认修改</el-button>
        <el-button size="mini" @click="btnCancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {modifyItem, userGetItemById} from "@/apis/item";
import E from "wangeditor";

export default {
  name: "updateDialog",
  data() {
    return {
      uploadUrl: 'http://localhost:9090/user/v2/user/upload',
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),

      editorVisible: false,

      updateForm: {
        description: "",
        endTime: null,
        id: 0,
        img: "",
        isLost: 0,
        name: "",
        startTime: null,
      },
    }
  },
  props: {
    updateVisible: {
      type: Boolean,
      default: false
    },
    updateForm: {
      type: Object,
      default: () => ({}) // Provide a default empty object if not provided by parent
    }
  },
  // mounted() {
  //   this.getItemById(this.currentNodeId);
  // },
  computed: {
    formattedFileList() {
      if (this.updateForm.img) {
        return [{uid: '-1', url: this.updateForm.img}];
      } else {
        return [];
      }
    }
  },
  methods: {
    // async getItemById(id) {
    //   try {
    //     const response = await userGetItemById(id);
    //     const {data} = response;
    //     // TODO:这个起始时间还没有设置
    //     this.updateForm.name = data.name
    //     this.updateForm.img = data.img
    //     this.updateForm.isLost = data.isLost
    //     this.updateForm.description = data.description
    //   } catch (error) {
    //     console.error('An error occurred while fetching item list:', error);
    //   }
    // },
    async modifyItem() {
      const response = await modifyItem(this.updateForm);
      if (response.code === 200){
        this.$message.success(response.msg)
        this.btnCancelUpdate()
      }
    },
    async handleAvatarSuccess(response) {
      this.updateForm.img = await response.data;
    },
    initWangEditor(content) {
      this.$nextTick(() => {
        this.editor = new E('#editor')
        this.editor.config.placeholder = '请输入内容'
        this.editor.config.uploadFileName = 'file'
        this.editor.config.uploadImgServer = this.uploadUrl
        this.editor.config.uploadImgHeaders = {
          Authorization: this.user.token
        };
        this.editor.create()
        setTimeout(() => {
          this.editor.txt.html(content)
        })
      })
    },
    btnCancelUpdate() {
      this.$refs.updateForm.resetFields() // 重置表单
      this.updateVisible = false
    },
  }
}
</script>


<style scoped>

</style>
