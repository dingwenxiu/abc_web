<template>
  <div class="user-profits">
    <el-tabs v-model="activeName" @tab-click="listQuery.username ='';searchData()">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :lazy="true"
        :key="index"
        :label="item"
        :name="item"
      ></el-tab-pane>
    </el-tabs>
    <div style="padding: 0 15px 20px">
      <!-- 搜索 -->
      <div class="filter-container">
        <div class="filter-label">
          用户名:
          <el-input
            clearable
            v-model="listQuery.username"
            size="small"
            style="width: 200px;"
            class="filter-item"
          ></el-input>
        </div>
        <div class="filter-label">
          时间:
          <el-date-picker
            :clearable="false"
            size="small"
            style="width:140px"
            v-model="gameTime[0]"
            placeholder="请选择时间"
          ></el-date-picker>&nbsp;至&nbsp;
          <el-date-picker
            :clearable="false"
            size="small"
            style="width:140px"
            v-model="gameTime[1]"
            placeholder="请选择时间"
          ></el-date-picker>
        </div>
        <el-checkbox v-model="checked" class="checked">有余额</el-checkbox>
        <div class="bmn-search-button">
          <input @click="searchData" type="submit" value="搜 索" class="btn" />
        </div>
      </div>

      <div v-loading="listLoading" class="m-t-25">
        <el-breadcrumb v-if="showBreadcrumb" separator="/" style="padding:0 0 10px 0px;">
          <el-breadcrumb-item
            @click.native="listQuery.username ='';searchData()"
          >{{userDetail.username}}</el-breadcrumb-item>
          <el-breadcrumb-item
            @click.native="handleBreadcrumb(item, index)"
            v-for="(item, index) in breadcrumbList"
            :key="index"
          >{{item.username}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 表格 -->
        <div class="custom-table" style="margin-bottom:10px" v-if="userProfits.part">
          <el-table v-if="activeName === '彩票'" :data="[userProfits.part]" style="width: 100%">
            <el-table-column align="left" width="110" label="区间合计 >">
              <template>
                <span style="width:110px">所选区间合计</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="充值总额">
              <template slot-scope="scope">
                <span>{{ scope.row.recharge_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="提现总额">
              <template slot-scope="scope">
                <span>{{ scope.row.withdraw_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="投注总额">
              <template slot-scope="scope">
                <span>{{ scope.row.bets }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="撤销总额">
              <template slot-scope="scope">
                <span>{{ scope.row.cancel }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="投注返点">
              <template slot-scope="scope">
                <span>{{ scope.row.commission_from_bet }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="代理返点">
              <template slot-scope="scope">
                <span>{{ scope.row.commission_from_child }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="奖金总额">
              <template slot-scope="scope">
                <span>{{ scope.row.bonus }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="活动礼金">
              <template slot-scope="scope">
                <span>{{ scope.row.gift }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="日工资">
              <template slot-scope="scope">
                <span>{{ scope.row.salary }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="净盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.profit >= 0 ? 'green' : 'red'}"
                >{{ scope.row.profit > 0 ? '+' + scope.row.profit : scope.row.profit }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="游戏盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.game_profit >= 0 ? 'green' : 'red'}"
                >{{ scope.row.game_profit > 0 ? '+' + scope.row.game_profit : scope.row.game_profit }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-else :data="[userProfits.part]" style="width: 100%">
            <el-table-column align="center" label="区间合计 >" width="150px">
              <template>
                <span>所有区间合计 ></span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="投注总额">
              <template slot-scope="scope">
                <span>{{ scope.row.bet_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="派彩总额">
              <template slot-scope="scope">
                <span>{{ scope.row.company_payout_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="游戏盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.company_win_amount >= 0 ? 'green' : 'red'}"
                >{{ scope.row.company_win_amount > 0 ? '+' + scope.row.company_win_amount : scope.row.company_win_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="促销红利">
              <template slot-scope="scope">
                <span>{{ scope.row.company_win_neat_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="净盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.company_win_amount >= 0 ? 'green' : 'red'}"
                >{{ scope.row.company_win_amount > 0 ? '+' + scope.row.company_win_amount : scope.row.company_win_amount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="custom-table m-t-10">
          <el-table v-if="activeName === '彩票'" :data="[userProfits.self]" style="width: 100%">
            <el-table-column align="center" label="用户名" width="140">
              <template slot-scope="scope">
                <span>{{scope.row.username}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="用户属性">
              <template>
                <span>自己 ></span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="充值总额">
              <template slot-scope="scope">
                <span>{{ scope.row.recharge_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="提现总额">
              <template slot-scope="scope">
                <span>{{ scope.row.withdraw_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="投注总额">
              <template slot-scope="scope">
                <span>{{ scope.row.bets }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="派奖总额">
              <template slot-scope="scope">
                <span>{{ scope.row.bonus }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="投注返点">
              <template slot-scope="scope">
                <span>{{ scope.row.commission_from_bet }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="游戏盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.game_profit >= 0 ? 'green' : 'red'}"
                >{{ scope.row.game_profit > 0 ? '+' + scope.row.game_profit : scope.row.game_profit }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="代理返点">
              <template slot-scope="scope">
                <span>{{ scope.row.commission_from_child }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="活动礼金">
              <template slot-scope="scope">
                <span>{{ scope.row.gift }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="日工资">
              <template slot-scope="scope">
                <span>{{ scope.row.salary }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="净盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.profit >= 0 ? 'green' : 'red'}"
                >{{ scope.row.profit > 0 ? '+' + scope.row.profit : scope.row.profit }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-else :data="[userProfits.self]" style="width: 100%">
            <el-table-column align="center" label="用户名" width="140">
              <template slot-scope="scope">
                <span>{{scope.row.username}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="用户属性">
              <template>
                <span>自己 ></span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="投注总额">
              <template slot-scope="scope">
                <span>{{ scope.row.bet_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="派彩总额">
              <template slot-scope="scope">
                <span>{{ scope.row.company_payout_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="游戏盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.company_win_amount >= 0 ? 'green' : 'red'}"
                >{{ scope.row.company_win_amount > 0 ? '+' + scope.row.company_win_amount : scope.row.company_win_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="促销红利">
              <template slot-scope="scope">
                <span>{{ scope.row.company_win_neat_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="净盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.company_win_amount >= 0 ? 'green' : 'red'}"
                >{{ scope.row.company_win_amount > 0 ? '+' + scope.row.company_win_amount : scope.row.company_win_amount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="line-center">直属下级盈亏明细</div>
        <div class="custom-table">
          <el-table v-if="activeName === '彩票'" :data="userProfits.child.data" style="width: 100%">
            <el-table-column align="center" width="120" label="用户名">
              <template slot-scope="scope">
                <div @click="handleNextLink(scope.row)" class="next-link">
                  <span>{{ scope.row.username }}</span>
                  <i
                    style="margin-left:2px;font-size:12px"
                    class="fa fa-caret-right"
                    aria-hidden="true"
                  ></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="充值总额">
              <template slot-scope="scope">
                <span>{{ scope.row.recharge_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="提现总额">
              <template slot-scope="scope">
                <span>{{ scope.row.withdraw_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="投注总额">
              <template slot-scope="scope">
                <span>{{ scope.row.team_bets }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="派奖总额">
              <template slot-scope="scope">
                <span>{{ scope.row.team_bonus }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="投注返点">
              <template slot-scope="scope">
                <span>{{ scope.row.team_commission_from_bet }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="游戏盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.game_profit >= 0 ? 'green' : 'red'}"
                >{{ scope.row.game_profit > 0 ? '+' + scope.row.game_profit : scope.row.game_profit }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="代理返点">
              <template slot-scope="scope">
                <span>{{ scope.row.team_commission_from_child }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="活动礼金">
              <template slot-scope="scope">
                <span>{{ scope.row.gift }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="日工资">
              <template slot-scope="scope">
                <span>{{ scope.row.salary }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="净盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.profit >= 0 ? 'green' : 'red'}"
                >{{ scope.row.profit > 0 ? '+' + scope.row.profit : scope.row.profit }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-else
            v-loading="listLoading"
            :data="userProfits.child.data"
            style="width: 100%"
          >
            <el-table-column align="center" width="120" label="用户名">
              <template slot-scope="scope">
                <div v-if="!showBreadcrumb" @click="handleNextLink(scope.row)" class="next-link">
                  <span>{{ scope.row.username }}</span>
                  <i
                    style="margin-left:2px;font-size:12px"
                    class="fa fa-caret-right"
                    aria-hidden="true"
                  ></i>
                </div>
                <div v-else class="next-link">
                  <span>{{ scope.row.username }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="投注总额">
              <template slot-scope="scope">
                <span>{{ scope.row.bet_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="派彩总额">
              <template slot-scope="scope">
                <span>{{ scope.row.company_payout_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="游戏盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.company_win_amount >= 0 ? 'green' : 'red'}"
                >{{ scope.row.company_win_amount > 0 ? '+' + scope.row.company_win_amount : scope.row.company_win_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="促销红利">
              <template slot-scope="scope">
                <span>{{ scope.row.company_win_neat_amount }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label="净盈亏">
              <template slot-scope="scope">
                <span
                  :style="{'color': scope.row.company_win_amount >= 0 ? 'green' : 'red'}"
                >{{ scope.row.company_win_amount > 0 ? '+' + scope.row.company_win_amount : scope.row.company_win_amount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const chooseOptions = ['有余额']; 
export default {
  name: "TeamProfits",
  data() {
    // 时间转换
    const date1 = new Date();
    date1.setHours(0, 0, 0);
    const date2 = new Date();
    date2.setHours(23, 59, 59);
    return {
      activeName: "彩票",
      tabList: ["彩票", "棋牌", "电子", "真人", "捕鱼"],
      userProfits: {
        child: {},
        self: {}
      },
      total: undefined,
      listLoading: false,
      listQuery: {
        page_size: 10,
        page_index: 1,
        username: undefined,
        start_day: undefined,
        end_day: undefined,
        is_recharge: undefined 
      },
      gameTime: [new Date(date1), new Date(date2)],
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
      currentUser: {},
      tableData: [],
      showBreadcrumb: false,
      breadcrumbList: [],
      checked: 0,
      choose: chooseOptions,
      //checkAll: false,
      //isIndeterminate: true
    };
  },
  watch: {
    // 时间初始化
    gameTime: {
      handler(newName) {
        if (newName && newName.length) {
          this.listQuery.start_day = this.Utils.formatTime(
            newName[0],
            "YYYY-MM-DD"
          );
          this.listQuery.end_day = this.Utils.formatTime(
            newName[1],
            "YYYY-MM-DD"
          );
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
    // 数据初始化
    initData() {
      this.listLoading = true;
      for (var propName in this.listQuery) {
        if (
          this.listQuery[propName] === "" ||
          this.listQuery[propName] === []
        ) {
          delete this.listQuery[propName];
        }
      }
      if (this.activeName !== "彩票") {
        this.Api.getCasinoProfitList({
          ...this.listQuery,
          plat_type: this.activeName
        })
          .then(({ success, data }) => {
            this.listLoading = false;
            if (success) {
              this.userProfits = data;
              this.total = data.child.total;
            }
          })
          .catch(() => {
            this.listLoading = false;
          });
      } else {
        this.Api.getTeamProfits(this.listQuery)
          .then(({ success, data }) => {
            this.listLoading = false;
            if (success) {
              this.userProfits = data;
              this.total = data.child.total;
            }
          })
          .catch(() => {
            this.listLoading = false;
          });
      }
    },
    searchData() {
      this.listQuery.page_index = 1;
      this.listQuery.parent_id = "";
      this.listQuery.is_recharge = this.checked?1:0;
      this.showBreadcrumb = false;
      this.breadcrumbList = [];
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
    handleNextLink(row) {
      this.currentUser = row;
      this.listQuery.page_index = 1;
      this.listQuery.parent_id = row.user_id;
      this.showBreadcrumb = true;
      this.breadcrumbList.push(row);
      this.initData();
    },
    handleBreadcrumb(item, index) {
      this.listQuery.page_index = 1;
      this.breadcrumbList = this.breadcrumbList.slice(0, index + 1);
      this.listQuery.parent_id = item.user_id;
      this.initData();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/var.scss";
.user-profits {
  /deep/ {
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__nav-scroll {
      background: #ffffff !important;
    }
    .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
      background-color: #fffbf5;
    }
    .el-tabs__item + .el-tabs__item {
      &::before {
        content: "";
        display: block;
        width: 1px;
        height: 18px;
        background: #e6d7c0;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
      }
    }
    .el-tabs__item.is-active {
      color: #000;
      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background: $primary-color;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
    }
    .el-tabs__item:hover {
      color: $primary-color-hover;
    }
  }
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
.filter-container {
  .filter-label {
    display: inline-block;
    margin-right: 20px;
  }
  .el-checkbox-group {
      display: inline-block;
      margin-right: 20px;
  }
  .checked {
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
.next-link {
  text-decoration: underline;
  cursor: pointer;
}
.el-breadcrumb {
  cursor: pointer;
}
</style>
