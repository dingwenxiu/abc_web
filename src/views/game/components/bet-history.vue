<template>
  <div class="bet-history">
    <!-- 投注和追号历史记录 -->
    <section class="list-full-history">
      <ul>
        <li
          class="title-list"
          :class="{current: betHistory.tab === 0}"
          @click="betHistory.tab = 0"
        >我的投注</li>
        <li
          class="title-list"
          :class="{current: betHistory.tab === 1}"
          @click="betHistory.tab = 1"
        >我的追号</li>
      </ul>
      <template v-if="betHistory.tab === 0">
        <el-table :key="1" :data="bet.betHistory.myBetList" style="width: 100%">
          <el-table-column width="126" prop="name" label="游戏">
            <template slot-scope="scope">
              <span>{{scope.row.lottery_name}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="140" prop="method_name" label="玩法"></el-table-column>
          <el-table-column width="130" prop="issue" label="期号"></el-table-column>
          <el-table-column prop="open_number" label="开奖号" show-overflow-tooltip></el-table-column>
          <el-table-column label="投注内容" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.bet_number_view.replace(/&/g,',')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="total_cost" label="投注金额"></el-table-column>
          <el-table-column prop="bonus" label="奖金"></el-table-column>
          <el-table-column prop="bet_prize_group" label="奖金组-返点"></el-table-column>
          <el-table-column label="单挑" width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.is_challenge == 1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">待开奖</span>
              <span v-if="scope.row.status == 1">已撤单</span>
              <span style="color:red" v-if="scope.row.status == 2">未中奖</span>
              <span style="color:green" v-if="scope.row.status == 3">已派奖</span>
              <span v-if="scope.row.status == 4">系统撤单</span>
              <span style="color:blue;" v-if="scope.row.status == 5">和局</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <router-link tag="section" class="row-more" to="/account-center/bet-record">更多游戏记录...</router-link>
      </template>
      <template v-if="betHistory.tab === 1">
        <el-table :key="2" :data="bet.betHistory.myChaseList" style="width: 100%">
          <el-table-column prop="lottery_name" label="彩种" show-overflow-tooltip></el-table-column>
          <el-table-column prop="method_name" label="玩法" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="start_issue" label="起始奖期" show-overflow-tooltip></el-table-column>
          <el-table-column label="追号进度" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.finished_issues}}/{{ scope.row.total_issues }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="total_price" label="投注金额" show-overflow-tooltip></el-table-column>
          <el-table-column prop="win_stop" label="追中即停" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.win_stop == 0">否</span>
              <span v-if="scope.row.win_stop == 1">是</span>
            </template>
          </el-table-column>
          <el-table-column prop="finished_bonus" label="中奖金额" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">追号中</span>
              <span v-if="scope.row.status == 1">中奖停止</span>
              <span v-if="scope.row.status == 2">追号完成</span>
              <span v-if="scope.row.status == 3">玩家撤单</span>
              <span v-if="scope.row.status == 4">管理撤单</span>
              <span v-if="scope.row.status == 5">异常撤单</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <router-link tag="section" class="row-more" to="/account-center/bet-record/traces">更多游戏记录...</router-link>
      </template>
    </section>
    <!-- 投注历史详情 -->
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
  components: {
    recordDetails
  },
  props: ["isYlc"],
  data() {
    return {
      dialogVisible: false,
      detailData: null,
      betHistory: {
        tab: 0
      }
    };
  },
  computed: {
    ...mapGetters(["bet"])
  },
  methods: {
    //投注记录详情
    handleDetail(row) {
      this.detailData = row;
      this.dialogVisible = true;
    },
    handleDetailClose() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.bet-history {
  /deep/ {
    .el-table th,
    .el-table tr:nth-child(even) {
      background-color: #f1f1f1;
    }
  }
}
</style>
