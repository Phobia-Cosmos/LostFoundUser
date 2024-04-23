<template>
  <div class="main-content dashboard-container">
    <div class="dashboard-widget">
      <div class="widget-header">
        <h2>筛选</h2>
        <div class="widget-controls">
          <div class="button-container">
            <el-button type="info" icon="el-icon-search" @click="getItemList()" round>搜索</el-button>
          </div>
        </div>
      </div>
      <div class="widget-content">
        <el-form class="form" :label-position="labelPosition" label-width="80px" :inline="inline">
          <el-form-item>
            <template slot="label">
              <el-tag class="ruletag" type="info" size="medium" effect="dark">物品名称</el-tag>
            </template>
            <el-input v-model="queryParams.name" placeholder="请填写物品名称" clearable @clear="getItemList"
              @keyup.enter.native="initFun" style="width: auto;" />
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <el-tag class="ruletag" type="info" size="medium" effect="dark">招领状态</el-tag>
            </template>
            <el-select v-model="queryParams.status" placeholder="请选择" clearable @clear="getItemList">
              <el-option v-for="(item, index) in [
                { label: '未审核', value: 0 },
                { label: '未解决', value: 2 },
                { label: '已解决', value: 3 }
              ]" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <el-tag class="ruletag" type="info" size="medium" effect="dark">物品类型</el-tag>
            </template>
            <el-select v-model="queryParams.tag" placeholder="请选择物品类型" style="width: auto;">
              <el-option v-for="option in tagOptions" :key="option.value" :label="option.label"
                :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="widget-footer">
        <el-form class="form" :label-position="labelPosition" label-width="80px" :inline="inline">
          <el-form-item>
            <template slot="label">
              <el-tag class="ruletag" type="info" size="medium" effect="dark">拾取区域</el-tag>
            </template>
            <el-select v-model="queryParams.region" placeholder="请选择区域" style="width: auto;">
              <el-option v-for="(option, index) in regionOptions" :key="index" :label="option.label"
                :value="option.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <el-tag class="ruletag" type="info" size="medium" effect="dark">物品颜色</el-tag>
            </template>
            <el-select v-model="queryParams.color" placeholder="请选择颜色" style="width: auto;">
              <el-option v-for="option in colorOptions" :key="option.value" :label="option.label"
                :value="option.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <el-tag class="ruletag"  type="info" size="medium" effect="dark" >发布时间</el-tag>
            </template>
            <el-date-picker v-model="queryParams.publishTime" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期"
              :default-time="['00:00:00', '23:59:59']" />

          </el-form-item>
        </el-form>
      </div>
    </div>

    <div style=" width:80%;margin: 20px auto" class="container">


      <div type="flex" align="top" style="margin-top: 20px">
        <el-row class="selcard" :gutter="20">
          <el-col :span="colspan" v-for="item in itemData" style="margin-bottom: 20px">
            <div class="transition card" @click="viewContent(item)">
              <div style="display: flex"><!--由于后台还没有设置好现在使用静态处理-->
                <img :src="item.img[0]" alt=""
                  style="height: 75px; width: 75px;border: 1px solid #eeeeee;border-radius: 15px;">

                <div style="margin-left: 10px">
                  <div  style="font-weight: 550;max-height: 20px;">{{ item.name }}</div>
                  <div style="margin-top: 10px;font-size: 12px"><el-tag size="mini" type="success">发布人:{{ item.userId }}</el-tag></div>
                  <!--根据用户id关联一下找出用户名称-->
                  <div style="margin-top: 5px;font-size: 12px"><el-tag size="mini" type="info">时间:{{ item.startTime }} -{{ item.endTime }}</el-tag>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-row style="height: 60px" align="middle" type="flex" justify="end">
        <el-pagination layout="total, sizes, prev, pager, next" :total="total" :current-page="queryParams.page"
          :page-size="queryParams.pageSize" :page-sizes="[8, 16, 20]" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" >

        </el-pagination>
      </el-row>
    </div>

    <el-dialog title="详细信息" :visible.sync="viewVisible" v-if="currentNode" width="50%" destroy-on-close>
      <!-- <div v-html="viewData" class="w-e-text w-e-text-container"></div> -->
      <el-container>

        <el-aside class="el-aside-card">
          <el-image v-if="currentNode.img && currentNode.img.length > 0" class="mainjpg" :src="currentNode.img[0]"
            fit="contain"></el-image>
        </el-aside>

        <el-main style="width: auto;height: 200px;">
          <el-descriptions :column="column" :size="size" border>
            <el-descriptions-item label="姓名">
              {{ currentNode.name || '未知' }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号">
              {{ currentNode.phone || '未知' }}
            </el-descriptions-item>
            <el-descriptions-item label="物品类型">
              {{ currentNode.tag }}
            </el-descriptions-item>
            <el-descriptions-item label="物品拾取地点">
              {{ currentNode.region }}
            </el-descriptions-item>
            <el-descriptions-item label="拾取时间">
              {{ currentNode.publishTime }}
            </el-descriptions-item>
            <el-descriptions-item label="颜色">
              {{ currentNode.color }}
            </el-descriptions-item>
            <el-descriptions-item label="备注">
              {{ currentNode.description }}
            </el-descriptions-item>
          </el-descriptions>
        </el-main>
      </el-container>
      <div>
        <b class="anyimgtext">其他图片预览</b>
      </div>

      <el-main>
        <div class="demo-image">
          <div v-if="currentNode.img" class="block" v-for="(img, index) in currentNode.img" :key="index">
            <el-image class="anyimg" :src="img" fit="contain"></el-image>
          </div>
        </div>
      </el-main>
    </el-dialog>

  </div>
</template>

<script>
import { userPageQuery } from "@/apis/item";
import { getUserById } from "@/apis/user";

export default {
  name: 'Item',
  data() {
    return {

      column: 2,
      labelPosition: 'right',
      inline: true,
      colspan: 6,
      itemData: [],

      queryParams: {
        page: 1,
        pageSize: 8,
        name: null,
        status: null,
        isLost: 1,
        //这里tag现在有数据了
        tag: null,
        //时间换成一个框框了，只有一个时间输入，然后从这个时间至今来查询
        publishTime: '',
        //新加属性
        region: null,
        color: null,
      },
      total: 0,

      // dialog for certain item
      currentNode: {
        name: null,
        phone: null,
        tag: null,
        region: null,
        color: null,
        publishTime: null,
        description: null
      },
      viewVisible: false,

      size: '',
      viewData: null,
      fromVisible: false,
      content: null,
      from: {},
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),

      medium: 'medium', // Define the medium property with a value
      fits: ['contain'],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      colorOptions: [
        { label: '红色', value: 1 },
        { label: '蓝色', value: 2 },
        { label: '黄色', value: 3 },
        { label: '绿色', value: 4 },
        { label: '黑色', value: 5 },
        { label: '白色', value: 6 },
        { label: '紫色', value: 7 },
        { label: '橙色', value: 8 },
        { label: '灰色', value: 9 },
        { label: '粉色', value: 10 },
        { label: '褐色', value: 11 },
        { label: '银色', value: 12 }
      ],
      tagOptions: [
        { label: '证件', value: 1 },
        { label: '笔记本/书', value: 2 },
        { label: '蓝牙/有线耳机', value: 3 },
        { label: '手机', value: 4 },
        { label: '雨伞', value: 5 },
        { label: '水杯/保温杯', value: 6 },
        { label: '其他', value: 7 }
      ],
      regionOptions: [
        { label: '一区', value: 'region-1' },
        { label: '二区', value: 'region-2' },
        { label: '三区', value: 'region-3' },
        { label: '四区', value: 'region-4' },
        { label: '五区', value: 'region-5' },
        { label: '六区', value: 'region-6' },
        { label: '七区', value: 'region-7' },
        { label: '八区', value: 'region-8' },
        { label: '一食堂', value: 'cafeteria-1' },
        { label: '二食堂', value: 'cafeteria-2' },
        { label: '三食堂', value: 'cafeteria-3' },
        { label: '四食堂', value: 'cafeteria-4' },
        { label: '五食堂', value: 'cafeteria-5' },
        { label: '六食堂', value: 'cafeteria-6' },
        { label: '七食堂', value: 'cafeteria-7' },
        { label: '八食堂', value: 'cafeteria-8' },
        { label: '第一教学楼', value: 'classbuild-1' },
        { label: '第二教学楼', value: 'classbuild-2' },
        { label: '第三教学楼', value: 'classbuild-3' },
        { label: '第四教学楼', value: 'classbuild-4' },
        { label: '第五教学楼', value: 'classbuild-5' },
        { label: '第六教学楼', value: 'classbuild-6' },
        { label: '第七教学楼', value: 'classbuild-7' },
        { label: '第八教学楼', value: 'classbuild-8' },
        { label: '第九教学楼', value: 'classbuild-9' },
        { label: '第十教学楼', value: 'classbuild-10' }
      ]
    }
  },
  created() {
    this.getItemList();
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      if(window.innerWidth < 1080){
        if (window.innerWidth < 1080 && window.innerWidth > 768) {
        this.column = 1;
        this.colspan = 12;
      }
      if (window.innerWidth <= 768) {
        this.inline = false;
        this.colspan = 12;
      } else {
        this.inline = true;
      }
      }else{
        this.column = 2;
        this.colspan = 6;
        this.inline = true;
      }

    },
    async getItemList() {
      try {
        const response = await userPageQuery(this.queryParams);
        const { data } = response;
        const { records, total } = data;
        this.total = total;

        this.itemData = records.map(record => {
          let formattedImgs;
          const { img } = record;
          if (img) {
            const prefix = 'http://118.25.40.159:9090'; // Prefix for the image URLs
            formattedImgs = img.split(',').map(url => `${prefix}${url}`);
          } else {
            formattedImgs = ['http://118.25.40.159:9090/lostfound/2024/04/04/e276a0c7951942d28845b4b68aa56824.jpg'];
          }
          return {
            ...record,
            img: formattedImgs,
            publishTime: this.formatDate(record.publishTime)
          };
        });
        console.log(this.itemData)
      } catch (error) {
        console.error('An error occurred while fetching item list:', error);
      }
    },
    async viewContent(item) {
      const response = await getUserById(item.userId);
      const { data } = response;
      const { name, phone } = data || {};
      const extractedName = name ?? null;
      const extractedPhone = phone ?? null;

      const { img, tag, region, color, publishTime, description } = item;
      console.log(img)

      const tagLabel = this.tagOptions.find(option => option.value === tag)?.label || '';
      const regionLabel = this.regionOptions.find(option => option.value === region)?.label || '';
      const colorLabel = this.colorOptions.find(option => option.value === color)?.label || '';

      this.currentNode = {
        name: extractedName,
        phone: extractedPhone,
        tag: tagLabel,
        region: regionLabel,
        color: colorLabel,
        publishTime,
        description,
        img
      };

      this.viewVisible = true;
    },
    initFun() {
      this.page = 1
      this.getItemList()
    },
    formatDate(dateArray) {
      const year = dateArray[0];
      const month = String(dateArray[1]).padStart(2, '0');
      const day = String(dateArray[2]).padStart(2, '0');
      return `${year}-${month}-${day}`;
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
    formatImageUrl(img) {
      if (!img) return ''; // Return empty string if img is not provided
      const imgUrls = img.split(",");
      const firstImg = imgUrls[0]; // Get the first image URL
      return 'http://118.25.40.159:9090' + firstImg; // Add the prefix to the first image URL
    },
    // TODO:联系模块还没有写！！
    contact(item) {
      this.form = JSON.parse(JSON.stringify(item))  //生成另一个对象和item相等但是他们是不同的对象
      this.fromVisible = true
    },
    // submit() {
    //   if (this.user.id === this.form.userId) {
    //     this.$message.warning('您不能联系自己')
    //     this.fromVisible = false
    //     this.content = null
    //     return
    //   }
    //   let data = {
    //     articleId: this.form.id,
    //     type: '招领广场',
    //     fromId: this.user.id,
    //     toId: this.form.userId,
    //     content: this.content
    //   }
    //   this.$request.post('/user/v2/message', data).then(res => {
    //     if (res.code === 200) {
    //       this.$message.success('留言成功，等待对方联系')
    //       this.content = null
    //       this.fromVisible = false
    //     } else {
    //       this.$message.error(res.msg)
    //     }
    //   })
    // },
  }
}
</script>
<style scoped>
@media screen and (max-width: 1000px) {
  .dashboard-container .container .tableBar {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    align-items: flex-end;
  }

  .el-col-12{
  width: 100% !important;
}
  .selcard {
    display: flex;
    flex-direction: column;
  }
}
.el-col-12{
  width: 50%;
}
.el-tag {
  font-weight: bolder;
}

.form {
  margin: auto 30px !important;
  margin-bottom: -10px !important;
  padding-left: 30px;
}

.active {
  color: #ce0e0e !important;
}

.dashboard-container {
  margin: 30px;
}

.dashboard-container .container {
  position: relative;
  z-index: 1;
  padding: 14px 28px;
  border-radius: 4px;
}

.dashboard-container .container .normal-btn {
  margin-left: 20px;
  max-width: 100px;
}

.dashboard-container .container .tableBar {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
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

.el-descriptions .is-bordered {
  table-layout: fixed !important;
}



/*物品详情style-card*/
.el-dialog__body {
  padding: 10px 20px !important;
}



.el-main {
  background-color: #E9EEF3;
  color: #333;

}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  display: flex;
  /* 将el-aside设置为Flex容器 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100% !important;
  width: 30% !important;
}

.el-descriptions {
  width: auto;
}

.demo-image {
  display: flex;
  overflow-x: auto;
  /* 允许水平滚动 */
  margin-left: -5px;
  /* 初始左边距调整 */
  height: auto;
  /* 根据图片高度自适应，或者设置固定高度 */
}

.block {
  flex: 0 0 auto;
  margin: 5px;
  /* 设置间距为5px */
  display: inline-flex;
}

.anyimgtext {
  text-align: center;
  font-size: 20px;
}

.anyimg {
  height: 200px;
  /* 保持图片原始比例 */
  width: auto;
}

.mainjpg {
  height: 200px;
}

.dashboard-widget {
  margin: auto;
  width: 70%;
  border: 1px solid #ffffff;
  border-radius: 4px;
  background-color: #ffffff;
  margin-top: 50px;
}

.widget-header {
  background-color: #d5d5d5;
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
  padding: 10px;
  display: flex;
  justify-content: flex-start;
}

.widget-footer {
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
}
.ruletag{
  font-weight:bolder;
  font-size: 13px;
}
</style>
