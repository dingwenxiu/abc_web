<template>
  <div class="user-profits">
    <!-- 搜素过滤 -->
    <div class="filter-container">
      <div class="filter-label">
        用户名:
        <el-input
          v-model="listQuery.username"
          size="small"
          style="width: 200px;"
          class="filter-item"
        ></el-input>
      </div>
      <div class="bmn-search-button">
        <input @click="searchData" type="submit" value="查 询" class="btn" />
      </div>
    </div>
    <div class="sub-title" style="margin-top: 15px;">直属联系人</div>
    <div class="custom-table">
      <el-table style="width: 100%">
        <el-table-column  label="用户名称">
          <!-- <template slot-scope="scope"> -->
            <span>直属联系人</span>
          <!-- </template> -->
        </el-table-column>
        <el-table-column  show-overflow-tooltip label="未读消息">
          <!-- <template slot-scope="scope"> -->
            <span>0则</span>
          <!-- </template> -->
        </el-table-column>
        <el-table-column  show-overflow-tooltip label="最后更新时间">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.team_turnover }}</span>
          </template> -->
        </el-table-column>
        <el-table-column  show-overflow-tooltip label="操作">
          <!-- <template slot-scope="scope"> -->
            <el-button
              size="mini">发送消息</el-button>
            <el-button
              size="mini">历史消息</el-button>
          <!-- </template> -->
        </el-table-column>
      </el-table>
    </div>
    <div class="sub-title" style="margin-top: 30px;">
      下级代理
      <span class="send-message-btn">下级群发功能</span>
    </div>
    <div class="custom-table">
      <el-table :data="userProfits.child.data" style="width: 100%">
        <el-table-column  label="用户名称">
          <!-- <template slot-scope="scope"> -->
            <span>直属联系人</span>
          <!-- </template> -->
        </el-table-column>
        <el-table-column  show-overflow-tooltip label="未读消息">
          <!-- <template slot-scope="scope"> -->
            <span>0则</span>
          <!-- </template> -->
        </el-table-column>
        <el-table-column  show-overflow-tooltip label="最后更新时间">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.team_turnover }}</span>
          </template> -->
        </el-table-column>
        <el-table-column  show-overflow-tooltip label="操作">
          <!-- <template slot-scope="scope"> -->
            <el-button
              size="mini">发送消息</el-button>
            <el-button
              size="mini">历史消息</el-button>
          <!-- </template> -->
        </el-table-column>
      </el-table>
    </div>
    <p style="overflow:hidden">
      <span style="float:left">数据来源: 包网统计中心</span>
    </p>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userProfits.child.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="userProfits.child.page_size"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'agent-message',
  data() {
    const date1 = new Date()
    date1.setDate(1)
    date1.setHours(0, 0, 0)
    const date2 = new Date()
    date2.setHours(23, 59, 59)
    return {
      userProfits: {
        child: {},
        self: {},
        sum: {}
      },
      total: undefined,
      listQuery: {
        page_size: 10,
        page: 1,
        username: undefined,
        start_time: undefined,
        end_time: undefined
      },
      gameTime: [new Date(date1), new Date(date2)],
      tableData: [
        {
          date: '2016-05-02',
          name: '0.0000',
          address: '0.0000'
        }
      ]
    }
  },
  watch: {
    // 时间初始化格式
    gameTime: {
      handler(newName) {
        this.listQuery.start_time = this.Utils.formatTime(
          newName[0],
          'YYYY-MM-DD HH:MM:SS'
        )
        this.listQuery.end_time = this.Utils.formatTime(
          newName[1],
          'YYYY-MM-DD HH:MM:SS'
        )
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['userDetail'])
  },
  created() {
    this.initData()
  },
  methods: {
    // 请求数据
    initData() {
      this.Api.getUserBonus(this.listQuery).then(({ success, data }) => {
        if (success) {
          Object.assign(this.userProfits, data)
          this.total = data.child.total
        }
      })
    },
    // 搜素
    searchData() {
      this.listQuery.page = 1
      this.initData()
    },
    handleSizeChange(val) {
      this.gameListQuery.page_size = val
      this.getGameList()
    },
    handleCurrentChange(val) {
      this.gameListQuery.page = val
      this.getGameList()
    }
  }
}
</script>


<style lang="scss" scoped>
@import "../../../assets/css/var.scss";
.bmn-search-button {
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  width: 80px;
  height: 36px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);
  border-style: solid;
  border-width: 1px;
  border-image-slice: 1;
  border-radius: 3px;
  text-align: center;
  line-height: 34px;
  color: white;
  margin-right: 8px;
  input {
    width: 80px;
    height: 100%;
    background:$button-color;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
      inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);

    border-width: 1px;
    color: #000;
    padding: 0;
  }
}
.filter-container {
  .filter-label {
    display: inline-block;
    margin-right: 20px;
  }
}
.line-center {
  height: 45px;
  line-height: 45px;
  font-size: 13px;
  text-align: center;
  border-left: 1px solid #cfcfcf;
  border-right: 1px solid #cfcfcf;
}
.sub-title {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  .send-message-btn {
    display: inline-block;
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    background: #ff5656;
    color: #fff;
    padding: 0 50px;
    cursor: pointer;
    float: right;
  }
}
</style>
