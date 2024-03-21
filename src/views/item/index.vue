<template>
  <div class="main-content dashboard-container">
    <div style="color: darkblue; font-size: 25px;font-weight: 550;">
      欢迎来到招领广场，如果您看到自己的物品，请尽快联系捡到的小伙伴！！！
    </div>
    <div style=" width:80%;margin: 20px auto" class="container">
      <!--      <div style="margin-top: 30px">-->
      <!--        <el-input placeholder="请输入标题查询" style="width: 200px" v-model="name" ></el-input>-->
      <!--        <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>-->
      <!--        <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>-->
      <!--      </div>-->
      <div class="tableBar">
        <label style="margin-right: 10px">物品名称：</label>
        <el-input v-model="queryParams.name"
                  placeholder="请填写物品名称"
                  style="width: 10%"
                  clearable
                  @clear="getItemList"
                  @keyup.enter.native="initFun"/>

        <label style="margin-right: 10px; margin-left: 20px">失物招领状态：</label>
        <el-select v-model="queryParams.status"
                   style="width: 8%"
                   placeholder="请选择"
                   clearable
                   @clear="getItemList">
          <el-option v-for="(item, index) in [
                            { label: '未审核', value: 0 },
                            { label: '未解决', value: 2 },
                            { label: '已解决', value: 3 }
                          ]"
                     :key="index"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>

        <label style="margin-right: 10px; margin-left: 20px">物品状态：</label>
        <el-select v-model="queryParams.isLost"
                   style="width: 8%"
                   placeholder="请选择"
                   clearable
                   @clear="getItemList">
          <el-option :label="'招领'" :value="0"/> <!-- Option for 招领 -->
          <el-option :label="'失物'" :value="1"/> <!-- Option for 失物 -->
        </el-select>


        <label style="margin-right: 10px; margin-left: 20px">物品发布时间：</label>
        <el-date-picker
            v-model="valueTime"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 20%; margin-left: 6px"
            @clear="init(orderStatus)"
        />
        <el-button class="normal-btn continue"
                   @click="getItemList()">
          查询
        </el-button>
      </div>

      <div style="margin-top: 20px">
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in itemData" style="margin-bottom: 20px">
            <div class="transition card" @click="viewContent(item.description)">
              <div style="display: flex"><!--由于后台还没有设置好现在使用静态处理-->
                <img :src="item.img" alt=""
                     style="height: 75px; width: 75px;border: 1px solid #eeeeee;border-radius: 15px">
                <div style="margin-left: 10px">
                  <div style="font-weight: 550;color: #0066BC">{{ item.name }}</div>
                  <div style="margin-top: 10px;color:#666666;font-size: 12px">发布人:{{ item.userId }}</div>
                  <!--根据用户id关联一下找出用户名称-->
                  <div style="margin-top: 5px;color:#666666;font-size: 12px">时间:{{ item.startTime }} -
                    {{ item.endTime }}
                  </div>
                </div>
                <div style="margin-left: 5px;font-size: 20px;color: #666">
                  <span style="margin-right: 5px;cursor: pointer;" @click="setFlower(item)"
                        :class="{'active':item.userFlower}"><i class="el-icon-flower"></i>{{ item.flowerCount }}</span>
                </div>
              </div>
              <div style="margin-top: 20px;text-align: center">
                <el-button type="success" size="mini" @click.stop="contact(item)">联系拾到者</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-row style="height: 60px" align="middle" type="flex" justify="end">
        <el-pagination
            layout="total, sizes, prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pageSize"
            :page-sizes="[8, 16, 20]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />
      </el-row>
    </div>

    <el-dialog title="详细信息" :visible.sync="viewVisible" width="80%" destroy-on-close>
      <div v-html="viewData" class="w-e-text w-e-text-container"></div>
    </el-dialog>

    <el-dialog title="留言信息" :visible.sync="fromVisible" width="40%" destroy-on-close>
      <el-form label-width="100px" style="padding-right: 50px" :model="form">
        <el-form-item prop="title" label="友情提示">
          <div style="color: #d19e05 ">请详细描述你的联系方式，方便对方联系到你</div>
        </el-form-item>
        <el-form-item prop="content" label="留言内容">
          <el-input type="textarea" :rows="5" v-model="content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {userPageQuery} from "@/apis/item";

export default {
  name: 'Item',
  data() {
    return {
      /*
      private Long userId;*/
      itemData: [],
      valueTime: [],
      queryParams: {
        page: 1,
        pageSize: 8,
        name: null,
        status: null,
        tag: null,
        isLost: null,
        startTime: null,
        endTime: null
      },
      total: 0,

      viewVisible: false,

      viewData: null,
      fromVisible: false,
      content: null,
      from: {},
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),

    }
  },
  // mounted() {
  //   this.load(1)
  // },
  created() {
    this.getItemList()
  },
  methods: {
    // setFlower(item) {
    //   this.form = JSON.parse(JSON.stringify(item))
    //   let data = {
    //     fid: this.form.id,
    //     module: '招领广场'
    //   }//调用接口
    //   this.$request.post('/flower/set/', data).then(res => {
    //     if (res.code === 200) {
    //       this.$message.success('操作成功')
    //       this.load()
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   })
    // },
    // load(pageNum) {
    //   if (pageNum) this.pageNum = pageNum
    //   this.$request.get('/user/v2/user/page', {
    //     params: {
    //       pageNum: this.pageNum,
    //       pageSize: this.pageSize,
    //       name: this.name,
    //     }
    //   }).then(res => {
    //     this.itemData = res.data?.list
    //     this.total = res.data?.total
    //   })
    // },
    async getItemList() {
      try {
        this.queryParams.startTime = this.valueTime && this.valueTime.length > 0 ? this.valueTime[0] : undefined;
        this.queryParams.endTime = this.valueTime && this.valueTime.length > 0 ? this.valueTime[1] : undefined;
        const response = await userPageQuery(this.queryParams);
        const {data} = response;
        const {records, total} = data;
        this.total = total;
        this.itemData = records.map(record => ({
          ...record,
          startTime: this.formatDate(record.startTime),
          endTime: this.formatDate(record.endTime),
          publishTime: this.formatDate(record.publishTime)
        }));
        console.log(this.total)
        console.log(this.itemData)
      } catch (error) {
        console.error('An error occurred while fetching item list:', error);
      }
    },
    initFun() {
      this.page = 1
      this.getItemList()
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
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

    viewContent(content) {
      this.viewData = content
      this.viewVisible = true
    },
    // TODO:联系模块还没有写！！
    contact(item) {
      this.form = JSON.parse(JSON.stringify(item))  //生成另一个对象和item相等但是他们是不同的对象
      this.fromVisible = true
    },
    submit() {
      if (this.user.id === this.form.userId) {
        this.$message.warning('您不能联系自己')
        this.fromVisible = false
        this.content = null
        return
      }
      let data = {
        articleId: this.form.id,
        type: '招领广场',
        fromId: this.user.id,
        toId: this.form.userId,
        content: this.content
      }
      this.$request.post('/user/v2/message', data).then(res => {
        if (res.code === 200) {
          this.$message.success('留言成功，等待对方联系')
          this.content = null
          this.fromVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
  }
}
</script>
<style>
.active {
  color: #ce0e0e !important;
}

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
