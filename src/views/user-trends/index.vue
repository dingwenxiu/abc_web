<template>
  <div class="user-trends">
    <div class="trend-header">
      <el-form :inline="true" class="form-inline">
        <el-form-item>
          <span style="font-size: 16px;">选择彩种：</span>
        </el-form-item>
        <el-form-item>
          <el-cascader
            @change="handleLotteryIdChange"
            :props="{ expandTrigger: 'hover' }"
            v-model="lotteryId"
            :options="lotteryAllOptions"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </div>
    <div class="trend-main">
      <div class="select-section">
        <div class="select-section-inner clearfix" v-if="lotteryId[0] !== 'lhc'">
          <ul class="select-list" v-if="this.lotteryId[0] === 'ssc'">
            <li
              :class="{current: currentChart === 'WuXing'}"
              @click="selectCurrentChart('WuXing', 5)"
            >
              <a href="javascript:void(0);">五星</a>
            </li>
            <li
              :class="{current: currentChart === 'SiXing'}"
              @click="selectCurrentChart('SiXing', 4)"
            >
              <a href="javascript:void(0);">四星</a>
            </li>
            <li
              :class="{current: currentChart === 'QianSan'}"
              @click="selectCurrentChart('QianSan', '3f')"
            >
              <a href="javascript:void(0);">前三</a>
            </li>
            <li
              :class="{current: currentChart === 'ZhongSan'}"
              @click="selectCurrentChart('ZhongSan', '3m')"
            >
              <a href="javascript:void(0);">中三</a>
            </li>
            <li
              :class="{current: currentChart === 'HouSan'}"
              @click="selectCurrentChart('HouSan', '3e')"
            >
              <a href="javascript:void(0);">后三</a>
            </li>
            <li
              :class="{current: currentChart === 'QianEr'}"
              @click="selectCurrentChart('QianEr', '2f')"
            >
              <a href="javascript:void(0);">前二</a>
            </li>
            <li
              :class="{current: currentChart === 'HouEr'}"
              @click="selectCurrentChart('HouEr', '2e')"
            >
              <a href="javascript:void(0);">后二</a>
            </li>
          </ul>
          <ul class="select-list" v-if="this.lotteryId[0] === 'lotto'">
            <li
              :class="{current: currentChart === 'WuXing11x5'}"
              @click="selectCurrentChart('WuXing11x5')"
            >
              <a href="javascript:void(0);">五星</a>
            </li>
          </ul>
          <ul class="select-list" v-if="this.lotteryId[0] === 'k3'">
            <li
              :class="{current: currentChart === 'SanXingK3'}"
              @click="selectCurrentChart('SanXingK3')"
            >
              <a href="javascript:void(0);">三星</a>
            </li>
          </ul>
          <ul
            class="select-list"
            v-if="this.lotteryId[0] === '3d' || this.lotteryId[0] === 'sd' || this.lotteryId[0] === 'p3p5' || this.lotteryId[0] === 'ssl'"
          >
            <li
              :class="{current: currentChart === 'SanXingDpc'}"
              @click="selectCurrentChart('SanXingDpc')"
            >
              <a href="javascript:void(0);">三星</a>
            </li>
          </ul>
          <ul class="select-list" v-if="this.lotteryId[0] === 'pk10'">
            <li
              :class="{current: currentChart === 'GuanYa'}"
              @click="selectCurrentChart('GuanYa', '2gy')"
            >
              <a href="javascript:void(0);">冠亚军</a>
            </li>
            <li
              :class="{current: currentChart === 'QianWu'}"
              @click="selectCurrentChart('QianWu', '5f')"
            >
              <a href="javascript:void(0);">前五名</a>
            </li>
            <li
              :class="{current: currentChart === 'HouWu'}"
              @click="selectCurrentChart('HouWu', '5e')"
            >
              <a href="javascript:void(0);">后五名</a>
            </li>
          </ul>
        </div>
        <div class="select-section-content clearfix">
          <div class="select-section-content-inner">
            <div class="function" v-if="lotteryId[0] !== 'lhc'">
              <el-checkbox-group @change="handleChangeSelect" v-model="select">
                <el-checkbox
                  v-for="select in selectOption"
                  :label="select"
                  :key="select"
                  border
                >{{slectOptionDict[select]}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="time">
              <el-radio-group v-model="dataNum" @change="dataNumChange">
                <el-radio-button label="30">近30期</el-radio-button>
                <el-radio-button label="50">近50期</el-radio-button>
                <el-radio-button label="100">近100期</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="chart-loading" v-loading="chartLoading">
          <component v-if="showCurrentChat" ref="Chart" :list="list" :is="currentChart"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import WuXing from "./components/ssc/wu-xing";
import SiXing from "./components/ssc/si-xing";
import QianSan from "./components/ssc/qian-san";
import ZhongSan from "./components/ssc/zhong-san";
import HouSan from "./components/ssc/hou-san";
import QianEr from "./components/ssc/qian-er";
import HouEr from "./components/ssc/hou-er";
import SanXingK3 from "./components/k3/san-xing";
import SanXingDpc from "./components/dpc/san-xing";
import WuXing11x5 from "./components/11-5/wu-xing";
import GuanYa from "./components/pk10/guanya";
import QianWu from "./components/pk10/qian-wu";
import HouWu from "./components/pk10/hou-wu";

import Lhc from "./components/lhc/lhc";

export default {
  name: "user-trends",
  components: {
    WuXing,
    SiXing,
    QianSan,
    ZhongSan,
    HouSan,
    QianEr,
    HouEr,
    WuXing11x5,
    SanXingK3,
    SanXingDpc,
    GuanYa,
    QianWu,
    HouWu,
    Lhc
  },
  props: ["lotterySign"],
  data() {
    const slectOptionDict = {
      guides: "辅助线",
      lost: "遗漏",
      lostPost: "遗漏条",
      trend: "连线",
      temperature: "号温"
    };
    return {
      list: [],
      chartLoading: false,
      showCurrentChat: false,
      currentChart: "",
      lotteryId: ["ssc", "cqssc"],
      slectOptionDict,
      selectOption: ["guides", "lost", "lostPost", "trend", "temperature"],
      select: ["guides", "lost", "trend"],
      options: [],
      dataNum: 30,
      listQuery: {
        lottery_sign: "",
        num_type: 5,
        count: 30
      }
    };
  },
  computed: {
    ...mapGetters(["lotteryAll", "currentLottery", "lotteryLists"]),
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
    if (this.lotterySign)
      this.lotteryId = [
        this.lotteryAll[this.lotterySign]["lottery"]["series_id"],
        this.lotterySign
      ];
    this.switchChat(this.lotteryId[0]);
  },
  mounted() {
    this.getData(this.lotteryId[1]);
  },
  methods: {
    // 请求走势数据
    getData(lottery_sign, num) {
      this.list = [];
      this.listQuery.lottery_sign = lottery_sign;
      if (num) this.listQuery.num_type = num;
      this.showCurrentChat = false;
      this.chartLoading = true;
      this.Api.getTrend(this.listQuery)
        .then(({ success, data }) => {
          if (success) {
            this.chartLoading = false;
            this.list = data;
            this.showCurrentChat = true;
          }
        })
        .catch(() => {
          this.chartLoading = false;
        });
    },
    //请求数量改变
    dataNumChange(num) {
      this.listQuery.count = num;
      this.select = ["guides", "lost", "trend"];
      this.getData(this.lotteryId[1]);
    },
    //选择不同彩种
    handleLotteryIdChange(value) {
      this.restQuery();
      this.getData(value[1], 3);
      this.switchChat(value[0]);
    },
    // 进入不同玩法
    switchChat(chatName) {
      switch (chatName) {
        case "ssc":
          this.currentChart = "WuXing";
          this.listQuery.num_type = 5;
          break;
        case "lotto":
          this.currentChart = "WuXing11x5";
          this.listQuery.num_type = 5;
          break;
        case "k3":
          this.currentChart = "SanXingK3";
          this.listQuery.num_type = 3;
          break;
        case "sd":
        case "3d":
        case "ssl":
        case "p3p5":
        case "pcdd":
          this.currentChart = "SanXingDpc";
          this.listQuery.num_type = 3;
          break;
        case "pk10":
          this.currentChart = "GuanYa";
          this.listQuery.num_type = "2gy";
          break;
        case "lhc":
          this.currentChart = "Lhc";
          this.listQuery.num_type = "7a";
          break;
        default:
          break;
      }
    },
    //筛选条件
    handleChangeSelect(select) {
      this.$refs.Chart.handleSelectOption(select);
    },
    // 复原搜索条件
    restQuery() {
      this.dataNum = 30;
      this.listQuery.count = 30;
      this.select = ["guides", "lost", "trend"];
    },
    //选择当前玩法
    selectCurrentChart(method, num) {
      this.select = ["guides", "lost", "trend"];
      this.currentChart = method;
      this.getData(this.lotteryId[1], num);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.user-trends {
  width: 1240px;
  margin: 0 auto;
  .trend-header {
    margin: 20px 0 5px;
    /deep/ {
      .el-form-item {
        margin-bottom: 15px;
      }
    }
  }
}
.trend-main {
  min-height: 500px;
  /deep/ {
    .el-checkbox {
      margin-right: 5px;
    }
    .el-checkbox.is-bordered.is-checked {
      border-color: #d7d3cd;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #333;
    }
    .el-checkbox__inner:hover {
      border-color: $primary-color;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: $header-btn-color;
      border-color: $header-btn-color;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #faf1f6;
      border-color: #dcdfe6;
      color: $primary-color;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      box-shadow: -1px 0 0 0 #faf1f6;
    }
  }

  .select-section {
    position: relative;
    z-index: 2;
  }

  .select-section-inner {
    width: 1240px;
    height: 40px;
    margin: 0 auto;
    box-sizing: border-box;
    border-radius: 5px 5px 0 0;
    background-image: linear-gradient(to right, #ffd0b8, #800fa9);
  }

  .select-section-content {
    position: relative;
    z-index: 1;
  }

  .search a.btn {
    /* Rectangle 94: */
    background: #54c28e;
    background-image: linear-gradient(-180deg, #54c28e 0%, #2eac70 100%);
    border: 1px solid #3baa75;
    box-shadow: 0px 1px 2px 0px #17533e;
    border-radius: 2px;
    padding: 0 30px;
  }

  .search a.btn:hover {
    color: #fff;
  }

  .select-section-content-inner {
    width: 1240px;
    margin: 0 auto;
    display: block;
    height: 56px;
    line-height: 42px;
    padding-top: 15px;
    background: #fff;
  }

  .select-section-content .input {
    width: 120px;
    padding: 6px 10px;
  }

  .select-section-content .function {
    float: left;
    color: #333;
    margin-left: 10px;
  }

  .select-section-content .function .label {
    /* Rectangle 51 Copy 6: */
    background: #ffffff;
    border: 1px solid rgba(117, 126, 168, 0.38);
    border-radius: 3px;
    padding: 10px 15px;
    margin-right: 10px;
  }
  .select-section-content .function .label input {
    position: relative;
    top: 2px;
  }
  .select-section-content .time {
    float: left;
    margin-left: 25px;
  }

  .select-section-content .select {
    float: left;
    padding-right: 10px;
  }

  .select-section-content .select .ui-label {
    width: 72px;
  }

  .select-section-content .select .ui-select {
    width: 72px;
  }

  .select-section-content .search {
    float: left;
  }

  .select-section-content .choose-model {
    margin: 5px 20px 0 20px;
  }

  .select-function {
    float: right;
    margin-top: 11px;
    margin-right: 15px;
  }

  .select-function a {
    color: #736045;
    display: inline-block;
    vertical-align: middle;
  }

  .select-function i {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: 5px;
    vertical-align: middle;
    // background-image: url("un-arrow.png");
    background-repeat: no-repeat;
    overflow: hidden;
    margin: 0 7px;
    vertical-align: middle;
  }

  .select-function .arrow-down {
    background-position: 0 0;
  }

  .select-function .arrow-up {
    background-position: 0 -16px;
  }

  .select-list {
    float: left;
    box-sizing: border-box;
  }

  .select-list li {
    cursor: pointer;
    float: left;
    width: 78px;
    height: 40px;
    box-sizing: border-box;
    border-top: 2px solid transparent;
  }

  .select-list li.current {
    color: $primary-color;
    background-color: #ffffff;
    border-top: 2px solid $primary-color;
  }

  .select-list li a {
    color: #000;
    display: block;
    font-size: 14px;
    text-align: center;
    width: 78px;
    height: 20px;
    box-sizing: border-box;
    margin-top: 8px;
  }
  .select-list li:last-child a {
    border-right: none;
  }

  .select-list li.current a,
  .select-list li a:hover {
    color: $primary-color;
  }
}
.chart-loading {
  min-height: 350px;
  background: #fff;
}
</style>

<style lang="scss">
/* S chart-section */
@import "../../assets/css/var.scss";
.chart-section {
  font-family: DIN, "Helvetica Neue", "Hiragino Sans GB", "Microsoft Yahei",
    sans-serif, arial;
  font-size: 12px;
  position: relative;
  border: 1px solid #ccc;
  border-top: 1px solid #ccc;
  width: 1238px;
  margin: 0 auto 80px auto;
  box-sizing: border-box;
}

.chart-table {
  width: 1240px !important;
}

.chart-table .title-issue {
  cursor: pointer;
}

.chart-table thead .issue-order {
  display: inline-block;
  width: 10px;
  height: 7px;
  // background: url("../global-v4/v5/menu-big-sj.png");
}

.issue-order-desc {
  transform: rotate(180deg);
}

.chart-table {
  background-color: #fff0db;
}
.chart-table .title-text th {
  font-weight: 700;
  white-space: nowrap;
  word-wrap: break-word;
  color: #736045;
  border-bottom: 1px solid rgba(155, 155, 155, 0.28);
}
/* .chart-table .title-text th:nth-child(2){
    border-bottom: none;
    position: relative;
    top: 18px;
    left: 0px;
    background: transparent;
    border-right: none;
}
.chart-table .title-text th:nth-child(3)::before{
    content: "";
    width: 1px;
    height: 28px;
    border-right: 1px solid #e3d3bc;
    display: inline-block;
    position: absolute;
    top: 0px;
    left: -1px;
}
.chart-table .title-text th:nth-child(3){position: relative;} */
.chart-table .title-number th {
  padding-top: 10px;
}
.title-number th:nth-child(1),
.title-number th:nth-child(2),
.title-number th:nth-child(3) {
  background-image: none !important;
  display: none;
}
.title-number th:nth-child(2) label {
  display: none;
}
.title-number th.border-bottom-header {
  background: $deputy-color;
}
.title-number td.border-bottom {
  background: $deputy-color;
}
.title-number td:nth-child(1),
.title-number td:nth-child(2) {
  /*background-image: none;*/
  background: $child-color;
}
.border-top {
  border-top: 1px solid #e6e6e6;
}

.chart-table .title-text .border-bottom-header,
.chart-table .title-number .border-bottom-header,
.chart-table thead .border-bottom,
.border-bottom,
.title-text .border-bottom,
.tbody-footer-header .border-bottom,
.J-ball-content border-bottom,
.tbody-footer-header border-bottom {
  border-bottom: 1px solid #e3d3bc !important;
}

.chart-table .tbody {
  color: #5b5d74;
}

.chart-table th {
  padding: 5px 0;
  background-color: $child-color;
  text-align: center;
  color: #666;
}

.chart-table td {
  padding: 10px 0;
  border-bottom: 1px solid #fff;
  border-top: 1px solid #fff;
  background-color: #fff;
  text-align: center;
}

.chart-table .issue-numbers,
.chart-table .lottery-numbers {
  width: auto;
}

.chart-table .lottery-numbers {
  color: #f26432;
  white-space: nowrap;
}

.chart-table .size-numbers,
.chart-table .parity-numbers {
  color: #0a94e3;
}

.chart-table .border-right {
  border-right: 1px solid rgba(155, 155, 155, 0.28);
}

.chart-table .border-left {
  border-left: 1px solid #757575;
  border-left: 1px solid rgba(155, 155, 155, 0.28);
}

.chart-table .ball-none,
.chart-table .title-number .ball-none {
  width: 4px;
}

.ball-noraml {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 22px;
  text-align: center;
  font-style: normal;
  color: #ffffff;
  overflow: hidden;
}

.chart-table .ball-red,
.chart-table .ball-ocount,
.chart-table .ball-blue,
.chart-table .ball-green,
.chart-table .ball-purple,
.chart-table .group-current {
  background-image: url("../../assets/images/lottery/chart/un-chart.png");
  background-repeat: no-repeat;
  color: #fff;
}

.chart-table .ball-red {
  background-position: 0 0;
}

.chart-table .ball-ocount {
  background-position: -20px 0;
}

.chart-table .ball-blue {
  background-position: -40px 0;
}

.chart-table .ball-green {
  background-position: -60px 0;
}

.chart-table .ball-purple {
  background-position: -80px 0;
}

.chart-table .group-current {
  display: inline-block;
  width: 18px;
  height: 12px;
  line-height: 12px;
  text-align: center;
  font-style: normal;
  background-position: -100px 0;
}

.chart-table .tbody .bg-red {
  background-color: #f53f00;
  color: #fff;
}

.chart-table .bg-blue {
  background-color: #00a2ff;
  color: #fff;
  .ball-noraml {
    color: #fff;
  }
}

.chart-table .tbody .bg-blue .ball-noraml {
  color: #fff;
}

.chart-table .tbody .bg-green {
  background-color: #34bc0f;
  color: #fff;
}

.chart-table .tbody .compare {
  background-color: #7999f3;
  color: #fff;
}

.chart-table .tbody .lost {
  background-color: #8083a3;
  color: #ccc;
}

.auxiliary-area td {
  background-color: $child-color;
  border-top: 1px solid #e6e6e6;
  color: #666;
}

.chart-table .title-number .border-bottom-header input {
  vertical-align: baseline;
}

.select-area td {
  background-color: #ccc;
}

.select-area .ico-add,
.select-area .ico-del {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 4px;
  // background-image: url("un-select-area.png");
  background-repeat: no-repeat;
  vertical-align: middle;
  cursor: pointer;
}

.select-area .ico-add {
  background-position: 0 0;
}

.select-area .ico-del {
  background-position: -20px 0;
}

.chart-table .td-bg-light {
  background: #ececef;
}

.chart-table .border-right-light {
  border-right: 1px solid #d4d4d7;
}

/* E chart-section */

.other-flag {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 12px;
  text-indent: -10000px;
  overflow: hidden;
  background: #0eaa74;
}

.other-flag-odd,
.other-flag-even {
  background: #ce0b24;
}

.other-flag-up {
  border-radius: 0;
  // background: url(flag-up.png) no-repeat center center;
}

.other-flag-p {
  border-radius: 0;
  // background: url(flag-p.png) no-repeat center center;
}

.other-flag-down {
  border-radius: 0;
  // background: url(flag-down.png) no-repeat center center;
}

/** 样式名称规则直接使用号码属性拼接 //array(遗漏次数, 当前开奖号数字, 号温, 遗漏条) **/

/** 当前开奖球数字 和 冷热号数字 **/
.c-0-1,
.c-0-2,
.c-0-3 {
  background-image: url("../../assets/images/lottery/chart/un-chart.png");
  background-repeat: no-repeat;
  color: #fff !important;
  background: #fb6f79;
  border-radius: 20px;
  line-height: 16px;
  vertical-align: -2px;
}

.c-0-1,
.c-0-2,
.c-0-3 {
  background-position: 0 0;
}

.table-temperature .c-0-1 {
  background-position: -40px 0;
  background: blue;
}

.table-temperature .c-0-2 {
  background-position: -20px 0;
  background: yellow;
  color: #333 !important;
}

.table-temperature .c-0-3 {
  background-position: 0 0;
  background: #f60;
}

/** 遗漏条样式 **/
.table-lost-post .l-1 {
  background-color: #dadae5;
  border: none;
}

.table-lost-post .l-1 .ball-noraml {
  color: #b7b7b7;
}

/** 辅助线 **/
.table-guides .border-bottom {
  td {
    border-bottom: 1px solid #ccc;
  }
}

/** 遗漏数 **/
.table-lost .ball-noraml {
  color: #666;
}

/** 选球区域放置样式被覆盖 **/
.table-lost .auxiliary-area .ball-noraml,
.table-lost .select-area .ball-noraml {
  color: #b7b7b7;
}

.table-lost .select-area .ball-ocount {
  color: #fff;
}

/** 号码分布样式 **/
.f-1,
.f-2,
.f-3,
.f-4,
.f-5 {
  background-image: url("../../assets/images/lottery/chart/un-chart.png");
  background-repeat: no-repeat;
  color: #fff !important;
  background: #34bc0f;
  border-radius: 20px;
  line-height: 16px;
  vertical-align: -2px;
}

/*出现单次*/
.f-1 {
  background-position: -60px 0;
}

/*出现多次*/
.f-2,
.f-3,
.f-4,
.f-5 {
  background-position: -80px 0;
  background: #d573e6;
}

/** 选球区域选球相关样式 **/
.select-area i {
  cursor: pointer;
}

/** 五星综合 **/
/** 分布 **/
.zh-0-1,
.zh-0-2,
.zhkd-1 {
  background-image: url("../../assets/images/lottery/chart/un-chart.png");
  background-repeat: no-repeat;
  color: #fff;
}

.zh-0-1 {
  background-position: -60px 0;
}

.zh-0-2 {
  background-position: -80px 0;
}

/** 跨度 **/
.zhkd-1 {
  background-position: -80px 0;
}

/** 大小比 **/
.chart-table .zhdx-0 {
  background: #7999f3;
}

.chart-table .zhdx-0 .ball-noraml {
  color: #fff;
}

/** 单双比 **/
.chart-table .zhds-0 {
  background: #7999f3;
}

.chart-table .zhds-0 .ball-noraml {
  color: #fff;
}

/** 质合比 **/
.chart-table .zhzh-0 {
  background: #7999f3;
}

.chart-table .zhzh-0 .ball-noraml {
  color: #fff;
}
.ball-content,
.tbody-footer-header {
  .ball-noraml {
    color: #666 !important;
  }
}
/*走势图*/
.chart-section {
  canvas {
    display: none;
  }
  &.table-trend canvas {
    display: block;
  }
}
</style>
