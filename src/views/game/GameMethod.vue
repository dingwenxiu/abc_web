<template>
  <section class="w100">
    <section v-show="currentMethod.type !== 'pcdd' && changeYlcPlays.name === 'official'" class="w">
      <!-- 选号区 -->
      <section class="main-center">
        <div class="bet-type-crow">
          <section class="bet-type-crows">
            <ul>
              <li
                class="bet-type-crow-li"
                v-for="(_group, _index) in allMethods"
                :key="_index"
                @click="selectGroup(_group.sign, _index)"
                :class="{'on':_group.sign === selectedGroup}"
              >
                <span class="bet-type-crow-name">{{_group.name}}</span>
                <span class="bet-type-group-name"></span>
              </li>
            </ul>
            <div v-if="currentLottery.hasrx" class="bet-type-optional">
              <span></span>
            </div>
          </section>
          <section
            class="bet-plays"
            v-if="
            currentLottery.series_id === 'ssc' ||
            currentLottery.series_id === 'pk10' ||
            currentLottery.series_id === 'k3'"
          >
            <div class="bet-play active">官方</div>
            <div class="bet-play" @click="changePlay()">信用</div>
          </section>
        </div>
        <div class="main-center-wrap">
          <div
            v-if="currentLottery.series_id !== 'lhc'"
            class="right-collapse"
            @click="handleCollapseRight"
          >{{this.collapseRight ? '收起开奖记录' : '展开开奖记录'}}</div>
          <div class="main-left">
            <div class="bet-type-group" v-if="selectedGroup" :style="{minHeight: typeGroup}">
              <div class="bet-type-group-warp">
                <div class="method-current-prize">
                  <template v-if="currentMethod.type !== 'lhc'">
                    <template v-if="!Array.isArray(countPrizes())">
                      单注奖金:
                      <span style="color:#FF5656;">{{countPrizes()}}</span> 元
                    </template>
                    <template v-else>
                      单注奖金:
                      <el-select
                        style="width:165px;"
                        v-model="prizeSelect"
                        :placeholder="prizeSelect"
                      >
                        <el-option
                          v-for="(item, index) in countPrizes()"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </template>
                  </template>
                </div>
                <div
                  class="bet-type-group-list"
                  v-for="(row, _rowIndex) in allMethods[selectedGroupIndex]['rows']"
                  :class="{'bet-type-group-list-lhc' : currentMethod.method.indexOf('LHCBZ') !== -1 ||
                              currentMethod.method === 'LHC_TX' ||
                              currentMethod.method === 'LHC_YX' ||
                              currentMethod.method === 'LHC_LX'}"
                  :key="_rowIndex"
                >
                  <template
                    v-if="row.methods.length > 0 &&
                        currentMethod.method.indexOf('LHCBZ') === -1 &&
                        currentMethod.method !== 'LHC_TX' &&
                        currentMethod.method !== 'LHC_YX' &&
                        currentMethod.method !== 'LHC_LX'"
                  >
                    <div class="group-name">{{row.name}}</div>
                    <ul>
                      <li
                        class="bet-type-group-list-li"
                        v-for="(method, mkey) in row.methods"
                        :key="mkey"
                        :class="{'on':method.method_sign === selectedMethodId}"
                        @click="selectMethod(method)"
                      >{{method.method_name}}</li>
                    </ul>
                  </template>

                  <template
                    v-else-if="
                              currentMethod.method.indexOf('LHCBZ') !== -1 ||
                              currentMethod.method === 'LHC_TX' ||
                              currentMethod.method === 'LHC_YX' ||
                              currentMethod.method === 'LHC_LX'"
                  >
                    <div
                      class="group-name group-name-lhc"
                      v-if="_rowIndex === 0"
                    >{{allMethods[selectedGroupIndex].name}}</div>
                    <ul class="lhc-ul">
                      <li
                        class="bet-type-group-list-li"
                        :class="{'on':row.methods[0].method_sign === selectedMethodId}"
                        @click="selectMethod(row.methods[0])"
                      >{{row.methods[0].method_name}}</li>
                    </ul>
                  </template>

                  <template v-else-if="row.methods[0].method_sign === 'LTBDW'">
                    <div class="group-name">{{row.name}}</div>
                    <ul>
                      <li
                        class="bet-type-group-list-li"
                        v-for="(method, mkey) in row.methods"
                        :key="mkey"
                        v-bind:class="{'on':method.method_sign === selectedMethodId}"
                        @click="selectMethod(method.method_sign)"
                      >前三不定位</li>
                    </ul>
                  </template>
                </div>
              </div>
            </div>
            <game-select @countPrizes="countPrizes" :countPrizes="countPrizes()" ref="gameSelect"></game-select>
          </div>
          <transition name="el-zoom-in-center">
            <section
              class="main-right"
              v-show="collapseRight"
              v-if="currentLottery.series_id !== 'lhc'"
            >
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
        </div>
        <!-- 投注区 -->
        <game-order ref="gameOrder" :countPrizes="countPrizes()"></game-order>
      </section>
    </section>

    <GameYlc
      v-if="changeYlcPlays.name === 'casino' || currentMethod.type === 'pcdd'"
      @addOrder="addOrder()"
    ></GameYlc>
  </section>
</template> 
<script>
import methods from "../../lib/config/method";
import prizes from "../../lib/config/prizes";
import GameSelect from "./GameSelect";
import GameOrder from "./GameOrder";
import GameYlc from "../../components/game/ylc";
import { mapGetters, mapState } from "vuex";

export default {
  name: "game-method",

  components: {
    GameOrder,
    GameSelect,
    GameYlc
  },
  data() {
    return {
      selectedGroup: "",
      selectedGroupIndex: "",
      selectedMethodId: "",
      collapseRight: true,
      typeGroup: "",
      prizeSelect: "一等奖" //单注奖金
    };
  },
  computed: {
    ...mapState(["lottery"]),
    ...mapGetters([
      "lotteryAll",
      "currentLottery",
      "allMethods",
      "defaultGroup",
      "defaultMethod",
      "currentMethod",
      "bet",
      "changeYlcPlays",
      "userDetail",
      "lotteryLists",
      "currentMethodGroup",
      "userConfig"
    ]),
    //获取每个彩种id
    gameId() {
      const gameIdArr = [];
      for (const key in this.lotteryLists) {
        const listArr = [];
        if (this.lotteryLists.hasOwnProperty(key)) {
          const element = this.lotteryLists[key];
          element.list.forEach(val => {
            listArr.push(val.number_id);
          });
        }
        gameIdArr.push(listArr);
      }
      return gameIdArr;
    }
  },
  watch: {
    // 官方彩 和 娱乐城的切换
    changeYlcPlays(newVal) {
      this.$refs.gameOrder.clearOrderList();
      let lottery = this.lotteryAll[this.currentLottery.en_name];

      if (newVal.name === "official") {
        this.$store.commit("SET_ALL_METHODS", lottery.methodConfig);
        if (this.currentLottery["valid_price"][2]) {
          this.userConfig.singlePrice = 2;
        } else {
          this.userConfig.singlePrice = 1;
        }
        this.selectGroup(this.defaultGroup, newVal.index, true);
      } else if (newVal.name === "casino") {
        this.lottery.userConfig.mode = 1;
        this.$store.commit("SET_ALL_METHODS", lottery.methodConfig_casino);
        this.selectGroup(this.defaultGroup, newVal.index);
      }
    }
  },
  created() {
    //初始化选择玩法
    this.selectGroup(this.defaultGroup, 0, true);
  },
  methods: {
    // 娱乐城的添加投注
    addOrder() {
      this.$refs.gameSelect.addOrder();
    },
    //奖金计算
    countPrizes() {
      let [
        seriesId = this.currentLottery.series_id,
        diff = 0,
        prize = prizes[this.currentLottery.series_id] &&
          prizes[this.currentLottery.series_id]["official"][
            this.currentMethod.method
          ],
        count = 0,
        arr = []
      ] = [];
      this.bet.gameIds = this.gameId;
      for (const k of this.gameId) {
        for (const i of k) {
          if (!prize) return;
          if (this.currentLottery.id === i) {
            if (
              i === 20 ||
              i === 17 ||
              i === 71 ||
              seriesId === "sd" ||
              seriesId === "ssl" ||
              seriesId === "p3p5"
            ) {
              diff = 30;
            } else if (seriesId === "lotto") {
              diff = 20;
            }
            // 单个奖金时
            if (!Array.isArray(prize.count)) {
              count =
                (((this.userConfig.mode * this.userConfig.singlePrice) /
                  (prize.count / prize.total)) *
                  (this.lottery.countPrize - diff)) /
                  2000 +
                0.00000001;
              this.typeGroup = "auto";
              if (this.userConfig.mode == 0.001) {
                return this.Utils.toFixed(String(count), 3);
              } else {
                return this.Utils.toFixed(String(count), 2);
              }
            }

            // 奖金为多个奖级时  数组
            else {
              for (const j of Object.keys(prize.count)) {
                let json = {};

                count =
                  (((this.userConfig.mode * this.userConfig.singlePrice) /
                    (prize.count[j] / prize.total)) *
                    (this.lottery.countPrize - diff)) /
                    2000 +
                  0.00000001;

                json.value = j;
                if (this.currentMethodGroup === "LH") {
                  if (+j === 0) {
                    json.label =
                      "和 " + this.Utils.toFixed(String(count)) + " 元";
                  } else if (+j === 1) {
                    json.label =
                      "龙虎 " + this.Utils.toFixed(String(count)) + " 元";
                  }
                } else {
                  json.label =
                    +j +
                    1 +
                    " 等奖 " +
                    this.Utils.toFixed(String(count), 2) +
                    " 元";
                }
                json.prize = count;
                arr.push(json);
              }
              this.typeGroup = "78px";
              this.prizeSelect = arr[0].label;
              return arr;
            }
          }
        }
      }
      // 2÷(1÷165)×1936÷1980
      // 重庆时时彩 1 -20
      // 福彩3d 17 -30
      // 排列35 20 -30
    },
    //切换娱乐城玩法
    changePlay() {
      let json = {
        name: "casino",
        index: 0
      };
      this.$store.commit("SET_CHANGE_YLCPLAYS", json);
    },
    // 选中玩法组
    selectGroup(groupSign, _index = 0, flag = false) {
      let recentMethod = this.Utils.storage.get("recentMethod");

      // 存在上次玩法
      if (
        flag &&
        recentMethod &&
        recentMethod.data[this.currentLottery.lottery_sign]
      ) {
        let recent = recentMethod.data[this.currentLottery.lottery_sign];
        this.selectedGroup = recent["first"];

        for (let k of Object.keys(this.allMethods)) {
          for (let i of this.allMethods[k].rows) {
            for (let j of i.methods) {
              if (j.method_sign === recent.grandson) {
                this.selectMethod(j, recent["first"]);
                this.selectedGroupIndex = k;
              }
            }
          }
        }
      }
      // 不存在上次玩法
      else {
        this.selectedGroup = groupSign;
        this.selectedGroupIndex = _index;
        this.selectMethod(
          this.allMethods[_index]["rows"][0]["methods"][0],
          this.allMethods[_index]["sign"]
        );
      }

      this.$store.commit("SET_METHODS_TAB");
    },

    // 记录上次玩法
    recentMethod() {
      let recentMethod = this.Utils.storage.get("recentMethod");
      let json = {};
      let method = this.currentMethod;
      let lottery = this.currentLottery;

      if (recentMethod) {
        json = recentMethod.data;
      }

      json[lottery.lottery_sign] = {};
      json[lottery.lottery_sign]["first"] = this.selectedGroup;
      // json[lottery.lottery_sign]['child'] = childPay;
      json[lottery.lottery_sign]["grandson"] = method["method_sign"];
      this.Utils.storage.set("recentMethod", json);
    },
    // 选中玩法
    selectMethod(method) {
      let play = null;
      if (this.changeYlcPlays.name === "official") {
        play = Object.assign(
          methods[this.currentLottery.series_id].official[
            method["method_sign"]
          ],
          method,
          { sign: this.selectedGroup }
        );
        this.$store.commit("SET_CURRENT_METHOD", play);

        this.recentMethod();
      } else {

        let casino = this.lotteryAll[this.currentLottery.en_name]
          .methodConfig_casino;
        this.$store.commit(
          "SET_CURRENT_METHOD",
          methods[this.currentLottery.series_id].casino[casino[0].sign]
        );
      }
      this.selectedMethodId = method["method_sign"];
      this.$store.commit("SET_METHODS_TAB");
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
.bet-type-group-warp {
  position: relative;
  padding-top: 20px;
  min-height: 25px;
}
.method-current-prize {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 2;
  font-size: 14px;
  box-sizing: border-box;
  text-align: right;
}
.bet-type-group-list:first-child {
  padding-top: 20px;
}
.main-center-wrap {
  position: relative;
  .right-collapse {
    cursor: pointer;
    font-size: 12px;
    line-height: 1.5;
    top: 0;
    right: -23px;
    position: absolute;
    width: 23px;
    text-align: center;
    padding: 8px 0;
    background: $primary-color;
    color: #fff;
  }
}
</style>
