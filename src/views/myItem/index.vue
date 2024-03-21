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
        <el-button type="primary" plain @click="handleAdd">发布失物招领</el-button>
      </div>

      <!--      <div style="margin: 20px 20px">-->
      <!--        <el-button type="primary" plain @click="handleAdd">发布失物招领</el-button>-->
      <!--      </div>-->

      <div class="table">
        <el-table :data="tableData" stripe:true row-key="id">
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
          <!--          <el-table-column prop="content" label="具体描述信息">-->
          <!--            <template v-slot="scope">-->
          <!--              <el-button type="primary" size="mini" @click="viewEditor(scope.row.content)">点击查看</el-button>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column prop="status" label="失物招领状态" :formatter="formatStatus"/>
          <el-table-column prop="tag" label="物品类型" :formatter="formatTag"/>
          <el-table-column prop="isLost" label="失物招领类型" :formatter="formatIsLost"/>
          <el-table-column prop="startTime" label="起始时间"/>
          <el-table-column prop="endTime" label="截止时间"/>
          <el-table-column prop="publishTime" label="发表时间"/>
          <el-table-column label="操作" width="180" align="center">
            <template v-slot="{ row }">
              <el-button plain type="danger" size="mini"
                         @click="() => delItem(row.id)">删除
              </el-button>
              <el-button plain type="success" size="mini"
                         @click="() => updateItem(row.id)">修改
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

      <el-dialog title="发布招领信息" :visible.sync="fromVisible" width="80%" destroy-on-close>
        <el-form label-width="100px" style="padding-right: 50px" :model="form">
          <el-form-item prop="img" label="物品图片">
            <el-upload
                class="avatar-uploader"
                :action="$baseUrl + '/files/upload'"
                :headers="{ token: user.token }"
                list-type="picture"
                :on-success="handleImgSuccess">
              <el-button type="primary">上传招领物品图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item prop="name" label="物品名称">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="status" label="物品状态">
            <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
              <el-option label="未找到失主" value="未找到失主"></el-option>
              <el-option label="已找到失主" value="已找到失主"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="content" label="物品描述">
            <div id="editor">
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="fromVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改招领信息" :visible.sync="updateVisible" width="80%" destroy-on-close>
        <el-form label-width="100px" style="padding-right: 50px" :model="form">
          <el-form-item prop="img" label="物品图片">
            <!--            :headers="{ token: user.token }"-->
            <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                list-type="picture"
                :on-success="handleAvatarSuccess">
              <el-button type="primary">上传招领物品图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item prop="name" label="物品名称">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="status" label="物品状态">
            <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
              <el-option label="未找到失主" value="未找到失主"></el-option>
              <el-option label="已找到失主" value="已找到失主"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="content" label="物品描述">
            <div id="editor">
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="fromVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="详细信息" :visible.sync="viewVisible" width="80%" :close-on-click-modal="false"
                 destroy-on-close>
        <div v-html="viewData" class="w-e-text w-e-text-container"></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
import {deleteItem, userPageQuery} from "@/apis/item";

export default {
  data() {
    return {
      tableData: [],
      updateVisible: false,
      fromVisible: false,
      viewVisible: false,
      uploadUrl: 'http://localhost:9090/user/v2/user/upload', // Define the action URL

      queryParams: {
        page: 1,
        pageSize: 5,
        name: null,
        status: null,
        isLost: null,
        startTime: null,
        endTime: null
      },
      updateForm: {

      },

      total: 0,

      editor: null,
      viewData: null,
      form: {},
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
    }
  },
  created() {
    this.getItemList()
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
    async updateItem(id) {

    },
    async delItem(ids) {
      const res = await deleteItem(ids)
      if (res.code === 200) {
        this.$message.success(res.msg)
        await this.getItemList()
      }
    },
    async handleAvatarSuccess(response) {
      this.infoForm.avatar = response.data;
      console.log(this.infoForm.avatar)
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
        this.editor.config.uploadImgServer = 'http://localhost:9090/files/wang/upload'
        this.editor.create()
        setTimeout(() => {
          this.editor.txt.html(content)
        })
      })
    },
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
    // load(pageNum){
    //   if (pageNum) this.pageNum = pageNum
    //   this.$request.get('/user/v2/item/page', {
    //     params: {
    //       pageNum: this.pageNum,
    //       pageSize: this.pageSize,
    //       userId:this.user.id
    //     }
    //   }).then(res => {
    //     this.tableData = res.data?.list
    //     this.total = res.data?.total
    //   })
    // },
    handleAdd() {
      this.form = {}
      this.initWangEditor('')
      this.fromVisible = true
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))//这里把form和对象转换成两个东西分隔开
      this.initWangEditor(this.form.content || '')
      this.fromVisible = true
    },
    save() {
      this.form.content = this.editor.txt.html()
      this.$request({
        url: this.form.id ? '/user/v2/item/upload' : '/user/v2/item/',
        method: this.form.id ? 'PUT' : 'POST',
        data: this.form
      }).then(res => {
        if (res.code === 200) {  // 表示成功保存
          this.$message.success('保存成功')
          this.fromVisible = false
          this.load(1)
        } else {
          this.$message.error(res.msg)  // 弹出错误的信息
        }
      })
    },
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
    handleImgSuccess(res) {
      this.form.img = res.data
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
