<template>
  <section class="game-header w fw">
    <section class="game-header-l">
      <section class="game-header-w">
        <section class="game-header-s">
          <h2 class="logo-lottery">
            <img :src="`${picBaseUrl}/${currentLottery.icon_path}`" alt />
          </h2>
        </section>
        <!-- 本期开奖 -->
        <section
          class="game-lotterys"
          :class="{pk10Deadlie : currentLottery.series_id === 'pk10' || currentLottery.series_id === 'klsf'}"
        >
          <div class="deadline">
            <div class="deadline-text">
              第
              <strong>{{currentIssue.issue_no}}</strong>期
              <br />投注截止
            </div>
            <div class="deadline-number">
              <FlipDown
                :serverDate="serverTime"
                :endDate="currentIssue.end_time"
                :type="3"
                :theme="2"
                @timeUp="handleTimeup"
              />
            </div>
          </div>
          <!-- 六合上x显示 -->
          <div class="game-lottery game-lottery-lhc" v-if="currentLottery.series_id === 'lhc'">
            <div class="deadline">
              <div class="deadline-text">
                第
                <strong>
                  <template>{{lastIssue.issue_no}}</template>
                </strong>期
              </div>
            </div>
            <div class="lottery-number lottery-number-lhc">
              <div class="pk10-num" style="overflow:hidden">
                <template v-for="(item, index) in lastIssue.open_code">
                  <em class="lhc-q" :class="[`open_code${index}`, circleColor(item)]" :key="index"></em>
                  <span
                    v-if="lastIssue.open_code[0] !== '-'"
                    class="item-name"
                    :key="`item-${index}`"
                  >{{lhcStyle(item)}}</span>
                  <span
                    class="sign"
                    v-if="index !== lastIssue.open_code.length-1"
                    :key="`sign-${index}`"
                  >+</span>
                </template>
                <template v-if="lastIssue.open_code[0] !== '-'">
                  <span class="sign equal">=</span>
                  <span class="sign code-total">{{numberToals(lastIssue.open_code)}}</span>
                </template>
              </div>
              <div v-if="lastIssue.open_code[0] === '-'" class="lottery-animate">
                <span>开</span>
                <span>奖</span>
                <span>中</span>
                <span>...</span>
              </div>
            </div>
          </div>
          <div class="game-lottery" v-else>
            <div class="deadline">
              <div class="deadline-text">
                第
                <strong>
                  <template>{{lastIssue.issue_no}}</template>
                </strong>期
                <br />开奖号码
              </div>
            </div>
            <div class="lottery-number average-number">
              <div
                :class="{'pk10-num' : currentLottery.series_id === 'pk10' || currentLottery.series_id === 'lhc'}"
                style="overflow:hidden;display:inline-block"
              >
                <em
                  :class="`open_code${index}`"
                  v-for="(item, index) in lastIssue.open_code"
                  :key="index"
                ></em>
              </div>
              <div v-if="lastIssue.open_code[0] === '-'" class="lottery-animate">
                <span>开</span>
                <span>奖</span>
                <span>中</span>
                <span>...</span>
              </div>
            </div>
          </div>
        </section>
        <section
          v-if="currentLottery.series_id !== 'pk10' && currentLottery.series_id !== 'klsf'"
          class="trend-info"
        >
          <!-- <router-link class="trend" tag="span" :to="`/user-trends/${currentLottery.en_name}`">
            <i class="fa fa-line-chart" aria-hidden="true"></i>
            <br />开奖趋势
          </router-link>-->
          <router-link class="trend info" tag="span" to="/help-play">
            <i class="fa fa-trophy" aria-hidden="true"></i>
            <br />开奖说明
          </router-link>
        </section>
      </section>
    </section>
    <!-- 开奖提示 -->
    <section class="msg-notice-bg" v-if="notice.show">
      <section class="msg-notice">
        <strong>已经进入</strong>
        <br />
        <strong class="red">{{notice.issue}}</strong>
        <br />
        <strong>请留意期号变化({{notice.time}})</strong>
      </section>
    </section>
  </section>
</template>
<script>
import { EventBus } from "@/utils/event-bus";
import FlipDown from "./components/flip-down";
import { Flip } from "number-flip";

import { mapGetters, mapState } from "vuex";

export default {
  name: "game-issue",
  components: {
    FlipDown
  },
  computed: {
    ...mapState(["currentMethod", "lottery"]),
    ...mapGetters([
      "picBaseUrl",
      "lotteryLists",
      "currentLottery",
      "lotteryAll",
      "issueInfo",
      "bet",
      "currentIssue"
    ])
  },
  props: {
    lotterySign: String
  },
  data() {
    return {
      //系统时间
      serverTime: "",
      //上期开奖
      lastIssue: {
        issue_no: "---------",
        open_code: null
      },
      timerout: null, //获取下期定时
      inTime: 1000, //递增时间
      notice: {
        issue: "",
        time: 3,
        show: false
      }
    };
  },
  created() {
    this.lastIssue.open_code = this.formatOpenCode();
  },

  mounted() {
    this.getLottery();
    // 事件判断当前页面——可见性的状态
    document.addEventListener("visibilitychange", this.handleVisibilitychange);
  },
  watch: {
    currentMethod() {},
    //倒计时结束弹出
    "notice.show"(newVal) {
      let timer = null;
      if (newVal) {
        //this.$msgbox.close();
        setTimeout(() => {
          timer = setInterval(() => {
            this.notice.time -= 1;
            if (this.notice.time === 0) {
              clearInterval(timer);
              timer = null;
              this.notice.time = 3;
              this.notice.show = false;
            }
          }, 1000);
        }, 1);
      }
    }
  },
  methods: {
    handleVisibilitychange() {
      if (!document.hidden) {
        this.serverTime = "";
        this.currentIssue.end_time = "";
        this.getLottery();
      }
    },
    //开奖号码滚动
    filpOpenCode() {
      let $node = undefined;
      if (this.lastIssue.open_code) {
        this.lastIssue.open_code.forEach((v, i) => {
          if (v === "-") {
            v = 0;
          }
          $node = document.querySelector(`.open_code${i}`);
          if ($node) {
            $node.innerHTML = "";
            new Flip({ node: $node, from: 0, to: v, duration: 2 });
          }
        });
      }
      return;
    },
    //格式化开奖号码
    formatOpenCode() {
      if (this.currentLottery.series_id === "pk10") {
        return ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
      } else if (
        this.currentLottery.series_id === "k3" ||
        this.currentLottery.series_id === "ssl" ||
        this.currentLottery.series_id === "sd" ||
        this.currentLottery.series_id === "pcdd"
      ) {
        return ["-", "-", "-"];
      } else if (this.currentLottery.series_id === "lhc") {
        return ["-", "-", "-", "-", "-", "-", "-"];
      } else if (this.currentLottery.series_id === "klsf") {
        return ["-", "-", "-", "-", "-", "-", "-", "-"];
      } else {
        return ["-", "-", "-", "-", "-"];
      }
    },
    // 获取开奖结果
    getLottery(timeUp) {
      clearTimeout(this.timerout);
      this.Api.getOpenAward(this.currentLottery.en_name)
        .then(({ success, data }) => {
          if (success) {
            if (timeUp) {
              this.$store.commit("issueInfo", data.issueInfo);
            } else {
              this.serverTime = data.serverTime;
              this.$store.commit("currentIssue", data.currentIssue);
              this.$store.commit("issueInfo", data.issueInfo);
              if (data.lastIssue.code) {
                data.lastIssue.open_code = data.lastIssue.code.split(",");
                this.lastIssue = data.lastIssue;
              } else {
                data.lastIssue.open_code = this.formatOpenCode();
                // 如果上期未开奖 间隔秒再次请求，知道开奖为止
                this.timerout = setTimeout(() => {
                  this.getLastIssue();
                }, 1000);
              }
              this.lastIssue = data.lastIssue;
            }
          }
        })
        .then(() => {
          this.filpOpenCode();
        });
    },
    //获取彩种上期的奖期
    getLastIssue() {
      //再次求上期 清除定时
      clearTimeout(this.timerout);
      this.Api.lastIssue(this.currentLottery.en_name)
        .then(({ success, data }) => {
          if (success) {
            const lastIssue = {};
            if (data.official_code) {
              this.inTime = 1000;
              lastIssue.open_code = data.official_code.split(",");
              this.lastIssue = data;
              this.$store.dispatch("issueHistory");
              this.$store.dispatch("getUserDetail");
              this.$store.dispatch("betHistory");
            } else {
              this.inTime = this.inTime * 2;
              lastIssue.open_code = this.formatOpenCode();
              // 如果上期未开奖 间隔秒再次请求，知道开奖为止
              this.timerout = setTimeout(() => {
                this.getLastIssue();
              }, this.inTime);
            }
            lastIssue.issue_no = data.issue;
            this.lastIssue = lastIssue;
          }
        })
        .then(() => {
          this.filpOpenCode();
        });
    },
    //倒计时完执行
    handleTimeup() {
      if (!this.currentIssue.end_time) return;
      if (this.issueInfo.length <= 1) {
        // 获取开奖结果
        this.getLottery();
        return;
      } else {
        this.$store.commit("currentIssue", this.issueInfo[1]);
        this.serverTime = this.issueInfo[1].begin_time;
        this.$nextTick(() => {
          this.notice.issue = this.issueInfo[1].issue_no;
          this.notice.show = true;
          EventBus.$emit("gameIssueTimeup");
          this.getLottery({ timeUp: true });
          this.getLastIssue();
        });
      }
    },

    // 六合彩的开奖区显示
    lhcStyle(item) {
      let lottery = this.currentLottery;
      if (lottery.series_id === "lhc") {
        let animal = [
          "鼠",
          "牛",
          "虎",
          "兔",
          "龙",
          "蛇",
          "马",
          "羊",
          "猴",
          "鸡",
          "狗",
          "猪"
        ];
        let name = "";

        for (const i of Object.keys(this.lottery.chineseZodiac)) {
          for (const k of this.lottery.chineseZodiac[i]) {
            if (+k === +item) {
              name = animal[i];
            }
          }
        }

        return name;
      }
    },
    // 计算球颜色六合彩
    circleColor(item) {
      let clas = "";

      if (this.lottery.lhcNumber.redBall.includes(parseInt(item))) {
        clas += "lhc-tm-list-q-red";
        return clas;
      } else if (this.lottery.lhcNumber.blueBall.includes(parseInt(item))) {
        clas += "lhc-tm-list-q-blue";
        return clas;
      } else if (this.lottery.lhcNumber.greenBall.includes(parseInt(item))) {
        clas += "lhc-tm-list-q-green";
        return clas;
      }
    },
    // 计算总数
    numberToals(number) {
      let lottery = this.currentLottery;

      if (lottery.series_id === "k3" || lottery.series_id === "lhc") {
        return number.reduce((prev, cur) => {
          return +prev + +cur;
        });
      }
    }
  },
  beforeDestroy() {
    // 组件销毁时清除定时
    clearTimeout(this.timerout);
    EventBus.$off("gameIssueTimeup");
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilitychange
    );
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.game-lotterys {
  &.pk10Deadlie {
    width: auto;
  }
  float: left;
  width: 920px;
  line-height: 1.15;
  display: flex;
  justify-content: space-around;
  .game-lottery {
    margin-left: 5px;
    flex: 1;
    line-height: 1.15;
    overflow: hidden;
  }
  .deadline {
    float: left;
    padding: 0;
    margin: 0;
    margin-left: 30px;
    background-color: transparent;
    _display: unset;
    box-shadow: unset;
    border-radius: unset;
    .deadline-number-mask {
      position: absolute;
      left: 0;
      width: 24px;
      height: 17px;
      border-bottom: none;
      border-radius: 3px 3px 0 0;
      z-index: 60;
    }
    .deadline-text {
      float: left;
      margin: 26px 10px 0 0;
      width: 142px;
      font-weight: normal;
      letter-spacing: 0px;
      color: #4f4948;
      font-size: 14px;
      text-align: end;
      font-family: inherit;
      strong {
        font-size: 16px;
        color: #4f4948;
        font-weight: normal;
        margin: 0 3px;
        display: inline-block;
      }
    }
    .deadline-number {
      float: left;
      margin-left: 5px;
      margin-top: 28px;
      font-size: 34px;
      .deadline-num {
        line-height: 36px;
        font-family: microsoft yahei;
        font-size: 32px;
        font-weight: 100;
        color: #e2e2e2;
        position: absolute;
        left: 0;
        top: 0;
        width: 24px;
        height: 34px;
        overflow: hidden;
        text-indent: 10px;
        box-shadow: none;
        text-shadow: none;
      }
      em {
        text-align: center;
        position: relative;
        width: 24px;
        height: 34px;
        margin-right: 2px;
        border-width: 1px;
        border-style: solid;
        background-image: none;
        background-color: #000;
        border-radius: 3px;
        box-shadow: none;
        border: 0;
        color: #e2e2e2;
      }
      .inner {
        position: absolute;
        height: 100%;
        width: 100%;
        left: -6px;
        font-family: Hei;
      }
      .deadline-num-next-t {
        height: 17px;
        overflow: hidden;
        background-image: none;
        background-color: #000;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        border: 0;
      }
      .deadline-num-next-b {
        height: 17px;
        overflow: hidden;
        top: 18px;
        z-index: 50;
        background-image: none;
        background-color: #333;
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
        border: 0;
        transform: rotateX(-90deg);
        transform-origin: left top 0;
        .inner {
          position: absolute;
          background: none;
          top: -18px;
        }
      }
      .deadline-num-t {
        height: 17px;
        top: 0;
        z-index: 50;
        background-image: none;
        background-color: #000;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        border: 0;
        transform: rotateX(0deg);
        transform-origin: left bottom 0;
      }
      .deadline-num-b {
        height: 17px;
        top: 18px;
        background-image: none;
        background-color: #000;
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
        border: 0;
      }
    }
  }
}
.deadline-number .deadline-num-b .inner {
  top: -18px;
}
.deadline-number em,
.deadline-number span.space1 {
  font-weight: 700;
  float: left;
  width: 10px;
  height: 34px;
  color: #000;
  padding-left: -2px;
  text-indent: unset;
  line-height: 25px;
}
.lottery-number {
  margin-left: 12px;
  overflow: hidden;
  margin-top: 8px;
  em {
    float: left;
    width: 50px;
    height: 50px;
    color: #57576b;
    font-size: 32px;
    text-align: center;
    background-image: linear-gradient(180deg, #e7d0fe 10%, #c66dfd 100%);
    border-radius: 50%;
    font-size: 26px;
    color: #fff;
    margin-right: 5px;
    line-height: 50px;
    text-align: center;
    font-family: inherit;
  }
  .pk10-num {
    margin: 8px 0 5px 0;
    em {
      float: left;
      width: 35px;
      height: 35px;
      background-image: linear-gradient(180deg, #e7d0fe 10%, #c66dfd 100%);
      font-size: 22px;
      border-radius: 50%;
      color: #fff;
      line-height: 40px;
      line-height: 36px;
      text-align: center;
      box-shadow: none;
      font-family: inherit;
    }
  }
}
.lottery-animate {
  line-height: 1.5;
  font-size: 12px;
  color: #57576b;
}
.game-lottery-lhc {
  text-align: center;
  .deadline {
    width: 100%;
    float: none;
    margin-left: 0;
    .deadline-text {
      width: 100%;
      float: none;
      margin-top: 8px;
      text-align: center;
    }
  }
  .lottery-number {
    margin: 0;
    padding: 0;
    text-align: center;
    .lottery-animate {
      line-height: 1.2;
    }
    .pk10-num {
      display: inline-block;
      em {
        margin-right: 0;
        background: url(../../assets/images/hj.png) no-repeat -104px -44px;
      }
    }
    .sign {
      float: left;
      display: block;
      height: 35px;
      width: 22px;
      line-height: 35px;
      color: #000;
      font-size: 22px;
      &.code-total {
        font-size: 30px;
        width: auto;
      }
      &.equal {
        width: 25px;
      }
    }
    .item-name {
      float: left;
      color: #000;
      margin-left: -26px;
      margin-top: 38px;
    }
  }
}

/*六合彩*/
.lottery-number-lhc .lhc-q {
  width: 32px !important;
  height: 32px !important;
  line-height: 32px !important;
  font-size: 17px !important;
}
.lhc-tm-list-q-red {
  background: url(../../assets/images/hj.png) no-repeat -104px -44px !important;
}
.lhc-tm-list-q-green {
  background: url(../../assets/images/hj.png) no-repeat -51px -44px !important;
}
.lhc-tm-list-q-blue {
  background: url(../../assets/images/hj.png) no-repeat 0 -44px !important;
}
.logo-lottery {
  text-align: center;
  img {
    display: inline-block;
    height: 80px;
    margin-top: 5px;
  }
}
.average-number {
  text-align: center;
}
</style>
