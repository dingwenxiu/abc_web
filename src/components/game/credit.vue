<template>
	<section>
		<template
						v-if="
                currentMethod.method === 'COZHENGHE' ||
                currentMethod.method === 'COLMP'"
		>
			<section
							class="fl fw w16"
							:class="{'ylc-content-line': index !== pcdd.allCodeList.length - 1}"
							v-for="(list, index) in pcdd.allCodeList"
							:key="index"
			>
				<p class="ylc-title w100">{{list.title}}</p>
				<ul class="ylc-title w100 ntb">
					<li class="ylc-title-list">号码</li>
					<li class="ylc-title-list">赔率</li>
					<li class="ylc-title-list">金额</li>
				</ul>
				<ul class="ylc-bet w100">
					<li
									class="ylc-bet-list ylc-c-bet-list w100"
									:class="{active: item.flag}"
									v-for="(item, lLndex) in list.codes"
									:key="lLndex"
					>
						<section class="w33 fl" @click="listChecked(item)">
                      <span class="ylc-bet-list-num" :class="{'ylc-bet-list-num-number': !isNaN(item.code)}"
                      >{{item.code}}</span>
						</section>
						<span
										class="fl red ylc-bet-list-odds"
										style="width:35.999%;"
										@click="listChecked(item)"
						>{{item.odds}}</span>
						<section class="w33 fl">
							<input
											type="text"
											@input="handleChangeInput(item)"
											class="ylc-bet-list-money"
											v-model="item.money"
							/>
						</section>
					</li>
					<template v-if="currentMethod.method === 'COZHENGHE'">
						<li
										class="ylc-bet-list ylc-c-bet-list w100"
										v-for="cc in (14 - list.codes.length)"
										:key="cc + '1'"
						></li>
					</template>
				</ul>
			</section>
		</template>
		
		<!--龙虎斗-->
		
		<section class="tc" v-else-if="currentMethod.method === 'COLH'">
			<section
							class="dinv ylc-lhd-list"
							v-for="(list, index) in pcdd.allCodeList.w"
							:key="index + 'w'"
			>
				<h3 class="ylc-lhd-list-title">{{list.name}}</h3>
				<ul class="fw">
					<li
									class="ylc-lhd-list-q"
									:class="{active: item.flag}"
									v-for="(item, iIndex) in list.code"
									:key="iIndex"
					>
						<section class="ylc-lhd-list-q-box" @click="listChecked(item)">
                      <span class="ylc-lhd-list-q-y" :class="{
                            'ylc-lhd-list-q-y-red': item.code === '龙',
                            'ylc-lhd-list-q-y-green': item.code === '和',
                            'ylc-lhd-list-q-y-blue': item.code === '虎'}"
                      >{{item.code}}</span>
						</section>
						<span class="dl red" @click="listChecked(item)">{{item.odds}}</span>
						<input
										type="text"
										@input="handleChangeInput(item)"
										class="ylc-bet-list-money"
										v-model="item.money"
						/>
					</li>
				</ul>
			</section>
			<br v-if="pcdd.allCodeList.q" />
			<section
							class="dinv ylc-lhd-list"
							v-for="(list, index) in pcdd.allCodeList.q"
							:key="index + 'q'"
			>
				<h3 class="ylc-lhd-list-title">{{list.name}}</h3>
				<ul class="fw">
					<li
									class="ylc-lhd-list-q"
									:class="{active: item.flag}"
									v-for="(item, iIndex) in list.code"
									:key="iIndex"
					>
						<section class="ylc-lhd-list-q-box" @click="listChecked(item)">
                      <span class="ylc-lhd-list-q-y" :class="{
                          'ylc-lhd-list-q-y-red': item.code === '龙',
                          'ylc-lhd-list-q-y-green': item.code === '和',
                          'ylc-lhd-list-q-y-blue': item.code === '虎'}"
                      >{{item.code}}</span>
						</section>
						<span class="dl red" @click="listChecked(item)">{{item.odds}}</span>
						<input
										type="text"
										@input="handleChangeInput(item)"
										class="ylc-bet-list-money"
										v-model="item.money"
						/>
					</li>
				</ul>
			</section>
			
			<br v-if="pcdd.allCodeList.b" />
			<section
							class="dinv ylc-lhd-list"
							v-for="(list, index) in pcdd.allCodeList.b"
							:key="index + 'b'"
			>
				<h3 class="ylc-lhd-list-title">{{list.name}}</h3>
				<ul class="fw">
					<li
									class="ylc-lhd-list-q"
									:class="{active: item.flag}"
									v-for="(item, iIndex) in list.code"
									:key="iIndex"
					>
						<section class="ylc-lhd-list-q-box" @click="listChecked(item)">
                      <span class="ylc-lhd-list-q-y" :class="{
                            'ylc-lhd-list-q-y-red': item.code === '龙',
                            'ylc-lhd-list-q-y-green': item.code === '和',
                            'ylc-lhd-list-q-y-blue': item.code === '虎'}"
                      >{{item.code}}</span>
						</section>
						<span class="dl red" @click="listChecked(item)">{{item.odds}}</span>
						<input
										type="text"
										@input="handleChangeInput(item)"
										class="ylc-bet-list-money"
										v-model="item.money"
						/>
					</li>
				</ul>
			</section>
			
			<br v-if="pcdd.allCodeList.s" />
			<section
							class="dinv ylc-lhd-list"
							v-for="(list, index) in pcdd.allCodeList.s"
							:key="index + 's'"
			>
				<h3 class="ylc-lhd-list-title">{{list.name}}</h3>
				<ul class="fw">
					<li
									class="ylc-lhd-list-q"
									:class="{active: item.flag}"
									v-for="(item, iIndex) in list.code"
									:key="iIndex"
					>
						<section class="ylc-lhd-list-q-box" @click="listChecked(item)">
                      <span class="ylc-lhd-list-q-y" :class="{
                            'ylc-lhd-list-q-y-red': item.code === '龙',
                            'ylc-lhd-list-q-y-green': item.code === '和',
                            'ylc-lhd-list-q-y-blue': item.code === '虎'}"
                      >{{item.code}}</span>
						</section>
						<span class="dl red" @click="listChecked(item)">{{item.odds}}</span>
						<input
										type="text"
										@input="handleChangeInput(item)"
										class="ylc-bet-list-money"
										v-model="item.money"
						/>
					</li>
				</ul>
			</section>
		</section>
		
		<!--第一球 到 第五球-->
		
		<section
						class="fw ylc-dwq"
						v-if="
                    currentMethod.method === 'COD1Q' ||
                    currentMethod.method === 'COD2Q' ||
                    currentMethod.method === 'COD3Q' ||
                    currentMethod.method === 'COD4Q' ||
                    currentMethod.method === 'COD5Q' ||
                    currentMethod.method === 'COZH' ||
                    currentMethod.method === 'COQWZY'"
		>
			<section class="fw">
				<ul class="fw ylc-title w20" v-for="c in 5" :key="c">
					<li class="ylc-title-list">号码</li>
					<li class="ylc-title-list">赔率</li>
					<li class="ylc-title-list">金额</li>
				</ul>
			</section>
			<ul class="ylc-bet w100">
				<li
								class="ylc-bet-list ylc-c-bet-list w20 fl nrb"
								style="overflow: initial;"
								:class="{active: item.flag, 'clear': item.code === '总大', nbb: index >= pcdd.allCodeList.length - 5}"
								v-for="(item, index) in pcdd.allCodeList[0].codes"
								:key="index"
				>
					<section class="w33 fl" @click="listChecked(item)">
                    <span class="ylc-bet-list-num" :class="{'ylc-bet-list-num-number': !isNaN(item.code)}"
                    >{{item.code}}</span>
					</section>
					<span
									class="fl red ylc-bet-list-odds"
									style="width:35.999%;"
									@click="listChecked(item)"
					>{{item.odds}}</span>
					<section class="w33 fl">
						<input
										type="text"
										@input="handleChangeInput(item)"
										class="ylc-bet-list-money"
										v-model="item.money"
						/>
					</section>
				</li>
			</ul>
		</section>
	</section>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import methods from "../../lib/config/method";
import prizes from "../../lib/config/prizes";
export default {
  name: "credit",
  data () {
    return {
    }
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
      "pcdd",
      "currentOrders",
      "orderList"
    ])
  },
  watch: {
    // 切换 娱乐城彩种时
    currentMethod() {
        this.pcddAllList();
    },
    // 快选输入金钱时
    "currentOrders.money": {
      handler(newVal) {
        let codeList = this.pcdd.allCodeList;
        if (isNaN(newVal)) {
          newVal = 0;
        }
        // 娱乐城龙虎斗
        if (this.currentMethod.method === "COLH") {
          for (const k of Object.keys(codeList)) {
            for (const i of codeList[k]) {
              for (const j of i.code) {
                if (j.flag) {
                  j.money = newVal;
                }
              }
            }
          }
        }
        // 娱乐城整合
        else if (
          this.currentMethod.method === "COZHENGHE" ||
          this.currentMethod.method === "COLMP"
        ) {
          for (const k of codeList) {
            for (const i of k.codes) {
              if (i.flag) {
                i.money = newVal;
              }
            }
          }
        }
        else {
          for (const k of codeList) {
            for (const i of k.codes) {
              if (i.flag) {
                i.money = newVal;
              }
            }
          }
        }

        if (+newVal > 1000000) {
          this.currentOrders.money = 1000000;
        }
      },
      deep: true
    },
    // 金钱发生变化时
    "pcdd.allCodeList": {
      handler(newVal) {
        // 娱乐城龙虎斗
        if (this.currentMethod.method === "COLH") {
          for (const k of Object.keys(newVal)) {
            for (const i of newVal[k]) {
              for (const j of i.code) {
                if (isNaN(j.money)) {
                  j.money = 0;
                } else if (j.money) {
                  if (Number(j.money) < 1) {
                    j.money = 0;
                  }
                  if (Number(j.money) > 1000000) {
                    j.money = 1000000;
                  }
                }
              }
            }
          }
        }

        // 娱乐城整合
        else {
          for (const k of newVal) {
            for (const i of k.codes) {
              if (isNaN(i.money)) {
                i.money = 0;
              } else if (i.money) {
                if (+i.money < 1) {
                  i.money = 0;
                }
                if (+i.money > 1000000) {
                  i.money = 1000000;
                }
              }
            }
          }
        }
      },
      deep: true
    }
  },
  created () {
    this.pcddAllList();
  },
  methods: {
    listChecked (item) {
        this.$emit("listChecked", item);
    },
    handleChangeInput (item) {
        this.$emit("handleChangeInput", item);
    },
    // 计算奖金
    countPrizes(obj) {
      // 整合 两面派 龙虎斗 奖金计算

      let diff = 0;
      let seriesId = this.currentLottery.series_id;

      for (const k of this.bet.gameIds) {
        for (const i of k) {
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

              let prize = prizes[this.currentLottery.series_id]["casino"];

              if (this.currentMethod.method === "COLH") {
                  for (let k of Object.keys(obj)) {
                      for (let o of obj[k]) {
                          for (let j of Object.keys(prize["COLH"])) {
                              if (o.method_sign === j) {
                                  for (let oc of o.code) {
                                      for (let i of Object.keys(prize["COLH"][j])) {
                                          if (oc.code === i) {
                                              // oc.odds = prize['COLH'][j][i].prize;
                                              let odds = +prize["COLH"][j][i].prize / 1800;
                                              oc.odds = this.Utils.toFixed(
                                                  odds *
                                                  (+this.userDetail.max_prize_group - diff),
                                                  4
                                              );
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              } else {
                  for (let k of obj) {
                      for (let o of k.codes) {
                          for (let j of Object.keys(prize[k.method_group])) {
                              if (j + "" === o.code + "") {
                                  // o.odds = prize[k.method_group][j].prize
                                  let odds = +prize[k.method_group][j].prize / 1800;
                                  o.odds = this.Utils.toFixed(
                                      odds * (+this.userDetail.max_prize_group - diff),
                                      4
                                  );
                              }
                          }
                      }
                  }
              }
          }
        }
      }
      // j.odds = 2 / (prize[l][p].count / prize[l][p].total) * this.bet.currentOrders.group / 2000 + .00000001
    },
    pcddAllList() {
        let [temp = []] = [];
        this.pcdd.allCodeList = [];
        let casino = methods[this.currentLottery.series_id].casino;
        let methodConfig = this.lotteryAll[this.currentLottery.en_name]
            .methodConfig_casino;
        if (this.currentMethod.method === "COZHENGHE") {
            for (const k of methodConfig) {
                let json = {};
                json.method_group = k.sign;
                json.codes = [];

                if (k.sign === "COD1Q") {
                    json.title = "第一球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_W") {
                            for (const i of casino["COD1Q"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                        if (o.method_sign === "CO_ZX_W_DXDS") {
                            for (const i of casino["COD1Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                } else if (k.sign === "COD2Q") {
                    json.title = "第二球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_Q") {
                            for (const i of casino["COD2Q"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                        if (o.method_sign === "CO_ZX_Q_DXDS") {
                            for (const i of casino["COD2Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                } else if (k.sign === "COD3Q") {
                    json.title = "第三球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_B") {
                            for (const i of casino["COD3Q"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                        if (o.method_sign === "CO_ZX_B_DXDS") {
                            for (const i of casino["COD3Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                } else if (k.sign === "COD4Q") {
                    json.title = "第四球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_S") {
                            for (const i of casino["COD4Q"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                        if (o.method_sign === "CO_ZX_S_DXDS") {
                            for (const i of casino["COD4Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                } else if (k.sign === "COD5Q") {
                    json.title = "第五球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_G") {
                            for (const i of casino["COD5Q"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                        if (o.method_sign === "CO_ZX_G_DXDS") {
                            for (const i of casino["COD5Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                } else if (k.sign === "COZH") {
                    json.title = "总合";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZHDXDS") {
                            for (const i of casino["COZH"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                }
            }
        }

        // 娱乐城两面派
        else if (this.currentMethod.method === "COLMP") {
            for (const k of methodConfig) {
                let json = {};
                json.method_group = k.sign;
                json.codes = [];
                if (k.sign === "COD1Q") {
                    json.title = "第一球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_W_DXDS") {
                            for (const i of casino["COD1Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                } else if (k.sign === "COD2Q") {
                    json.title = "第二球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_Q_DXDS") {
                            for (const i of casino["COD2Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                } else if (k.sign === "COD3Q") {
                    json.title = "第三球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_B_DXDS") {
                            for (const i of casino["COD3Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                } else if (k.sign === "COD4Q") {
                    json.title = "第四球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_S_DXDS") {
                            for (const i of casino["COD4Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                } else if (k.sign === "COD5Q") {
                    json.title = "第五球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_G_DXDS") {
                            for (const i of casino["COD5Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                } else if (k.sign === "COZH") {
                    json.title = "总合";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZHDXDS") {
                            for (const i of casino["COZH"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                    temp.push(json);
                }
            }
        }

        // 第一球到 第五球
        else if (
            this.currentMethod.method === "COD1Q" ||
            this.currentMethod.method === "COD2Q" ||
            this.currentMethod.method === "COD3Q" ||
            this.currentMethod.method === "COD4Q" ||
            this.currentMethod.method === "COD5Q"
        ) {
            let json = {};
            json.method_group = this.currentMethod.method;
            json.codes = [];

            for (const k of methodConfig) {
                if (this.currentMethod.method === "COD1Q") {
                    json.title = "第一球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_W") {
                            for (const i of casino["COD1Q"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                        if (o.method_sign === "CO_ZX_W_DXDS") {
                            for (const i of casino["COD1Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                } else if (this.currentMethod.method === "COD2Q") {
                    json.title = "第二球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_Q") {
                            for (const i of casino["COD2Q"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                        if (o.method_sign === "CO_ZX_Q_DXDS") {
                            for (const i of casino["COD2Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                } else if (this.currentMethod.method === "COD3Q") {
                    json.title = "第三球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_B") {
                            for (const i of casino["COD3Q"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                        if (o.method_sign === "CO_ZX_B_DXDS") {
                            for (const i of casino["COD3Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                } else if (this.currentMethod.method === "COD4Q") {
                    json.title = "第四球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_S") {
                            for (const i of casino["COD4Q"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                        if (o.method_sign === "CO_ZX_S_DXDS") {
                            for (const i of casino["COD4Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                } else if (this.currentMethod.method === "COD5Q") {
                    json.title = "第五球";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZX_G") {
                            for (const i of casino["COD5Q"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                        if (o.method_sign === "CO_ZX_G_DXDS") {
                            for (const i of casino["COD5Q"].layout.pcLmpCodes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                }
            }

            temp.push(json);
        }

        // 总合
        else if (this.currentMethod.method === "COZH") {
            let json = {};
            json.method_group = this.currentMethod.method;
            json.codes = [];
            for (const k of methodConfig) {
                if (k.sign === "COZH") {
                    json.title = "总合";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_ZHDXDS") {
                            for (const i of casino["COZH"].layout.codes) {
                                let codeJson = {};

                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                }
            }
            temp.push(json);
        }

        // 全五中一
        else if (this.currentMethod.method === "COQWZY") {
            let json = {};
            json.method_group = this.currentMethod.method;
            json.codes = [];
            for (const k of methodConfig) {
                if (k.sign === "COQWZY") {
                    json.title = "全五中一";
                    for (const o of k.rows[0].methods) {
                        if (o.method_sign === "CO_QWZY") {
                            for (const i of casino["COQWZY"].layout.codes) {
                                let codeJson = {};
                                codeJson.method_sign = o.method_sign;
                                codeJson.method_name = o.method_name;
                                codeJson.code = i;
                                codeJson.flag = false;
                                codeJson.money = 0;
                                json.codes.push(codeJson);
                            }
                        }
                    }
                }
            }
            temp.push(json);
        }

        // 龙虎斗
        else if (this.currentMethod.method === "COLH") {
            let [
                tempLh = {
                    w: [],
                    q: [],
                    b: [],
                    s: []
                }
            ] = [];
            for (const k of methodConfig) {
                if (k.sign === "COLH") {
                    for (const o of k.rows[0].methods) {
                        let json = {};
                        json.method_sign = o.method_sign;
                        json.method_name = o.method_name;
                        json.method_group = "COLH";
                        json.code = [
                            { code: "龙", odds: 0, flag: false, money: 0 },
                            { code: "和", odds: 0, flag: false, money: 0 },
                            { code: "虎", odds: 0, flag: false, money: 0 }
                        ];
                        if (o.method_sign === "CO_LHWQ") {
                            json.name = "万千 第一球 vs 第二球";
                            tempLh.w.push(json);
                        } else if (o.method_sign === "CO_LHWB") {
                            json.name = "万百 第一球 vs 第三球";
                            tempLh.w.push(json);
                        } else if (o.method_sign === "CO_LHWS") {
                            json.name = "万十 第一球 vs 第四球";
                            tempLh.w.push(json);
                        } else if (o.method_sign === "CO_LHWG") {
                            json.name = "万个 第一球 vs 第五球";
                            tempLh.w.push(json);
                        } else if (o.method_sign === "CO_LHQB") {
                            json.name = "千百 第二球 vs 第三球";
                            tempLh.q.push(json);
                        } else if (o.method_sign === "CO_LHQS") {
                            json.name = "千十 第二球 vs 第四球";
                            tempLh.q.push(json);
                        } else if (o.method_sign === "CO_LHQG") {
                            json.name = "千个 第二球 vs 第五球";
                            tempLh.q.push(json);
                        } else if (o.method_sign === "CO_LHBS") {
                            json.name = "百十 第三球 vs 第四球";
                            tempLh.b.push(json);
                        } else if (o.method_sign === "CO_LHBG") {
                            json.name = "百个 第三球 vs 第五球";
                            tempLh.b.push(json);
                        } else if (o.method_sign === "CO_LHSG") {
                            json.name = "十个 第四球 vs 第五球";
                            tempLh.s.push(json);
                        }
                    }
                }
            }

            temp = tempLh;
        }

        // 奖金计算
        this.countPrizes(temp);

        this.pcdd.allCodeList = temp;
    },
  }
}
</script>

<style scoped>

</style>
