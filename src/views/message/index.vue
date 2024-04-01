<template>
  <div class="dashboard-container">
    <div style="width:70%;margin:20px auto" class="container">
      <div class="tableBar">
        <!--        <el-table :data="tableData" strip>-->
        <!--          <el-table-column prop="id" label="序号" width="70" align="center" sortable></el-table-column>-->
        <!--          <el-table-column label="物品图片">-->
        <!--            <template v-slot="scope">-->
        <!--              <div style="display: flex; align-items: center">-->
        <!--                <el-image style="width: 40px; height: 40px; border-radius: 50%" v-if="scope.row.articleImg"-->
        <!--                          :src="scope.row.articleImg" :preview-src-list="[scope.row.articleImg]"></el-image>-->
        <!--              </div>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column prop="articleName" label="物品名称"></el-table-column>-->
        <!--          <el-table-column prop="toName" label="发布人"></el-table-column>-->
        <!--          <el-table-column prop="content" label="联系内容"></el-table-column>-->
        <!--          <el-table-column prop="type" label="类型"></el-table-column>-->
        <!--          <el-table-column prop="time" label="联系时间"></el-table-column>-->
        <!--          <el-table-column label="操作" align="center" width="180">-->
        <!--            <template v-slot="scope">-->
        <!--              <el-button size="mini" type="danger" plain @click="del(scope.row.id)">删除</el-button>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->

        <el-table :data="tableData" stripe:true row-key="id">
          <el-table-column prop="id" label="序号" width="80" align="center" sortable/>

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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),//获取当前用户
      tableData: [],
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

      pageNum: 1,
      pageSize: 6,
    }
  },
  methods: {
    loadData(pageNum) {
      if (pageNum) this.pageNum = pageNum;
      this.$request.get('/message/selectPage', {
        params: {//条件判断一下
          fromId: this.user.id,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          total: 0,
        }
      }).then(res => {//请求数据库查询
        if (res.code === '200') {
          this.tableData = res.data?.list
          this.total = res.data?.total
        }
      })
    },
    del(id) {   // 单个删除
      this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/message/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
            this.loadData(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.loadData(this.pageNum);
    }
  }
}
</script>
