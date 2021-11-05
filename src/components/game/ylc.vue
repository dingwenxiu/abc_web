
<template>
  <section class="w ylc-main">
    <!--娱乐城导航-->
    <section class="ylc-navs">
      <section class="ylc-nav-box">
        <nav class="ylc-nav" ref="ylcNav">
          <template v-if="currentLottery.series_id !== 'pcdd'">
            <a
              href="javascript:;"
              class="ylc-list"
              ref="ylclist"
              :class="{on: ylcListOn === item.sign}"
              @click="checkedPlay(item, index)"
              v-for="(item, index) in allMethods"
              :key="index"
            >{{item.name}}</a>
          </template>
          <!--pc蛋蛋导航-->
          <a href="javascript:;" class="ylc-list on" ref="ylclist" v-else>整合</a>
        </nav>
      </section>
      <section class="bet-plays" v-if="currentMethod.type !== 'pcdd'">
        <a href="javascript:;" class="ylc-kx" @click="kxInfo.show = true">快选金额</a>
        <div class="bet-play" @click="changePlay()">官方</div>
        <div class="bet-play active">信用</div>
      </section>
    </section>

    <!--投注区-->
    <section class="ylc-content">
      <!-- 开奖记录按钮 -->
      <div
        class="right-collapse"
        @click="handleCollapseRight"
      >{{this.collapseRight ? '收起开奖记录' : '展开开奖记录'}}</div>

      <section class="ylc-content-left">
        <section
          class="fw ylc-content-top"
          :class="{'ylc-content-top-ylc': currentMethod.type === 'ylc'}"
        >
          <!--时时彩信用玩法-->
          <Credit
            v-if="currentMethod.type === 'ylc'"
            @listChecked="listChecked"
            @handleChangeInput="handleChangeInput"
          ></Credit>

          <!--pc蛋蛋-->
          <Pcdd
            v-if="currentMethod.type === 'pcdd'"
            @listChecked="listChecked"
            @handleChangeInput="handleChangeInput"
          ></Pcdd>

          <!--k3信用玩法-->
          <K3
            v-if="currentMethod.type === 'k3'"
            @listChecked="listChecked"
            @handleChangeInput="handleChangeInput"
          ></K3>

          <!--pk10信用玩法-->
          <Pk10
            v-if="currentMethod.type === 'pk10'"
            @listChecked="listChecked"
            @handleChangeInput="handleChangeInput"
          ></Pk10>
        </section>
      </section>

      <!--右侧排行榜-->
      <transition name="el-zoom-in-center">
        <section class="main-right" v-show="collapseRight">
          <section class="list-historys">
            <section class="record">历史开奖记录</section>
            <table v-if="bet.issueHistory" width="100%" class="bet-table-trend">
              <thead>
                <tr>
                  <th class="th" style="width:124px">奖期</th>
                  <th class="th">开奖</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  :class="{first: index === 0}"
                  v-for="(item, index) in bet.issueHistory"
                  :key="index"
                >
                  <td class="td">
                    <span class="number">{{item.issue_no}} 期</span>
                  </td>
                  <td class="td">
                    <span class="balls">
                      <i
                        class="i curr"
                        v-for="(num, numIndex) in item.code.split(',')"
                        :key="numIndex"
                      >{{num}}</i>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <router-link
              class="cur more"
              tag="section"
              :to="`/user-trends/${currentLottery.en_name}`"
            >查看完整走势</router-link>
          </section>
        </section>
      </transition>
    </section>

    <!--快选金额设置-->
    <section class="ylc-kx-warp" v-if="kxInfo.show">
      <section class="ylc-kx-box">
        <section class="ylc-kx-info-header">快选金额</section>
        <p class="ylc-kx-explain">注意：设置只保存在您的电脑，清空浏览器缓存或更换电脑会显示默认值。</p>

        <section class="fw ylc-kx-info-list">
          <input
            type="text"
            min="0"
            max="10000"
            maxlength="5"
            class="ylc-kx-info-text"
            v-model="kxInfo.blue"
            value="10"
            placeholder="未设置"
          />
          <span class="ylc-kx-info-clear" @click="kxInfo.blue = 0">清空</span>
        </section>
        <section class="fw ylc-kx-info-list">
          <input
            type="text"
            min="0"
            max="10000"
            maxlength="5"
            class="ylc-kx-info-text"
            v-model="kxInfo.red"
            value="10"
            placeholder="未设置"
          />
          <span class="ylc-kx-info-clear" @click="kxInfo.red = 0">清空</span>
        </section>
        <section class="fw ylc-kx-info-list">
          <input
            type="text"
            min="0"
            max="10000"
            maxlength="5"
            class="ylc-kx-info-text"
            v-model="kxInfo.green"
            value="10"
            placeholder="未设置"
          />
          <span class="ylc-kx-info-clear" @click="kxInfo.green = 0">清空</span>
        </section>
        <section class="fw ylc-kx-info-list">
          <input
            type="text"
            min="0"
            max="10000"
            maxlength="5"
            class="ylc-kx-info-text"
            v-model="kxInfo.violet"
            value="10"
            placeholder="未设置"
          />
          <span class="ylc-kx-info-clear" @click="kxInfo.violet = 0">清空</span>
        </section>
        <section class="fw ylc-kx-info-list">
          <input
            type="text"
            min="0"
            max="10000"
            maxlength="5"
            class="ylc-kx-info-text"
            v-model="kxInfo.drakBlue"
            value="10"
            placeholder="未设置"
          />
          <span class="ylc-kx-info-clear" @click="kxInfo.drakBlue = 0">清空</span>
        </section>

        <section class="ylc-kx-info-btns">
          <span class="ylc-kx-info-btn" @click="kxInfo.show = false">取消</span>
          <span class="ylc-kx-info-btn" @click="kxInfoSave()">保存</span>
        </section>
      </section>
    </section>

    <!--底部-->
    <section class="w fw ylc-kx-footer">
      <span class="dinv ylc-kx-footer-clear active" @click="clearCode()">清除选号</span>
      <section class="ylc-kx-footer-moneys">
        <span class="ylc-kx-footer-moneys-sp">快选金额</span>
        <ul class="dinv">
          <li
            class="ylc-kx-footer-moneys-list"
            @click="kxInfoSelect(kxInfo.blue2, $event)"
          >{{kxInfo.blue2}}</li>
          <li
            class="ylc-kx-footer-moneys-list"
            @click="kxInfoSelect(kxInfo.red2, $event)"
          >{{kxInfo.red2}}</li>
          <li
            class="ylc-kx-footer-moneys-list"
            @click="kxInfoSelect(kxInfo.green2, $event)"
          >{{kxInfo.green2}}</li>
          <li
            class="ylc-kx-footer-moneys-list"
            @click="kxInfoSelect(kxInfo.violet2, $event)"
          >{{kxInfo.violet2}}</li>
          <li
            class="ylc-kx-footer-moneys-list"
            @click="kxInfoSelect(kxInfo.drakBlue2, $event)"
          >{{kxInfo.drakBlue2}}</li>
        </ul>
        <span class="ylc-kx-footer-moneys-much">金额:</span>
        <input
          type="text"
          class="ylc-kx-footer-moneys-text"
          v-model="currentOrders.money"
          @input="currentOrders.money = Utils.number(currentOrders.money)"
        />
        <span class="ylc-kx-footer-confirm" @click="confirm">确认投注</span>
      </section>
    </section>

    <!--投注弹出框-->
    <el-dialog title="下注清单" :visible.sync="submitDialog" class="ylc-submit" width="36%">
      <ul class="fw ylc-bet-titles">
        <li class="ylc-bet-title">号码</li>
        <li class="ylc-bet-title">赔率</li>
        <li class="ylc-bet-title">单注金额</li>
        <li class="ylc-bet-title">单挑</li>
      </ul>
      <ul class="fw ylc-bet-contents">
        <li class="ylc-bet-content" v-for="(item, index) in bet.ylcBetData" :key="`${index}-ylc`">
          <p class="ylc-bet-content-l">
            {{item.title}}
            <span class="red">@{{item.codec}}</span>
          </p>
          <p class="ylc-bet-content-c">{{item.odds}}</p>
          <p class="ylc-bet-content-r">{{Utils.toFixed(String(item.money))}}</p>
          <p class="ylc-bet-content-s">
            <span style="color:green" v-if="item.challenge_bonus">是</span>
            <span style="color:red" v-else>否</span>
          </p>
        </li>
      </ul>
      <section class="fw ylc-bet-count red">
        总计：
        <span
          class="fr"
        >{{bet.ylcBetData.length}}注 / {{Utils.toFixed(String(currentOrders.betMoney))}}元</span>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitClose()" size="small">取 消</el-button>
        <el-button type="primary" @click="bets()" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 投注和追号历史记录 -->
    <div class="bet-history">
      <bet-history :isYlc="true"></bet-history>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapState } from "vuex";
import methods from "../../lib/config/method";
import Utils from "../../lib/utils/utils";
import betHistory from "../../views/game/components/bet-history";
import Pcdd from "./pcdd";
import Credit from "./credit";
import K3 from "./k3";
import Pk10 from "./pk10";

export default {
  name: "ylc",
  components: {
    betHistory,
    K3,
    Pk10,
    Pcdd,
    Credit
  },
  data() {
    return {
      collapseRight: false,

      // 快选设置
      kxInfo: {
        show: false,
        blue: 10,
        red: 50,
        green: 100,
        violet: 200,
        drakBlue: 500,
        blue2: 10,
        red2: 50,
        green2: 100,
        violet2: 200,
        drakBlue2: 500
      },

      // 导航 状态
      ylcListOn: "COZHENGHE",
      ylcRightTab: {
        show: 0
      },
      submitDialog: false
    };
  },
  computed: {
    ...mapState(["ylcBetData"]),
    ...mapGetters([
      "allMethods",
      "lotteryAll",
      "currentLottery",
      "currentMethod",
      "currentIssue",
      "account",
      "changeYlcPlays",
      "userConfig",
      "userDetail",
      "bet",
      "orderList",
      "pcdd",
      "currentOrders"
    ])
  },
  watch: {},
  created() {
    this.bet.ylcBetData = [];
    this.currentOrders.money = 0;
    this.currentOrders.betMoney = 0;
    // pc蛋蛋 按钮
    // this.pcddAllbtn();
    if (this.allMethods && this.allMethods.length > 0) {
      this.ylcListOn = this.allMethods[0].sign;
    }

    // 获取快选本地设置
    let kxInfo = Utils.storage.get("kxInfo");
    if (kxInfo) {
      this.kxInfo = kxInfo.data;
    }
  },
  methods: {
    // 切换 官方 和 娱乐城 玩法
    changePlay() {
      let json = {
        name: "official",
        index: 0
      };
      this.$store.commit("SET_CHANGE_YLCPLAYS", json);
    },

    //切换娱乐城 小玩法
    checkedPlay(item, index) {
      this.$store.commit(
        "SET_CURRENT_METHOD",
        methods[this.currentLottery.series_id].casino[item.sign]
      );
      this.ylcListOn = item.sign;
    },

    //单挑判断
    judgeChallenge(item, codes) {
      const { challenge_type, challenge_min_count, challenge_config } = item;
      let isChallenge = false; //是否是单挑
      switch (challenge_type) {
        case 1:
        case 2:
          if (1 <= challenge_min_count) {
            isChallenge = true;
          }
          break;
        case 3:
        case 7:
          if (codes == challenge_config["code"]) {
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
              zu3Num <= challenge_config["zu3"] ||
              zu6Num <= challenge_config["zu6"]
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
            let keys = Object.keys(challenge_config["code"]).map(value => {
              return parseInt(value);
            });

            let currCodes = codes
              .toString()
              .split("|")
              .map(value => {
                return parseInt(value);
              });
            const interNum = keys.filter(v => currCodes.includes(v));

            if (interNum.length >= challenge_config["min"]) {
              isChallenge = true;
            }
          }
          break;
        default:
          break;
      }
      return isChallenge;
    },

    //取消提交
    submitClose() {
      this.submitDialog = false;
    },

    //提交
    confirm() {
      let [
        allCodeList = this.pcdd.allCodeList,
        money = 0,
        ylcBetData = []
      ] = [];
      this.userConfig.singlePrice = 1;
      this.$store.commit("SET_ORDER_LIST", []);
      this.currentOrders.betMoney = 0;
      // 娱乐城整合
      if (this.currentMethod.type === "ylc") {
        if (this.currentMethod.method !== "COLH") {
          for (const k of allCodeList) {
            for (const i of k.codes) {
              if (i.flag) {
                if (+i.money <= 0) {
                  this.$alert("你还未投注 或 投注错误", "提示", {
                    confirmButtonText: "确定"
                  });
                  return false;
                }
                money += +i.money;
                let json = {};
                json.codec = json.code = i.code;
                json.method_group = k.method_group;
                json.odds = i.odds;
                json.method_name = i.method_name;
                json.method_sign = i.method_sign;
                json.money = +i.money;
                json.title = k.title;
                ylcBetData.push(json);
              }
            }
          }
        }

        // 娱乐城龙虎斗
        else if (this.currentMethod.method === "COLH") {
          for (const k of Object.keys(allCodeList)) {
            for (const i of allCodeList[k]) {
              for (const j of i.code) {
                if (j.flag) {
                  if (+j.money <= 0) {
                    this.$alert("你还未投注 或 投注错误", "提示", {
                      confirmButtonText: "确定"
                    });
                    return false;
                  }
                  money += +j.money;
                  let json = {};
                  json.codec = json.code = j.code;
                  json.method_group = i.method_group;
                  json.odds = j.odds;
                  json.method_name = i.method_name;
                  json.method_sign = i.method_sign;
                  json.money = +j.money;
                  json.title = i.name;
                  ylcBetData.push(json);
                }
              }
            }
          }
        }
      } else if (this.currentMethod.type === "pcdd") {
        for (const k of Object.keys(allCodeList)) {
          if (k === "DXDS" || k === "TM" || k === "TMBS") {
            for (const i of allCodeList[k].codes) {
              if (i.flag) {
                if (+i.money <= 0) {
                  this.$alert("你还未投注 或 投注错误", "提示", {
                    confirmButtonText: "确定"
                  });
                  return false;
                }
                money += +i.money;
                let json = {};

                if (k === "TMBS") {
                  json.codec = json.code =
                    this.tmbs.one + "," + this.tmbs.two + "," + this.tmbs.three;
                } else {
                  json.codec = json.code = i.code;
                }
                json.challenge_bonus = this.judgeChallenge(
                  allCodeList[k],
                  json.code
                );
                json.method_group = allCodeList[k].method_group;
                json.odds = i.odds;
                json.method_name = i.method_name;
                json.method_sign = i.method_sign;
                json.money = +i.money;
                json.title = allCodeList[k].title;
                ylcBetData.push(json);
              }
            }
          } else {
            for (const j of allCodeList[k]) {
              for (const i of j.codes) {
                if (i.flag) {
                  if (+i.money <= 0) {
                    this.$alert("你还未投注 或 投注错误", "提示", {
                      confirmButtonText: "确定"
                    });
                    return false;
                  }
                  money += +i.money;
                  let json = {};
                  json.challenge_bonus = this.judgeChallenge(
                    allCodeList[k],
                    json.code
                  );
                  json.codec = json.code = json.title = i.code;
                  json.method_group = j.method_group;
                  json.odds = i.odds;
                  json.method_name = i.method_name;
                  json.method_sign = i.method_sign;
                  json.money = +i.money;
                  ylcBetData.push(json);
                }
              }
            }
          }
        }
      } else if (
        this.currentMethod.type === "pk10" ||
        this.currentMethod.type === "k3"
      ) {
        for (const k of allCodeList) {
          if (!k.arr) {
            for (const i of k.codes) {
              if (i.flag) {
                if (+i.money <= 0) {
                  this.$alert("你还未投注 或 投注错误", "提示", {
                    confirmButtonText: "确定"
                  });
                  return false;
                }
                money += +i.money;
                let json = {};
                json.codec = json.code = i.code;
                json.method_group = k.method_group;
                json.odds = i.odds;
                json.method_name = i.method_name;
                json.method_sign = i.method_sign;
                json.money = +i.money;
                json.title = k.title;
                ylcBetData.push(json);
              }
            }
          } else {
            for (let q of k.arr) {
              for (const i of q.codes) {
                if (i.flag) {
                  if (+i.money <= 0) {
                    this.$alert("你还未投注 或 投注错误", "提示", {
                      confirmButtonText: "确定"
                    });
                    return false;
                  }
                  money += +i.money;
                  let json = {};
                  json.codec = json.code = i.code;
                  json.method_group = q.method_group;
                  json.odds = i.odds;
                  json.method_name = i.method_name;
                  json.method_sign = i.method_sign;
                  json.money = +i.money;
                  json.title = q.title;
                  ylcBetData.push(json);
                }
              }
            }
          }
        }
      }
      if (ylcBetData.length < 1) {
        this.$alert("你还未投注 或 投注错误", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      this.bet.ylcBetData = ylcBetData;
      this.currentOrders.betMoney = this.bet.currentOrder.cost = money;
      this.submitDialog = true;
      this.$emit("addOrder");
    },

    //投注
    bets() {
      let [currentIssus = this.currentIssue.issue_no, issus = {}] = [];
      issus[currentIssus] = true;
      if (
        parseInt(this.currentOrders.betMoney) <= 0 ||
        this.bet.ylcBetData.length === 0
      ) {
        this.$alert("你还未投注 或 投注错误", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      this.orderList.forEach(v => (v.mode = 1));
      this.Api.bet(
        this.currentLottery.en_name,
        issus,
        this.orderList,
        this.bet.currentOrder.cost.toFixed(3),
        0
      ).then(res => {
        if (res.success) {
          this.$alert(
            "投注成功, 您可以通过”游戏记录“查询您的投注记录！",
            "提示",
            {
              confirmButtonText: "确定"
            }
          );
          // 添加完选号 清空选中号码
          this.clearCode();

          // 刷新余额
          this.$store.dispatch("getUserDetail");
          this.$store.dispatch("betHistory");
          this.submitDialog = false;
        }
      });
    },

    // 快选金额选择
    kxInfoSelect(item, e) {
      this.currentOrders.money =
        Number(item) + Number(this.currentOrders.money);

      e.target.className += " active";
      setTimeout(() => {
        e.target.className = "ylc-kx-footer-moneys-list";
      }, 350);
    },

    // 快选金额设置
    kxInfoSave() {
      if (isNaN(this.kxInfo.blue)) {
        this.kxInfo.blue = 0;
      }
      if (isNaN(this.kxInfo.red)) {
        this.kxInfo.red = 0;
      }
      if (isNaN(this.kxInfo.green)) {
        this.kxInfo.green = 0;
      }
      if (isNaN(this.kxInfo.violet)) {
        this.kxInfo.violet = 0;
      }
      if (isNaN(this.kxInfo.drakBlue)) {
        this.kxInfo.drakBlue = 0;
      }
      this.kxInfo.blue2 = this.kxInfo.blue;
      this.kxInfo.red2 = this.kxInfo.red;
      this.kxInfo.green2 = this.kxInfo.green;
      this.kxInfo.violet2 = this.kxInfo.violet;
      this.kxInfo.drakBlue2 = this.kxInfo.drakBlue;
      this.kxInfo.show = false;
      Utils.storage.set("kxInfo", this.kxInfo);
    },

    // 选中的列表项
    listChecked(item) {
      item.flag = !item.flag;
      // 选中加进投注数据
      if (item["flag"]) {
        if (+this.currentOrders.money > 0) {
          item.money = this.currentOrders.money;
        } else {
          item.money = 1;
        }
      }
      // 取消选中删除数据
      else {
        item.money = 0;
      }
    },

    // 底部清除选号
    clearCode() {
      let codeList = this.pcdd.allCodeList;
      this.bet.ylcBetData = [];
      this.$store.commit("SET_ORDER_LIST", []);
      if (this.currentMethod.type === "ylc") {
        // 娱乐城龙虎斗
        if (this.currentMethod.method === "COLH") {
          for (const k of Object.keys(codeList)) {
            for (const i of codeList[k]) {
              for (const j of i.code) {
                j.flag = false;
                j.money = 0;
              }
            }
          }
        }

        // 娱乐城整合
        else {
          for (const k of codeList) {
            for (const i of k.codes) {
              i.flag = false;
              i.money = 0;
            }
          }
        }
      } else if (this.currentMethod.type === "pcdd") {
        for (const k of Object.keys(codeList)) {
          if (k === "DXDS" || k === "TM" || k === "TMBS") {
            for (const i of codeList[k].codes) {
              i.flag = false;
              i.money = 0;
            }
          } else {
            for (const j of codeList[k]) {
              for (const i of j.codes) {
                i.flag = false;
                i.money = 0;
              }
            }
          }
        }
      } else if (
        this.currentMethod.type === "pk10" ||
        this.currentMethod.type === "k3"
      ) {
        for (const k of codeList) {
          if (!k.arr) {
            for (const i of k.codes) {
              i.flag = false;
              i.money = 0;
            }
          } else {
            for (let q of k.arr) {
              for (const i of q.codes) {
                i.flag = false;
                i.money = 0;
              }
            }
          }
        }
      }
    },
    //监听input输入框
    handleChangeInput(item) {
      this._.debounce(() => {
        let codeMoney;
        if (item.codes && item.codes.length) {
          item.codes[0]["flag"] = +item.codes[0]["money"] > 0 ? true : false;
        } else {
          item.flag = +item.money > 0 ? true : false;
        }
      }, 100)();
    },
    //展开历史
    handleCollapseRight() {
      this.collapseRight = !this.collapseRight;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.el-select {
  margin-right: 5px;
  width: 60px;
}
.dxds {
  border-top: 1px solid #d4d4d4;
}
/*.ylc-bet-line-dxds{*/
/*  width:75%;*/
/*}*/
/*.ylc-bet-line-dxds .ylc-bet-list{*/
/*  float:left;*/
/*  width:33.33%;*/
/*}*/
.bet-history {
  padding-top: 1px;
  background: #f1f1f1;
}
.main-right {
  position: absolute;
  right: 0;
  top: 9px;
  z-index: 10;
  border: 1px solid #dcdfe6;
  border-right: 0;
}
.right-collapse {
  cursor: pointer;
  font-size: 12px;
  line-height: 1.5;
  top: 9px;
  right: -23px;
  position: absolute;
  width: 23px;
  text-align: center;
  padding: 8px 0;
  background: $primary-color;
  color: #fff;
}
</style>
