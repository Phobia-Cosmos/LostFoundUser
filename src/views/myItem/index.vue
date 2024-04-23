<template>
  <div class="dashboard-container">
    <div style="width: 80%;margin: 0 auto " class="container">
      <div class="dashboard-widget">
        <div class="widget-header">
          <h2>筛选</h2>
        </div>
        <div class="widget-footer">
          <div class="tableBar">
            <el-form class="form" :label-position="labelPosition" label-width="80px" :inline="inline">
              <el-form-item>
                <template slot="label">
                  <el-tag class="ruletag" type="info" size="medium" effect="dark">物品名称</el-tag>
                </template>
                <el-input v-model="queryParams.name" placeholder="请填写物品名称" clearable @clear="reset"
                          @keyup.enter.native="initFun" style="width: auto;"/>
              </el-form-item>
              <el-form-item>
                <template slot="label">
                  <el-tag class="ruletag" type="info" size="medium" effect="dark">招领状态</el-tag>
                </template>
                <el-select v-model="queryParams.status" style="width: auto" placeholder="请选择" clearable
                           @clear="getItemList">
                  <el-option v-for="(item, index) in [
                    { label: '未审核', value: 0 },
                    { label: '审核失败', value: 1 },
                    { label: '未解决', value: 2 },
                    { label: '已解决', value: 3 }
                  ]" :key="index" :label="item.label" :value="item.value"/>
                </el-select>
                <el-button type="info" icon="el-icon-search" @click="getItemList()" round>搜索</el-button>
              </el-form-item>
            </el-form>
            <!--        TODO:为什么这里会自动变灰？-->
          </div>
        </div>
      </div>
      <div class="myitem">
        <div class="dashboard-widget">
          <div class="widget-header">
            <h2>你发布的招领</h2>
            <div class="widget-controls">
              <div class="button-container">
                <el-button type="info" @click="addButton">发布招领</el-button>
              </div>
            </div>
          </div>
          、
          <div class="widget-content">

            <div class="table">
              <el-table :data="tableData" stripe:true row-key="id">
                <!--          TODO:具体信息点击后显示，或者触碰显示-->
                <el-table-column prop="id" label="序号" align="center" sortable/>
                <el-table-column label="失物招领图片" show-overflow-tooltip>
                  <template v-slot="scope">
                    <el-image style="width: 60px; height: 45px; border-radius: 10%" v-if="scope.row.img"
                              :src="formatImageUrl(scope.row.img)"
                              :preview-src-list="[formatImageUrl(scope.row.img)]"></el-image>
                  </template>
                </el-table-column>

                <el-table-column prop="name" label="失物招领名称"/>
                <el-table-column prop="status" label="失物招领状态" :formatter="formatStatus"/>
                <!-- 下面这个要改一下 -->
                <el-table-column prop="tag" label="物品类型" :formatter="formatTag"/>
                <!-- 下面这个要删除的 -->
                <el-table-column prop="isLost" label="失物招领类型" :formatter="formatIsLost"/>
                <!-- 下面两个是新加的 -->
                <el-table-column prop="color" label="物品颜色" :formatter="formatColor"/>
                <el-table-column prop="region" label="拾取地点" :formatter="formatRegion"/>
                <el-table-column prop="publishTime" label="发表时间"/>
                <el-table-column label="操作" width="220" align="center">
                  <template v-slot="{ row }">
                    <el-button plain type="danger" size="mini" @click="() => delItem(row.id)">删除
                    </el-button>
                    <el-button plain type="success" size="mini" @click="() => updateButton(row.id)">修改
                    </el-button>
                    <el-button plain type="success" size="mini" @click="() => finishItem(row.id)">完成
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-row style="height: 60px" align="middle" type="flex" justify="end">
                <el-pagination layout="total, sizes, prev, pager, next" :total="total" :current-page="queryParams.page"
                               :page-size="queryParams.pageSize" :page-sizes="[5, 10, 20]"
                               @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"/>
              </el-row>
            </div>
          </div>
        </div>
      </div>


      <el-dialog title="修改失物招领" :visible.sync="updateVisible" width="50%" @close="btnCancelUpdate"
                 destroy-on-close>
        <!--不写rules-->
        <el-form ref="updateForm" label-width="150px" style="padding-right: 50px" :model="updateForm">
          <el-form-item prop="img" label="物品图片">
            <el-upload class="avatar-uploader" :action="uploadUrl" list-type="picture"
                       :headers="{ authentication: user.token }" :on-success="handleAvatarSuccess"
                       :file-list="formattedFileList">
              <el-button type="primary">上传招领物品图片(可上传多张图片)</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item prop="name" label="物品名称" label-width="150px">
            <el-input v-model="updateForm.name" autocomplete="off" style="width:205px;"></el-input>
          </el-form-item>
          <el-form-item prop="isLost" label="物品状态" label-width="150px">
            <el-select v-model="updateForm.isLost" placeholder="请选择状态" style="width: auto;">
              <el-option label="失物" :value="1"></el-option>
              <el-option label="招领" :value="0"></el-option>
            </el-select>
          </el-form-item>

          <!-- 新增修改 -->
          <el-form-item label="物品类型" label-width="150px" required>
            <el-select v-model="addForm.tag" placeholder="请选择物品类型" style="width: auto;">
              <el-option v-for="option in tagOptions" :key="option.value" :label="option.label"
                         :value="option.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="失物拾取/遗失区域" prop="" label-width="150px" required>
            <el-select v-model="addForm.region" placeholder="请选择区域" style="width: auto;">
              <el-option v-for="(option, index) in regionOptions" :key="index" :label="option.label"
                         :value="option.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="物品颜色" prop="" label-width="150px " required>
            <el-select v-model="updateForm.color" placeholder="请选择颜色" style="width: auto;">
              <el-option v-for="option in colorOptions" :key="option.value" :label="option.label"
                         :value="option.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="失物拾取/遗失时间" label-width="150px" required>
            <el-col :span="11">
              <el-form-item prop="date">
                <el-date-picker type="date" placeholder="请选择日期" v-model="updateForm.date"
                                style="width: 205px"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="备注" label-width="150px">
            <el-input type="textarea" v-model="updateForm.text"></el-input>
          </el-form-item>
          <!-- /新增修改 -->

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

      <el-dialog title="发布招领" :append-to-body="true" :visible.sync="addVisible" width="50%" @close="btnCancelUpdate"
                 destroy-on-close>
        <el-form ref="addForm" label-width="100px" style="padding-right: 50px" :model="addForm">

          <el-form-item prop="img" label="物品图片" label-width="150px">
            <el-upload class="avatar-uploader" :action="uploadUrl" :headers="{ authentication: user.token }"
                       list-type="picture" :on-success="handleImgSuccess" :file-list="formattedFileList">
              <el-button type="primary">上传招领物品图片(可上传多张图片)</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item prop="name" label="物品名称" label-width="150px">
            <el-input v-model="addForm.name" autocomplete="off" style="width:205px"></el-input>
          </el-form-item>


          <el-form-item label="物品类型" label-width="150px" required>
            <el-select v-model="addForm.tag" placeholder="请选择物品类型" style="width: auto;">
              <el-option v-for="option in tagOptions" :key="option.value" :label="option.label"
                         :value="option.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="拾取区域" prop="" label-width="150px" required>
            <el-select v-model="addForm.region" placeholder="请选择区域" style="width: auto;">
              <el-option v-for="(option, index) in regionOptions" :key="index" :label="option.label"
                         :value="option.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="物品颜色" prop="" label-width="150px " required>
            <el-select v-model="addForm.color" placeholder="请选择颜色" style="width: auto;">
              <el-option v-for="option in colorOptions" :key="option.value" :label="option.label"
                         :value="option.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="拾取时间" label-width="150px" required>
            <el-col :span="11">
              <el-form-item prop="date">
                <el-date-picker type="date" placeholder="请选择日期" v-model="addForm.publishTime"
                                style="width: 205px"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="备注" label-width="150px">
            <el-input type="textarea" v-model="addForm.description"></el-input>
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
      inline: true,
      labelPosition: 'right',
      tableData: [],
      updateVisible: false,
      addVisible: false,
      viewVisible: false,
      uploadUrl: 'http://localhost:9090/user/v2/user/upload', // Define the action URL
      currentNodeId: null, // 存储当前点击的id
      queryParams: {
        page: 1,
        pageSize: 5,
        name: null,
        status: null,
        isLost: 0,
      },
      total: 0,

      addForm: {
        img: "",
        name: "",
        isLost: 0,
        tag: "",
        description: "",
        color: null,
        region: null,
        publishTime: null,
      },
      updateForm: {
        description: "",
        endTime: null,
        id: 0,
        img: "",
        isLost: 0,
        name: "",
        startTime: null,
        //新增属性
        region: '',
        tiemtype: '',
        date: '',
        color: '',
        text: '',
      },

      editor: null,
      viewData: null,
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      colorOptions: [
        {label: '红色', value: 1},
        {label: '蓝色', value: 2},
        {label: '黄色', value: 3},
        {label: '绿色', value: 4},
        {label: '黑色', value: 5},
        {label: '白色', value: 6},
        {label: '紫色', value: 7},
        {label: '橙色', value: 8},
        {label: '灰色', value: 9},
        {label: '粉色', value: 10},
        {label: '褐色', value: 11},
        {label: '银色', value: 12}
      ],
      tagOptions: [
        {label: '证件', value: 1},
        {label: '笔记本/书', value: 2},
        {label: '蓝牙/有线耳机', value: 3},
        {label: '手机', value: 4},
        {label: '雨伞', value: 5},
        {label: '水杯/保温杯', value: 6},
        {label: '其他', value: 7}
      ],
      regionOptions: [
        {label: '一区', value: 'region-1'},
        {label: '二区', value: 'region-2'},
        {label: '三区', value: 'region-3'},
        {label: '四区', value: 'region-4'},
        {label: '五区', value: 'region-5'},
        {label: '六区', value: 'region-6'},
        {label: '七区', value: 'region-7'},
        {label: '八区', value: 'region-8'},
        {label: '一食堂', value: 'cafeteria-1'},
        {label: '二食堂', value: 'cafeteria-2'},
        {label: '三食堂', value: 'cafeteria-3'},
        {label: '四食堂', value: 'cafeteria-4'},
        {label: '五食堂', value: 'cafeteria-5'},
        {label: '六食堂', value: 'cafeteria-6'},
        {label: '七食堂', value: 'cafeteria-7'},
        {label: '八食堂', value: 'cafeteria-8'},
        {label: '第一教学楼', value: 'classbuild-1'},
        {label: '第二教学楼', value: 'classbuild-2'},
        {label: '第三教学楼', value: 'classbuild-3'},
        {label: '第四教学楼', value: 'classbuild-4'},
        {label: '第五教学楼', value: 'classbuild-5'},
        {label: '第六教学楼', value: 'classbuild-6'},
        {label: '第七教学楼', value: 'classbuild-7'},
        {label: '第八教学楼', value: 'classbuild-8'},
        {label: '第九教学楼', value: 'classbuild-9'},
        {label: '第十教学楼', value: 'classbuild-10'}
      ]
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
          publishTime: this.formatDate(record.publishTime)
        }));
        // console.log(this.total)
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
      if (this.addForm.img) {
        this.addForm.img += ',' + response.data;
      } else {
        // If this.addForm.img is empty, set it to the new image URL
        this.addForm.img = response.data;
      }
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
        if (content === "add") {
          this.editor.config.onchange = html => {
            this.addForm.description = html; // Update editorContent whenever content changes
          };
        } else {
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
    formatImageUrl(img) {
      if (!img) return ''; // Return empty string if img is not provided
      const imgUrls = img.split(",");
      const firstImg = imgUrls[0]; // Get the first image URL
      return 'http://118.25.40.159:9090' + firstImg; // Add the prefix to the first image URL
    },
    formatDate(timestamp) {
      const date = new Date(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4]);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    // formatDate(timestamp) {
    //   const date = new Date(timestamp);
    //   const year = date.getFullYear();
    //   const month = String(date.getMonth() + 1).padStart(2, '0');
    //   const day = String(date.getDate()).padStart(2, '0');
    //   return `${year}-${month}-${day}`;
    // },
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
    formatRegion(region) {
      switch (region.region) {
        case 'region-1':
          return '一区';
        case 'region-2':
          return '二区';
        case 'region-3':
          return '三区';
        case 'region-4':
          return '四区';
        case 'region-5':
          return '五区';
        case 'region-6':
          return '六区';
        case 'region-7':
          return '七区';
        case 'region-8':
          return '八区';
        case 'cafeteria-1':
          return '一食堂';
        case 'cafeteria-2':
          return '二食堂';
        case 'cafeteria-3':
          return '三食堂';
        case 'cafeteria-4':
          return '四食堂';
        case 'cafeteria-5':
          return '五食堂';
        case 'cafeteria-6':
          return '六食堂';
        case 'cafeteria-7':
          return '七食堂';
        case 'cafeteria-8':
          return '八食堂';
        case 'classbuild-1':
          return '第一教学楼';
        case 'classbuild-2':
          return '第二教学楼';
        case 'classbuild-3':
          return '第三教学楼';
        case 'classbuild-4':
          return '第四教学楼';
        case 'classbuild-5':
          return '第五教学楼';
        case 'classbuild-6':
          return '第六教学楼';
        case 'classbuild-7':
          return '第七教学楼';
        case 'classbuild-8':
          return '第八教学楼';
        case 'classbuild-9':
          return '第九教学楼';
        case 'classbuild-10':
          return '第十教学楼';
        default:
          return '未知区域';
      }
    },
    formatColor(color) {
      switch (color.color) {
        case 1:
          return '红色';
        case 2:
          return '蓝色';
        case 3:
          return '黄色';
        case 4:
          return '绿色';
        case 5:
          return '黑色';
        case 6:
          return '白色';
        case 7:
          return '紫色';
        case 8:
          return '橙色';
        case 9:
          return '灰色';
        case 10:
          return '粉色';
        case 11:
          return '褐色';
        case 12:
          return '银色';
        default:
          return '未知颜色'
      }
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
    //新加的Tag函数，使用时吧函数最前面的a去掉
    aformatTag(tag) {
      switch (tag) {
        case 1:
          return '证件';
        case 2:
          return '笔记本/书';
        case 3:
          return '蓝牙/有线耳机';
        case 4:
          return '手机';
        case 5:
          return '雨伞';
        case 6:
          return '水杯/保温杯';
        case 7:
          return '其他';
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
  background-color: rgba(255, 255, 255, 0);
  /* 白色背景，50%透明度 */
}

.dashboard-container .container {
  position: relative;
  z-index: 1;
  padding: 30px 28px;
  border-radius: 4px;
  background-color: rgba(red, green, blue, 0) !important;
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
  color: $gray-2;
  /* Assuming $gray-2 is a SASS/SCSS variable, replace with actual color value */
}

.dashboard-container .container .tableBox {
  width: 100%;
  border: 1px solid $gray-5;
  /* Assuming $gray-5 is a SASS/SCSS variable, replace with actual color value */
  border-bottom: 0;
}

.dashboard-container .container .pageList {
  text-align: center;
  margin-top: 30px;
}

.dashboard-widget {
  margin: auto;
  width: 70%;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
  margin-top: -10px;
}

.widget-header {
  background-color: #e4e4e4;
  /* 灰色头部背景 */
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  /* 分割线 */
  display: flex;
  justify-content: space-between;
  /* 标题和控件分开 */
  align-items: center;
}

.widget-controls {
  /* 控件样式 */
}

.widget-content {
}

.widget-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
}

.myitem .dashboard-widget {
  width: 100%;
  margin-top: 30px;
}

.ruletag {
  font-weight: bolder;
  font-size: 13px;
}
</style>
