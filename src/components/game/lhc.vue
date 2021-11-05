<template>
  <section class="pr lhc">
    <!--正特 特马-->
    <section
      v-if="currentMethod.method === 'LHC_TM' || currentMethod.method.indexOf('LHC_ZT') > -1"
      class="fl"
    >
      <ul class="fw ball-titles BB-titles">
        <li class="ball-title">号码</li>
        <li class="ball-title">金额</li>
        <li class="ball-title">号码</li>
        <li class="ball-title">金额</li>
        <li class="ball-title">号码</li>
        <li class="ball-title">金额</li>
        <li class="ball-title">号码</li>
        <li class="ball-title">金额</li>
        <li class="ball-title">号码</li>
        <li class="ball-title">金额</li>
      </ul>
      <ul class="fw lhc-tm-lists">
        <li
          class="lhc-tm-list"
          :class="{on: item.flag}"
          v-for="(item, index) in list.codes"
          :key="index"
        >
          <section class="fl" @click="numbers(item)">
            <span class="fl lhc-tm-list-q" :class="ballColor(item)">{{item.code}}</span>
            <span class="fl multiple">x{{item.odds}}</span>
          </section>
          <input
            type="text"
            class="lhc-tm-list-text ft12"
            maxlength="10"
            @input="item.money = Utils.number(item.money)"
            v-model="item.money"
          />
        </li>
      </ul>
    </section>

    <!--半波-->
    <section v-else-if="currentMethod.method === 'LHC_BB'">
      <section class="ball-titles">
        <section class="fw fl lhc-bb ft0">
          <ul class="fw ball-titles">
            <li class="ball-title">号码</li>
            <li class="ball-title">金额</li>
            <li class="ball-title">号码</li>
            <li class="ball-title">金额</li>
          </ul>
          <ul class="fw lhc-tm-lists">
            <li
              class="lhc-tm-list"
              :class="{on: item.flag}"
              v-for="(item, index) in list.codes"
              :key="index"
            >
              <section class="fl" @click="numbers(item)">
                <span class="lhc-bb-ball-name">{{item.title}}</span>
                <span class="lhc-bb-ball-name">x{{item.odds}}</span>
                <ul class="fw lhc-bb-balls">
                  <li
                    class="lhc-bb-ball ft14"
                    :class="ballColor(item)"
                    v-for="(cd, cdIndex) in item.code"
                    :key="cdIndex"
                  >{{cd < 10 ? '0' + cd : cd}}</li>
                </ul>
              </section>
              <input
                type="text"
                class="lhc-bb-ball-money ft12"
                maxlength="10"
                @input="item.money = Utils.number(item.money)"
                v-model="item.money"
              />
            </li>
          </ul>
        </section>
      </section>
    </section>

    <!--生肖-->
    <template
      v-else-if="
      currentMethod.method === 'LHC_TX' ||
      currentMethod.method === 'LHC_YX' ||
      currentMethod.method === 'LHC_LX'"
    >
      <section class="fw lhc-sx">
        <ul class="fw ball-titles">
          <li class="ball-title">号码</li>
          <li class="ball-title">{{currentMethod.method === 'LHC_LX' ? '状态' : '金额'}}</li>
          <li class="ball-title">号码</li>
          <li class="ball-title">{{currentMethod.method === 'LHC_LX' ? '状态' : '金额'}}</li>
        </ul>
        <ul class="fw lhc-tm-lists">
          <li
            class="lhc-tm-list"
            :class="{on: item.flag}"
            v-for="(item, index) in list.codes"
            :key="index"
          >
            <section class="fl" @click="numbers(item)">
              <span
                class="lhc-bb-ball-name lhc-bb-ball-icon"
                :style="{backgroundPosition: item.position}"
              ></span>
              <span class="lhc-bb-ball-name">{{item.title}}</span>
              <span class="lhc-bb-ball-name">x{{item.odds}}</span>
              <ul class="fw lhc-bb-balls">
                <li
                  class="lhc-bb-ball"
                  :class="ballColor(item, cdIndex)"
                  v-for="(cd, cdIndex) in item.code"
                  :key="cdIndex"
                >{{cd < 10 ? '0' + cd : cd}}</li>
              </ul>
              <span
                class="lhc-bz-list-checbox"
                v-if="currentMethod.method === 'LHC_LX'"
                :class="{on: item.flag}"
              ></span>
            </section>

            <input
              type="text"
              v-if="currentMethod.method !== 'LHC_LX'"
              class="lhc-bb-ball-money ft12"
              maxlength="10"
              @input="item.money = Utils.number(item.money)"
              v-model="item.money"
            />
          </li>
        </ul>
      </section>
    </template>

    <!--尾数-->
    <template v-else-if="currentMethod.method === 'LHC_WS'">
      <section class="fw lhc-sx lhc-wx">
        <ul class="fw ball-titles">
          <li class="ball-title">号码</li>
          <li class="ball-title">金额</li>
          <li class="ball-title">号码</li>
          <li class="ball-title">金额</li>
        </ul>
        <ul class="fw lhc-tm-lists">
          <li
            class="lhc-tm-list"
            :class="{on: item.flag}"
            v-for="(item, index) in list.codes"
            :key="index"
          >
            <section class="fl" @click="numbers(item)">
              <span class="lhc-bb-ball-name tc ft16">{{item.title}} 尾</span>
              <span class="lhc-bb-ball-name">x{{item.odds}}</span>
              <ul class="fw lhc-bb-balls">
                <li
                  class="lhc-bb-ball"
                  :class="ballColor(item, cdIndex)"
                  v-for="(cd, cdIndex) in item.code"
                  :key="cdIndex"
                >{{cd}}</li>
              </ul>
            </section>
            <input
              type="text"
              class="lhc-bb-ball-money ft12"
              maxlength="10"
              @input="item.money = Utils.number(item.money)"
              v-model="item.money"
            />
          </li>
        </ul>
      </section>
    </template>

    <!--总分-->
    <template v-else-if="currentMethod.method === 'LHC_ZF'">
      <section class="fw lhc-sx">
        <ul class="fw ball-titles">
          <li class="ball-title">号码</li>
          <li class="ball-title">金额</li>
          <li class="ball-title">号码</li>
          <li class="ball-title">金额</li>
        </ul>
        <ul class="fw lhc-tm-lists lhc-tm-lists-zf">
          <li
            class="lhc-tm-list lhc-tm-list-zf"
            :class="{on: item.flag}"
            v-for="(item, index) in list.codes"
            :key="index"
          >
            <section class="fl" @click="numbers(item)">
              <span class="lhc-bb-ball-name tc ft14 cre">{{item.title}}</span>
              <span class="lhc-bb-ball-name">x{{item.odds}}</span>
              <span class="ft12">{{item.code}}</span>
            </section>
            <input
              type="text"
              class="lhc-bb-ball-money ft12"
              maxlength="10"
              @input="item.money = Utils.number(item.money)"
              v-model="item.money"
            />
          </li>
        </ul>
      </section>
    </template>

    <!--不中-->
    <template v-else-if="currentMethod.method.indexOf('LHCBZ') !== -1">
      <section class="fw lhc-bz">
        <ul class="fw ball-titles">
          <li class="ball-title" v-for="(item, index) in 10" :key="index">号码</li>
        </ul>
        <ul class="fw lhc-tm-lists lhc-tm-lists-zf">
          <li
            class="lhc-bz-list"
            v-for="(item, index) in list.codes"
            :key="index"
            @click="numbers(item)"
          >
            <span class="lhc-tm-list" :class="ballColor(item)">{{item.code < 10 && item.code[0] !== '0' ? '0' + item.code : item.code}}</span>
<!--            <span class="lhc-tm-list" :class="ballColor(item)">{{ item.code }}</span>-->
            <span class="lhc-bz-list-checbox" :class="{on: item.flag}"></span>
          </li>
        </ul>
      </section>
    </template>

    <!--投注按钮-->
    <section class="fw clear tc submit">
      <p
        class="lhc-bz-odds"
        v-if="currentMethod.method.indexOf('LHCBZ') !== -1"
      >赔率 x {{list.codes[0].odds}}</p>
      <span>输入金额</span>
      <input type="text" v-model="currentOrder.betMoney" maxlength="10" class="lhc-tm-list-text" />

      <!--      <span>总金额 {{Utils.toFixed(currentOrder.betMoney)}}</span>-->

      <a href="javascript:;" class="silde-submit" @click="submit()">立即下注</a>
      <a href="javascript:;" class="silde-reset" @click="clearNumber()">
        <i class="fa fa-refresh"></i>重置
      </a>
    </section>

    <!-- 展开右侧按钮 -->

    <div
      @click="handleCollapse"
      v-if="currentMethod.method !== 'LHC_ZF' &&  currentMethod.method.indexOf('LHCBZ') === -1"
      class="slide-collapse"
    >
      <span class="span">快速选号</span>
    </div>
    <!--右侧-->
    <transition name="el-zoom-in-top">
      <section class="silde" v-if="showSilde">
        <section class="fw"></section>
        <section class="silde-plays">
          <!--正特 特马-->
          <template
            v-if="currentMethod.method === 'LHC_TM' || currentMethod.method.indexOf('LHC_ZT') > -1"
          >
            <section class="fw silde-play red">
              <span
                class="cur"
                @click="selectNumberSub(item)"
                v-for="(item, index) in currentMethod.buttons.red"
                :key="index"
              >
                <el-radio v-model="playValue" :label="index">{{item}}</el-radio>
              </span>
            </section>
            <section class="fw silde-play green">
              <span
                @click="selectNumberSub(item)"
                v-for="(item, index) in currentMethod.buttons.green"
                :key="index"
              >
                <el-radio
                  v-model="playValue"
                  :label="index + currentMethod.buttons.red.length"
                >{{item}}</el-radio>
              </span>
            </section>
            <section class="fw silde-play blue">
              <span
                @click="selectNumberSub(item)"
                v-for="(item, index) in currentMethod.buttons.blue"
                :key="index"
              >
                <el-radio
                  v-model="playValue"
                  :label="index + currentMethod.buttons.red.length + currentMethod.buttons.green.length"
                >{{item}}</el-radio>
              </span>
            </section>
            <ul class="fw plays">
              <li
                class="play"
                :class="{
                red: item.code === '大' || item.code === '小' || item.code === '单' || item.code === '双',
                on: item.flag}"
                v-for="(item, index) in plays"
                :key="index"
                @click="selectNumber(item)"
              >{{item.code}}</li>
            </ul>
          </template>

          <!--半波-->
          <template v-if="currentMethod.method === 'LHC_BB'">
            <section class="fw silde-play">
              <span
                @click="selectNumber(item)"
                v-for="(item, index) in currentMethod.buttons.wave"
                :key="index"
              >
                <el-radio v-model="playValue" :label="index">{{item}}</el-radio>
              </span>
            </section>
            <ul class="fw plays">
              <li
                class="play"
                :class="{
                red: item.code === '大' || item.code === '小' || item.code === '单' || item.code === '双',
                on: item.flag,
                w50: index === plays.length -1 || index === plays.length - 2}"
                v-for="(item, index) in plays"
                :key="index"
                @click="selectNumber(item)"
              >{{item.code}}</li>
            </ul>
          </template>

          <!--生肖-->
          <template
            v-if="currentMethod.method === 'LHC_TX' || currentMethod.method === 'LHC_YX' || currentMethod.method === 'LHC_LX'"
          >
            <section class="fw silde-play lhc-silde-play">
              <span
                @click="selectNumber(item)"
                v-for="(item, index) in currentMethod.buttons.class"
                :key="index"
              >
                <el-radio v-model="playValue" :label="index">{{item}}</el-radio>
              </span>
            </section>
            <ul class="fw plays">
              <li
                class="play w50 red"
                :class="{on: item.flag}"
                v-for="(item, index) in plays"
                :key="index"
                @click="selectNumber(item)"
              >{{item.code}}</li>
            </ul>
            <ul class="fw plays lhc-silde-playsFive">
              <li
                class="play w100"
                :class="{on: item.flag}"
                v-for="(item, index) in playsFive"
                :key="index"
                @click="selectNumber(item)"
              >{{item.code}}</li>
            </ul>
          </template>

          <!--尾数-->
          <template v-if="currentMethod.method === 'LHC_WS'">
            <section class="fw silde-play lhc-silde-play">
              <span
                class="lhc-wx-silde-play"
                @click="selectNumber(item)"
                v-for="(item, index) in currentMethod.buttons.class"
                :key="index"
              >
                <el-radio v-model="playValue" :label="index">{{item}}</el-radio>
              </span>
            </section>
          </template>
        </section>
        <a href="javascript:;" class="silde-reset" @click="clearNumber()">
          <i class="fa fa-refresh"></i>重置
        </a>
        <!-- 收起展开按钮 -->
        <div @click="handleCloseCollapse" class="close-collapse"></div>
      </section>
    </transition>

    <!--投注弹出框-->

    <el-dialog title="下注清单" :visible.sync="submitDialog" class="ylc-submit" width="36%">
      <ul class="fw ylc-bet-titles">
        <li class="ylc-bet-title">号码</li>
        <li class="ylc-bet-title">赔率</li>
        <li class="ylc-bet-title">单注金额</li>
      </ul>
      <ul class="fw ylc-bet-contents">
        <li class="ylc-bet-content" v-for="(item, index) in orderList" :key="`${index}-ylc`">
          <p class="ylc-bet-content-l wzfw">
            {{item.title}} {{currentMethod.method === 'LHC_WS' ? '尾': ''}}
            <span
              class="red"
            >@{{item.codec}}</span>
          </p>
          <p class="ylc-bet-content-c">{{item.odds}}</p>
          <p class="ylc-bet-content-r">{{Utils.toFixed(item.times)}}</p>
        </li>
      </ul>
      <section class="fw ylc-bet-count red">
        总计：
        <span class="fr">{{bet.currentOrder.count}}注 / {{Utils.toFixed(bet.currentOrder.cost)}}元</span>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitClose()" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmSubmit()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import prizes from "../../lib/config/prizes";
import { mapGetters, mapState } from "vuex";
export default {
  name: "lhc",
  data() {
    return {
      //展开侧栏
      showSilde: false,
      // 整理后的currentMethod.layout.codes
      list: {},
      playValue: "1",
      // 右侧表格辅助选项
      plays: [],
      // 生肖五行辅助选项
      playsFive: [],
      play: {
        clear: true
      },
      currentOrder: {
        money: 0,
        betMoney: 0,
        currentMode: 1,
        currentCost: 0,
        currentCount: 0,
        currentTimes: 1,
        currentGroup: 1950,
        currentCodes: {},
        list: []
      },
      submitDialog: false,
      // 总分布局
      isMethodZF: false
    };
  },
  computed: {
    ...mapState(["lottery"]),
    ...mapGetters([
      "currentMethod",
      "bet",
      "lotteryAll",
      "currentLottery",
      "userConfig",
      "currentIssue",
      "orderList"
    ])
  },
  watch: {
    currentMethod() {
      //侧边初始化
      this.showSilde = false;
      this.ballSort();
    },
    "bet.methodsTab"() {
      this.clearNumber();
    },
    // 六合彩奖金组
    "lottery.countPrize": {
      handler() {
        this.ballSort();
      },
      deep: true
    },
    // 列表变化时
    list: {
      handler(newVal) {
        for (const i of newVal.codes) {
          if (isNaN(i.money)) {
            i.money = 0;
          } else if (i.money) {
            if (+i.money > 0) {
              i.flag = true;
            }
            if (+i.money < 1) {
              i.money = 0;
            }
            if (+i.money > 1000000000) {
              i.money = 1000000000;
            }
          }

          if (i.flag && i.money <= 0) {
            i.money = 1;
          }
        }
      },
      deep: true
    },
    // 输入金额时
    "currentOrder.betMoney"(newVal) {
      newVal = parseInt(newVal);
      for (const i of this.list.codes) {
        if (i.flag) {
          i.money = newVal;
        }
      }

      if (isNaN(newVal)) {
        this.currentOrder.betMoney = 0;
      } else {
        if (+newVal > 1000000000) {
          newVal = 1000000000;
        }

        this.currentOrder.betMoney = newVal;
      }
    }
  },
  created() {
    this.chineseZodiacHandler();
  
    this.ballSort();
  },
  methods: {
    // 确认下注
    confirmSubmit() {
      let issus = {};
      issus[this.currentIssue["issue_no"]] = 1;

      this.Api.bet(
        this.currentLottery.en_name,
        issus,
        this.orderList,
        this.bet.currentOrder.cost
      ).then(res => {
        if (res.success) {
          this.submitDialog = false;
          this.$alert(
            "投注成功, 您可以通过”游戏记录“查询您的投注记录！",
            "提示",
            {
              confirmButtonText: "确定"
            }
          );
          // 清空号码
          this.clearNumber();
          // 获取我的投注 我的追号记录
          this.$store.dispatch("betHistory");
          // 刷新余额
          this.$store.dispatch("getUserDetail");
        }
      });
    },

    // 取消下注
    submitClose() {
      this.submitDialog = false;
    },

    // 立即下注
    submit() {
      let [
        list = this.list,
        currentMethod = this.currentMethod,
        ylcBetData = []
      ] = [];

      this.bet.currentOrder.cost = 0;
      this.bet.currentOrder.count = 0;
      this.lottery.userConfig.mode = 1;
      this.userConfig.singlePrice = 1;
      this.lottery.orderList = [];

      if (
        this.currentMethod.method.indexOf("LHCBZ") === -1 &&
        this.currentMethod.method !== "LHC_LX"
      ) {
        for (const i of list.codes) {
          if (i.flag) {
            if (+i.money <= 0) {
              this.$alert("你还未投注 或 投注错误", "提示", {
                confirmButtonText: "确定"
              });
              return false;
            }
            let json = {};

            if (
              currentMethod.method === "LHC_ZF" ||
              currentMethod.method === "LHC_TX" ||
              currentMethod.method === "LHC_YX" ||
              currentMethod.method === "LHC_LX" ||
              currentMethod.method === "LHC_WS" ||
              currentMethod.method === "LHC_BB"
            ) {
              json.codec = json.code = i.title;
            } else {
              if (String(i.code).length === 1 && +i.code < 10) {
                i.code = '0' + i.code;
              }
              json.codec = json.code = i.code;
            }
            
            if (
              currentMethod.method === "LHC_TM" ||
              currentMethod.method === "LHC_ZF" ||
              currentMethod.method === "LHC_TX" ||
              currentMethod.method === "LHC_YX" ||
              currentMethod.method.indexOf("LHC_ZT") > -1 ||
              currentMethod.method.indexOf("LHCBZ") !== -1 ||
              currentMethod.method === "LHC_BB"
            ) {
              json.title = list.title;
            } else {
              json.title = i.title;
            }

            json.odds = i.odds;
            json.method_name = list.method_name;
            json.method_sign = list.method_sign;
            json.money = +i.money;

            ylcBetData.push(json);
          }
        }

        for (let k of ylcBetData) {
          this.bet.currentOrder.cost += +k.money;
        }
      } else {
        let json = {};
        let num = 0;
        json.code = [];
        json.codec = [];
        for (const i of list.codes) {
          if (i.flag) {
            num += 1;
          }
        }

        if (num < this.currentMethod.number) {
          this.$alert("你还未投注 或 投注错误", "提示", {
            confirmButtonText: "确定"
          });
          return false;
        }
        for (const i of list.codes) {
          if (i.flag) {
            json.title = list.title;
            if (currentMethod.method.indexOf("LHCBZ") !== -1) {
              if (String(i.code).length === 1 && +i.code < 10) {
                i.code = '0' + i.code;
              }
              json.code.push(i.code);
              json.codec.push(i.code);
            } else {
              json.code.push(this.$store.getters.lhcTransLation(i.title));
              json.codec.push(i.title);
            }
            json.odds = i.odds;
            json.money = +i.money;
          }
        }

        this.bet.currentOrder.cost = json.code.length;
        json.code = json.code.join("&");
        json.codec = json.codec.join("&");

        json.method_name = list.method_name;
        json.method_sign = list.method_sign;

        if (this.currentOrder.betMoney) {
          json.money = +this.currentOrder.betMoney;
        }

        ylcBetData.push(json);

        for (let k of ylcBetData) {
          this.bet.currentOrder.cost += +this.currentOrder.betMoney;
        }
      }
      if (ylcBetData.length < 1) {
        this.$alert("你还未投注 或 投注错误", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }

      // this.bet.ylcDetailes.show = true;
      this.bet.currentOrder.count = ylcBetData.length;
      this.bet.ylcBetData = ylcBetData;
      this.$emit("addOrder");
      this.submitDialog = true;
    },

    // 清空 重置 已选
    clearNumber() {
      for (let k of this.list.codes) {
        k.flag = false;
        k.money = 0;
      }

      for (let k of this.plays) {
        k.flag = false;
      }

      if (this.currentMethod.method === "LHCTX") {
        for (let k of this.playsFive) {
          k.flag = false;
        }
      }
      this.playValue = -1;
      this.currentOrder.betMoney = 0;
      this.lottery.orderList = [];
    },

    // 生肖计算
    chineseZodiacHandler() {
      // 每一年的生肖对应的号码都会变化 进行计算
      // let chineseZodiac = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031"];
      let chineseZodiac = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
      // 当前年份
      // let currentYear = new Date().getFullYear();
      let current = this.Utils.newYear();
      // if (this.currentLottery.en_name === 'hklhc') {
      //   if (this.currentIssue.issue_no > '20007') {
      //     current = '鼠'
      //   }
      // }
      // 当前年份和数据中的年份 时间差
      let difference = 0;
      for (let i = 0; i < chineseZodiac.length; i++) {
        if (current.indexOf(chineseZodiac[i]) > -1) {
          difference = i + 1;
        }
      }

      // 根据当前生肖 计算号码
      let temp = this.lottery.lhcNumber.chineseZodiac.splice(
        this.lottery.lhcNumber.chineseZodiac.length - difference,
        difference
      );

      this.$store.commit(
        "chineseZodiac",
        temp.concat(this.lottery.lhcNumber.chineseZodiac)
      );
  
      this.lottery.lhcNumber.chineseZodiac = [
        [12, 24, 36, 48],
        [11, 23, 35, 47],
        [10, 22, 34, 46],
        [9, 21, 33, 45],
        [8, 20, 32, 44],
        [7, 19, 31, 43],
        [6, 18, 30, 42],
        [5, 17, 29, 41],
        [4, 16, 28, 40],
        [3, 15, 27, 39],
        [2, 14, 26, 38],
        [1, 13, 25, 37, 49]
      ];
    },

    // 特马 正特 大小 生肖 选择号码  半波 大小单双 合单 合双选择器
    selectNumber(item) {
      let temp = [];
      // 特马 正特
      if (
        this.currentMethod.method === "LHC_TM" ||
        this.currentMethod.method.indexOf("LHC_ZT") > -1
      ) {
        if (
          item.code === "大" ||
          item.code === "小" ||
          item.code === "单" ||
          item.code === "双"
        ) {
          this.play.clear = true;
          switch (item.code) {
            case "大":
              temp = this.list.codes.filter(i => {
                return i.code > 24;
              });
              break;
            case "小":
              temp = this.list.codes.filter(i => {
                return i.code <= 24;
              });
              break;
            case "单":
              temp = this.list.codes.filter(i => {
                return i.code % 2 !== 0;
              });
              break;
            case "双":
              temp = this.list.codes.filter(i => {
                return i.code % 2 === 0;
              });
              break;
          }
          // 选中和取消选中
          this.clearNumber();
          if (!item.flag) {
            for (let i = 0; i < temp.length; i++) {
              for (let j = 0; j < this.list.codes.length; j++) {
                if (
                  parseInt(temp[i].code) === parseInt(this.list.codes[j].code)
                ) {
                  this.$set(this.list.codes[j], "flag", true);
                }
              }
            }
            item.flag = true;
          } else {
            item.flag = false;
          }
        } else {
          // 如果第一次点击生肖，清空已选号
          if (this.play.clear) {
            this.clearNumber();
          }
          this.play.clear = false;
          switch (item.code) {
            case "鼠":
              temp = this.lottery.chineseZodiac[0];
              break;
            case "牛":
              temp = this.lottery.chineseZodiac[1];
              break;
            case "虎":
              temp = this.lottery.chineseZodiac[2];
              break;
            case "兔":
              temp = this.lottery.chineseZodiac[3];
              break;
            case "龙":
              temp = this.lottery.chineseZodiac[4];
              break;
            case "蛇":
              temp = this.lottery.chineseZodiac[5];
              break;
            case "马":
              temp = this.lottery.chineseZodiac[6];
              break;
            case "羊":
              temp = this.lottery.chineseZodiac[7];
              break;
            case "猴":
              temp = this.lottery.chineseZodiac[8];
              break;
            case "鸡":
              temp = this.lottery.chineseZodiac[9];
              break;
            case "狗":
              temp = this.lottery.chineseZodiac[10];
              break;
            case "猪":
              temp = this.lottery.chineseZodiac[11];
              break;
          }
          // 选中和取消选中
          if (!item.flag) {
            for (let i = 0; i < temp.length; i++) {
              for (let j = 0; j < this.list.codes.length; j++) {
                if (parseInt(temp[i]) === parseInt(this.list.codes[j].code)) {
                  this.$set(this.list.codes[j], "flag", true);
                }
              }
            }
            item.flag = true;
          } else {
            item.flag = false;
            for (let i = 0; i < temp.length; i++) {
              for (let j = 0; j < this.list.codes.length; j++) {
                if (parseInt(temp[i]) === parseInt(this.list.codes[j].code)) {
                  this.$set(this.list.codes[j], "flag", false);
                }
              }
            }
          }
        }
      }

      // 半波
      else if (this.currentMethod.method === "LHC_BB") {
        let code = item.code ? item.code : item;
        if (code.indexOf("红波") > -1) {
          temp = this.list.codes.filter(i => {
            return i.title.indexOf("红大") > -1 || i.title.indexOf("红小") > -1;
          });
        } else if (code.indexOf("绿波") > -1) {
          temp = this.list.codes.filter(i => {
            return i.title.indexOf("绿大") > -1 || i.title.indexOf("绿小") > -1;
          });
        } else if (code.indexOf("蓝波") > -1) {
          temp = this.list.codes.filter(i => {
            return i.title.indexOf("蓝大") > -1 || i.title.indexOf("蓝小") > -1;
          });
        } else if (code === "大") {
          temp = this.list.codes.filter(i => {
            return i.title.indexOf("大") > -1;
          });
        } else if (code === "小") {
          temp = this.list.codes.filter(i => {
            return i.title.indexOf("小") > -1;
          });
        } else if (code === "单") {
          temp = this.list.codes.filter(i => {
            return (
              i.title.indexOf("红单") > -1 ||
              i.title.indexOf("蓝单") > -1 ||
              i.title.indexOf("绿单") > -1
            );
          });
        } else if (code === "双") {
          temp = this.list.codes.filter(i => {
            return (
              i.title.indexOf("红双") > -1 ||
              i.title.indexOf("蓝双") > -1 ||
              i.title.indexOf("绿双") > -1
            );
          });
        } else if (code === "合单") {
          temp = this.list.codes.filter(i => {
            return i.title.indexOf("合单") > -1;
          });
        } else if (code === "合双") {
          temp = this.list.codes.filter(i => {
            return i.title.indexOf("合双") > -1;
          });
        }
        this.clearNumber();
        if (item.code) {
          item.flag = true;
        }
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < this.list.codes.length; j++) {
            if (temp[i].title) {
              if (temp[i].title === this.list.codes[j].title) {
                this.$set(this.list.codes[j], "flag", true);
              }
            } else {
              if (temp[i] === this.list.codes[j].title) {
                this.$set(this.list.codes[j], "flag", true);
              }
            }
          }
        }
      }

      // 生肖
      else if (
        this.currentMethod.method === "LHC_TX" ||
        this.currentMethod.method === "LHC_YX" ||
        this.currentMethod.method === "LHC_LX"
      ) {
        let code = item.code ? item.code : item;
        if (code === "大肖") {
          temp = ["鼠", "牛", "虎", "兔", "龙", "蛇"];
        } else if (code === "小肖") {
          temp = ["马", "羊", "猴", "鸡", "狗", "猪"];
        } else if (code === "男肖") {
          temp = ["鼠", "马", "牛", "虎", "猴", "龙", "狗"];
        } else if (code.indexOf("女肖") > -1) {
          temp = ["羊", "兔", "鸡", "蛇", "猪"];
        } else if (code === "吉美生肖") {
          temp = ["马", "羊", "兔", "鸡", "龙", "蛇"];
        } else if (code === "凶丑生肖") {
          temp = ["鼠", "牛", "虎", "猴", "狗", "猪"];
        } else if (code === "野外六兽") {
          temp = ["鼠", "虎", "猴", "兔", "龙", "蛇"];
        } else if (code === "家内六畜") {
          temp = ["牛", "马", "羊", "鸡", "狗", "猪"];
        } else if (code === "阳性生肖") {
          temp = ["牛", "羊", "虎", "猴", "兔", "鸡"];
        } else if (code === "阴性生肖") {
          temp = ["鼠", "马", "龙", "狗", "蛇", "猪"];
        } else if (code.indexOf("金") > -1) {
          temp = ["猴", "鸡"];
        } else if (code.indexOf("木") > -1) {
          temp = ["虎", "兔"];
        } else if (code.indexOf("水") > -1) {
          temp = ["鼠", "猪"];
        } else if (code.indexOf("火") > -1) {
          temp = ["蛇", "马"];
        } else if (code.indexOf("土") > -1) {
          temp = ["牛", "龙", "羊", "狗"];
        }
        this.clearNumber();
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < this.list.codes.length; j++) {
            if (temp[i] === this.list.codes[j].title) {
              this.$set(this.list.codes[j], "flag", true);
            }
          }
        }
      }

      // 尾数
      else if (this.currentMethod.method === "LHC_WS") {
        let [codes = this.currentMethod.layout.codes] = [];

        switch (item) {
          case "大":
            temp = [5, 6, 7, 8, 9];
            break;
          case "小":
            temp = [0, 1, 2, 3, 4];
            break;
          case "单":
            for (let i = 0; i < codes.length; i++) {
              if (i % 2 !== 0) {
                temp.push(i);
              }
            }
            break;
          case "双":
            for (let i = 0; i < codes.length; i++) {
              if (i % 2 === 0) {
                temp.push(i);
              }
            }
            break;
        }
        this.clearNumber();
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < this.list.codes.length; j++) {
            if (temp[i] === +this.list.codes[j].title) {
              this.$set(this.list.codes[j], "flag", true);
            }
          }
        }
      }
    },

    //特马 正特 颜色 选择号码
    selectNumberSub(item) {
      let [temp = []] = [];
      // 特马 正特
      if (
        this.currentMethod.method === "LHC_TM" ||
        this.currentMethod.method.indexOf("LHC_ZT") > -1
      ) {
        let obj = [];
        this.play.clear = true;
        if (item.indexOf("合") === -1) {
          if (item.indexOf("红") > -1) {
            obj = this.lottery.lhcNumber.redBall;
          } else if (item.indexOf("蓝") > -1) {
            obj = this.lottery.lhcNumber.blueBall;
          } else if (item.indexOf("绿") > -1) {
            obj = this.lottery.lhcNumber.greenBall;
          }
          if (item.indexOf("大") > -1) {
            temp = obj.filter(i => {
              return i > 24;
            });
          } else if (item.indexOf("小") > -1) {
            temp = obj.filter(i => {
              return i <= 24;
            });
          } else if (item.indexOf("单") > -1) {
            temp = obj.filter(i => {
              return i % 2 !== 0;
            });
          } else if (item.indexOf("双") > -1) {
            temp = obj.filter(i => {
              return i % 2 === 0;
            });
          }
        } else {
          if (item.indexOf("红合单") > -1) {
            temp = this.lottery.lhcNumber.hhd;
          } else if (item.indexOf("红合双") > -1) {
            temp = this.lottery.lhcNumber.hhs;
          } else if (item.indexOf("绿合单") > -1) {
            temp = this.lottery.lhcNumber.ghd;
          } else if (item.indexOf("绿合双") > -1) {
            temp = this.lottery.lhcNumber.ghs;
          } else if (item.indexOf("蓝合单") > -1) {
            temp = this.lottery.lhcNumber.lhd;
          } else if (item.indexOf("蓝合双") > -1) {
            temp = this.lottery.lhcNumber.lhs;
          }
        }
        this.clearNumber();
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < this.list.codes.length; j++) {
            if (temp[i] === parseInt(this.list.codes[j].code)) {
              this.$set(this.list.codes[j], "flag", true);
            }
          }
        }
      }
    },

    // 选中号码
    numbers(item) {
      item["flag"] = !item["flag"];

      if (item["flag"]) {
        if (
          +this.currentOrder.betMoney > 0 &&
          +this.currentOrder.betMoney > +item.money
        ) {
          item.money = this.currentOrder.betMoney;
        } else {
          +item["money"] === 0 ? (item["money"] = 1) : item["money"];
        }

        if (this.money > 0) {
          item["money"] = this.money;
        }
        this.lottery.orderList.push(item);
      } else {
        item["money"] = 0;

        this.lottery.orderList = this.lottery.orderList.filter(i => {
          return i.num !== item.num;
        });
      }
    },
    // 赔率计算
    prizesHandler(obj, obj2 = null) {
      let prize = obj2
        ? prizes[this.currentLottery.series_id]["official"][obj][obj2]
        : prizes[this.currentLottery.series_id]["official"][obj];
      let odds = +prize.prize / 1800;
      return this.Utils.toFixed(odds * this.lottery.countPrize, 2);
      // return prize.prize;
    },

    // 将号码顺序转换 和 初始渲染数据处理
    ballSort() {
      let [
        codes = this.currentMethod.layout.codes,
        currentMethod = this.currentMethod,
        method = this.currentMethod.method,
        lhcNumber = this.lottery.lhcNumber,
        json = {}
      ] = [];

      json.method_sign = currentMethod.method_sign;
      json.method_name = currentMethod.method_name;
      json.codes = [];

      this.list = {};
      this.plays = [];
      this.playsFive = [];

      // 特马 正特
      if (method === "LHC_TM" || method.indexOf("LHC_ZT") !== -1) {
        // 大小生肖选择数据处理
        let [tempCode = [], list = [], sub = currentMethod.buttons.sub] = [];

        switch (method) {
          case "LHC_TM":
            json.title = "特码";
            break;
          case "LHC_ZT1":
            json.title = "正特1";
            break;
          case "LHC_ZT2":
            json.title = "正特2";
            break;
          case "LHC_ZT3":
            json.title = "正特3";
            break;
          case "LHC_ZT4":
            json.title = "正特4";
            break;
          case "LHC_ZT5":
            json.title = "正特5";
            break;
          case "LHC_ZT6":
            json.title = "正特6";
            break;
        }
        for (let i = 0; i < sub.length; i++) {
          let jsonb = {};
          jsonb.code = sub[i];
          jsonb.flag = false;
          this.plays.push(jsonb);
        }
        for (let i = 0; i < Math.ceil(codes.length / 5); i++) {
          tempCode.push([]);
        }
        for (let i = 0; i < codes.length; i++) {
          if (i < 9 && String(codes[i]).substr(0, 1) !== "0") {
            codes[i] = "0" + codes[i];
          }
          tempCode[i % Math.ceil(codes.length / 5)].push(codes[i]);
        }
        for (let i = 0; i < tempCode.length; i++) {
          list = list.concat(tempCode[i]);
        }
        for (let i = 0; i < list.length; i++) {
          let codeJson = {};
          codeJson.flag = false;
          codeJson.code = list[i];
          codeJson.money = 0;
          codeJson.odds = this.prizesHandler(method);
          json.codes.push(codeJson);
        }
      }

      // 半波
      else if (method === "LHC_BB") {
        json.title = "半波";
        let sub = this.currentMethod.buttons.sub;
        for (let i = 0; i < sub.length; i++) {
          let json = {};
          json.code = sub[i];
          json.flag = false;
          this.plays.push(json);
        }

        for (const i of codes) {
          let codeJson = {};

          switch (i) {
            case "红大":
              codeJson.odds = this.prizesHandler(method, "RB");
              codeJson.code = lhcNumber.redBall.filter(i => {
                return i > 24;
              });
              break;
            case "红小":
              codeJson.odds = this.prizesHandler(method, "RS");
              codeJson.code = lhcNumber.redBall.filter(i => {
                return i <= 24;
              });
              break;
            case "红单":
              codeJson.odds = this.prizesHandler(method, "RO");
              codeJson.code = lhcNumber.redBall.filter(i => {
                return i % 2 !== 0;
              });
              break;
            case "红双":
              codeJson.odds = this.prizesHandler(method, "RE");
              codeJson.code = lhcNumber.redBall.filter(i => {
                return i % 2 === 0;
              });
              break;
            case "红合单":
              codeJson.odds = this.prizesHandler(method, "RAO");
              codeJson.code = lhcNumber.hhd;
              break;
            case "红合双":
              codeJson.odds = this.prizesHandler(method, "RAE");
              codeJson.code = lhcNumber.hhs;
              break;
            case "绿大":
              codeJson.odds = this.prizesHandler(method, "GB");
              codeJson.code = lhcNumber.greenBall.filter(i => {
                return i > 24 && i < 49;
              });
              break;
            case "绿小":
              codeJson.odds = this.prizesHandler(method, "GS");
              codeJson.code = lhcNumber.greenBall.filter(i => {
                return i <= 24;
              });
              break;
            case "绿单":
              codeJson.odds = this.prizesHandler(method, "GO");
              codeJson.code = lhcNumber.greenBall.filter(i => {
                return i % 2 !== 0 && i < 49;
              });
              break;
            case "绿双":
              codeJson.odds = this.prizesHandler(method, "GE");
              codeJson.code = lhcNumber.greenBall.filter(i => {
                return i % 2 === 0;
              });
              break;
            case "绿合单":
              codeJson.odds = this.prizesHandler(method, "GAO");
              codeJson.code = lhcNumber.ghd;
              break;
            case "绿合双":
              codeJson.odds = this.prizesHandler(method, "GAE");
              codeJson.code = lhcNumber.ghs;
              break;
            case "蓝大":
              codeJson.odds = this.prizesHandler(method, "BB");
              codeJson.code = lhcNumber.blueBall.filter(i => {
                return i > 24;
              });
              break;
            case "蓝小":
              codeJson.odds = this.prizesHandler(method, "BS");
              codeJson.code = lhcNumber.blueBall.filter(i => {
                return i <= 24;
              });
              break;
            case "蓝单":
              codeJson.odds = this.prizesHandler(method, "BO");
              codeJson.code = lhcNumber.blueBall.filter(i => {
                return i % 2 !== 0;
              });
              break;
            case "蓝双":
              codeJson.odds = this.prizesHandler(method, "BE");
              codeJson.code = lhcNumber.blueBall.filter(i => {
                return i % 2 === 0;
              });
              break;
            case "蓝合单":
              codeJson.odds = this.prizesHandler(method, "BAO");
              codeJson.code = lhcNumber.lhd;
              break;
            case "蓝合双":
              codeJson.odds = this.prizesHandler(method, "BAE");
              codeJson.code = lhcNumber.lhs;
              break;
          }
          codeJson.flag = false;
          codeJson.money = 0;
          codeJson.title = i;
          json.codes.push(codeJson);
        }
      }

      // 生肖
      else if (
        method === "LHC_TX" ||
        method === "LHC_YX" ||
        method === "LHC_LX"
      ) {
        let [
          sub = this.currentMethod.buttons.alias,
          fiveElements = this.currentMethod.buttons.fiveElements
        ] = [];
        // 吉美生肖
        for (let i = 0; i < sub.length; i++) {
          let jsonb = {};
          jsonb.code = sub[i];
          jsonb.flag = false;
          this.plays.push(jsonb);
        }
        for (let i = 0; i < fiveElements.length; i++) {
          let jsonb = {};
          jsonb.code = fiveElements[i];
          jsonb.flag = false;
          this.playsFive.push(jsonb);
        }

        for (const i of Object.keys(codes)) {
          let codeJson = {};
          codeJson.flag = false;
          codeJson.title = codes[i];
          codeJson.code = this.lottery.chineseZodiac[i];

          if (method !== "LHC_LX") {
            if (this.lottery.chineseZodiac[i].length === 4) {
              codeJson.odds = this.prizesHandler(method, "other");
            } else {
              codeJson.odds = this.prizesHandler(method, "main");
            }
          } else {
            codeJson.odds = this.prizesHandler(method);
          }
          codeJson.money = 0;

          switch (codes[i]) {
            case "鼠":
              codeJson.position = "-57px -4px";
              break;
            case "马":
              codeJson.position = "-10px -4px";
              break;
            case "牛":
              codeJson.position = "-292px -4px";
              break;
            case "羊":
              codeJson.position = "-339px -4px";
              break;
            case "虎":
              codeJson.position = "-104px -4px";
              break;
            case "猴":
              codeJson.position = "-386px -4px";
              break;
            case "兔":
              codeJson.position = "-151px -4px";
              break;
            case "鸡":
              codeJson.position = "-433px -4px";
              break;
            case "龙":
              codeJson.position = "-198px -4px";
              break;
            case "狗":
              codeJson.position = "-480px -4px";
              break;
            case "蛇":
              codeJson.position = "-245px -4px";
              break;
            case "猪":
              codeJson.position = "-527px -4px";
              break;
          }

          switch (method) {
            case "LHC_TX":
              json.title = "特肖";
              break;
            case "LHC_YX":
              json.title = "一肖";
              break;
            case "LHC_LX":
              json.title = "六肖";
              break;
          }
          json.codes.push(codeJson);
        }
      }

      // 尾数
      else if (method === "LHC_WS") {
        let sub = this.currentMethod.buttons.class;
        // 右侧 辅助选项
        for (let i = 0; i < sub.length; i++) {
          let jsonb = {};
          jsonb.code = sub[i];
          jsonb.flag = false;
          this.plays.push(json);
        }

        for (let i = 0; i < codes.length; i++) {
          let codeJson = {};

          codeJson.title = codes[i];
          codeJson.flag = false;
          codeJson.money = 0;
          switch (codes[i]) {
            case "0":
              codeJson.odds = this.prizesHandler(method, "0");
              codeJson.code = [10, 20, 30, 40];
              break;
            case "1":
              codeJson.odds = this.prizesHandler(method, "1");
              codeJson.code = ["01", 11, 21, 31, 41];
              break;
            case "2":
              codeJson.odds = this.prizesHandler(method, "2");
              codeJson.code = ["02", 12, 22, 32, 42];
              break;
            case "3":
              codeJson.odds = this.prizesHandler(method, "3");
              codeJson.code = ["03", 13, 23, 33, 43];
              break;
            case "4":
              codeJson.odds = this.prizesHandler(method, "4");
              codeJson.code = ["04", 14, 24, 34, 44];
              break;
            case "5":
              codeJson.odds = this.prizesHandler(method, "5");
              codeJson.code = ["05", 15, 25, 35, 45];
              break;
            case "6":
              codeJson.odds = this.prizesHandler(method, "6");
              codeJson.code = ["06", 16, 26, 36, 46];
              break;
            case "7":
              codeJson.odds = this.prizesHandler(method, "7");
              codeJson.code = ["07", 17, 27, 37, 47];
              break;
            case "8":
              codeJson.odds = this.prizesHandler(method, "8");
              codeJson.code = ["08", 18, 28, 38, 48];
              break;
            case "9":
              codeJson.odds = this.prizesHandler(method, "9");
              codeJson.code = ["09", 19, 29, 39, 49];
              break;
          }

          json.codes.push(codeJson);
        }
        //
        // // 渲染数据排序
        // for (let i = 0; i < Math.ceil(tempCodes.length / 2); i++) {
        //   tempWx.push([])
        // }
        // for (let i = 0; i < tempCodes.length; i++) {
        //   tempWx[i % Math.ceil(tempCodes.length / 2)].push(tempCodes[i])
        // }
        // for (let i = 0; i < tempWx.length; i++) {
        //   list = list.concat(tempWx[i])
        // }
        // for (let i = 0; i < list.length; i++) {
        //   let codeJson = {};
        //   codeJson.flag = false;
        //   codeJson.code = list[i].code;
        //   codeJson.title = list[i].name;
        //   codeJson.money = 0;
        //   codeJson.odds = this.prizesHandler(method);
        //   // json.codes.push(json)
        // }
      }

      // 总分
      else if (method === "LHC_ZF") {
        json.title = "总分";
        for (const k of codes) {
          let codeJson = {};
          codeJson.title = k;
          codeJson.flag = false;
          codeJson.money = 0;
          switch (k) {
            case "大":
              codeJson.odds = this.prizesHandler(method, "b");
              codeJson.code = "总分大于等于175的，即视为中奖。";
              break;
            case "小":
              codeJson.odds = this.prizesHandler(method, "s");
              codeJson.code = "总分小于等于174的，即视为中奖。";
              break;
            case "单":
              codeJson.odds = this.prizesHandler(method, "o");
              codeJson.code = "总分是单数的，即视为中奖。";
              break;
            case "双":
              codeJson.odds = this.prizesHandler(method, "e");
              codeJson.code = "总分是双数的，即视为中奖。";
              break;
            case "大单":
              codeJson.odds = this.prizesHandler(method, "bo");
              codeJson.code = "总分小于等于175且为单数的，即视为中奖。";
              break;
            case "大双":
              codeJson.odds = this.prizesHandler(method, "so");
              codeJson.code = "总分大于等于175且为双数的，即视为中奖。";
              break;
            case "小单":
              codeJson.odds = this.prizesHandler(method, "be");
              codeJson.code = "总分小于等于174且为单数的，即视为中奖。";
              break;
            case "小双":
              codeJson.odds = this.prizesHandler(method, "se");
              codeJson.code = "总分小于等于174且为双数的，即视为中奖。";
              break;
          }

          json.codes.push(codeJson);
        }
      }

      // 不中
      else if (method.indexOf("LHCBZ") !== -1) {
        switch (method) {
          case "LHCBZ_5":
            json.title = "五不中";
            break;
          case "LHCBZ_6":
            json.title = "六不中";
            break;
          case "LHCBZ_7":
            json.title = "七不中";
            break;
          case "LHCBZ_8":
            json.title = "八不中";
            break;
          case "LHCBZ_9":
            json.title = "九不中";
            break;
          case "LHCBZ_10":
            json.title = "十不中";
            break;
        }
        for (const i of codes) {
          let codeJson = {};
          
          codeJson.code = i;
          codeJson.odds = this.prizesHandler(method);
          codeJson.flag = false;
          codeJson.money = 0;
          json.codes.push(codeJson);
        }
      }
      
      this.list = json;
    },

    // 计算 球 背景色
    ballColor(item, index = 0) {
      if (!Array.isArray(item.code)) {
        if (this.lottery.lhcNumber.redBall.includes(parseInt(item.code))) {
          return "lhc-tm-list-q-red";
        } else if (
          this.lottery.lhcNumber.blueBall.includes(parseInt(item.code))
        ) {
          return "lhc-tm-list-q-blue";
        } else if (
          this.lottery.lhcNumber.greenBall.includes(parseInt(item.code))
        ) {
          return "lhc-tm-list-q-green";
        }
      } else {
        if (
          this.lottery.lhcNumber.redBall.includes(parseInt(item.code[index]))
        ) {
          return "lhc-tm-list-q-red";
        } else if (
          this.lottery.lhcNumber.blueBall.includes(parseInt(item.code[index]))
        ) {
          return "lhc-tm-list-q-blue";
        } else if (
          this.lottery.lhcNumber.greenBall.includes(parseInt(item.code[index]))
        ) {
          return "lhc-tm-list-q-green";
        }
      }
    },
    handleCollapse() {
      this.showSilde = true;
    },
    handleCloseCollapse() {
      this.showSilde = false;
    }
  }
};
</script>

<style scoped>
/*	右侧*/
.silde {
  position: absolute;
  border: 1px solid #d9d9d9;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  padding: 20px 8px;
  width: 184px;
  background: #fff;
}
.silde-money-text {
  margin-left: 5px;
  width: 102px;
  height: 27px;
  text-align: center;
  border: 2px solid #cfd2d8;
  border-radius: 3px;
}
.silde-reset,
.silde-submit {
  display: inline-block;
  margin: 10px 0 0 12px;
  width: 40%;
  height: 28px;
  line-height: 28px;
  border: 1px solid #cfd2d8;
  border-radius: 3px;
  text-align: center;
  color: #333;
}
.silde-submit {
  margin-left: 8px;
  background: red;
  border-color: red;
  font-size: 12px;
  color: #fff;
}
.silde-reset:hover {
  background: #cfd2d8;
}
.silde-submit:hover {
  background: #d48888;
  border-color: #d48888;
}
.silde-reset .fa-refresh {
  padding-right: 3px;
}
.silde-plays {
  margin-top: 25px;
  padding-bottom: 15px;
  left: 9px;
  border: 1px solid #d9d9d9;
  overflow: hidden;
  background: #ffffff;
}
.silde-play {
  padding-top: 15px;
  cursor: pointer;
  color: #7d7d7d;
  font-size: 13px;
}
.el-radio {
  position: relative;
  margin-right: 0;
  width: 75px;
  padding-left: 12px;
  color: inherit;
}
.silde-play /deep/ .el-radio__label {
  padding-left: 3px;
}
.red {
  color: #d7414b !important;
}
.green {
  color: #32ab87 !important;
}
.blue {
  color: #3458d7 !important;
}
.radioi:checked + .radio-label:before {
  background-clip: content-box;
}
.red /deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #d7414b;
  background-color: #d7414b;
}
.red /deep/ .el-radio__input.is-checked + .el-radio__label {
  color: #d7414b;
}
.green /deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #32ab87;
  background-color: #32ab87;
}
.green /deep/ .el-radio__input.is-checked + .el-radio__label {
  color: #32ab87;
}
.blue /deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #3458d7;
  background-color: #3458d7;
}
.blue /deep/ .el-radio__input.is-checked + .el-radio__label {
  color: #3458d7;
}
.plays {
  margin: 18px auto 0;
  width: 168px;
  border-left: 1px solid #e0e0e0;
  border-top: 1px solid #e0e0e0;
}
.play {
  float: left;
  width: 42px;
  height: 30px;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  color: #7d7d7d;
  cursor: pointer;
}
.play.on {
  background: #fff9b8;
}
/*六合彩*/
.ball-titles {
  height: 38px;
  line-height: 38px;
  background: #ebebeb\0;
  background-image: linear-gradient(-180deg, #fafafa, #d9d9d9);
  border-top: 1px solid #d9d9d9;
}
.ball-title {
  float: left;
  width: 95px;
  text-align: center;
  font-size: 14px;
}
.BB-titles .ball-title {
  width: 9.8%;
}
.lhc-tm-lists {
  padding: 15px 0 15px 10px;
  background: #fff;
}
.lhc-tm-list {
  float: left;
  margin: 0 0 8px 2px;
  width: 228px;
  text-align: center;
  color: #6d7288;
  line-height: 42px;
}
.lhc-tm-list.on {
  background: #fff9b8;
}
.multiple {
  text-align: center;
  width: 67px;
}
.lhc-tm-list-q,
.lhc-bb-ball {
  margin: 6px 0 0 11px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  color: #fff;
  font-size: 15px;
}
.lhc-tm-list-q {
  margin: 6px 0 0 22px;
}
.lhc-tm-list-q-red {
  background: url(../../assets/images/hj.png) no-repeat -104px -44px;
}
.lhc-tm-list-q-green {
  background: url(../../assets/images/hj.png) no-repeat -51px -44px;
}
.lhc-tm-list-q-blue {
  background: url(../../assets/images/hj.png) no-repeat 0 -44px;
}
.lhc-tm-list-text,
.lhc-bb-ball-money {
  float: right;
  margin: 6px 5px 0 0;
  width: 78px;
  height: 32px;
  border: 1px solid #e8e8e8;
  background: #ededed;
  font-size: 12px;
  text-align: center;
  border-radius: 3px;
  box-shadow: 1px 1px 2px #e8e8e8 inset;
  color: #999;
}
.lhc-bb-ball-money {
  margin: 6px 37px 0 0;
}
.submit {
  position: relative;
  background: #fff;
}
.submit .silde-reset,
.submit .silde-submit {
  margin-bottom: 20px;
  width: 160px;
  height: 50px;
  line-height: 50px;
  font-size: 22px;
}
.submit .silde-submit {
  margin-right: 13px;
}
/*投注弹窗*/
.bet-header {
  padding: 0 0 9px 4%;
  font-size: 16px;
  text-align: left;
  border-bottom: 1px solid #c6c6c6;
}
.lhc /deep/ .el-dialog__footer {
  padding-bottom: 10px;
}
.lhc /deep/ .el-dialog__body {
  padding: 10px 3px;
}
.lhc /deep/ .el-dialog__header {
  padding: 15px 10px 10px;
}
.lhc /deep/ .el-dialog__headerbtn {
  top: 10px;
}
.bet-lists {
  text-align: left;
  font-size: 15px;
  margin-top: 10px;
  padding-left: 3%;
}
.bet-list {
  float: left;
  margin-top: 2px;
  width: 49%;
}
/*半波*/
.lhc-bb {
}
.lhc-bb .lhc-tm-lists {
  padding-left: 0;
}
.lhc-bb .lhc-tm-list {
  padding-left: 12px;
  width: calc(50% - 14px);
  text-align: left;
}
.lhc-bb .ball-titles {
  border-top: none;
}
.lhc-bb .ball-title {
  width: 25%;
}
.lhc-bb .ball-title:nth-of-type(2n) {
  text-indent: 150px;
}
.lhc-bb .ball-title:nth-of-type(1) {
  padding-left: 0;
}
.lhc-bb-ball {
  display: inline-block;
  vertical-align: middle;
  margin: 0;
  width: 31px;
  text-align: center;
}
.lhc-bb-balls {
  display: inline-block;
  vertical-align: middle;
  width: 311px;
}
.lhc-bb-ball-name {
  display: inline-block;
  vertical-align: middle;
  width: 50px;
  text-align: center;
  font-size: 13px;
}
.lhc-bb-ball-money {
  display: inline-block;
  vertical-align: middle;
}
/*生肖*/
.lhc-sx .ball-title {
  width: 25%;
}
.lhc-sx .lhc-tm-lists {
  padding-left: 0;
}
.lhc-sx .ball-title:nth-of-type(1) {
  padding-left: 0;
}
.lhc-sx .lhc-bb-balls {
  width: 210px;
}
.lhc-sx .lhc-bb-ball-money {
  margin-right: 97px;
}
.lhc-sx .lhc-bz-list-checbox {
  margin-left: 84px;
}
.lhc-sx .lhc-bb-ball {
  margin: 0 5px;
}
.lhc-sx .lhc-tm-list {
  margin: 0 5px 5px 0;
  width: calc(50% - 5px);
  text-align: left;
}
.lhc-sx .lhc-bb-ball-icon {
  margin: 0 5px 0 10px;
  width: 30px;
  height: 34px;
  background: url(../../assets/images/methods/zodiac.png) no-repeat;
}
.lhc-sx {
}
.lhc-silde-play .el-radio {
  width: 51px;
}
.lhc-silde-playsFive .play {
  text-align: left;
  text-indent: 1rem;
}
.lhc-wx-silde-play .el-radio {
  width: 70px;
}

.lhc-wx .lhc-bb-balls {
  width: 231px;
}
.lhc-wx .lhc-tm-list {
  padding-left: 20px;
  width: calc(50% - 25px);
}

/*总分*/
.lhc-tm-lists-zf .lhc-tm-list {
  padding-left: 8px;
  margin-left: 12px;
  width: 512px;
}
.lhc-tm-lists-zf .lhc-tm-list:nth-of-type(2),
.lhc-tm-lists-zf .lhc-tm-list:nth-of-type(4),
.lhc-tm-lists-zf .lhc-tm-list:nth-of-type(6),
.lhc-tm-lists-zf .lhc-tm-list:nth-of-type(8) {
  margin-left: 112px;
}
.lhc-tm-lists-zf .lhc-bb-ball-money {
  margin-right: 39px;
}
.lhc-bz .ball-title:nth-of-type(1) {
  padding-left: 0;
}
.lhc-bz .ball-title {
  width: 10%;
}
.lhc-bz .lhc-tm-lists {
  padding-bottom: 5px;
  border-bottom: 1px solid #d6d5d4;
}
.lhc-bz .lhc-tm-list {
  padding-left: 0;
  margin-left: 9px !important;
  width: 32px;
  height: 32px;
  line-height: 32px;
  color: #fff;
  font-size: 17px;
}
.lhc-bz-list {
  float: left;
  width: 10%;
}
.lhc-bz-list-checbox {
  display: inline-block;
  margin-left: 20px;
  vertical-align: middle;
  width: 23px;
  height: 23px;
  background: url(../../assets/images/hj.png) no-repeat -154px -49px;
}
.lhc-bz-list-checbox.on {
  background-position: -197px -49px;
}
.lhc-bz-odds {
  position: absolute;
  top: 6px;
  left: 30px;
}
.submit .lhc-tm-list-text {
  float: none;
  display: inline-block;
  vertical-align: initial;
  width: 100px;
  height: 40px;
  margin-left: 5px;
}
/* 展开 */
.slide-collapse {
  width: 33px;
  height: 138px;
  background: url("../../assets/images/slide-collapse.png");
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  cursor: pointer;
}
.slide-collapse .span {
  display: inline-block;
  line-height: 1.3;
  padding: 36px 8px 0;
  color: #f73b3b;
}
.close-collapse {
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: -28px;
  transform: translateY(-50%);
  width: 38px;
  height: 70px;
  background: url("../../assets/images/close-collapse.png") no-repeat left
    center;
}
</style>
