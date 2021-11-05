
<template>
  <section class="trace">
    <section class="panel-trace">
      <ul class="chase-tabs">
        <li
          class="chase-tab"
          :class="{active: chaseTab === 'rate'}"
          @click="chaseTabHan('rate')"
        >利润率追号</li>
        <li
          class="chase-tab"
          :class="{active: chaseTab === 'same'}"
          @click="chaseTabHan('same')"
        >同倍追号</li>
        <li
          class="chase-tab"
          :class="{active: chaseTab === 'double'}"
          @click="chaseTabHan('double')"
        >翻倍追号</li>
      </ul>
      <ul class="fw tab-cons">
        <div style="text-align:right">
          <el-button
            class="tab-cons-btn"
            type="warning"
            plain
            size="mini"
            @click="closeTraceList"
          >清除追号</el-button>
        </div>
        <!-- 利润率追号Tab -->
        <li class="tab-con" v-if="chaseTab === 'rate'">
          <section class="tab-inputs">
            <label class="param">
              最低收益率:
              <input
                type="text"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model="chaseRate.lowNum"
                :placeholder="chaseRate.lowNum"
                class="tab-input"
              />%
            </label>
            <label class="param">
              追号期数
              <input
                type="number"
                @input="changeIssueNum(chaseRate)"
                v-model="chaseRate.issueNum"
                :placeholder="chaseRate.issueNum"
                class="tab-input"
              />
            </label>
            <el-button size="small" @click="chaseRateSubmit">生成追号计划</el-button>
          </section>
          <div class="chase-stop">
            <el-checkbox v-model="checkTraceWinStop">中奖后停止追号</el-checkbox>
          </div>
        </li>
        <!-- 同倍追号Tab -->
        <li class="tab-con" v-if="chaseTab === 'same'">
          <section class="tab-inputs">
            <label class="param">
              起始倍数:
              <input
                type="number"
                @input="onSamNumChange(chaseSame)"
                v-model="chaseSame.startMultiple"
                class="tab-input"
              />倍
            </label>
            <label class="param">
              追号期数
              <input
                type="number"
                @input="changeIssueNum(chaseSame)"
                v-model="chaseSame.issueNum"
                :placeholder="chaseSame.issueNum"
                class="tab-input"
              />
            </label>
            <el-button size="small" @click="chaseSameSubmit">生成追号计划</el-button>
          </section>
          <div class="chase-stop">
            <el-checkbox v-model="checkTraceWinStop">中奖后停止追号</el-checkbox>
          </div>
        </li>
        <!-- 翻倍追号Tab -->
        <li class="tab-con" v-if="chaseTab === 'double'">
          <section class="tab-inputs">
            <label class="param">
              每隔
              <input
                type="text"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model="chaseDouble.interIssueNum"
                :placeholder="chaseDouble.interIssueNum"
                class="tab-input"
              />期
            </label>
            <label class="param">
              倍 x
              <input
                type="number"
                @input="onSamNumChange(chaseDouble)"
                v-model="chaseDouble.doubleNum"
                :placeholder="chaseDouble.doubleNum"
                class="tab-input"
              />
            </label>
            <label class="param">
              期数:
              <input
                type="number"
                @input="changeIssueNum(chaseDouble)"
                v-model="chaseDouble.issueNum"
                :placeholder="chaseDouble.issueNum"
                class="tab-input"
              />
            </label>
            <el-button size="small" @click="chaseDoubleSubmit">生成追号计划</el-button>
          </section>
          <div class="chase-stop">
            <el-checkbox v-model="checkTraceWinStop">中奖后停止追号</el-checkbox>
          </div>
        </li>
      </ul>
    </section>
    <!-- 利润率追号 -->
    <section class="chase-table-container" v-if="chaseRate.show">
      <table class="chase-table">
        <tbody data-type="lirunlv">
          <tr>
            <th class="text-center">序号</th>
            <th>
              <input @click="handleCheckedBoxAll" v-model="checkedBoxAll" type="checkbox" /> 追号期次
            </th>
            <th>倍数</th>
            <th>金额</th>
            <th>奖金</th>
            <th>盈利金额</th>
            <th>盈利率</th>
          </tr>
          <tr v-for="(item, index) in traceList" :key="index">
            <td class="text-center">{{index + 1}}</td>
            <td>
              <input
                @click="handleCheckedItem(item)"
                data-action="checkedRow"
                v-model="item.checked"
                class="trace-row-checked"
                type="checkbox"
                checked="checked"
              />
              <span class="trace-row-number">
                {{item.issue_no}}
                <span class="icon-period-current"></span>
              </span>
            </td>
            <td>
              <input
                class="trace-row-multiple"
                @input="rateInputChange(item, index)"
                @blur="rateInputBlur(item)"
                v-model="item.multiple"
                type="number"
                style="width:60px;text-align:center;"
              />
            </td>
            <td>
              <span class="trace-row-money">{{Utils.toFixed(String(item.value))}}</span>
            </td>
            <td>
              <span class="trace-row-userGroupMoney">{{Utils.toFixed(String(item.prize))}}</span>
            </td>
            <td>
              <span class="trace-row-userGroupMoney">{{Utils.toFixed(String(item.profit))}}</span>
            </td>
            <td>
              <span class="trace-row-userGroupMoney">{{Utils.toFixed(String(item.percentage))}}%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <!-- 同倍追号 -->
    <section class="chase-table-container" v-if="chaseSame.show">
      <table class="chase-table">
        <tbody data-type="lirunlv">
          <tr>
            <th class="text-center">序号</th>
            <th>
              <input @click="handleCheckedBoxAll" v-model="checkedBoxAll" type="checkbox" /> 追号期次
            </th>
            <th>倍数</th>
            <th>金额</th>
            <th>预计开奖时间</th>
          </tr>
          <tr v-for="(item, index) in traceList" :key="index">
            <td class="text-center">{{index + 1}}</td>
            <td>
              <input
                @click="handleCheckedItem(item)"
                data-action="checkedRow"
                v-model="item.checked"
                class="trace-row-checked"
                type="checkbox"
                checked="checked"
              />
              <span class="trace-row-number">
                {{item.issue_no}}
                <span class="icon-period-current"></span>
              </span>
            </td>
            <td>
              <input
                class="trace-row-multiple"
                @input="doubleInputChange(item, index)"
                @blur="doubleInputBlur(item)"
                v-model="item.multiple"
                type="number"
                style="width:60px;text-align:center;"
              />
            </td>
            <td>
              <span class="trace-row-money">{{(item.value).toFixed(3)}}</span>
            </td>
            <td>
              <span class="trace-row-userGroupMoney">{{item.time}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <!-- 翻倍追号 -->
    <section class="chase-table-container" v-if="chaseDouble.show">
      <table class="chase-table">
        <tbody data-type="lirunlv">
          <tr>
            <th class="text-center">序号</th>
            <th>
              <input @click="handleCheckedBoxAll" v-model="checkedBoxAll" type="checkbox" /> 追号期次
            </th>
            <th>倍数</th>
            <th>金额</th>
            <th>预计开奖时间</th>
          </tr>
          <tr v-for="(item, index) in traceList" :key="index">
            <td class="text-center">{{index + 1}}</td>
            <td>
              <input
                @click="handleCheckedItem(item)"
                data-action="checkedRow"
                v-model="item.checked"
                class="trace-row-checked"
                type="checkbox"
                checked="checked"
              />
              <span class="trace-row-number">
                {{item.issue_no}}
                <span class="icon-period-current"></span>
              </span>
            </td>
            <td>
              <input
                class="trace-row-multiple"
                @input="doubleInputChange(item)"
                @blur="doubleInputBlur(item)"
                v-model="item.multiple"
                value="1"
                type="text"
                style="width:60px;text-align:center;"
              />
            </td>
            <td>
              <span class="trace-row-money">{{(item.value).toFixed(3)}}</span>
            </td>
            <td>
              <span class="trace-row-userGroupMoney">{{item.time}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </section>
</template>
<script>
import { EventBus } from '@/utils/event-bus';
import { mapGetters } from 'vuex';

export default {
  name: 'trace-mod',
  data() {
    return {
      chaseTab: 'rate',
      checkedBoxAll: true, //追号期次，
      cacheOrderList: [], //购彩蓝缓存
      checkTraceWinStop: true, //中奖后是否停止追号
      orderListMultiple: 0, //当前购彩蓝最大倍数
      traceList: [], //追号列表
      allCount: 0, //追号总注数
      allMoney: 0, //追号总金额
      teaceCount: 0, //追号每期注数
      teaceMoney: 0, //追号每期金额
      //利润率追号
      chaseRate: {
        show: false,
        lowNum: 50, //最低收益率
        issueNum: 10, //追号期数
        traceWinStop: true //中奖后停止追号
      },
      // 同倍追号
      chaseSame: {
        show: false,
        startMultiple: 1, //起始倍数
        issueNum: 10
      },
      //翻倍追号
      chaseDouble: {
        show: false,
        interIssueNum: 1, //间隔期数
        doubleNum: 2, //翻倍数
        issueNum: 10 //期数
      },
      chase: {}
    };
  },
  props: ['currentCountPrizes'], //当前奖金
  computed: {
    ...mapGetters(['orderList', 'currentLottery', 'issueInfo', 'currentIssue']),
    maxIssue: function() {
      const arr = this.issueInfo.filter(item => {
        return Number(item.issue_no) >= Number(this.currentIssue.issue_no);
      });
      return arr.length;
    }
  },
  watch: {
    checkTraceWinStop(newVal) {
      this.$emit('watchStopTrace', newVal);
    }
  },
  methods: {
    //切换tab
    chaseTabHan(name) {
      this.closeTraceList();
      this.checkTraceWinStop = true;
      this.chaseTab = name;
    },
    //清除追号
    closeTraceList() {
      if (this.cacheOrderList.length) {
        this.$store.commit('SET_ORDER_LIST', this.cacheOrderList);
      }
      this.restTraceList();
      this.$emit('closeTrace');
    },
    restTraceList() {
      this.traceList = [];
      this.teaceCount = 0;
      this.teaceMoney = 0;
      this.chaseRate.show = false;
      this.chaseSame.show = false;
      this.chaseDouble.show = false;
      this.checkedBoxAll = true;
    },
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
    //处理购彩蓝
    handleOrderList(handleDouble) {
      // 监听
      EventBus.$on('gameIssueTimeup', () => {
        if (this.traceList.length) {
          this.closeTraceList();
        }
      });
      // 如果投注里面有倍数 先改为最小
      let timesSign = true;
      const maxTimesArr = [];
      this.orderList.forEach(order => {
        if (order['times'] > this.currentLottery.min_times) {
          if (timesSign) {
            this.cacheOrderList = [].concat(
              JSON.parse(JSON.stringify(this.orderList))
            );
          }
          order.times = this.currentLottery.min_times;
          order.cost = (
            order.count *
            this.parseMode(order.mode) *
            +order.price *
            +order.times
          ).toFixed(3);
          if (timesSign) {
            this.$nextTick(() => {
              handleDouble();
            });
            this.timesSign = false;
          }
        }
        maxTimesArr.push(order.currentMaxTimes);
        this.teaceMoney += Number(order['cost']);
        this.teaceCount += Number(order['count']);
      });
      this.orderListMultiple = Math.min(...maxTimesArr);
    },
    //生成利润率追号
    chaseRateSubmit() {
      if (this.orderList.length) {
        this.restTraceList();
        //条件判断
        let type = '',
          mode = '';
        for (let i = 0; i < this.orderList.length; i++) {
          //盈利/盈利率追号不支持混投
          if (type !== '' && mode !== '') {
            if (
              type !== this.orderList[i].method_sign ||
              mode !== this.orderList[i].mode
            ) {
              this.$alert(
                '利润率追号不支持混投，请确保您的投注都为同一玩法类型，且元角模式一致。',
                '提示',
                {
                  confirmButtonText: '确定'
                }
              );
              return false;
            }
          } else {
            type = this.orderList[i].method_sign;
            mode = this.orderList[i].mode;
          }
        }
        // 如果投注里面有倍数 先改为最小
        this.handleOrderList(this.chaseRateSubmit);

        // 找出当前期 以及当前期 后面当期数
        const list = [].concat(
          JSON.parse(
            JSON.stringify(
              this.issueInfo.filter(item => {
                return (
                  Number(item.issue_no) >= Number(this.currentIssue.issue_no)
                );
              })
            )
          )
        );
        // 追号添加数据
        const resultData = this.getMultipleByYinglilv(
          this.chaseRate.lowNum / 100,
          this.currentCountPrizes * this.orderList.length,
          this.teaceMoney,
          this.chaseRate.issueNum,
          this.currentLottery.min_times,
          this.orderListMultiple
        );
        if (resultData.length < 1) {
          alert('您设置的参数无法达到盈利，请重新设置');
          return;
        }
        this.chaseRate.show = true;
        for (let i = 0; i < resultData.length; i++) {
          if (resultData[i]['oldMultiple'] > this.orderListMultiple) {
            alert(
              '生成方案中的倍数超过了系统最大允许设置的倍数，将自动调整为系统最大可设置倍数'
            );
            break;
          }
        }
        for (let i = 0; i < list.length; i++) {
          if (i < this.chaseRate.issueNum) {
            list[i].time = this.Utils.formatTime(
              list[i].open_time * 1000,
              'YYYY-MM-DD HH:MM:SS'
            );
            this.traceList.push(list[i]);
            this.$set(this.traceList[i], 'checked', true);
            this.$set(this.traceList[i], 'multiple', resultData[i]['multiple']);
            this.$set(
              this.traceList[i],
              'value',
              this.teaceMoney * resultData[i]['multiple']
            );
            this.$set(
              this.traceList[i],
              'prize',
              this.currentCountPrizes *
                this.orderList.length *
                resultData[i]['multiple']
            );
            this.$set(
              this.traceList[i],
              'profit',
              resultData[i]['winAmountAll']
            );
            this.$set(
              this.traceList[i],
              'percentage',
              (resultData[i]['winAmountAll'] / resultData[i]['amountAll']) * 100
            );
          }
        }

        this.handleAllDate();
      } else {
        this.$alert('请至少选择一注投注号码', '提示', {
          confirmButtonText: '确定'
        });
      }
    },
    /**
     * yinglilv 盈利率
     * prize 所有注单的单倍奖金
     * onePrice 单注单价
     * times 需要运行的期数
     * multipleBase 起始倍数
     * maxnum 最大可设的倍数
     */
    getMultipleByYinglilv(
      yinglilv,
      prize,
      onePrice,
      times,
      multipleBase,
      maxnum
    ) {
      var amountAll = multipleBase * onePrice,
        //标记原始计算出的倍数
        oldMultiple = 0,
        //每次运算结果倍数变量
        multiple,
        i = 0,
        result = [];
      //当期倍数＝ceil((总花销*(1+盈利率)/(单倍奖金-单倍成本*(1+盈利率)))
      for (; i < times; i++) {
        multiple = Math.ceil(
          (amountAll * (1 + yinglilv)) / (prize - onePrice * (1 + yinglilv))
        );
        if (multiple < 1) {
          break;
        }
        oldMultiple = multiple;
        multiple = multiple > maxnum ? maxnum : multiple;
        if (i == 0) {
          amountAll = multiple * onePrice;
        } else {
          amountAll = amountAll + multiple * onePrice;
        }
        result.push({
          multiple: multiple,
          amountAll: amountAll, //累计投注成本
          winAmountAll: prize * multiple - amountAll,
          oldMultiple: oldMultiple
        });
      }
      return result;
    },
    //生成同倍追号
    chaseSameSubmit() {
      if (this.orderList.length) {
        this.restTraceList();
        this.handleOrderList(this.chaseSameSubmit);
        this.chaseSame.show = true;
        const list = [].concat(
          JSON.parse(
            JSON.stringify(
              this.issueInfo.filter(item => {
                return (
                  Number(item.issue_no) >= Number(this.currentIssue.issue_no)
                );
              })
            )
          )
        );
        // 追号添加数据
        for (let i = 0; i < list.length; i++) {
          if (i < this.chaseSame.issueNum) {
            list[i].time = this.Utils.formatTime(
              list[i].open_time * 1000,
              'YYYY-MM-DD HH:MM:SS'
            );
            this.traceList.push(list[i]);
            this.$set(this.traceList[i], 'checked', true);
            this.$set(
              this.traceList[i],
              'multiple',
              this.chaseSame.startMultiple
            );
            this.$set(
              this.traceList[i],
              'value',
              this.chaseSame.startMultiple * this.teaceMoney
            );
          }
        }
        this.handleAllDate();
      } else {
        this.$alert('请至少选择一注投注号码', '提示', {
          confirmButtonText: '确定'
        });
      }
    },
    //生成翻倍追号
    chaseDoubleSubmit() {
      if (this.orderList.length) {
        this.restTraceList();
        this.handleOrderList(this.chaseDoubleSubmit);
        this.chaseDouble.show = true;
        const list = [].concat(
          JSON.parse(
            JSON.stringify(
              this.issueInfo.filter(item => {
                return (
                  Number(item.issue_no) >= Number(this.currentIssue.issue_no)
                );
              })
            )
          )
        );
        // 追号添加数据
        for (let i = 0; i < list.length; i++) {
          if (i < this.chaseDouble.issueNum) {
            list[i].time = this.Utils.formatTime(
              list[i].open_time * 1000,
              'YYYY-MM-DD HH:MM:SS'
            );
            this.traceList.push(list[i]);
            this.$set(this.traceList[i], 'checked', true);
            this.$set(
              this.traceList[i],
              'multiple',
              this.chaseDouble.startMultiple
            );
            this.$set(
              this.traceList[i],
              'value',
              this.chaseDouble.startMultiple * this.teaceMoney
            );
            if (i === 0) {
              this.$set(
                this.traceList[i],
                'multiple',
                this.currentLottery.min_times
              );
            } else {
              const multiple = Math.pow(
                this.chaseDouble.doubleNum,
                parseInt(i / this.chaseDouble.interIssueNum)
              );
              if (multiple > this.orderListMultiple) {
                this.$set(
                  this.traceList[i],
                  'multiple',
                  this.orderListMultiple
                );
              } else {
                this.$set(this.traceList[i], 'multiple', multiple);
              }
            }
            this.$set(
              this.traceList[i],
              'value',
              this.traceList[i].multiple * this.teaceMoney
            );
          }
        }
        this.handleAllDate();
      } else {
        this.$alert('请至少选择一注投注号码', '提示', {
          confirmButtonText: '确定'
        });
      }
    },
    //同倍追号起始倍数
    onSamNumChange(item) {
      if (!this.orderList.length) return;
      const maxTimes = this.orderList[0]['currentMaxTimes'];
      if (item.startMultiple && +item.startMultiple < 1) {
        this.$set(item, 'startMultiple', 1);
      } else if (item.doubleNum && +item.doubleNum < 1) {
        this.$set(item, 'doubleNum', 1);
      } else if (item.doubleNum && +item.doubleNum > maxTimes) {
        this.$set(item, 'doubleNum', maxTimes);
      } else if (item.startMultiple && +item.startMultiple > maxTimes) {
        this.$set(item, 'startMultiple', maxTimes);
      }
    },
    //处理金额和注数
    handleAllDate() {
      const list = this.traceList.filter(v => v.checked);
      let rateAll = 0;
      this.allCount = this.teaceCount * list.length;
      rateAll = list.reduce(function(total, currentValue) {
        return total + +currentValue.multiple;
      }, 0);
      this.allMoney = rateAll * this.teaceMoney;
      this.$emit('getTraceData', {
        allCount: this.allCount,
        allMoney: this.allMoney,
        traceList: list
      });
    },
    //追号期次
    handleCheckedBoxAll() {
      this.checkedBoxAll = !this.checkedBoxAll;
      const list = this.traceList;
      for (let i = 0; i < list.length; i++) {
        if (this.checkedBoxAll) {
          list[i].checked = true;
        } else {
          list[i].checked = false;
        }
      }
      this.handleAllDate();
    },
    handleCheckedItem(item) {
      item.checked = !item.checked;
      this.handleAllDate();
    },
    //利润率追号倍数改变
    rateInputChange(item) {
      if (item.multiple > this.orderListMultiple) {
        this.$set(item, 'multiple', this.orderListMultiple);
      }
      const newTraceList = [];
      //累计投注成本
      let costAmount = 0;
      this.traceList.forEach(trace => {
        costAmount += this.teaceMoney * +trace.multiple;
        newTraceList.push({
          time: trace.time,
          issue_no: trace.issue_no,
          multiple: trace.multiple,
          checked: trace.checked,
          value: this.teaceMoney * +trace.multiple,
          prize:
            this.currentCountPrizes * this.orderList.length * +trace.multiple,
          profit:
            this.currentCountPrizes * this.orderList.length * trace.multiple -
            costAmount,
          percentage:
            ((this.currentCountPrizes *
              this.orderList.length *
              +trace.multiple -
              costAmount) /
              costAmount) *
            100
        });
      });
      this.traceList = newTraceList;
      this.handleAllDate();
    },
    rateInputBlur(item) {
      if (item.multiple < this.currentLottery.min_times) {
        this.$set(item, 'multiple', this.currentLottery.min_times);
        const newTraceList = [];
        //累计投注成本
        let costAmount = 0;
        this.traceList.forEach(trace => {
          costAmount += this.teaceMoney * +trace.multiple;
          newTraceList.push({
            time: trace.time,
            issue_no: trace.issue_no,
            multiple: trace.multiple,
            checked: trace.checked,
            value: this.teaceMoney * +trace.multiple,
            prize:
              this.currentCountPrizes * this.orderList.length * +trace.multiple,
            profit:
              this.currentCountPrizes * this.orderList.length * trace.multiple -
              costAmount,
            percentage:
              ((this.currentCountPrizes *
                this.orderList.length *
                +trace.multiple -
                costAmount) /
                costAmount) *
              100
          });
        });
        this.traceList = newTraceList;
        this.handleAllDate();
      }
    },
    // 同倍 翻倍倍数改变
    doubleInputChange(item) {
      if (item.multiple > this.orderListMultiple) {
        this.$set(item, 'multiple', this.orderListMultiple);
      }
      const money = this.teaceMoney,
        multiple = this.Utils.number(item.multiple);
      if (multiple === '' || multiple === 0) {
        return;
      }
      this.$set(item, 'value', money * multiple);
      this.handleAllDate();
    },
    doubleInputBlur(item) {
      if (item.multiple < this.currentLottery.min_times) {
        const money = this.teaceMoney,
          multiple = this.currentLottery.min_times;
        this.$set(item, 'multiple', multiple);
        this.$set(item, 'value', money * multiple);
        this.handleAllDate();
      }
      return;
    },
    //期号改变
    changeIssueNum(item) {
      if (item.issueNum === '') {
        this.$set(item, 'issueNum', 1);
      } else if (item.issueNum > this.maxIssue) {
        this.$set(item, 'issueNum', this.maxIssue);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/var.scss";
.chase-stop {
  text-align: left;
  padding-left: 20px;
}
.chase-stop /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #000;
}
.chase-stop /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: $button-color;
  border-color:$button-color;
}
</style>
