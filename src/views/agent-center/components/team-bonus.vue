<template>
  <div class="user-profits">
    <!-- 搜素过滤 -->
    <div class="filter-container">
      <div class="filter-label">
        用户名:
        <el-input
          v-model.trim="listQuery.username"
          size="medium"
          style="width: 200px;"
          class="filter-item"
        ></el-input>
      </div>
      <div class="filter-label">
        时间:
        <el-select popper-class="single-price" value-key="label" size="small" v-model="gameTime">
          <el-option
            v-for="(item, index) in timeOptions"
            :key="index"
            :label="item.label"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div class="bmn-search-button">
        <input @click="searchData" type="submit" value="搜 索" class="btn" />
      </div>
      <div class="bmn-search-button send-btn">
        <el-button @click="handleSendBonus" :loading="sendBtnLoading" class="btn">一键发放分红</el-button>
      </div>
    </div>
    <div class="custom-table m-t-25">
      <el-table :data="self" style="width: 100%">
        <el-table-column align="center" label="用户" width="140">
          <template>
            <span>自己 ></span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="投注总额">
          <template slot-scope="scope">
            <span>{{ scope.row.total_bets }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="派奖总额">
          <template slot-scope="scope">
            <span>{{ scope.row.total_bonus }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="返点总额">
          <template slot-scope="scope">
            <span>{{ scope.row.total_commission_from_child }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="活动礼金">
          <template slot-scope="scope">
            <span>{{ scope.row.total_gift }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="日工资">
          <template slot-scope="scope">
            <span>{{ scope.row.total_salary }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="净盈亏">
          <template slot-scope="scope">
            <span
              :style="{'color': scope.row.profit >= 0 ? 'green' : 'red'}"
            >{{ scope.row.profit > 0 ? '+' + scope.row.profit : scope.row.profit }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="分红比例">
          <template slot-scope="scope">
            <span>{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="分红金额">
          <template slot-scope="scope">
            <span>{{ scope.row.total_dividend }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="line-center">直属下属盈亏明细</div>
    <div class="custom-table">
      <el-table :data="child" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50"></el-table-column>
        <el-table-column align="center" label="用户" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="投注总额">
          <template slot-scope="scope">
            <span>{{ scope.row.total_bets }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="派奖总额">
          <template slot-scope="scope">
            <span>{{ scope.row.total_bonus }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="返点总额">
          <template slot-scope="scope">
            <span>{{ scope.row.total_commsission }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="活动礼金">
          <template slot-scope="scope">
            <span>{{ scope.row.total_gift }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="日工资">
          <template slot-scope="scope">
            <span>{{ scope.row.total_salary }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="净盈亏">
          <template slot-scope="scope">
            <span
              :style="{'color': scope.row.profit >= 0 ? 'green' : 'red'}"
            >{{ scope.row.profit > 0 ? '+' + scope.row.profit : scope.row.profit }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="分红比例">
          <template slot-scope="scope">
            <span>{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="分红金额">
          <template slot-scope="scope">
            <span>{{ scope.row.real_amount }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <p style="overflow:hidden">
      <span style="float:left">数据来源: 包网统计中心</span>
      <span style="float:right">* 由于系统任然在计算过程种，当前分红金额仅供参考，实际以到账分红金额为准</span>
    </p>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page_index"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "team-bonus",
  data() {
    const date1 = new Date();
    date1.setHours(0, 0, 0);
    const date2 = new Date();
    date2.setHours(23, 59, 59);
    return {
      child: [],
      self: [],
      sum: [],
      timeOptions: [],
      total: undefined,
      listQuery: {
        page_size: 10,
        page_index: 1,
        username: undefined,
        start_day: undefined,
        end_day: undefined
      },
      gameTime: null,
      // 分红发放
      sendBtnLoading: false,
      multipleSelection: []
    };
  },
  watch: {
    // 时间初始化格式
    gameTime: {
      handler(newName) {
        if (newName && newName["value"].length) {
          this.listQuery.start_day = this.Utils.formatTime(
            newName["value"][0],
            "YYYY-MM-DD"
          );
          this.listQuery.end_day = this.Utils.formatTime(
            newName["value"][1],
            "YYYY-MM-DD"
          );
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters(["userDetail"])
  },
  created() {
    this.getTimeOptions();
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 计算一个月的天数
    getDaysOfMonth(timeDate) {
      const date = new Date(timeDate);
      const month = date.getMonth(),
        time = date.getTime(), //计算思路主要是month+1,相减除一天的毫秒数
        newTime = date.setMonth(month + 1);
      return Math.ceil((newTime - time) / (24 * 60 * 60 * 1000));
    },
    //获取时间选项
    getTimeOptions() {
      this.timeOptions = [];
      const date = new Date();
      let days = this.getDaysOfMonth(date),
        halfDays = Math.floor(days / 2);
      if (date.getDate() > halfDays) {
        const label = `${date.getFullYear()}年${date.getMonth() + 1}月上半月`,
          start = new Date(date.getFullYear(), date.getMonth(), 1),
          end = new Date(date.getFullYear(), date.getMonth(), halfDays);
        this.timeOptions.push({
          value: [start, end],
          label: label
        });
        this.gameTime = {
          value: [start, end],
          label: label
        };
      } else {
        date.setMonth(date.getMonth() - 1);
        days = this.getDaysOfMonth(date);
        halfDays = Math.floor(days / 2);
        const label1 = `${date.getFullYear()}年${date.getMonth() + 1}月上半月`,
          label2 = `${date.getFullYear()}年${date.getMonth() + 1}月下半月`,
          start1 = new Date(date.getFullYear(), date.getMonth(), 1),
          end1 = new Date(date.getFullYear(), date.getMonth(), halfDays),
          start2 = new Date(date.getFullYear(), date.getMonth(), halfDays + 1),
          end2 = new Date(date.getFullYear(), date.getMonth(), days);

        this.timeOptions.push(
          {
            value: [start2, end2],
            label: label2
          },
          {
            value: [start1, end1],
            label: label1
          }
        );
        this.gameTime = {
          value: [start2, end2],
          label: label2
        };
      }
      for (let index = 1; index < 7; index++) {
        date.setMonth(date.getMonth() - 1);
        days = this.getDaysOfMonth(date);
        halfDays = Math.floor(days / 2);
        const label1 = `${date.getFullYear()}年${date.getMonth() + 1}月上半月`,
          label2 = `${date.getFullYear()}年${date.getMonth() + 1}月下半月`,
          start1 = new Date(date.getFullYear(), date.getMonth(), 1),
          end1 = new Date(date.getFullYear(), date.getMonth(), halfDays),
          start2 = new Date(date.getFullYear(), date.getMonth(), halfDays + 1),
          end2 = new Date(date.getFullYear(), date.getMonth(), days);
        this.timeOptions.push(
          {
            value: [start2, end2],
            label: label2
          },
          {
            value: [start1, end1],
            label: label1
          }
        );
      }
    },
    // 请求数据
    initData() {
      for (var propName in this.listQuery) {
        if (
          this.listQuery[propName] === "" ||
          this.listQuery[propName] === []
        ) {
          delete this.listQuery[propName];
        }
      }
      this.Api.getTeamBonus(this.listQuery).then(({ success, data }) => {
        if (success) {
          this.child = data["child"] || [];
          this.self = [data["self"]] || [];
          this.total = data["total"];
        }
      });
    },
    // 搜素
    searchData() {
      this.listQuery.page_index = 1;
      this.initData();
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.initData();
    },
    handleCurrentChange(val) {
      this.listQuery.page_index = val;
      this.initData();
    },
    //一键发放日工资
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSendBonus() {
      if (!this.multipleSelection.length) {
        this.$alert("请在下方表格左侧选择用户!", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      this.sendBtnLoading = true;
      const hash_id = this.multipleSelection.map(v => v.hash_id);
      this.Api.playerDividendSend({ hash_id })
        .then(({ success, msg }) => {
          this.sendBtnLoading = false;
          if (success) {
            this.$alert(msg, "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
        })
        .catch(() => {
          this.sendBtnLoading = false;
        });
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../../assets/css/var.scss";
.user-profits {
  padding: 15px;
}
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
  /deep/ {
    .el-button {
      border: 0;
      border-radius: 0;
    }
  }
  .btn {
    width: 80px;
    height: 100%;
    background:$button-color;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
      inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);
    border-width: 1px;
    color: #000;
    padding: 0;
  }
  &.send-btn {
    width: 120px;
    margin-left: 15px;
    .btn {
      width: 140px;
    }
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
</style>
