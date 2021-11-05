<template>
  <div class="bet-record sub-account">
    <el-tabs v-model="activeName" @tab-click="handleCainoTab">
      <!-- 游戏记录 -->
      <el-tab-pane :lazy="true" label="彩票投注" name="game">
        <div class="container">
          <div class="filter-container" style="margin-bottom:10px">
            游戏时间：
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
            <el-input
              @change="gameListInputChange"
              clearable
              style="width:235px;margin:0 15px"
              size="mini"
              placeholder="请输入内容"
              v-model="valueSelect"
              class="input-with-select"
            >
              <el-select
                @change="gameListSelectChange"
                style="width:80px;"
                v-model="typeSelect"
                slot="prepend"
                placeholder="请选择"
              >
                <el-option label="订单号" value="hash_id"></el-option>
                <el-option label="奖期号" value="issue"></el-option>
              </el-select>
            </el-input>状态：
            <el-select
              clearable
              size="mini"
              style="width:100px;"
              v-model="gameListStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in statusOption"
                :key="index"
                :label="item.label"
                :value="item"
              ></el-option>
            </el-select>
            <br />游戏名称：
            <el-cascader
              style="margin-right:15px"
              size="mini"
              clearable
              :props="{ expandTrigger: 'hover' }"
              v-model="gameListQuery.lotterySign"
              :options="lotteryAllOptions"
            ></el-cascader>用户名：
            <el-input
              clearable
              size="mini"
              style="width: 160px;margin-right:15px"
              placeholder="请输入用户名"
              v-model="gameListQuery.username"
              class="input-with-select"
            ></el-input>
            <div class="bmn-search-button" style="margin-left:20px;">
              <input @click="searchGame" type="submit" value="搜 索" class="btn" />
            </div>
          </div>
          <div class="custom-table">
            <el-table
              :summary-method="getGameSummaries"
              show-summary
              :data="gameList"
              v-loading="listLoading"
              style="width: 100%"
            >
              <el-table-column align="center" width="120" label="用户名">
                <template slot-scope="scope">
                  <span>{{ scope.row.username }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="110" label="游戏" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.lottery_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="100" show-overflow-tooltip label="订单号">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleDetail(scope.row)"
                  >{{ scope.row.hash_id }}</el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" width="120" show-overflow-tooltip label="奖期">
                <template slot-scope="scope">
                  <span>{{ scope.row.issue }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="100" show-overflow-tooltip label="玩法">
                <template slot-scope="scope">
                  <span>{{ scope.row.method_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="200px" show-overflow-tooltip label="投注内容">
                <template slot-scope="scope">
                  <span>{{scope.row.bet_number_view.replace(/&/g,',')}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="投注额" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.total_cost }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="奖金" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.bonus }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="奖金组">
                <template slot-scope="scope">
                  <span>{{ scope.row.bet_prize_group }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 0">待开奖</span>
                  <span v-if="scope.row.status == 1">已撤单</span>
                  <span style="color:red" v-if="scope.row.status == 2">未中奖</span>
                  <span style="color:green" v-if="scope.row.status == 3">已派奖</span>
                  <span v-if="scope.row.status == 4">系统撤单</span>
                  <span v-if="scope.row.status == 5">和局</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="50" label="单挑">
                <template slot-scope="scope">
                  <span v-if="scope.row.is_challenge == 1">是</span>
                  <span v-else>否</span>
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
      </el-tab-pane>
      <!-- 追号记录 -->
      <el-tab-pane :lazy="true" label="彩票追号" name="traces">
        <div class="container">
          <div class="filter-container" style="margin-bottom:10px">
            游戏时间：
            <el-date-picker
              size="mini"
              style="width:180px;margin-bottom:10px;"
              v-model="tracesListQuery.start_time"
              placeholder="开始日期"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
            ></el-date-picker>&nbsp;至&nbsp;
            <el-date-picker
              size="mini"
              style="width:180px"
              v-model="tracesListQuery.end_time"
              placeholder="结束日期"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="23:59:59"
            ></el-date-picker>
            <el-input
              @change="tracesListInputChange"
              style="width:235px;margin:0 15px"
              size="mini"
              placeholder="请输入内容"
              v-model="tracesValueSelect"
              class="input-with-select"
            >
              <el-select
                @change="tracesListSelectChange"
                style="width:85px;"
                v-model="tracesTypeSelect"
                slot="prepend"
                placeholder="请选择"
              >
                <el-option label="追号编号" value="hash_id"></el-option>
                <el-option label="奖期号" value="issue"></el-option>
              </el-select>
            </el-input>状态：
            <el-select
              size="mini"
              clearable
              style="width:100px;"
              v-model="tracesListQuery.status"
              placeholder="请选择"
            >
              <el-option label="所有" value></el-option>
              <el-option
                v-for="(item, index) in traceStatusOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <br />游戏名称：
            <el-cascader
              style="margin-right:15px;"
              clearable
              size="mini"
              :props="{ expandTrigger: 'hover' }"
              v-model="tracesListQuery.lotterySign"
              :options="lotteryAllOptions"
            ></el-cascader>用户名：
            <el-input
              clearable
              size="mini"
              style="width: 160px;margin-right:15px"
              placeholder="请输入用户名"
              v-model="tracesListQuery.username"
              class="input-with-select"
            ></el-input>
            <div class="bmn-search-button" style="margin-left:20px;">
              <input @click="searchTraces" type="submit" value="搜 索" class="btn" />
            </div>
          </div>
          <div class="custom-table">
            <el-table
              :data="tracesList"
              v-loading="tracesListLoading"
              :summary-method="getTracesSummaries"
              show-summary
              style="width: 100%"
            >
              <el-table-column align="center" width="120" label="用户名">
                <template slot-scope="scope">
                  <span>{{ scope.row.username }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="彩种">
                <template slot-scope="scope">
                  <span>{{ scope.row.lottery_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="彩种">
                <template slot-scope="scope">
                  <span>{{ scope.row.lottery_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="玩法">
                <template slot-scope="scope">
                  <span>{{ scope.row.method_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="开始奖期">
                <template slot-scope="scope">
                  <span>{{ scope.row.start_issue }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="追号进度">
                <template slot-scope="scope">
                  <span>{{scope.row.finished_issues}}/{{ scope.row.total_issues}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="投注金额">
                <template slot-scope="scope">
                  <span>{{ scope.row.total_price }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="中奖金额">
                <template slot-scope="scope">
                  <span>{{ scope.row.finished_bonus }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="追中即停">
                <template slot-scope="scope">
                  <span v-if="scope.row.win_stop == 0">否</span>
                  <span v-if="scope.row.win_stop == 1">是</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 0">追号中</span>
                  <span v-if="scope.row.status == 1">中奖停止</span>
                  <span v-if="scope.row.status == 2">追号完成</span>
                  <span v-if="scope.row.status == 3">玩家撤单</span>
                  <span v-if="scope.row.status == 4">管理撤单</span>
                  <span v-if="scope.row.status == 5">异常撤单</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleTraceSizeChange"
              @current-change="handleTraceCurrentChange"
              :current-page="tracesListQuery.page_index"
              :page-sizes="[10,20,30, 50]"
              :page-size="tracesListQuery.page_size"
              layout="total, sizes, prev, pager, next"
              :total="tracesListTotal"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!-- 第三方游戏 -->
      <el-tab-pane
        :lazy="true"
        :label="item"
        :name="item"
        v-for="(item, index) in casinoTabList"
        :key="index"
      >
        <div class="container">
          <div class="filter-container" style="margin-bottom:10px">
            游戏时间：
            <el-date-picker
              size="mini"
              style="width:180px;margin-bottom:10px;"
              v-model="casionListQuery.start_time"
              placeholder="开始日期"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
            ></el-date-picker>&nbsp;至&nbsp;
            <el-date-picker
              size="mini"
              style="width:180px"
              v-model="casionListQuery.end_time"
              placeholder="结束日期"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="23:59:59"
            ></el-date-picker>&nbsp;
            &nbsp;
            &nbsp;
            订单号:
            <el-input
              clearable
              size="mini"
              style="width: 160px;"
              placeholder="请输入订单号"
              v-model="casionListQuery.platform_order_id"
              class="input-with-select"
            ></el-input>&nbsp;
            &nbsp;
            &nbsp;游戏名称:
            <el-input
              clearable
              size="mini"
              style="width: 160px;"
              placeholder="请输入游戏名称"
              v-model="casionListQuery.c_name"
              class="input-with-select"
            ></el-input>
            <br />用户名:
            <el-input
              clearable
              size="mini"
              style="width: 160px;"
              placeholder="请输入用户名"
              v-model="casionListQuery.username"
              class="input-with-select"
            ></el-input>
            <div class="bmn-search-button" style="margin-left:20px;">
              <input @click="searchCasion" type="submit" value="搜 索" class="btn" />
            </div>
          </div>
          <div class="custom-table">
            <el-table
              :data="casinoList"
              v-loading="tracesListLoading"
              :summary-method="getTracesSummaries"
              show-summary
              style="width: 100%"
            >
              <el-table-column align="center" width="120" label="用户名">
                <template slot-scope="scope">
                  <span>{{ scope.row.username }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="彩种">
                <template slot-scope="scope">
                  <span>{{ scope.row.lottery_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="彩种">
                <template slot-scope="scope">
                  <span>{{ scope.row.lottery_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="玩法">
                <template slot-scope="scope">
                  <span>{{ scope.row.method_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="开始奖期">
                <template slot-scope="scope">
                  <span>{{ scope.row.start_issue }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="追号进度">
                <template slot-scope="scope">
                  <span>{{scope.row.finished_issues}}/{{ scope.row.total_issues}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="投注金额">
                <template slot-scope="scope">
                  <span>{{ scope.row.total_price }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="中奖金额">
                <template slot-scope="scope">
                  <span>{{ scope.row.finished_bonus }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="追中即停">
                <template slot-scope="scope">
                  <span v-if="scope.row.win_stop == 0">否</span>
                  <span v-if="scope.row.win_stop == 1">是</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 0">追号中</span>
                  <span v-if="scope.row.status == 1">中奖停止</span>
                  <span v-if="scope.row.status == 2">追号完成</span>
                  <span v-if="scope.row.status == 3">玩家撤单</span>
                  <span v-if="scope.row.status == 4">管理撤单</span>
                  <span v-if="scope.row.status == 5">异常撤单</span>
                </template>
              </el-table-column>
              <el-table-column align="center" show-overflow-tooltip label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleTraceSizeChange"
              @current-change="handleTraceCurrentChange"
              :current-page="tracesListQuery.page_index"
              :page-sizes="[10,20,30, 50]"
              :page-size="tracesListQuery.page_size"
              layout="total, sizes, prev, pager, next"
              :total="tracesListTotal"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <record-details
      :detailData="detailData"
      @close="handleDetailClose"
      v-if="dialogVisible"
      :dialogVisible="dialogVisible"
    ></record-details>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import recordDetails from "../../../components/public/record_details";

export default {
  inject: ["active"],
  components: {
    recordDetails
  },
  data() {
    const statusOption = [
      {
        value: {
          is_win: 3
        },
        label: "和局"
      },
      {
        value: {
          status: 0
        },
        label: "待开奖"
      },
      {
        value: {
          status: 1
        },
        label: "已撤销"
      },
      {
        value: {
          is_win: 1
        },
        label: "已派奖"
      },
      {
        value: {
          is_win: 2
        },
        label: "未中奖"
      },
      {
        value: {
          status: 4
        },
        label: "系统撤销"
      }
    ];
    const traceStatusOption = [
      {
        value: 0,
        label: "追号中"
      },
      {
        value: 1,
        label: "中奖停止"
      },
      {
        value: 2,
        label: "追号完成"
      },
      {
        value: 3,
        label: "玩家撤单 "
      },
      {
        value: 4,
        label: "管理撤单"
      },
      {
        value: 5,
        label: "异常撤单"
      }
    ];
    return {
      statusOption,
      traceStatusOption,
      casinoTabList: ["棋牌", "电子", "真人", "捕鱼"],
      casinoList: [],
      typeSelect: "hash_id",
      valueSelect: "",
      tracesTypeSelect: "hash_id",
      tracesValueSelect: "",
      detailData: null,
      dialogVisible: false,
      activeName: "game",
      gameList: [],
      listLoading: true,
      tracesListLoading: true,
      gameListTotal: null,
      gameListStatus: {
        value: "",
        label: ""
      },
      gameListQuery: {
        page_size: 10,
        page_index: 1,
        lotterySign: "",
        lottery_sign: "",
        hash_id: "",
        user_id: "",
        issue: "",
        is_win: "",
        start_time: "",
        end_time: "",
        username: ""
      },
      tracesListTotal: null,
      tracesList: [],
      tracesListQuery: {
        page_size: 10,
        page_index: 1,
        start_time: "",
        end_time: "",
        lotterySign: "",
        lottery_sign: "",
        hash_id: "",
        user_id: "",
        issue: "",
        status: "",
        username: ""
      },
      casionListTotal: null,
      casionList: [],
      casionListQuery: {
        page_size: 10,
        page_index: 1,
        plat_type: "",
        start_time: "",
        end_time: "",
        username: "",
        platform_order_id: "", //订单号
        c_name: "" //游戏名
      },
      childOption: [],
      tracesChildOption: [],
      childCode: "",
      tracesChildCode: "",
      currentUser: "请选择下级用户",
      currentTracesUser: "请选择下级用户"
    };
  },
  computed: {
    ...mapGetters(["lotteryAll", "lotteryLists", "userDetail"]),
    lotteryAllOptions() {
      if (!Object.keys(this.lotteryLists).length) return;
      let list = [];
      for (let i in this.lotteryLists) {
        const val = this.lotteryLists[i];
        const children = val.list.map(val => {
          return {
            value: val.id,
            label: val.name
          };
        });
        list.push({
          value: val.sign,
          label: val.name,
          children: children
        });
      }
      return list;
    }
  },
  created() {
    this.activeName = this.active ? this.active : "game";
    this.getGameList();
    this.getTraceList();
  },
  filters: {
    handleTraceList(list) {
      const newArr = list.filter(v => v.status > 1);
      return newArr.length;
    }
  },
  methods: {
    handleCainoTab() {
      if (this.activeName !== "game" && this.activeName !== "traces") {
        this.casionListQuery.c_name = "";
        this.casionListQuery.plat_type = this.activeName;
        this.Api.casinoProjectHistory(this.casionListQuery).then(
          ({ success, data }) => {
            if (success) {
              console.log(data);
            }
          }
        );
      }
    },
    gameListInputChange(v) {
      this.gameListQuery[this.typeSelect] = v;
    },
    gameListSelectChange(v) {
      if (v === "hash_id") {
        this.gameListQuery.hash_id = this.valueSelect;
        this.gameListQuery.issue = "";
      } else if (v === "issue") {
        this.gameListQuery.issue = this.valueSelect;
        this.gameListQuery.hash_id = "";
      }
    },
    tracesListInputChange(v) {
      this.tracesListQuery[this.tracesTypeSelect] = v;
    },
    tracesListSelectChange(v) {
      if (v === "hash_id") {
        this.tracesListQuery.hash_id = this.tracesValueSelect;
        this.tracesListQuery.issue = "";
      } else if (v === "issue") {
        this.tracesListQuery.issue = this.tracesValueSelect;
        this.tracesListQuery.hash_id = "";
      }
    },
    getGameList() {
      delete this.gameListQuery.status;
      delete this.gameListQuery.is_win;
      Object.assign(this.gameListQuery, {
        ...this.gameListStatus.value,
        user_id: this.childCode ? this.childCode["id"] : "",
        lottery_sign:
          this.gameListQuery.lotterySign &&
          this.gameListQuery.lotterySign.length == 2
            ? this.gameListQuery.lotterySign[1]
            : ""
      });
      for (var propName in this.gameListQuery) {
        if (
          this.gameListQuery[propName] === "" ||
          this.gameListQuery[propName] === []
        ) {
          delete this.gameListQuery[propName];
        }
      }

      this.listLoading = true;
      this.Api.getBetGameRecord(this.gameListQuery).then(res => {
        const { success, data, code } = res;
        this.listLoading = false;
        if (success) {
          this.gameList = data["data"];
          this.childOption = code["child"];
          this.gameListTotal = data["total"];
        }
      });
    },
    getTraceList() {
      Object.assign(this.tracesListQuery, {
        user_id: this.tracesChildCode ? this.tracesChildCode["id"] : "",
        lottery_sign:
          this.tracesListQuery.lotterySign &&
          this.tracesListQuery.lotterySign.length == 2
            ? this.tracesListQuery.lotterySign[1]
            : ""
      });
      for (var propName in this.tracesListQuery) {
        if (
          this.tracesListQuery[propName] === "" ||
          this.gameListQuery[propName] === []
        ) {
          delete this.tracesListQuery[propName];
        }
      }
      this.tracesListLoading = true;
      this.Api.getBetTraceRecord(this.tracesListQuery).then(res => {
        const { success, data, code } = res;
        this.tracesListLoading = false;
        if (success) {
          this.tracesList = data["data"];
          this.tracesChildOption = code["child"];
          this.tracesListTotal = data["total"];
        }
      });
    },
    searchGame() {
      this.gameListQuery.page_index = 1;
      this.showBreadcrumb = false;
      this.breadcrumbList = [];
      this.childCode
        ? (this.currentUser = this.childCode["username"])
        : (this.currentUser = "请选择下级用户");
      this.getGameList();
    },
    searchTraces() {
      this.tracesListQuery.page_index = 1;
      this.showTracesBreadcrumb = false;
      this.tracesBreadcrumbList = [];
      this.tracesChildCode
        ? (this.currentTracesUser = this.tracesChildCode["username"])
        : (this.currentTracesUser = "请选择下级用户");
      this.getTraceList();
    },
    searchCasion() {
      this.casionListQuery.page_index = 1;
      this.handleCainoTab();
    },
    handleSizeChange(val) {
      this.gameListQuery.page_size = val;
      this.getGameList();
    },
    handleCurrentChange(val) {
      this.gameListQuery.page_index = val;
      this.getGameList();
    },
    handleTraceSizeChange(val) {
      this.tracesListQuery.page_size = val;
      this.getTraceList();
    },
    handleTraceCurrentChange(val) {
      this.tracesListQuery.page_index = val;
      this.getTraceList();
    },
    //投注记录详情
    handleDetail(row) {
      this.detailData = row;
      this.dialogVisible = true;
    },
    handleDetailClose() {
      this.dialogVisible = false;
    },
    //游戏记录合计
    getGameSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "本页小结";
          return;
        }
        if (index === 6) {
          const values = data.map(item => Number(item["total_cost"]));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(3);
        }
        if (index === 7) {
          const values = data.map(item => Number(item["bonus"]));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(3);
        }
      });

      return sums;
    },
    //追号记录合计
    getTracesSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "本页小结";
          return;
        }
        if (index === 4) {
          const values = data.map(item => Number(item["total_price"]));
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
        if (index === 5) {
          const values = data.map(item => Number(item["finished_bonus"]));
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

.bet-record {
  .container {
    padding: 0 35px 35px;
  }
  /deep/ {
    .el-input--mini .el-input__inner {
      height: 28px;
    }
    .el-table tr:nth-child(even) {
      background-color: #f1f1f1;
    }
  }
}
.next-link {
  cursor: pointer;
  line-height: 1.2;
}
.el-breadcrumb {
  cursor: pointer;
}
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
</style>
