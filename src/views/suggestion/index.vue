<template>
  <div class="main-content">
    <div style="width: 70%;margin: 30px auto">
      <div style="font-size: 20px; margin: 20px 0">请对平台提出建议或者反馈</div>

      <div>
        <el-input v-model="content" type="textarea" :rows="6" placeholder="请输入你的反馈建议"></el-input>
      </div>
      <div style="text-align: center;margin-top: 10px">
        <el-button type="primary" style="width: 40%;" @click="publishSuggestion">提交</el-button>
      </div>

      <div style="margin: 20px 0;font-size: 20px; color: #005ca9;font-weight: 550">
        看看其他用户发表的意见与反馈
      </div>
      <el-table :data="suggestionData" stripe:true style="width: 100%;color: #000b17;font-size: 13px" row-key="id">
        <!--            <el-table-column prop="avatar" label="头像" show-overflow-tooltip>-->
        <!--              <template v-slot="scope">-->
        <!--                <div style="display: flex; align-items: center">-->
        <!--                  <el-image style="width: 45px; height: 45px; border-radius: 100%" v-if="scope.row.avatar"-->
        <!--                            :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]"></el-image>-->
        <!--                </div>-->
        <!--              </template>-->
        <!--            </el-table-column>-->
        <el-table-column prop="id" label="建议ID" width="150"/>
        <el-table-column prop="userId" label="用户名称" width="150"/>
        <el-table-column prop="content" label="意见与反馈" width="240"/>
        <el-table-column prop="status" label="意见状态" :formatter="formatStatus"/>
        <el-table-column prop="pollCount" label="意见票数" width="240"/>
        <el-table-column prop="publishTime" label="时间" color="#666666"/>
      </el-table>

      <el-row style="height: 60px" align="middle" type="flex" justify="end">
        <el-pagination
            layout="total, sizes, prev, pager, next"
            :total="suggestionData.length"
            :current-page="queryParams.page"
            :page-size="queryParams.pageSize"
            :page-sizes="[5, 10, 20]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />
      </el-row>
    </div>
  </div>
</template>

<script>
import {publishSuggestion, userPageQuery} from "@/apis/suggestion";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      queryParams: {
        page: 1, // 当前页码
        pageSize: 5,
        pollCount: null,
        tag: 1,
        status: null,
      },
      content: null,
      suggestionData: [],
    }
  },
  created() {
    this.getSuggestionList()
  },
  methods: {
    async getSuggestionList() {
      try {
        const response = await userPageQuery(this.queryParams);
        const {data} = response;
        const {records} = data;
        this.suggestionData = records.map(record => ({
          ...record,
          publishTime: this.formatDate(record.publishTime)
        }));
        console.log(this.suggestionData)
      } catch (error) {
        console.error('An error occurred while fetching item list:', error);
      }
    },
    async publishSuggestion() {
      try {
        const response = await publishSuggestion({
          content: this.content,
          tag: 1,
          userId: this.user.id
        });
        if (response.code === 200) {
          await this.getSuggestionList()
          this.$message.success(response.msg)
        }
      } catch (error) {
        console.error('An error occurred while fetching item list:', error);
      }
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
    handleCurrentChange(pageNum) {
      this.queryParams.page = pageNum;
      this.getSuggestionList();
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.getSuggestionList();
    },
  }
}
</script>
