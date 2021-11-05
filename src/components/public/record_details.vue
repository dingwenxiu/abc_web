<template>
  <el-dialog
    width="800"
    class="record-detail"
    title="记录详情"
    :visible.sync="openStatus"
    @close="handleClose"
  >
    <template v-if="detailData">
      <!-- 投注记录详情 -->
      <div class="content" v-if="!isTraces">
        <div class="openball-result" v-if="detailData.open_number && detailData.open_number.length">
          <span
            class="item"
            v-for="(item, index) in detailData.open_number.split(',')"
            :key="index"
          >{{item}}</span>
        </div>
        <div class="table-detail">
          <table width="100%" class="table-detail">
            <tbody>
              <tr class="child-user" v-if="isChildUser">
                <th width="25%" align="right">下级用户：</th>
                <th>
                  <span class="value">{{detailData.username}}</span>
                </th>
              </tr>
              <tr>
                <td width="25%" align="right">游戏：</td>
                <td>
                  <span class="value">{{detailData.lottery_name}}</span>
                </td>
                <td align="right">注单编号：</td>
                <td>
                  <span class="value">{{detailData.hash_id}}</span>
                </td>
              </tr>
              <tr>
                <td align="right">玩法：</td>
                <td>
                  <span class="value">{{detailData.method_name}}</span>
                </td>
                <td align="right">投注时间：</td>
                <td>
                  <span class="value">{{detailData.time_bought}}</span>
                </td>
              </tr>
              <tr>
                <td align="right">期号：</td>
                <td>
                  <span class="value">{{detailData.issue}}</span>
                </td>
                <td align="right">倍数：</td>
                <td>
                  <span class="value">{{detailData.times}}倍</span>
                </td>
              </tr>

              <tr>
                <td align="right">模式：</td>
                <td>{{detailData.mode}}</td>
                <td align="right">投注金额：</td>
                <td>
                  <span class="value">{{detailData.total_cost}}</span>
                </td>
              </tr>

              <tr>
                <td align="right">状态：</td>
                <td>
                  <span v-if="detailData.status == 0">待开奖</span>
                  <span v-if="detailData.status == 1">已撤单</span>
                  <span style="color:red" v-if="detailData.status == 2">未中奖</span>
                  <span style="color:green" v-if="detailData.status == 3">已派奖</span>
                  <span v-if="detailData.status == 4">系统撤单</span>
                  <span v-if="detailData.status == 5">和局</span>
                </td>
                <td align="right">奖金：</td>
                <td>
                  <span class="value">{{detailData.bonus}}</span>
                </td>
              </tr>

              <tr>
                <td align="right">单价：</td>
                <td>
                  <span class="value">{{detailData.price}}{{detailData.mode}}</span>
                </td>
                <td align="right">单挑：</td>
                <td>
                  <span v-if="detailData.is_challenge == 1">是</span>
                  <span v-else>否</span>
                </td>
              </tr>
              <tr>
                <td align="right">注数：</td>
                <td>
                  <span class="value">{{detailData.count}}</span>
                </td>
                <td align="right"></td>
                <td>
                  <span class="value"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="detail-row-cont">
          <div class="title">投注内容：</div>
          <el-input type="textarea" disabled :rows="4" v-model="bet_number"></el-input>
        </div>
        <div v-if="detailData.status == 0" style="text-align:center; margin-top:10px;">
          <el-button @click="handleCancelBet(detailData)">撤单</el-button>
        </div>
      </div>
      <!-- 追号记录详情 -->
      <div class="content" v-else>
        <div class="table-detail">
          <table width="100%" class="table-detail">
            <tbody>
              <tr class="child-user" v-if="isChildUser">
                <th width="30%" align="right">下级用户：</th>
                <th>
                  <span class="value">{{detailData.username}}</span>
                </th>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <td width="30%" align="right">游戏：</td>
                <td>
                  <span class="value">{{detailData.lottery_name}}</span>
                </td>
                <td align="right">追号编号：</td>
                <td>
                  <span class="value">{{detailData.id}}</span>
                </td>
              </tr>
              <tr>
                <td align="right">玩法：</td>
                <td>
                  <span class="value">{{detailData.method_name}}</span>
                </td>
                <td align="right">追号时间：</td>
                <td>
                  <span class="value">{{detailData.created_at}}</span>
                </td>
              </tr>
              <tr>
                <td align="right">开始期号：</td>
                <td>
                  <span class="value">{{detailData.start_issue}}</span>
                </td>
                <td align="right">追号期数：</td>
                <td>
                  <span class="value">{{detailData.total_issues}}</span>
                </td>
              </tr>

              <tr>
                <td align="right">完成期数：</td>
                <td>
                  <span class="value">{{detailData.finished_issues}}</span>
                </td>
                <td align="right">取消期数：</td>
                <td>
                  <span class="value">{{detailData.canceled_issues}}</span>
                </td>
              </tr>

              <tr>
                <td align="right">追号金额：</td>
                <td>
                  <span class="value">{{detailData.total_price}}</span>
                </td>
                <td align="right">完成金额：</td>
                <td>
                  <span class="value">{{detailData.finished_amount}}</span>
                </td>
              </tr>

              <tr>
                <td align="right">取消金额：</td>
                <td>
                  <span class="value">{{detailData.canceled_amount}}</span>
                </td>
                <td align="right">中奖金额：</td>
                <td>
                  <span
                    class="value"
                  >{{detailData.finished_bonus ? detailData.finished_bonus : '--'}}</span>
                </td>
              </tr>

              <tr>
                <td align="right">追号状态：</td>
                <td>
                  <span class="value">
                    <span v-if="detailData.status == 0">追号中</span>
                    <span v-if="detailData.status == 1">中奖停止</span>
                    <span v-if="detailData.status == 2">追号完成</span>
                    <span v-if="detailData.status == 3">玩家撤单</span>
                    <span v-if="detailData.status == 4">管理撤单</span>
                    <span v-if="detailData.status == 5">异常撤单</span>
                  </span>
                </td>
                <td align="right">模式：</td>
                <td>{{detailData.mode}}</td>
              </tr>

              <tr>
                <td align="right">追号奖金组：</td>
                <td>
                  <span class="value">{{detailData.bet_prize_group}}</span>
                </td>
                <td align="right">中奖后终止任务：</td>
                <td>
                  <span class="value" v-if="detailData.win_stop == 1">是</span>
                  <span class="value" v-else>否</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="text-align:center; margin-top:20px;" v-if="detailData.status == 0 && !isFund">
          <el-button @click="handleStopTrace(detailData)">终止追号</el-button>
        </div>
        <div class="trace-lists" v-if="trace_lists && !isFund">
          <el-table :data="trace_lists" style="margin:30px auto">
            <el-table-column align="center" prop="issue" label="奖期"></el-table-column>
            <el-table-column align="center" label="投注内容" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.bet_number_view.replace(/&/g,',')}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="times" label="追号倍数"></el-table-column>
            <el-table-column align="center" prop="total_price" label="投注金额	"></el-table-column>
            <el-table-column align="center" label="单挑">
              <template slot-scope="scope">
                <span v-if="scope.row.is_challenge">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0">等待追号</span>
                <span v-else-if="scope.row.status == 1">玩家撤单</span>
                <span v-else-if="scope.row.status == 2">系统撤单</span>
                <span v-else-if="scope.row.status == 3">中奖停止</span>
                <span v-else-if="scope.row.status == 4 && scope.row.bonus > 0">已中奖</span>
                <span v-else-if="scope.row.status == 4">追号完成</span>
              </template>
            </el-table-column>
            <el-table-column width="120" align="center" show-overflow-tooltip label="中奖">
              <template slot-scope="scope">{{scope.row.bonus}}</template>
            </el-table-column>
            <el-table-column width="100" align="center" label="操作	">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status == 0"
                  @click="handleStopIssueTrace(scope.row)"
                  type="text"
                  size="mini"
                >取消本期追号</el-button>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      // 弹框显示
      openStatus: this.dialogVisible,
      trace_lists: [],
      trace_total: 0,
      page_size: 5,
      page_index: 1
    };
  },
  props: ["dialogVisible", "detailData", "isFund", "isChildUser"],
  computed: {
    // 是否是追号
    isTraces() {
      return this.detailData.win_stop !== undefined;
    },
    // 翻译字符
    bet_number() {
      return this.detailData.bet_number_view.replace(/&/g, ",");
    }
  },
  watch: {
    dialogVisible(val) {
      this.openStatus = val;
    }
  },
  mounted() {
    if (this.isTraces && !this.isFund) {
      this.getTraceDetail();
    }
  },
  methods: {
    async getTraceDetail() {
      const { success, data } = await this.Api.getTraceDetail(
        this.detailData.id,
        {
          page_size: this.page_size,
          page_index: this.page_index
        }
      );
      if (success) {
        this.trace_lists = data;
        this.trace_total = data["total"];
      }
    },
    // 关闭弹框
    handleClose() {
      this.$emit("close");
    },
    // 撤单
    handleCancelBet(item) {
      this.$confirm("你确认撤单么？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.Api.cancelBet({ project_id: item.hash_id }).then(({ success }) => {
          if (success) {
            this.$store.dispatch("betHistory");
            item.status = 1;
            this.$message({
              type: "success",
              message: "撤单成功!",
              duration: 1000
            });
          }
        });
      });
    },
    // 终止追号
    handleStopTrace(item) {
      this.$confirm("你确认中止追号么？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.Api.stopTrace({ trace_id: item.id }).then(({ success }) => {
          if (success) {
            this.$store.dispatch("betHistory");
            item.status = 3;
            this.getTraceDetail();
            this.$message({
              type: "success",
              message: "本期追号单取消成功!",
              duration: 1000
            });
          }
        });
      });
    },
    // 终止本期追号
    handleStopIssueTrace(item) {
      this.$confirm("你确认取消本期追号么？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.Api.stopTraceDetail({
          trace_detail_id: item.id
        }).then(({ success }) => {
          if (success) {
            this.$store.dispatch("betHistory");
            this.getTraceDetail();
            this.$message({
              type: "success",
              message: "本期追号单取消成功!",
              duration: 1000
            });
          }
        });
      });
    },
    // 分页
    handleSizeChange(val) {
      this.page_size = val;
      this.initData();
    },
    handleCurrentChange(val) {
      this.page_index = val;
      this.getTraceDetail();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.record-detail {
  /deep/ {
    .el-textarea.is-disabled .el-textarea__inner {
      background-color: #fff;
      border-color: #dcdfe6;
      color: #606266;
    }
  }
  .content {
    margin: 0 auto 25px;
  }
  .openball-result {
    text-align: center;
    padding: 0 0 30px 0;
    .item {
      display: inline-block;
      width: 45px;
      height: 45px;
      line-height: 45px;
      background: $ball-color;
      text-align: center;
      border-radius: 50%;
      color: #fff9e9;
      font-size: 26px;
      margin: 0 2px;
      box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.47);
    }
  }
  .table-detail {
    color: #343434;
    border-collapse: collapse;
    border-spacing: 0;
    .title {
      text-align: center;
      font-size: 14px;
      font-weight: bold;
    }
    td {
      border-bottom: 1px dashed #e5e5e5;
      height: 36px;
      line-height: 36px;
    }
    .noborder td {
      border: 0;
    }
    .ball {
      margin-bottom: 20px;
    }
    .value {
      color: #545454;
    }
  }
  .detail-row-cont {
    width: 500px;
    margin: 15px auto 0;
  }
}
.pagination {
  margin-right: 120px;
  text-align: right;
}
.child-user {
  text-align: left;
  height: 50px;
}
</style>


