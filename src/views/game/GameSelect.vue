<template>
  <section class="main">
    <div class="main-play-introduce ft12" :class="{'k3': currentLottery.series_id === 'k3'}">
      {{currentMethod.desc}}
      <a
        href="javascript:;"
        class="ico-why"
        v-if="currentMethod && currentMethod.help"
      >
        <i class="el-icon-question"></i> 玩法说明
        <div class="tooltip1" v-html="currentMethod.help"></div>
      </a>
      <div class="lhc-end ab" v-if="currentMethod.type === 'lhc'">
        <el-radio-group v-model="lhcPrizes">
          <el-radio-button label="B面"></el-radio-button>
          <el-radio-button label="A面"></el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="main-ball-box ball" v-if="currentMethod.type === 'multi'">
      <div
        class="main-ball-list"
        v-for="(_number, _tabName, yIndex) in currentMethod.layout"
        :key="yIndex"
      >
        <div
          class="ball-list-name"
          :style="{'padding-top': currentMethod.method.indexOf('LH') > -1 ? '26px' : '7px'}"
        >{{_tabName}}</div>
        <!--        选号区域  非龙虎选号-->
        <ul
          class="main-ball-content"
          v-if="!currentMethod['method'].includes('LH') || currentMethod['method'].indexOf('KLSF_LH_') > -1"
        >
          <li
            class="main-ball-content-li"
            v-for="(_code, xIndex) in _number"
            :key="xIndex"
            :class="{'ball-on': chooseNumber[yIndex][xIndex], 'active': chooseNumber[yIndex][xIndex]}"
            :style="{'margin-left': currentMethod.method.indexOf('KLSF_DXDS_') > -1 ? '6px': '12px'}"
            @click="selectCode(yIndex, xIndex)"
          >
            <a
              href="javascript:;"
              :class="{
                'ball-number-long' : currentMethod.method === 'QTS3' || currentMethod.method === 'ZTS3' || currentMethod.method === 'HTS3' || currentMethod.method === 'LTDDS' || currentMethod.method.indexOf('KLSF_DXDS_') > -1 || currentMethod['method'].indexOf('KLSF_LH_') > -1}"
              class="ball"
              :x="xIndex"
              :y="yIndex"
            >{{_code}}</a>
          </li>
        </ul>
        <!-- 龙虎选号 -->
        <ul v-if=" currentLottery.series_id === 'ssc' && currentMethod.method.indexOf('LH') > -1">
          <li
            class="main-ball-content-lh"
            v-for="(_code, xIndex) in _number"
            :key="xIndex"
            :class="{
            'ball-on': chooseNumber[yIndex][xIndex],
            'main-ball-content-lh-tiger': _code === '虎',
            'main-ball-content-lh-he': _code === '和',
            'active': chooseNumber[yIndex][xIndex]}"
            @click="selectCode(yIndex, xIndex)"
          ></li>
        </ul>
        <!--辅助选号按钮-->
        <ul
          class="main-ball-control"
          v-if="currentMethod.buttons.length > 0 && _tabName !== '胆码'"
          :class="{'series' : series === 'lotto' ||
          currentLottery.series_id === 'klsf' ||
          currentMethod.method === 'QZUHZ' || 
          currentMethod.method === 'ZZXHZ' ||
          currentMethod.method === 'ZZUHZ' ||
          currentMethod.method === 'HZXHZ' ||
          currentMethod.method === 'HZUHZ' ||
          currentMethod.method === 'HZX2HZ' ||
          currentMethod.method === 'QZX2HZ' ||
          currentMethod.method === 'HZU2HZ' ||
          currentMethod.method === 'QZU2HZ' ||
          currentMethod.method === 'QZXHZ' }"
        >
          <li
            class="main-ball-control-li"
            v-for="(_btnText, bIndex) in  currentMethod.buttons"
            :key="bIndex"
            :class="{'ball-on': chooseButton[yIndex][bIndex] }"
            @click="selectButton(yIndex, bIndex)"
          >
            <a href="javascript:;" class="ball" :x="bIndex" :y="yIndex">{{_btnText}}</a>
          </li>
        </ul>
      </div>
    </div>

    <!--快三-->
    <section
      v-else-if="currentMethod.type === 'k3'"
      class="ball-k3"
      v-for="(_number, _tabName, yIndex) in currentMethod.layout"
      :key="yIndex"
    >
      <template v-if="currentMethod.method !== 'KSHZDXDS' && currentMethod.method !== 'KSHZ'">
        <ul
          class="k3-dxds-lists k3-sbth-lists"
          :class="{
            'k3-sth-lists': currentMethod.method === 'STH' || currentMethod.method === 'ETH',
            'k3-ebth-lists': currentMethod.method === 'EBTH',
            'k3-dtys-lists': currentMethod.method === 'DTYS'}"
        >
          <li
            class="k3-dxds-list"
            v-for="(_code, xIndex) in _number"
            :key="xIndex"
            @click="selectCode(yIndex, xIndex)"
            :class="{'active': chooseNumber[yIndex][xIndex]}"
          >
            <a
              href="javascript:;"
              class="k3-sbth-dxds-lk"
              :class="'k3-sbth-' + _code_sub"
              :x="xIndex"
              :y="yIndex"
              v-for="(_code_sub, index) in String(_code).split('')"
              :key="index"
            ></a>
          </li>
        </ul>
        <ul
          v-if="currentMethod.method === 'ETH'"
          class="k3-dxds-lists k3-sbth-lists k3-dxds-lists-btn"
        >
          <li
            class="k3-dxds-list"
            v-for="(_code, xIndex) in currentMethod.buttons"
            :key="xIndex"
            @click="selectButton(yIndex, xIndex)"
            :class="{'active': chooseButton[yIndex][xIndex]}"
          >
            <a
              href="javascript:;"
              class="k3-sbth-dxds-lk"
              :class="'k3-sbth-' + _code_sub"
              :x="xIndex"
              :y="yIndex"
              v-for="(_code_sub, index) in String(_code).split('')"
              :key="index"
            ></a>
          </li>
        </ul>
      </template>

      <!-- 合值 大小单双-->
      <ul class="k3-dxds-lists" v-else>
        <li
          class="k3-dxds-list"
          v-for="(_code, xIndex) in _number"
          :key="xIndex"
          @click="selectCode(yIndex, xIndex)"
        >
          <a
            href="javascript:;"
            class="k3-dxds-lk"
            :class="{'active': chooseNumber[yIndex][xIndex]}"
            :x="xIndex"
            :y="yIndex"
          >{{_code}}</a>
        </li>
      </ul>
    </section>

    <!--六合彩-->
    <Lhc v-else-if="currentMethod.type === 'lhc'" @addOrder="addOrder"></Lhc>

    <!--直选-->
    <div class="main-ball-box" v-else>
      <div class="main-single-entry">
        <div class="main-balls-import">
          <el-upload
            action="/import/bet"
            :show-file-list="false"
            :http-request="uploadSectionFile"
            accept=".txt"
          >
            <div class="btn btn-blue btn-ball-import">导入注单</div>
          </el-upload>
        </div>
        <div class="balls-import-box">
          <textarea
            @input="inputAreaChange()"
            @blur="inputAreaBlur()"
            :placeholder="inputCodesInitText"
            class="balls-import-txt"
            v-model="inputCodes"
          ></textarea>
        </div>
        <div class="btn-tab-list import-clean-list">
          <a href="javascript:;" class="panel-btn-a" @click="inputClearRepeatOrder()">清理重复和错误号码</a>
          <a href="javascript:;" class="panel-btn-a" @click="inputClearOrder()">清空选号</a>
        </div>
      </div>
    </div>

    <template v-if="currentMethod.type !== 'lhc'">
      <div class="bet-statistics">
        <div class="main-column-1 fl">
          <el-select
            @change="singlePriceChange"
            v-model="userConfig.singlePrice"
            popper-class="single-price"
            placeholder="二元模式"
          >
            <el-option
              v-for="(item, index) in singlePrice"
              :key="index"
              :label="item.title"
              :value="item.val"
            ></el-option>
          </el-select>
          <div class="bet-play-mode fw">
            <a
              v-for="(mode, modeIndex) in currentLottery.valid_modes"
              href="javascript:;"
              @click="selectMode(mode.val, modeIndex)"
              :class="['btn-tab', 'btn-effect', 'btn-red', userConfig.mode == mode.val ? 'tab-on' : '']"
              :key="modeIndex"
              :v="modeIndex"
            >{{mode.title}}</a>
          </div>
          <div class="bet-choose-total">
            <a href="javascript:;" class="bet-choose-ipt" @click="timeReduce()">-</a>
            <input
              type="text"
              oninput="value=value.replace(/[^\d]/g,'')"
              class="ipt ipt-muliple"
              value="1"
              v-model="currentOrder.currentTimes"
            />
            <a href="javascript:;" class="bet-choose-ipt" @click="timeAdd()">+</a>
            <span style="margin-left: 10px;line-height: 34px;color: #a7a7a7;">倍</span>
          </div>
        </div>
        <div class="bet-add-box fr">
          奖金组:
          <el-slider
            :disabled="prizes.min >= prizes.max"
            @change="sliderChange"
            v-model="lottery.countPrize"
            :min="prizes.min"
            :max="prizes.max"
          ></el-slider>
          {{lottery.countPrize}} / {{prizes.max}}
        </div>
      </div>
      <div class="submit-btn">
        <div class="bet-statics-money-nums">
          最高盈利
          <em
            class="bignum"
          >{{currentOrder['maxProfit'] && currentOrder['maxProfit'].toFixed(3)}}</em>元
        </div>
        <div class="bet-choose-total bet-choose-total-money">
          已选
          <span class="bet-choose-total-money-count">{{currentOrder.currentCount}}</span> 注，
          共
          <strong
            class="bet-total-money"
            id="cost"
          >{{Utils.toFixed(String(bet.currentOrder.cost))}}</strong>元
        </div>
        <a
          href="javascript:;"
          class="btn main-btn-fastadd btn-effect"
          :class="{'btn-diable' : fastBtnDisable}"
          @click="!fastBtnDisable && oneKeyBet()"
        >
          <i class="el-icon-loading" v-if="betLoading"></i>一键投注
        </a>
        <a
          href="javascript:;"
          :class="{'btn-diable' : fastBtnDisable}"
          class="btn main-btn-add btn-effect"
          @click="!fastBtnDisable && handleAddOrder()"
        >
          <i class="fa fa-download ft20"></i> 添加选号
        </a>
      </div>
    </template>
  </section>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import algorithm from "../../lib/algorithm";

import { isRepeat, isRepeatNum, pad } from "@/utils";

import Lhc from "@/components/game/lhc";

export default {
  name: "game-select",
  data() {
    return {
      inputCodesInitText: "",
      inputCodes: undefined,
      inputCodesSingle: 0,
      max_times: undefined,
      chooseNumber: [],
      chooseButton: [],
      choosePosition: [],
      // 当前选中状态
      currentOrder: {
        //当前最大倍数
        currentMaxTimes: undefined,
        currentCost: 0,
        currentCount: 0,
        currentTimes: 1,
        currentGroup: undefined,
        currentCodes: {},
        maxProfit: 0
      },
      // 一键投注
      fastBtnDisable: true,
      oneKeyList: {},
      dsTimer: null,
      series: "", //当前彩种
      // 奖金计算
      // 六合彩奖金组
      lhcPrizes: "B面",
      prizes: {},
      betLoading: false,// 投注loading，
      closeTimer: null,
    };
  },
  props: ["countPrizes"],
  components: {
    Lhc
  },
  computed: {
    ...mapState(["lottery"]),
    ...mapGetters([
      "userConfig",
      "orderList",
      "totalCost",
      "currentLottery",
      "currentMethod",
      "currentMethodGroup",
      "currentLotterySign",
      "bet",
      "currentIssue",
      "allMethods",
      "userDetail",
      "lotteryLists",
      "translation",
      "userFrozen"
    ]),

    // 模式配置
    modeConfig: function() {
      return this.currentLottery.valid_modes;
    },
    // 游戏模式
    singlePrice: function() {
      return this.currentLottery.valid_price;
    },
    // 当前订单状态
    orderState: function() {
      return {
        input: this.inputCodes,
        choices: this.chooseNumber,
        position: this.choosePosition
      };
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
    //元角分更改
    "userConfig.mode": {
      handler(v) {
        if (+v == 1) {
          this.max_times = +this.currentLottery.max_times;
        } else if (+v == 0.1) {
          this.max_times = +this.currentLottery.max_times * 10;
        } else if (+v == 0.01) {
          this.max_times = +this.currentLottery.max_times * 100;
        } else {
          this.max_times = +this.currentLottery.max_times * 1000;
        }
      },
      immediate: true
    },
    //更改倍数
    "currentOrder.currentTimes"() {
      //最大倍数
      if (this.currentOrder.currentTimes > this.currentOrder.currentMaxTimes) {
        this.currentOrder.currentTimes = this.currentOrder.currentMaxTimes;
      }
      if (this.currentOrder.currentTimes < this.currentLottery.min_times) {
        this.currentOrder.currentTimes = this.currentLottery.min_times;
      }
      this.calculate();
    },
    // 切换玩法时
    "bet.methodsTab"() {
      this.fastBtnDisable = true;
      this.currentOrder.currentMaxTimes = undefined;
      this.bet.currentOrder.cost = 0;
      this.currentOrder.maxProfit = 0;
      this.currentOrder.currentCount = 0;
      this.currentOrder.currentTimes = 1;
      this.inputCodes = "";
    },
    orderList(newVal) {
      if (newVal.length === 0) {
        this.clearBtn();
      }
    },
    oneKeyList(newVal) {
      if (JSON.stringify(newVal) === "{}") {
        this.clearBtn();
      }
    },
    // 更新玩法时
    currentMethod: {
      handler() {
        console.log(this.currentMethod);
        this.initChoose();
      },
      deep: true
    },
    // 六合彩奖金组
    lhcPrizes: {
      handler(newVal) {
        if (newVal === "B面") {
          this.lottery.countPrize = 1800;
        } else {
          this.lottery.countPrize = this.prizes.max;
        }
      },
      deep: true
    }
  },
  created() {
    this.preSelectButton();
    // 当前奖金组
    // 当前最大 最小奖金组
    // 当前最大 最小奖金组
    const userPrize = {
      min: parseInt(this.userDetail.min_prize_group),
      max: parseInt(this.userDetail.max_prize_group)
    };
    const lotteryPrize = {
      min: parseInt(this.currentLottery.min_prize_group),
      max: parseInt(this.currentLottery.max_prize_group)
    };
    this.prizes.min =
      lotteryPrize.min <= userPrize.min ? userPrize.min : lotteryPrize.min;

    this.prizes.max =
      lotteryPrize.max >= userPrize.max ? userPrize.max : lotteryPrize.max;

    if (this.prizes.min > this.prizes.max) {
      this.prizes.min = this.prizes.max;
    }

    this.currentOrder.currentTimes = this.currentLottery.min_times;
    this.lottery.countPrize = this.prizes.max;
    this.series = this.currentLottery && this.currentLottery.series_id;
    this.inputAreaInit();

    if (this.currentLottery.series_id === "lhc" && this.lhcPrizes === "B面") {
      this.lottery.countPrize = 1800;
    }
  },
  methods: {
    // 投注成功 清除选中的数字
    clearBtn() {
      for (let j = 0; j < this.chooseNumber.length; j++) {
        for (let i = 0; i < this.chooseNumber[j].length; i++) {
          this.$set(this.chooseNumber[j], i, false);
        }
      }
      for (let j = 0; j < this.chooseButton.length; j++) {
        for (let i = 0; i < this.chooseButton[j].length; i++) {
          this.$set(this.chooseButton[j], i, false);
        }
      }
      // 清空注单值
      this.currentOrder.currentMaxTimes = undefined;
      this.bet.currentOrder.cost = 0;
      this.currentOrder.currentCount = 0;
      this.currentOrder.maxProfit = 0;
      this.currentOrder.currentTimes = this.currentLottery.min_times;
      this.fastBtnDisable = true;
    },
    // 计算注数
    calculate() {
      if (
        this.currentMethod.type === "multi" ||
        this.currentMethod.type === "k3" ||
        (this.currentMethod.type === "lhc" &&
          (this.currentMethod.method.indexOf("LHCBZ") !== -1 ||
            this.currentMethod.method === "LHC_LX"))
      ) {
        const method = this.currentMethod;
        let _cnt,
          _count = 0,
          _pcnt,
          item,
          k,
          ref,
          result,
          inputcodes,
          positionDesc;
        inputcodes = "";
        positionDesc = [];
        result = algorithm[method.method](method, this.orderState);
        if (method.rx && result[0]) {
          _count = result[0];
          _cnt = result[1];
          _pcnt = 0;
          ref = this.orderState.position;
          for (k in ref) {
            item = ref[k];
            if (item) {
              _pcnt += 1;
            }
          }
          positionDesc = [_pcnt, _cnt];
          if (result.length === 3) {
            inputcodes = result[2];
          }
        } else if (result instanceof Array && result[0]) {
          _count = result[0];
          inputcodes = result[1];
        } else {
          _count = result;
        }
        this.fastBtnDisable = _count > 0 ? false : true;
        //最大倍数
        this.currentOrder.currentMaxTimes = (() => {
          const v = Math.floor(
            +this.currentLottery.max_prize_per_issue / +this.currentCountPrizes
          );
          if (v > this.max_times) {
            return this.max_times;
          } else {
            return v;
          }
        })();
        //如何大于最大盈利返回false
        const maxProfit =
          _count &&
          (+this.currentCountPrizes -
            _count * +this.userConfig.mode * this.userConfig.singlePrice) *
            this.currentOrder.currentTimes;
        // 最大倍数
        if (maxProfit < this.currentLottery.max_prize_per_issue) {
          this.currentOrder.maxProfit = maxProfit;
        } else {
          this.$message({
            message: "已超过最高盈利",
            type: "warning"
          });
          this.currentOrder.currentTimes = this.currentOrder.currentMaxTimes;
          return false;
        }
        this.currentOrder.currentCount = this.bet.currentOrder.count = _count;
        this.bet.currentOrder.cost =
          +_count *
          +this.userConfig.mode *
          +this.userConfig.singlePrice *
          +this.currentOrder.currentTimes;
        this.currentOrder.inputcodes = inputcodes;
        this.currentOrder.positionDesc = positionDesc;
        return [_count, inputcodes, positionDesc];
      } else {
        //最大倍数
        this.currentOrder.currentMaxTimes = (() => {
          const v = Math.floor(
            this.currentLottery.max_prize_per_issue / this.currentCountPrizes
          );
          if (v > this.max_times) {
            return this.max_times;
          } else {
            return v;
          }
        })();
        //如何大于最大盈利返回false
        const maxProfit =
          (this.currentCountPrizes -
            this.inputCodesSingle *
              +this.userConfig.mode *
              this.userConfig.singlePrice) *
          this.currentOrder.currentTimes;
        if (maxProfit < this.currentLottery.max_prize_per_issue) {
          this.currentOrder.maxProfit = maxProfit;
        } else {
          this.$message({
            message: "已超过最高盈利",
            type: "warning"
          });
          this.currentOrder.currentTimes = this.currentOrder.currentMaxTimes;
          return false;
        }
        this.fastBtnDisable = this.inputCodesSingle > 0 ? false : true;
        this.bet.currentOrder.cost =
          this.inputCodesSingle *
          +this.userConfig.singlePrice *
          this.currentOrder.currentTimes *
          this.userConfig.mode;
        this.currentOrder.currentCount = this.inputCodesSingle;
      }
    },
    //将金组改变
    sliderChange() {
      this.calculate();
    },
    // 倍数增加
    timeAdd() {
      if (this.currentOrder.currentTimes < this.currentOrder.currentMaxTimes) {
        this.currentOrder.currentTimes = +this.currentOrder.currentTimes + 1;
      }
    },
    // 倍数减少
    timeReduce() {
      this.currentOrder.currentTimes > 1
        ? (this.currentOrder.currentTimes = +this.currentOrder.currentTimes - 1)
        : "";
      this.calculate();
    },
    // 选择模式
    selectMode(mode) {
      Object.assign(this.userConfig, {
        mode: (+mode).toFixed(3)
      });
      this.$store.commit("SET_USER_CONFIG", this.userConfig);
      this.$emit("countPrizes");
      this.$nextTick(() => {
        this.calculate();
      });
    },
    // 模式改变
    singlePriceChange(val) {
      Object.assign(this.userConfig, { singlePrice: val });
      this.$store.commit("SET_USER_CONFIG", this.userConfig);
      this.$emit("countPrizes");
      this.$nextTick(() => {
        this.calculate();
      });
    },
    // 选择数字
    selectCode(y, x) {
      this.cleanChooseButton(y);
      // 限制号码个数
      if (
        this.currentMethod.limitSelectedCount &&
        (this.chooseNumber[y] && this.chooseNumber[y][x] === false)
      ) {
        let count = 0;
        for (let c = 0; c < this.chooseNumber[y].length; c++) {
          const col1 = this.chooseNumber[y][c];
          if (x !== c) {
            if (col1) {
              count++;
            }
            if (count >= this.currentMethod.limitSelectedCount[y] && col1) {
              this.$set(this.chooseNumber[y], c, false);
            }
          }
        }
      }
      // 限制同位选择
      if (this.currentMethod.limitSelectedSomePosition) {
        for (let _row = 0; _row < this.chooseNumber.length; _row++) {
          if (_row !== y) {
            if (this.chooseNumber[_row][x] === true) {
              this.$set(this.chooseNumber[_row], x, false);
            }
          }
        }
      }

      this.$set(this.chooseNumber[y], x, !this.chooseNumber[y][x]);
      // 计算注数
      this.calculate();
    },
    preSelectButton() {
      this.initChoose();
    },
    // 选择按钮
    selectButton(y, b) {
      if (this.currentMethod.method !== "ETH") {
        this.cleanChooseButton(y);
        this.cleanChooseNumber(y);
      }
      this.$set(this.chooseButton[y], b, !this.chooseNumber[y][b]);
      let rowData = this.chooseNumber[y];
      const rowVal = Object.values(this.currentMethod.layout)[y];
      if (
        this.currentLottery.series_id === "lotto" ||
        this.currentLottery.series_id === "pk10"
      ) {
        if (
          this.currentLottery.series_id === "lotto" &&
          (this.currentMethod.method === "LTQ3ZU3DT" ||
            this.currentMethod.method === "LTQ2DTZU2" ||
            this.currentMethod.method === "LTRXDT2" ||
            this.currentMethod.method === "LTRXDT3" ||
            this.currentMethod.method === "LTRXDT4" ||
            this.currentMethod.method === "LTRXDT5" ||
            this.currentMethod.method === "LTRXDT6" ||
            this.currentMethod.method === "LTRXDT7" ||
            this.currentMethod.method === "LTRXDT8")
        ) {
          switch (this.currentMethod.buttons[b]) {
            case "全":
              for (let i = 0; i < rowData.length; i++) {
                this.chooseNumber[y][i] = !this.chooseNumber[0][i];
              }
              break;
            case "大":
              for (let i = 0; i < rowData.length; i++) {
                if (i >= Math.floor(rowData.length / 2)) {
                  this.chooseNumber[y][i] = !this.chooseNumber[0][i];
                }
              }
              break;
            case "小":
              for (let i = 0; i < rowData.length; i++) {
                if (i < Math.floor(rowData.length / 2)) {
                  this.chooseNumber[y][i] = !this.chooseNumber[0][i];
                }
              }
              break;
            case "偶":
              for (let i = 0; i < rowData.length; i++) {
                if (rowVal[i] % 2 === 0) {
                  this.chooseNumber[y][i] = !this.chooseNumber[0][i];
                }
              }
              break;
            case "奇":
              for (let i = 0; i < rowData.length; i++) {
                if (rowVal[i] % 2 !== 0) {
                  this.chooseNumber[y][i] = !this.chooseNumber[0][i];
                }
              }
              break;
            case "清":
              this.chooseButton[y][b] = false;
              break;
          }
        } else {
          switch (this.currentMethod.buttons[b]) {
            case "全":
              for (let i = 0; i < rowData.length; i++) {
                this.chooseNumber[y][i] = true;
              }
              break;
            case "大":
              for (let i = 0; i < rowData.length; i++) {
                if (i >= Math.floor(rowData.length / 2)) {
                  this.chooseNumber[y][i] = true;
                }
              }
              break;
            case "小":
              for (let i = 0; i < rowData.length; i++) {
                if (i < Math.floor(rowData.length / 2)) {
                  this.chooseNumber[y][i] = true;
                }
              }
              break;
            case "偶":
              for (let i = 0; i < rowData.length; i++) {
                if (rowVal[i] % 2 === 0) {
                  this.chooseNumber[y][i] = true;
                }
              }
              break;
            case "奇":
              for (let i = 0; i < rowData.length; i++) {
                if (rowVal[i] % 2 !== 0) {
                  this.chooseNumber[y][i] = true;
                }
              }
              break;
            case "清":
              this.chooseButton[y][b] = false;
              break;
          }
        }
      } else {
        switch (this.currentMethod.buttons[b]) {
          case "全":
            for (let i = 0; i < rowData.length; i++) {
              this.chooseNumber[y][i] = true;
            }
            break;
          case "大":
            for (let i = 0; i < rowData.length; i++) {
              if (i >= rowData.length / 2) {
                this.chooseNumber[y][i] = true;
              }
            }
            break;
          case "小":
            for (let i = 0; i < rowData.length; i++) {
              if (i < rowData.length / 2) {
                this.chooseNumber[y][i] = true;
              }
            }
            break;
          case "偶":
            for (let i = 0; i < rowData.length; i++) {
              if (rowVal[i] % 2 === 0) {
                this.chooseNumber[y][i] = true;
              }
            }
            break;
          case "奇":
            for (let i = 0; i < rowData.length; i++) {
              if (rowVal[i] % 2 !== 0) {
                this.chooseNumber[y][i] = true;
              }
            }
            break;
          case "清":
            this.chooseButton[y][b] = false;
            break;
          case "11":
            for (let i = 0; i < 30; i += 6) {
              this.chooseNumber[y][i] = !this.chooseNumber[y][i];
            }
            break;
          case "22":
            for (let i = 1; i < 30; i += 6) {
              this.chooseNumber[y][i] = !this.chooseNumber[y][i];
            }
            break;
          case "33":
            for (let i = 2; i < 30; i += 6) {
              this.chooseNumber[y][i] = !this.chooseNumber[y][i];
            }
            break;
          case "44":
            for (let i = 3; i < 30; i += 6) {
              this.chooseNumber[y][i] = !this.chooseNumber[y][i];
            }
            break;
          case "55":
            for (let i = 4; i < 30; i += 6) {
              this.chooseNumber[y][i] = !this.chooseNumber[y][i];
            }
            break;
          case "66":
            for (let i = 5; i < 30; i += 6) {
              this.chooseNumber[y][i] = !this.chooseNumber[y][i];
            }
            break;
        }
      }
      this.calculate();
    },
    // 初始化选号
    initChoose() {
      this.chooseNumber = [];
      this.chooseButton = [];
      this.bet.ylcBetData = [];
      if (this.currentMethod.type !== "lhc" && this.currentMethod.layout) {
        const iterable = Object.keys(this.currentMethod.layout);
        for (let i = 0; i < iterable.length; i++) {
          let row = iterable[i];
          this.chooseNumber[i] = [];
          this.chooseButton[i] = [];
          let _xData = [];
          for (let j = 0; j < this.currentMethod.layout[row].length; j++) {
            _xData[j] = false;
          }
          let _bData = [];

          this.currentMethod.buttons.forEach((undefined, iNum) => {
            _bData[iNum] = false;
          });
          this.$set(this.chooseButton, i, _bData);
          this.$set(this.chooseNumber, i, _xData);
        }
      }
    },
    // 清空选号
    cleanChooseNumber(y) {
      for (let j = 0; j < this.chooseNumber[y].length; j++) {
        this.chooseNumber[y][j] = false;
      }
    },
    // 清空按钮
    cleanChooseButton(y) {
      for (let j = 0; j < this.chooseButton[y].length; j++) {
        this.chooseButton[y][j] = false;
      }
    },

    convertCodes() {
      const method = this.currentMethod;
      // 选球类型
      if (
        method.type === "multi" ||
        (method.type === "k3" && method.types !== "casino") ||
        (method.type === "pk10" && method.types !== "casino")
      ) {
        let codes = [];
        const iterable = Object.keys(method.layout);
        for (let i = 0; i < iterable.length; i++) {
          const name = iterable[i];
          const layout = method.layout[name];
          const col = [];
          for (let j = 0; j < layout.length; j++) {
            const number = layout[j];
            if (this.chooseNumber[i][j]) {
              let temp = null;
              if (
                this.Utils.checkIsChinese(number) ||
                (this.currentLottery.series_id === "klsf" &&
                  method.method.indexOf("KLSF_LH_") > -1)
              ) {
                temp = this.$store.getters.translation(number);
                if (
                  this.currentLottery.series_id === "klsf" &&
                  number === "和"
                ) {
                  temp = "h";
                }
              } else {
                temp = number;
              }
              col.push(temp);
            }
          }
          if (
            method.type === "k3" ||
            method.method === "QZXHZ" ||
            method.method === "QZUHZ" ||
            method.method === "ZZXHZ" ||
            method.method === "ZZUHZ" ||
            method.method === "HZXHZ" ||
            method.method === "HZUHZ"
          ) {
            codes.push(col.join("|"));
          } else if (this.currentLottery.series_id === "pk10") {
            codes.push(
              col
                .map(val => {
                  return pad(parseInt(val), 2);
                })
                .join("&")
            );
          } else {
            codes.push(col.join("&"));
          }
        }
        return codes.join("|");
      } else if (
        method.type === "ylc" ||
        method.type === "pcdd" ||
        method.type === "lhc" ||
        (method.type === "k3" && method.types === "casino") ||
        (method.type === "pk10" && method.types === "casino")
      ) {
        let list = this.bet.ylcBetData;
        for (const k of list) {
          if (this.Utils.checkIsChinese(k.code)) {
            if (method.type === "lhc") {
              k.code = this.$store.getters.lhcTransLation(k.code);
            } else {
              k.code = this.$store.getters.translation(k.code);
            }
          }
        }
        return list;
      }
    },
    // 格式化号码
    formatInputCodes(code) {
      if (
        this.currentMethod.type === "multi" ||
        this.currentMethod.type === "k3"
      ) {
        if (
          this.currentLottery.series_id === "ssc" ||
          this.currentLottery.series_id === "digital3" ||
          this.currentLottery.series_id === "p3p5"
        ) {
          if (
            Array.from(code).includes("|") ||
            this.currentMethod.method === "DWD"
          ) {
            return code.replace(/&/g, "");
          } else {
            return code.replace(/&/g, ",");
          }
        } else if (this.currentLottery.series_id === "lotto") {
          if (
            Array.from(code).includes("|") ||
            this.currentMethod.method === "LTDWD"
          ) {
            return code.replace(/&/g, " ");
          } else {
            return code.replace(/&/g, ",");
          }
        } else if (this.currentLottery.series_id === "pk10") {
          if (
            Array.from(code).includes("|") ||
            this.currentMethod.method === "PKDWD"
          ) {
            return code.replace(/&/g, " ");
          } else {
            return code.replace(/&/g, ",");
          }
        } else if (this.currentLottery.series_id === "ks") {
          if (Array.from(code).includes("|")) {
            return code.replace(/&/g, "");
          } else {
            return code.replace(/&/g, ",");
          }
        }
      }
      return code;
    },
    // 输入框初始化
    inputAreaInit() {
      if (
        this.currentLottery.series_id === "lotto" ||
        this.currentLottery.series_id === "pk10"
      ) {
        this.inputCodesInitText =
          "说明：\n 1、每一注号码之间的间隔符支持|符或者逗号，号码之间则使用空格隔开\n 2、文件格式必须是.txt格式。\n 3、导入文本内容后将覆盖文本框中现有的内容 \n" +
          " 范例1：01 02 03|03 04 05|07 08 11 \n" +
          " 范例2：01 02 03,03 04 05,07 08 11 \n";
      } else {
        this.inputCodesInitText =
          "说明：\n 1、每一注号码之间的间隔符支持换行符 回车 逗号。\n 2、文件格式必须是.txt格式。\n 3、导入文本内容后将覆盖文本框中现有的内容";
      }
      // this.inputCodes = this.inputCodesInitText
    },
    // 单式输入框获取焦点
    inputAreaFocus() {
      if (this.inputCodes === this.inputCodesInitText) {
        this.inputCodes = "";
        return true;
      }
    },
    // 单式输入框 变化时
    inputAreaChange() {
      clearInterval(this.dsTimer);
      this.dsTimer = setTimeout(() => {
        this.inputClearRepeatOrder();
      }, 2000);
    },
    // 单式输入框失去焦点
    inputAreaBlur() {
      if (this.inputCodes) {
        this.inputClearRepeatOrder();
      }
    },
    // 清空直选单式文本
    inputClearOrder() {
      this.inputCodes = "";
    },
    // 清理重复项 和 错误项
    inputClearRepeatOrder() {
      let [
        tmp = new Set(
          (this.inputCodes || "").split(/[\s\n,，|]+/).map(item => {
            return this.Utils.trim(item);
          })
        )
      ] = [];
      // 顺序不限的彩种
      const unlimitOrder = [
        "QZU3_S",
        "QZU6_S",
        "ZZU3_S",
        "ZZU6_S",
        "ZHHZX",
        "HZU3_S",
        "HZU6_S",
        "HHHZX",
        "HZU2_S",
        "QZU2_S",
        "QHHZX",
        "LTQ3ZU3_S",
        "LTQ2ZU2_S"
      ];
      // 任选单式
      if (this.currentMethod.mType && this.currentMethod.mType === "rxds") {
        tmp = new Set(
          (this.inputCodes || "").split(/[,，|;]+/).map(item => {
            return this.Utils.trim(item);
          })
        );
        for (const k of tmp) {
          // 去除重复的组
          const arr = k.split(/[\s\n]+/);
          if (
            isRepeat(arr) ||
            arr.length != this.currentMethod.b64 ||
            arr.some(val => Number(val) > 11 || Number(val) <= 0) ||
            arr.some(val => val.length !== 2)
          ) {
            tmp.delete(k);
          }
        }
      } else {
        // 直选单式
        if (
          this.currentLottery.series_id === "lotto" ||
          this.currentLottery.series_id === "pk10"
        ) {
          tmp = new Set(
            (this.inputCodes || "").split(/[,|，;]+/).map(item => {
              return this.Utils.trim(item);
            })
          );
          for (const i of tmp) {
            // 去除重复的组
            const arr = i.split(/[\s\n]+/);
            if (
              isRepeat(arr) ||
              arr.length != this.currentMethod.b64 ||
              arr.some(val => Number(val) > 11 || Number(val) <= 0) ||
              arr.some(val => val.length !== 2)
            ) {
              tmp.delete(i);
            }
          }
        } else {
          for (const i of tmp) {
            // 去除非数字项
            if (isNaN(i)) {
              tmp.delete(i);
            }
            // 去除 小于 或者 大于规定长度
            if (
              (this.currentMethod &&
                String(i).length < this.currentMethod.b64) ||
              String(i).length > this.currentMethod.b64
            ) {
              tmp.delete(i);
            }
            if (
              this.currentMethod.method === "QZU3_S" ||
              this.currentMethod.method === "ZZU3_S" ||
              this.currentMethod.method === "HZU3_S"
            ) {
              if (isRepeatNum(i) !== 2) {
                tmp.delete(i);
              }
            }
            if (
              this.currentMethod.method === "QZU2_S" ||
              this.currentMethod.method === "HZU2_S" ||
              this.currentMethod.method === "QZU6_S" ||
              this.currentMethod.method === "ZZU6_S" ||
              this.currentMethod.method === "HZU6_S"
            ) {
              if (isRepeat(i)) {
                tmp.delete(i);
              }
            }
            if (
              this.currentMethod.method === "QHHZX" ||
              this.currentMethod.method === "ZHHZX" ||
              this.currentMethod.method === "HHHZX"
            ) {
              if (isRepeatNum(i) === 3) {
                tmp.delete(i);
              }
            }
          }
        }
      }
      if (
        unlimitOrder.some(v => v === this.currentMethod.method) ||
        (this.currentMethod && this.currentMethod.mType === "rxds")
      ) {
        const newArr = [];
        if (
          this.currentLottery.series_id === "lotto" ||
          this.currentLottery.series_id === "pk10"
        ) {
          for (const i of tmp) {
            const newVal = i
              .split(/[\s\n]+/)
              .sort(function(a, b) {
                return a - b;
              })
              .join(" ");
            newArr.push(newVal);
          }
        } else {
          for (const i of tmp) {
            const newVal = i
              .split("")
              .sort(function(a, b) {
                return a - b;
              })
              .join("");
            newArr.push(newVal);
          }
        }
        tmp = new Set(newArr);
      }
      if (
        this.currentLottery.series_id === "lotto" ||
        this.currentLottery.series_id === "pk10"
      ) {
        this.inputCodes = [...tmp].join("|");
        if (!this.inputCodes) {
          this.inputCodesSingle = 0;
        } else {
          this.inputCodesSingle = this.inputCodes.split("|").length;
        }
      } else {
        this.inputCodes = [...tmp].join(",");
        if (!this.inputCodes) {
          this.inputCodesSingle = 0;
        } else {
          this.inputCodesSingle = this.inputCodes.split(",").length;
        }
      }

      this.calculate();
    },
    // 投注单
    addOrder(oneKey) {
      // if (!this.bet.currentOrder.cost || +this.bet.currentOrder.cost <= 0) {
      //   return -1;
      // }
      let order = null;

      function handleMode(mode) {
        switch (+mode) {
          case 1:
            return 1;
          case 0.1:
            return 2;
          case 0.01:
            return 3;
          default:
            return 4;
        }
      }
      const convertCodes = this.convertCodes();
      if (
        this.currentMethod.type === "multi" ||
        (this.currentMethod.type === "k3" &&
          this.currentMethod.types !== "casino") ||
        (this.currentMethod.type === "pk10" &&
          this.currentMethod.types !== "casino")
      ) {
        order = {
          method_sign: this.currentMethod.method,
          method_name: this.currentMethod.name,
          codes: convertCodes,
          count: this.currentOrder.currentCount,
          times: this.currentOrder.currentTimes,
          currentMaxTimes: this.currentOrder.currentMaxTimes,
          cost: this.bet.currentOrder.cost.toFixed(3),
          mode: handleMode(this.userConfig.mode),
          prize_group: this.lottery.countPrize,
          price: this.userConfig.singlePrice,
          sign: this.currentMethod.sign
        };
        order._codes = this.formatInputCodes(order.codes);
        if (oneKey) {
          this.oneKeyList = order;
        } else {
          let index = this.orderList.findIndex(item => {
            return (
              order.codes === item.codes &&
              order.method_sign === item.method_sign
            );
          });
          // 如果订单存在相同号码  不添加订单 在原有订单基础上累加倍数
          if (index > -1) {
            this.$alert(
              "您选择的号码在号码篮已存在，将直接进行倍数累加，返点以第一单为准",
              "提示",
              {
                confirmButtonText: "确定",
                callback: () => {
                  this.$set(
                    this.orderList[index],
                    "times",
                    this.orderList[index].times + order.times
                  );
                  this.$set(
                    this.orderList[index],
                    "cost",
                    Number(this.orderList[index].cost) + Number(order.cost)
                  );
                }
              }
            );
          } else {
            this.orderList.unshift(order);
          }
          // 初始化翻倍后的数据
          let doubleBeforeOrder = [];
          if (!Array.isArray(this.bet.doubleBeforeOrder)) {
            doubleBeforeOrder = JSON.parse(this.bet.doubleBeforeOrder);
          }
          doubleBeforeOrder.push(order);
          this.bet.doubleBeforeOrder = JSON.stringify(doubleBeforeOrder);
          this.clearBtn();
        }
      } else if (
        this.currentMethod.type === "ylc" ||
        this.currentMethod.type === "lhc" ||
        this.currentMethod.type === "pcdd" ||
        (this.currentMethod.type === "k3" &&
          this.currentMethod.types === "casino") ||
        (this.currentMethod.type === "pk10" &&
          this.currentMethod.types === "casino")
      ) {
        // let ylcBetData = this.convertCodes();
        let count = 1;
        let cost = 0;

        if (
          this.currentMethod.method.indexOf("LHCBZ") !== -1 ||
          this.currentMethod.method === "LHC_LX"
        ) {
          this.inputCodes = "";
          this.chooseNumber = [[]];
          for (let i = 0; i < 48; i++) {
            this.chooseNumber[0].push(false);
          }

          if (this.currentMethod.method.indexOf("LHCBZ") !== -1) {
            for (let k of convertCodes[0].code.split("&")) {
              this.chooseNumber[0][+k - 1] = true;
            }
          } else {
            for (let i = 0; i < convertCodes[0].code.split("&").length; i++) {
              this.chooseNumber[0][i] = true;
            }
          }
          this.orderState.position = [1, 2, 3];
          this.calculate();

          count = this.bet.currentOrder.count;
          cost = this.bet.currentOrder.cost =
            +convertCodes[0]["money"] * this.bet.currentOrder.cost;
        }

        for (const k of convertCodes) {
          order = {
            method_sign: k.method_sign,
            method_name: k.method_name,
            title: k.title,
            codes: k.code + "",
            codec: k.codec + "",
            count: count,
            times: k.money,
            odds: k.odds,
            cost: cost
              ? this.Utils.toFixed(cost, 3)
              : this.Utils.toFixed(k.money, 3),
            mode: handleMode(this.userConfig.mode),
            prize_group: this.lottery.countPrize,
            price: this.userConfig.singlePrice,
            sign: this.currentMethod.sign
          };
          this.orderList.unshift(order);
        }
      } else {
        const codes = (() => {
          if (
            this.currentLottery.series_id === "lotto" ||
            this.currentLottery.series_id === "pk10"
          ) {
            return this.inputCodes.split("|");
          } else {
            return this.inputCodes.split(",");
          }
        })();
        order = {
          method_sign: this.currentMethod.method,
          method_name: this.currentMethod.name,
          codes:
            this.currentMethod.type === "text"
              ? codes.join(",")
              : this.inputCodes,
          count: this.currentOrder.currentCount,
          times: this.currentOrder.currentTimes,
          cost: this.bet.currentOrder.cost.toFixed(3),
          mode: handleMode(this.userConfig.mode),
          prize_group: this.lottery.countPrize,
          price: this.userConfig.singlePrice,
          sign: this.currentMethod.sign
        };
        if (oneKey) {
          this.oneKeyList = order;
        } else {
          this.oneKeyList = {};
          this.orderList.unshift(order);
          // 初始化翻倍后的数据
          let doubleBeforeOrder = [];
          if (!Array.isArray(this.bet.doubleBeforeOrder)) {
            doubleBeforeOrder = JSON.parse(this.bet.doubleBeforeOrder);
          }
          doubleBeforeOrder.push(order);
          this.bet.doubleBeforeOrder = JSON.stringify(doubleBeforeOrder);
          this.inputCodesSingle = 0;
          this.inputCodes = "";
        }
      }
    },
    // 一键投注
    oneKeyBet() {
      if (this.betLoading) {
        return;
      }
      clearTimeout(this.closeTimer);
      this.betLoading = true;
      this.$store
        .dispatch("getUserDetail")
        .then(({ success }) => {
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
            if (+this.userDetail["balance"] < +this.bet.currentOrder.cost) {
              this.$alert("对不起, 当前余额不足!", "提示", {
                confirmButtonText: "确定",
                closeOnClickModal: false,
                closeOnPressEscape: false,
                showClose: false
              });
              this.betLoading = false;
              return false;
            }
            let [
              currentIssus = this.currentIssue.issue_no,
              issus = { [currentIssus]: 1 }
            ] = [];
            this.judgeChallenge(true)
              .then(() => {
                this.addOrder(true);
                const oneKeyList = JSON.parse(JSON.stringify(this.oneKeyList));
                delete oneKeyList._codes;
                delete oneKeyList.currentMaxTimes;
                this.Api.bet(
                  this.currentLottery.en_name,
                  issus,
                  [oneKeyList],
                  this.bet.currentOrder.cost.toFixed(3),
                  0
                ).then(res => {
                  this.betLoading = false;
                  if (res.success) {
                    this.oneKeyList = {};
                    this.$alert(
                      "投注成功, 您可以通过”游戏记录“查询您的投注记录！",
                      "提示",
                      {
                        confirmButtonText: "确定"
                      }
                    );
                    this.closeTimer = setTimeout(() => {
                      this.$msgbox.close();
                    }, 3000);
                    // 添加完选号 清空选中号码
                    this.clearBtn();
                    // 获取我的投注 我的追号记录
                    this.$store.dispatch("betHistory");
                    // 刷新余额
                    this.$store.dispatch("getUserDetail");
                    this.inputCodes = "";
                  }
                });
              })
              .catch(() => {
                this.betLoading = false;
              });
          }
        })
        .catch(() => {
          this.betLoading = false;
        });
    },
    // 添加投注单
    handleAddOrder() {
      this.addOrder();
    },
    //单挑判断
    judgeChallenge(oneKey) {
      if (!this.bet.currentOrder.cost || +this.bet.currentOrder.cost <= 0) {
        this.$alert("选号不符合规则, 请按照规则选号", "提示", {
          confirmButtonText: "确定"
        });
        return -1;
      }
      return new Promise((resolve, reject) => {
        const h = this.$createElement;
        let codes = null,
          isChallenge = false; //是否是单挑
        if (
          this.currentMethod.type !== "multi" &&
          this.currentMethod.type !== "k3"
        ) {
          let input = null;
          if (
            this.currentLottery.series_id === "lotto" ||
            this.currentLottery.series_id === "pk10"
          ) {
            input = this.inputCodes.split("|");
          } else {
            input = this.inputCodes.split(",");
          }

          if (this.currentMethod.type === "text") {
            codes = input.join(",");
          } else {
            codes = this.inputCodes;
          }
        } else {
          // 非单式
          codes = this.convertCodes();
        }
        switch (this.currentMethod["challenge_type"]) {
          case 1:
          case 2:
            if (
              this.currentOrder.currentCount <=
              this.currentMethod["challenge_min_count"]
            ) {
              isChallenge = true;
            }
            break;
          case 3:
          case 7:
            if (codes == this.currentMethod["challenge_config"]["code"]) {
              isChallenge = true;
            }
            break;
          case 4:
            {
              let zu3Num = 0;
              let zu6Num = 0;
              codes.split(",").forEach(v => {
                const num = isRepeatNum(v);
                if (num === 1) {
                  zu6Num++;
                } else if (num === 2) {
                  zu3Num++;
                }
              });
              if (
                zu3Num <= this.currentMethod["challenge_config"]["zu3"] ||
                zu6Num <= this.currentMethod["challenge_config"]["zu6"]
              ) {
                isChallenge = true;
              }
            }
            break;
          case 5:
            isChallenge = true;
            break;
          case 6:
            {
              let keys = Object.keys(
                this.currentMethod["challenge_config"]["code"]
              ).map(value => {
                return parseInt(value);
              });
              let currCodes = codes.split("|").map(value => {
                return parseInt(value);
              });
              // 求交集
              const interNum = keys.filter(v => currCodes.includes(v));

              if (
                interNum.length >= this.currentMethod["challenge_config"]["min"]
              ) {
                isChallenge = true;
              }
            }
            break;
          default:
            break;
        }

        if (isChallenge) {
          this.$msgbox({
            title: oneKey ? "投注确认" : "添加确认",
            customClass: "confirm-bet",
            message: h("div", null, [
              h(
                "p",
                { style: "text-align: center; font-weight:bold;" },
                `${this.currentLottery.cn_name} 第${this.currentIssue.issue_no}期`
              ),
              h(
                "p",
                { style: "text-align: center; font-weight:bold;" },
                `总计${
                  this.currentOrder.currentCount
                }注  总共${this.bet.currentOrder.cost.toFixed(3)}元`
              ),
              h(
                "p",
                { style: "text-align: center; color: #ff7200" },
                `投注包含单挑注单，奖金上限为${
                  this.currentMethod["challenge_bonus"]
                }元`
              )
            ]),
            showCancelButton: true,
            confirmButtonText: oneKey ? "确认投注" : "继续添加"
          })
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        } else {
          resolve();
        }
      });
    },
    uploadSectionFile(param) {
      const _this = this,
        fileReader = new FileReader(),
        file = param.file;

      fileReader.readAsText(file, "gb2312");
      fileReader.onload = e => {
        let fileText = e.target.result;
        if (fileText.trim() != "") {
          _this.inputCodes = fileText;
          this.inputAreaChange();
        }
      };
      return;
    }
  },
  destroyed() {
    clearTimeout(this.closeTimer);
  }
};
</script>
<style lang="scss">
@import "../../assets/css/var.scss";
.confirm-bet {
  /deep/ {
    .el-message-box__btns {
      text-align: center;
    }
    .el-button--primary {
      background-color: $ball-color;
      border-color: $ball-color;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.bet-add-box {
  right: 15px;
  font-size: 14px;
  /deep/ {
    .el-slider {
      position: relative;
      z-index: 0;
      margin: 0 20px;
      display: inline-block;
      vertical-align: middle;
      width: 100px;
    }

    .el-slider__bar {
      background-color: $ball-color;
    }
    .el-slider__button {
      border-color: $ball-color;
    }
  }
}
.main-column-1 {
  /deep/ {
    .el-select {
      margin-right: 10px;
      width: 108px;
      float: left;
    }
  }
}
.bet-statics-money-nums {
  float: left;
  clear: both;
  line-height: 45px;
}
.single-price .el-select-dropdown__item.selected {
  color: $ball-color;
  font-weight: 500;
}
</style>
