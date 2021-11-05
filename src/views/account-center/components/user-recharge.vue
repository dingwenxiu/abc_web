<template>
  <div class="bet-record sub-account">
    <div class="container">
      <div class="filter-container">
        游戏时间：
        <!-- 今天 昨天 -->
        <el-date-picker
          size="mini"
          style="width:180px;margin-bottom:10px;"
          v-model="gameListQuery.start_time"
          placeholder="开始日期"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        ></el-date-picker>&nbsp;至&nbsp;
        <el-date-picker
          size="mini"
          style="width:180px"
          v-model="gameListQuery.end_time"
          placeholder="结束日期"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
        ></el-date-picker>
        <div class="bmn-search-button" style="margin-left:20px;">
          <input @click="searchGame" type="submit" value="搜 索" class="btn" />
        </div>
      </div>
      <div class="custom-table m-t-25">
        <el-table
          :data="gameList"
          show-summary
          :summary-method="getSummaries"
          v-loading="listLoading"
          style="width: 100%"
        >
          <el-table-column align="center" show-overflow-tooltip label="编号">
            <template slot-scope="scope">
              <span>{{ scope.row.order_id }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">{{scope.row.request_time}}</template>
          </el-table-column>
          <el-table-column align="center" label="申请金额">
            <template slot-scope="scope">
              <span>{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="实际充值">
            <template slot-scope="scope">
              <span>{{ scope.row.real_amount }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">正在充值</span>
              <span v-if="scope.row.status == 1">充值成功</span>
              <span v-if="scope.row.status == 2">充值失败</span>
              <span v-if="scope.row.status == 10">正在审核</span>
              <span v-if="scope.row.status == 11">审核成功</span>
              <span v-if="scope.row.status == 12">审核失败</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="gameListQuery.page_index"
          :page-sizes="[10,20,30, 50]"
          :page-size="gameListQuery.page_size"
          layout="total, sizes, prev, pager, next"
          :total="gameListTotal"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typeSelect: "project_id",
      valueSelect: "",
      changeTypeList: [],
      detailData: null,
      dialogVisible: false,
      activeName: "game",
      gameList: [],
      listLoading: true,
      gameListTotal: null,
      gameListQuery: {
        page_size: 10,
        page_index: 1,
        start_time: "",
        end_time: ""
      },
      gameTime: []
    };
  },
  created() {
    this.getGameList();
  },
  methods: {
    getGameList() {
      this.listLoading = true;
      for (var propName in this.gameListQuery) {
        if (
          this.gameListQuery[propName] == "" ||
          this.gameListQuery[propName] == []
        ) {
          delete this.gameListQuery[propName];
        }
      }
      this.Api.rechargeList(this.gameListQuery).then(res => {
        const { success, data } = res;
        this.listLoading = false;
        if (success) {
          this.gameList = data.data;
          this.gameListTotal = data.total;
        }
      });
    },
    searchGame() {
      this.gameListQuery.page_index = 1;
      this.getGameList();
    },
    handleSizeChange(val) {
      this.gameListQuery.page_size = val;
      this.getGameList();
    },
    handleCurrentChange(val) {
      this.gameListQuery.page_index = val;
      this.getGameList();
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "小结";
          return;
        }
        if (index === 1) {
          sums[index] = "本页资金变动";
          return;
        }
        if (index === 2) {
          const values = data.map(item => {
            return Number(item["amount"]);
          });
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(4);
        }
        if (index === 3) {
          const values = data.map(item => {
            return Number(item["real_amount"]);
          });
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(4);
        }
      });

      return sums;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/var.scss";
.bmn-search-button {
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  width: 80px;
  height: 28px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);
  border-style: solid;
  border-width: 1px;
  border-image-slice: 1;
  border-radius: 3px;
  text-align: center;
  line-height: 28px;
  color: white;
  margin-right: 8px;
  input {
    cursor: pointer;
    width: 80px;
    height: 100%;
    background: $button-color;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
      inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);

    border-width: 1px;
    color: #000;
    padding: 0;
  }
}
.bet-record {
  .container {
    padding: 25px 35px 35px;
  }
  /deep/ {
    .el-input--mini .el-input__inner {
      height: 28px;
    }
  }
}
</style>
