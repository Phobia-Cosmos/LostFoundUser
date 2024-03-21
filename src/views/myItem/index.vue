<template>
  <div class="dashboard-container">
    <div style="width: 80%;margin: 0 auto " class="container">
      <div class="tableBar">
        <label style="margin-right: 10px">物品名称：</label>
        <el-input v-model="queryParams.name"
                  placeholder="请填写物品名称"
                  style="width: 14%"
                  clearable
                  @clear="reset"
                  @keyup.enter.native="initFun"/>

        <label style="margin-right: 10px; margin-left: 20px">失物招领状态：</label>
        <el-select v-model="queryParams.status"
                   style="width: 14%"
                   placeholder="请选择"
                   clearable
                   @clear="getItemList">
          <el-option v-for="(item, index) in [
                            { label: '未审核', value: 0 },
                            { label: '审核失败', value: 1 },
                            { label: '未解决', value: 2 },
                            { label: '已解决', value: 3 }
                          ]"
                     :key="index"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
        <el-button class="normal-btn continue"
                   @click="getItemList()">
          查询
        </el-button>
        <!--        TODO:为什么这里会自动变灰？-->
        <el-button type="primary" plain @click="addButton">发布失物招领</el-button>
      </div>

      <div class="table">
        <el-table :data="tableData" stripe:true row-key="id">
          <!--          TODO:具体信息点击后显示，或者触碰显示-->
          <el-table-column prop="id" label="序号" width="80" align="center" sortable/>
          <el-table-column label="失物招领图片" show-overflow-tooltip>
            <template v-slot="scope">
              <el-image style="width: 60px; height: 45px; border-radius: 10%"
                        v-if="scope.row.img"
                        :src="scope.row.img"
                        :preview-src-list="[scope.row.img]"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="失物招领名称"/>
          <el-table-column prop="status" label="失物招领状态" :formatter="formatStatus"/>
          <el-table-column prop="tag" label="物品类型" :formatter="formatTag"/>
          <el-table-column prop="isLost" label="失物招领类型" :formatter="formatIsLost"/>
          <el-table-column prop="startTime" label="起始时间"/>
          <el-table-column prop="endTime" label="截止时间"/>
          <el-table-column prop="publishTime" label="发表时间"/>
          <el-table-column label="操作" width="220" align="center">
            <template v-slot="{ row }">
              <el-button plain type="danger" size="mini"
                         @click="() => delItem(row.id)">删除
              </el-button>
              <el-button plain type="success" size="mini"
                         @click="() => updateButton(row.id)">修改
              </el-button>
              <el-button plain type="success" size="mini"
                         @click="() => finishItem(row.id)">完成
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
              layout="total, sizes, prev, pager, next"
              :total="total"
              :current-page="queryParams.page"
              :page-size="queryParams.pageSize"
              :page-sizes="[5, 10, 20]"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
          />
        </el-row>
      </div>

      <el-dialog title="修改失物招领" :visible.sync="updateVisible" width="80%" @close="btnCancelUpdate"
                 destroy-on-close>
        <!--不写rules-->
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

      <el-dialog title="详细信息" :visible.sync="viewVisible" width="80%" :close-on-click-modal="false"
                 destroy-on-close>
        <div v-html="viewData" class="w-e-text w-e-text-container"></div>
      </el-dialog>

      <el-dialog title="发布失物招领" :visible.sync="addVisible" width="80%" @close="btnCancelUpdate" destroy-on-close>
        <el-form ref="addForm" label-width="100px" style="padding-right: 50px" :model="addForm">
          <el-form-item prop="img" label="物品图片">
            <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="{ authentication: user.token }"
                list-type="picture"
                :on-success="handleImgSuccess"
                :file-list="formattedFileList">
              <el-button type="primary">上传招领物品图片</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item prop="name" label="物品名称">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item prop="isLost" label="物品状态">
            <el-select v-model="addForm.isLost" placeholder="请选择状态" style="width: 100%">
              <el-option label="失物" :value="1"></el-option>
              <el-option label="招领" :value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="description" label="物品描述">
            <div id="editor">
            </div>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="publishItem">确认新增</el-button>
            <el-button size="mini" @click="btnCancelAdd">取消</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
import {deleteItem, finishItem, modifyItem, publishItem, userGetItemById, userPageQuery} from "@/apis/item";

export default {
  data() {
    return {
      tableData: [],
      updateVisible: false,
      addVisible: false,
      viewVisible: false,
      uploadUrl: 'http://localhost:9090/user/v2/user/upload', // Define the action URL

      currentNodeId: null, // 存储当前点击的id

      addForm: {
        description: "",
        img: "",
        isLost: 0,
        name: "",
      },
      updateForm: {
        description: "",
        endTime: null,
        id: 0,
        img: "",
        isLost: 0,
        name: "",
        startTime: null,
      },
      queryParams: {
        page: 1,
        pageSize: 5,
        name: null,
        status: null,
        isLost: null,
        startTime: null,
        endTime: null
      },
      total: 0,

      editor: null,
      viewData: null,
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
    }
  },
  created() {
    this.getItemList()
  },
  // TODO:如何动态获取编辑器中的数据？
  // watch: {
  //   'updateForm.description': function(newVal, oldVal) {
  //     console.log('Description changed:', newVal);
  //   }
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
    async getItemList() {
      try {
        const response = await userPageQuery({...this.queryParams, userId: this.user.id});
        const {data} = response;
        const {records, total} = data;
        this.total = total;
        this.tableData = records.map(record => ({
          ...record,
          startTime: this.formatDate(record.startTime),
          endTime: this.formatDate(record.endTime),
          publishTime: this.formatDate(record.publishTime)
        }));
        console.log(this.total)
        console.log(this.tableData)
      } catch (error) {
        console.error('An error occurred while fetching item list:', error);
      }
    },
    async delItem(ids) {
      const res = await deleteItem(ids)
      if (res.code === 200) {
        this.$message.success(res.msg)
        await this.getItemList()
      }
    },
    async getItemById(id) {
      try {
        const response = await userGetItemById(id);
        const {data} = response;
        // TODO:这个起始时间还没有设置
        this.updateForm.name = data.name
        this.updateForm.img = data.img
        this.updateForm.isLost = data.isLost
        this.updateForm.description = data.description
      } catch (error) {
        console.error('An error occurred while fetching item list:', error);
      }
    },
    async finishItem(id) {
      const res = await finishItem(id)
      if (res.code === 200) {
        this.$message.success(res.msg)
        await this.getItemList()
      }
    },
    async publishItem() {
      const response = await publishItem({...this.addForm, userId: this.user.id});
      if (response.code === 200) {
        this.$message.success(response.msg)
        this.btnCancelAdd()
        await this.getItemList()
      }
    },
    async modifyItem() {
      const response = await modifyItem(this.updateForm);
      if (response.code === 200) {
        this.$message.success(response.msg)
        this.btnCancelUpdate()
        await this.getItemList()
      }
    },
    // ------------------------------------------------------------------------------------
    // 更新过程中图片上传成功后回传图片路径到更新表单中
    async handleAvatarSuccess(response) {
      this.updateForm.img = await response.data;
    },
    async handleImgSuccess(response) {
      this.addForm.img = await response.data;
    },
    initFun() {
      this.page = 1
      this.getItemList()
    },
    initWangEditor(content) {
      this.$nextTick(() => {
        this.editor = new E('#editor')
        this.editor.config.placeholder = '请输入内容'
        this.editor.config.uploadFileName = 'file'
        this.editor.config.uploadImgServer = this.uploadUrl
        if(content === "add"){
          this.editor.config.onchange = html => {
            this.addForm.description = html; // Update editorContent whenever content changes
          };
        }else {
          this.editor.config.onchange = html => {
            this.updateForm.description = html; // Update editorContent whenever content changes
          };
        }
        this.editor.create()
        setTimeout(() => {
          this.editor.txt.html(content)
        })
      })
    },
    // TODO:注意这里一定要await否则编辑器中得不到数据
    async addButton() {
      this.addVisible = true
      this.handleAdd()
    },
    async updateButton(id) {
      this.updateForm.id = id
      this.updateVisible = true
      await this.getItemById(id)
      this.handleUpdate()
    },
    // ------------------------------------------------------------------------------------
    handleAdd() {
      this.initWangEditor("add")
      this.addVisible = true
    },
    handleUpdate() {
      this.initWangEditor("update")
      this.updateVisible = true
    },
    btnCancelAdd() {
      this.$refs.addForm.resetFields() // 重置表单
      this.addVisible = false
    },
    btnCancelUpdate() {
      this.$refs.updateForm.resetFields() // 重置表单
      this.updateVisible = false
    },
    // ------------------------------------------------------------------------------------
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    formatStatus(status) {
      switch (status.status) {
        case 0:
          return '未审核';
        case 1:
          return '审核失败';
        case 2:
          return '未解决';
        case 3:
          return '已解决';
        default:
          return '未知状态';
      }
    },
    formatIsLost(isLost) {
      return isLost.isLost ? '失物' : '招领';
    },
    formatTag(tag) {
      switch (tag.tag) {
        case 0:
          return '日常物品';
        case 1:
          return '贵重物品';
        default:
          return '未知种类';
      }
    },
    // handleEdit(row) {
    //   this.form = JSON.parse(JSON.stringify(row))//这里把form和对象转换成两个东西分隔开
    //   this.initWangEditor(this.form.content || '')
    //   this.fromVisible = true
    // },
    reset() {
      this.queryParams.name = null
      this.getItemList()
    },
    handleCurrentChange(pageNum) {
      this.queryParams.page = pageNum;
      this.getItemList();
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.getItemList();
    },
    // viewEditor(content) {
    //   this.viewData = content
    //   this.viewVisible = true
    // },
  }
}
</script>

<style>
.dashboard-container {
  margin: 30px;
}

.dashboard-container .container {
  background: #fff;
  position: relative;
  z-index: 1;
  padding: 30px 28px;
  border-radius: 4px;
}

.dashboard-container .container .normal-btn {
  background: #333333;
  color: white;
  margin-left: 20px;
}

.dashboard-container .container .tableBar {
  margin-bottom: 20px;
}

.dashboard-container .container .tableBar .tableLab {
  display: inline-block;
  float: right;
}

.dashboard-container .container .tableBar .tableLab span {
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  padding: 0 20px;
  color: $gray-2; /* Assuming $gray-2 is a SASS/SCSS variable, replace with actual color value */
}

.dashboard-container .container .tableBox {
  width: 100%;
  border: 1px solid $gray-5; /* Assuming $gray-5 is a SASS/SCSS variable, replace with actual color value */
  border-bottom: 0;
}

.dashboard-container .container .pageList {
  text-align: center;
  margin-top: 30px;
}

</style>
