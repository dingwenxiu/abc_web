<template>
  <section class="main-bottom">
    <section class="main-bottom-con" v-if="currentMethod.type !== 'lhc'">
      <section class="bet-count-confirm">
        <!-- 购彩蓝 -->
        <section class="play-footer clearfix fw">
          <section class="panel-section">
            <div class="pannel-title">
              <a
                href="javascript:;"
                class="btn close"
                id="project-empty"
                @click="clearOrderList()"
              >清空</a>
              购彩篮
            </div>
            <div class="panel-select-title clearfix">
              <span class="name">玩法</span>
              <span class="number">号码</span>
              <span class="bet">注</span>
              <span class="multiple">倍</span>
              <span class="price">金额</span>
              <span class="operation">操作</span>
            </div>
            <div class="panel-order-list-cont">
              <ul class="order-container">
                <li v-for="(order, _orderIndex) in orderList" :key="_orderIndex">
                  <span class="name">{{order.method_name}}</span>
                  <span class="number" :title="parseCodes(order)">
                    {{parseCodes(order)}}
                  </span>
                  <span class="bet">{{order.count}}</span>
                  <span class="multiple">{{order.times}}</span>
                  <span class="price">{{Utils.toFixed(String(order.cost))}}</span>
                  <a
                    @click="deleteOrderList(order, _orderIndex)"
                    href="javascript:void(0);"
                    title="删除"
                    class="delete"
                  ></a>
                </li>

                <li class="no-data" v-if="orderList.length < 1">
                  暂无订单！！！
                  <br />无限大奖等着您，赶紧购彩去~
                </li>
              </ul>
            </div>
          </section>
          <trace-mod
            ref="traceMod"
            :currentCountPrizes="currentCountPrizes"
            @getTraceData="handleGetTeaceData"
            @closeTrace="handleCloseTrace"
            @watchStopTrace="handleWatchStopTrace"
          ></trace-mod>
        </section>
      </section>
      <!-- 确认投注信息 -->
      <section class="bet-future-set">
        <div class="bmn-confirm-title">
          <div class="bmn-confir-icon">
            <img src="../../assets/images/lottery/icon_money.png" />
          </div>确认投注信息
        </div>
        <section class="bmn-confirm-text">
          <ul class="bmn-confirm-infos">
            <li class="bmn-confirm-info">
              当前奖金组
              <span class="corigin">{{countPrize}}</span>
            </li>
            <li class="bmn-confirm-info">
              当前模式
              <span class="corigin">
                {{userConfig.singlePrice}}元 -
                <span v-if="userConfig.mode == 1">元</span>
                <span v-else-if="userConfig.mode == .1">角</span>
                <span v-else-if="userConfig.mode == .01">分</span>
                <span v-else>厘</span>
              </span> 模式
            </li>
            <li class="bmn-confirm-info">
              总注数
              <span class="corigin">{{currentCount}}</span>注
            </li>
          </ul>总金额
          <span style="font-size: 22px;" class="corigin">
            <template v-if="isTrace">{{Utils.toFixed(String(traceAllMoney))}}</template>
            <template v-else>{{Utils.toFixed(String(totals.money))}}</template>
          </span>
        </section>
        <a
          href="javascript:;"
          class="btn main-btn-confirm"
          :class="{'btn-diable' : mainBtnDisable}"
          style="height:auto;min-width:auto;"
          @click="!mainBtnDisable && submitBet()"
        >
          <el-button type="primary" :loading="betLoading">
            <i class="fa fa-check-circle ft20" v-if="!betLoading"></i>
            <span style="font-size:18px">确认投注</span>
          </el-button>
        </a>
      </section>
    </section>
    <!-- 投注和追号历史记录 -->
    <bet-history></bet-history>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import traceMod from './components/trace-mod';
import betHistory from './components/bet-history';

export default {
  name: 'game-order',
  components: {
    traceMod,
    betHistory
  },
  data() {
    return {
      total: {
        number: 0,
        money: 0
      },
      totalSub: {
        number: 0,
        double: 1,
        money: 0
      },
      mainBtnDisable: true,
      checkTraceWinStop: true,
      orderListSub: [],
      tableData: [],
      // 投注loading
      betLoading: false,
      // 当前注数 和 当前倍数
      currentCount: 0,
      isTrace: 0, //是否是追号模式
      traceList: null, //追号列表
      traceAllMoney: 0 //追号模式下的总金额
    };
  },
  props: ['countPrizes'],
  computed: {
    ...mapGetters([
      'userDetail',
      'lotteryAll',
      'orderList',
      'currentOrderState',
      'totalCost',
      'currentLottery',
      'currentMethod',
      'bet',
      'currentIssue',
      'issueInfo',
      'countPrize',
      'userConfig',
      'userFrozen'
    ]),
    // 翻倍
    totals() {
      /* eslint-disable */
      this.total = {
        number: 0,
        money: 0
      };
      for (let i = 0; i < this.orderList.length; i++) {
        this.total.number += Number(this.orderList[i].count);
        this.total.money += Number(this.orderList[i].cost);
      }
      this.totalSub.money =
        parseInt(this.totalSub.double) * Number(this.total.money);
      return this.total;
    },
    //当前奖金
    currentCountPrizes() {
      if (Array.isArray(this.countPrizes)) {
        return this.countPrizes[0].prize;
      } else {
        return this.countPrizes;
      }
    }
  },
  watch: {
    "totalSub.double": {
      handler() {
        // 计算翻倍后的金额
        this.totalSub.money =
          parseInt(this.totalSub.double) * Number(this.total.money);
      },
      deep: true
    },
    orderList: {
      handler(newVal) {
        // 总注数
        this.mainBtnDisable = newVal.length ? false : true;
        this.currentCount = 0;
        this.traceAllMoney = 0;
        for (let i = 0; i < this.orderList.length; i++) {
          this.currentCount += Number(this.orderList[i]["count"]);
        }
        this.$refs.traceMod && this.$refs.traceMod.restTraceList();
      },
      deep: true
    }
  },
  created() {
    // 获取我的投注 我的追号记录
    this.$store.dispatch("betHistory");
    this.clearOrderList();
  },
  methods: {
    //解析mode
    parseMode(mode) {
      switch (+mode) {
        case 1:
          return 1;
        case 2:
          return 0.1;
        case 3:
          return 0.01;
        default:
          return 0.001;
      }
    },
    //投注蓝号码解析
    parseCodes(order) {
      if (order.sign === "DXDS") {
        return order.codes
          .replace(/&/g, ",")
          .replace(/(s)/g, "小")
          .replace(/(b)/g, "大")
          .replace(/(e)/g, "双")
          .replace(/(o)/g, "单");
      } else if (order.sign === "LH") {
        return order.codes
          .replace(/&/g, ",")
          .replace(/(1)/g, "龙")
          .replace(/(2)/g, "虎")
          .replace(/(3)/g, "和");
      } else if (
        order.method_sign === "QTS3" ||
        order.method_sign === "ZTS3" ||
        order.method_sign === "HTS3"
      ) {
        return order.codes
          .replace(/&/g, ",")
          .replace(/(b)/g, "豹子")
          .replace(/(s)/g, "顺子")
          .replace(/(d)/g, "对子");
      } else if (order.method_sign === "LTDDS") {
        return order.codes.replace(/&|0|1|2|3|4|5/g, function(matched) {
          switch (matched) {
            case "5":
              return "5单0双";
              break;
            case "4":
              return "4单1双";
              break;
            case "3":
              return "3单2双";
              break;
            case "2":
              return "2单3双";
              break;
            case "1":
              return "1单4双";
              break;
            case "0":
              return "0单5双";
              break;
            case "&":
              return ",";
              break;
          }
        });
      } else {
        return order.codes.replace(/&/g, ",");
      }
    },
    // 确定投注
    submitBet() {
      if (this.betLoading) {
        return;
      }
      this.betLoading = true;
      this.$store.dispatch("getUserDetail").then(({ success }) => {
        if (success) {
          if (this.userFrozen === 4) {
            this.$alert("对不起，您已被禁止资金操作", "提示", {
              confirmButtonText: "确定",
              closeOnClickModal: false,
              closeOnPressEscape: false,
              showClose: false
            });
            this.betLoading = false;
            return false;
          } else if (this.userFrozen === 2) {
            this.$alert("对不起，您已被禁止投注", "提示", {
              confirmButtonText: "确定",
              closeOnClickModal: false,
              closeOnPressEscape: false,
              showClose: false
            });
            this.betLoading = false;
            return false;
          }
          if (
            this.bet.doubleBeforeOrder.length === 0 ||
            this.bet.doubleBeforeOrder === "[]"
          ) {
            this.$alert("请至少选择一注投注号码", "提示", {
              confirmButtonText: "确定"
            });
            this.betLoading = false;
            return;
          }

          let [
            currentIssus = this.currentIssue.issue_no,
            issus = {},
            money = 0,
            chaseData = []
          ] = [];
          if (this.isTrace) {
            chaseData = this.traceList;
            if (this.traceList.length) {
              for (let i = 0; i < chaseData.length; i++) {
                Object.assign(issus, {
                  [chaseData[i].issue_no]: chaseData[i].multiple
                });
              }
              money = this.traceAllMoney;
            } else {
              this.$alert("请至少选择一注投注号码", "提示", {
                confirmButtonText: "确定"
              });
              this.betLoading = false;
              return;
            }
          } else {
            // 同倍和翻倍追奖 都没有打开
            issus = { [currentIssus]: 1 };
            money =
              this.totalSub.double > 1
                ? this.totalSub.money
                : this.totals.money;
          }

          if (+this.userDetail["balance"] < +money) {
            this.$alert("对不起, 当前余额不足!", "提示", {
              confirmButtonText: "确定",
              closeOnClickModal: false,
              closeOnPressEscape: false,
              showClose: false
            });
            this.betLoading = false;
            return false;
          }
          // 计算翻倍后的 金额 和倍数
          let [list = JSON.parse(this.bet.doubleBeforeOrder)] = [];
          if (list.length === 0) {
            this.$alert("请至少选择一注投注号码", "提示", {
              confirmButtonText: "确定"
            });
            this.betLoading = false;
            return;
          }
          for (let i = 0; i < list.length; i++) {
            list[i].cost = (
              Number(list[i].cost) * Number(this.totalSub.double)
            ).toFixed(3);
            list[i].count =
              Number(list[i].count) * Number(this.totalSub.double);
            if (this.isTrace) {
              list[i].times = Number(this.currentLottery.min_times);
              list[i].cost =
                list[i].times *
                list[i].count *
                this.parseMode(list[i].mode) *
                list[i].price;
            }
            delete list[i]._codes;
            delete list[i].currentMaxTimes;
            delete list[i].sign;
          }
          this.Api.bet(
            this.currentLottery.en_name,
            issus,
            list,
            money.toFixed(3),
            this.isTrace,
            this.checkTraceWinStop ? 1 : 0
          )
            .then(res => {
              this.betLoading = false;
              if (res.success) {
                this.$alert(
                  "投注成功, 您可以通过”游戏记录“查询您的投注记录！",
                  "提示",
                  {
                    confirmButtonText: "确定"
                  }
                );
                this.$store.commit("SET_ORDER_LIST", []);
                this.$refs.traceMod && this.$refs.traceMod.restTraceList();
                this.bet.doubleBeforeOrder = JSON.stringify([]);
                // 获取我的投注 我的追号记录
                this.$store.dispatch("betHistory");
                // 刷新余额
                this.$store.dispatch("getUserDetail");
              }
            })
            .catch(() => {
              this.betLoading = false;
            });
        }
      });
    },
    // 删除当前投注
    deleteOrderList(item, index) {
      this.isTrace = 0;
      this.orderList.splice(index, 1);
      this.bet.doubleBeforeOrder = JSON.stringify(this.orderList);
      this.totalSub.money -= Number(item.cost) * Number(this.totalSub.double);
      if (this.orderList.length === 0) {
        this.total = {
          number: 0,
          money: 0
        };
        this.totalSub = {
          number: 0,
          double: 1,
          money: 0
        };
      }
      this.$refs.traceMod && this.$refs.traceMod.restTraceList();
    },
    // 清空当前投注
    clearOrderList() {
      this.isTrace = 0;
      this.$store.commit("SET_ORDER_LIST", []);
      this.bet.doubleBeforeOrder = JSON.stringify([]);
      this.total = {
        number: 0,
        money: 0
      };
      this.totalSub = {
        number: 0,
        double: 1,
        money: 0
      };
      this.$refs.traceMod && this.$refs.traceMod.restTraceList();
    },

    //追号生成后获取数据
    handleGetTeaceData(data) {
      this.isTrace = 1;
      this.$nextTick(() => {
        this.currentCount = data.allCount;
        this.traceAllMoney = data.allMoney;
        this.traceList = data.traceList;
      });
    },
    //清除追号
    handleCloseTrace() {
      this.isTrace = 0;
    },
    //中奖后停止追号
    handleWatchStopTrace(val) {
      this.checkTraceWinStop = val;
    }
  }
};
</script>
