<template>
  <div class="user-profits">
    <div class="filter-container">
      <div class="filter-label">
        用户名:
        <el-input
          v-model="listQuery.username"
          size="small"
          style="width: 150px;"
          class="filter-item"
        ></el-input>
      </div>
      <div class="filter-label">
        时间:
        <el-date-picker
          :clearable="false"
          @change="searchData"
          style="width:135px;"
          size="medium"
          format="yyyy-MM-dd"
          v-model="gameTime"
          placeholder="选择日期时间"
        ></el-date-picker>
      </div>
      <div class="bmn-search-button">
        <input @click="searchData" type="submit" value="搜 索" class="btn" />
      </div>
    </div>
    <div class="custom-table m-t-25">
      <el-table :data="daySalary.self && [daySalary.self]" style="width: 100%">
        <el-table-column align="center" label="用户名">
          <template>
            <span>自己 ></span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="用户投注额">
          <template slot-scope="scope">
            <span>{{ scope.row.self_bets }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="团队投注额">
          <template slot-scope="scope">
            <span>{{ scope.row.team_bets }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="团队撤单">
          <template slot-scope="scope">
            <span>{{ scope.row.team_cancel }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="团队返点">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="代理返点+投注返点" placement="top">
              <span>{{ scope.row.team_he_return }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="团队有效投注额">
          <template slot-scope="scope">
            <span>{{ scope.row.team_real_bet }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="日资比例">
          <template slot-scope="scope">
            <span>{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="团队日资合计">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="(团队投注额 - 返点) * 日资比例" placement="top">
              <span>{{ scope.row.total_salary }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="用户结算工资">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="团队日资合计 - 所有直属下级团队日资" placement="top">
              <span>{{ scope.row.self_salary }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="line-center">直属下级日工资报表</div>
    <div class="custom-table">
      <el-table :data="daySalary.data && daySalary['data']" style="width: 100%">
        <el-table-column align="center" label="用户名" width="140">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="用户投注额">
          <template slot-scope="scope">
            <span>{{ scope.row.self_bets }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="团队投注额">
          <template slot-scope="scope">
            <span>{{ scope.row.team_bets }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="团队撤单">
          <template slot-scope="scope">
            <span>{{ scope.row.team_cancel }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="团队返点">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="代理返点+投注返点" placement="top">
              <span>{{ scope.row.team_he_return }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="团队有效投注额">
          <template slot-scope="scope">
            <span>{{ scope.row.team_real_bets }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="日资比例">
          <template slot-scope="scope">
            <span>{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="团队日资合计">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="(团队投注额 - 返点) * 日资比例" placement="top">
              <span>{{ scope.row.total_salary }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="用户结算工资">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="团队日资合计 - 所有直属下级团队日资" placement="top">
              <span>{{ scope.row.child_salary }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <p style="overflow:hidden">
      <span style="float:left">数据来源: 包网统计中心</span>
      <span style="float:right">
        *计算公式：
        用户结算日工资=团队有效投注额*工资比例-直属下级团队日工资
      </span>
    </p>
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
  name: "teamDaySalary",
  data() {
    const before = new Date() - 1000 * 60 * 60 * 24;
    return {
      daySalary: {
        child: {},
        self: {}
      },
      total: undefined,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      // 搜索条件
      listQuery: {
        page_size: 10,
        page_index: 1,
        username: undefined,
        start_day: undefined,
        end_day: undefined
      },
      gameTime: new Date(before)
    };
  },
  watch: {
    // 时间初始化
    gameTime: {
      handler(newName) {
        if (newName) {
          this.listQuery.start_day = this.Utils.formatTime(
            newName,
            "YYYY-MM-DD"
          );
          this.listQuery.end_day = this.Utils.formatTime(newName, "YYYY-MM-DD");
        } else {
          this.listQuery.start_day = "";
          this.listQuery.end_day = "";
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["userDetail"])
  },
  created() {
    this.initData();
  },
  methods: {
    // 时间初始化
    initData() {
      for (var propName in this.listQuery) {
        if (
          this.listQuery[propName] === "" ||
          this.listQuery[propName] === []
        ) {
          delete this.listQuery[propName];
        }
      }
      this.Api.getTeamDaySalary(this.listQuery).then(({ success, data }) => {
        if (success) {
          this.daySalary = data;
          this.total = data["total"];
        }
      });
    },
    // 搜所
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
  input {
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
