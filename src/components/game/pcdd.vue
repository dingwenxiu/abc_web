<template>
	<section>
		<section class="fw">
			<ul
							class="ylc-title"
							:class="{nrb: index === 3}"
							v-for="(item, index) in 4"
							:key="index"
			>
				<li class="ylc-title-list">号码</li>
				<li class="ylc-title-list">赔率</li>
				<li class="ylc-title-list">金额</li>
			</ul>
		</section>
		<section class="fw" v-if="pcdd.allCodeList.TM.codes">
			<ul class="ylc-bet w100">
				<li
								class="ylc-bet-list w25"
								:class="{nrb: (index + 1) % 4 === 0, active: item.flag}"
								v-for="(item, index) in pcdd.allCodeList.TM.codes"
								:key="index"
				>
					<section class="w66 fl" @click="listChecked(item)">
						<section class="w50 fl">
							<span class="ylc-bet-list-num" :class="pcddAllIcon(item)">{{item.code}}</span>
						</section>
						<span
										class="fl w50 red ylc-bet-list-odds"
						>{{Utils.toFixed(String(item.odds), 4)}}</span>
					</section>
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
		
		<!--特码包三-->
		<!--            <section class="fw">
			<ul class="ylc-title w100 ntb">
				<li class="ylc-title-list">号码</li>
				<li class="ylc-title-list">赔率</li>
				<li class="ylc-title-list">金额</li>
			</ul>
			<ul class="ylc-bet w100 clear ylc-tmb3">
				<li class="ylc-bet-list tc w100"
						v-for="(item, index) in pcdd.allCodeList.TMBS.codes"
						:key="index"
						:class="{active: item.flag}">
					<section class="w66 fl" @click="listChecked(item)">
						<section class="w50 fl">
							<span class="dinv ft13 ylc-tmb3-title">特码包三</span>
							<el-select v-model="tmbs.one" placeholder="请选择">
								<el-option
												v-for="item in tmbsOptions"
												:key="item.value + 'v1'"
												:label="item.label"
												:value="item.value">
								</el-option>
							</el-select>
							<el-select v-model="tmbs.two" placeholder="请选择">
								<el-option
												v-for="item in tmbsOptions"
												:key="item.value + 'v2'"
												:label="item.label"
												:value="item.value">
								</el-option>
							</el-select>
							<el-select v-model="tmbs.three" placeholder="请选择">
								<el-option
												v-for="item in tmbsOptions"
												:key="item.value + 'v3'"
												:label="item.label"
												:value="item.value">
								</el-option>
							</el-select>
						</section>

						<section class="w50 fl">
							<span class="red ylc-bet-list-odds">{{item.odds}}</span>
						</section>
					</section>
					
					<section class="w33 fl">
						<input type="text" @input="handleChangeInput(item)" class="ylc-bet-list-money" v-model="item.money">
					</section>
				</li>
			</ul>
		</section>-->
		
		<!--            大小单双  波-->
		<section class="fw dxds">
			<section class="fw clear">
				<ul
								class="ylc-title ntb"
								:class="{nrb: indexr === 3}"
								v-for="(item, indexr) in 4"
								:key="indexr"
				>
					<li class="ylc-title-list">号码</li>
					<li class="ylc-title-list">赔率</li>
					<li class="ylc-title-list">金额</li>
				</ul>
			</section>
			<section class="fw">
				<ul class="ylc-bet ylc-bet-line ylc-bet-line-dxds w25">
					<template v-for="(item, indexo) in pcdd.allCodeList.DXDS.codes">
						<li
										class="ylc-bet-list"
										:class="{active: item.flag, nrb: indexo === 3}"
										v-if="indexo < 4"
										:key="indexo"
						>
							<section class="w66 fl" @click="listChecked(item)">
								<span class="w50 fl" :class="item.class">{{item.code}}</span>
								<span class="fl w50 red ylc-bet-list-odds">{{item.odds}}</span>
							</section>
							<section class="w33 fl">
								<input
												type="text"
												@input="handleChangeInput(item)"
												class="ylc-bet-list-money"
												v-model="item.money"
								/>
							</section>
						</li>
					</template>
				</ul>
				<ul class="ylc-bet ylc-bet-line w25">
					<template v-for="(item, indext) in pcdd.allCodeList.DXDS.codes">
						<li
										class="ylc-bet-list"
										:class="{active: item.flag, nrb: indext === 3}"
										v-if="indext > 3 && indext < 8"
										:key="indext"
						>
							<section class="w66 fl" @click="listChecked(item)">
								<span class="w50 fl" :class="item.class">{{item.code}}</span>
								<span class="fl w50 red ylc-bet-list-odds">{{item.odds}}</span>
							</section>
							<section class="w33 fl">
								<input
												type="text"
												@input="handleChangeInput(item)"
												class="ylc-bet-list-money"
												v-model="item.money"
								/>
							</section>
						</li>
					</template>
				</ul>
				<ul class="ylc-bet ylc-bet-line w25">
					<template v-for="(item, indexs) in pcdd.allCodeList.DXDS.codes">
						<li
										class="ylc-bet-list"
										:class="{active: item.flag, nrb: indexs === 3}"
										v-if="indexs > 7"
										:key="indexs"
						>
							<section class="w66 fl" @click="listChecked(item)">
								<span class="w50 fl" :class="item.class">{{item.code}}</span>
								<span class="fl w50 red ylc-bet-list-odds">{{item.odds}}</span>
							</section>
							<section class="w33 fl">
								<input
												type="text"
												@input="handleChangeInput(item)"
												class="ylc-bet-list-money"
												v-model="item.money"
								/>
							</section>
						</li>
					</template>
				</ul>
				
				<ul class="ylc-bet ylc-bet-line w25">
					<li
									class="ylc-bet-list"
									:class="{active: item.codes[0].flag, nrb: indexf === 3}"
									v-for="(item, indexf) in pcdd.allCodeList.BZ"
									:key="indexf"
					>
						<section class="w66 fl" @click="listChecked(item.codes[0])">
							<span class="w50 fl" :class="item.class">{{item.codes[0].code}}</span>
							<span class="fl w50 red ylc-bet-list-odds">{{item.codes[0].odds}}</span>
						</section>
						
						<section class="w33 fl">
							<input
											type="text"
											@input="handleChangeInput(item)"
											class="ylc-bet-list-money"
											v-model="item.codes[0].money"
							/>
						</section>
					</li>
				</ul>
			</section>
		</section>
	</section>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import methods from "../../lib/config/method";
import prizes from "../../lib/config/prizes";
export default {
  name: "pcdd",
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
	data () {
    return {
      bq: {
        gray: [0, 13, 14, 27],
        green: [1, 4, 7, 10, 16, 19, 22, 25],
        blue: [2, 5, 8, 11, 17, 20, 23, 26],
        red: [3, 6, 9, 12, 15, 18, 21, 24]
      },
      // pcdd 特码包三
      tmbsOptions: [],
      tmbs: {
        one: 1,
        two: 1,
        three: 1
      }
    }
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
        for (const k of Object.keys(codeList)) {
          if (k === "DXDS" || k === "TM" || k === "TMBS") {
            for (const i of codeList[k].codes) {
              if (i.flag) {
                i.money = newVal;
              }
            }
          } else {
            for (const j of codeList[k]) {
              for (const i of j.codes) {
                if (i.flag) {
                  i.money = newVal;
                }
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
        for (const k of Object.keys(newVal)) {
          if (k === "DXDS" || k === "TM" || k === "TMBS") {
            for (const i of newVal[k].codes) {
              if (isNaN(i.money)) {
                i.money = 0;
              } else if (i.money) {
                if (Number(i.money) < 1) {
                  i.money = 0;
                }
                if (Number(i.money) > 1000000) {
                  i.money = 1000000;
                }
              }
            }
          } else {
            for (const j of newVal[k]) {
              for (const i of j.codes) {
                if (isNaN(i.money)) {
                  i.money = 0;
                } else if (i.money) {
                  if (Number(i.money) < 1) {
                    i.money = 0;
                  }
                  if (Number(i.money) > 1000000) {
                    i.money = 1000000;
                  }
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
    pcddAllIcon (item) {
        if (this.bq.gray.includes(item.code)) {
            return "ylc-bet-list-gray";
        } else if (this.bq.green.includes(item.code)) {
            return "ylc-bet-list-green";
        } else if (this.bq.blue.includes(item.code)) {
            return "ylc-bet-list-blue";
        } else if (this.bq.red.includes(item.code)) {
            return "ylc-bet-list-red";
        }
    },
    handleChangeInput (item) {
        this.$emit("handleChangeInput", item);
    },
    // 计算奖金
    countPrizes(obj) {
        // 娱乐城整合 两面派 龙虎斗 奖金计算

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

                    let prize = prizes[this.currentLottery.series_id]["official"];

                    for (let k of obj.TM.codes) {
                        for (let j of Object.keys(prize["TM"])) {
                            if (+k.code === +j) {
                                let odds = +prize["TM"][j].prize / 1800;
                                k.odds = this.Utils.toFixed(
                                    odds * (+this.userDetail.max_prize_group - diff),
                                    4
                                );
                            }
                        }
                    }

                    for (let k of obj.DXDS.codes) {
                        for (let j of Object.keys(prize["DXDS"])) {
                            if (k.code === j) {
                                let odds = +prize["DXDS"][j].prize / 1800;
                                k.odds = this.Utils.toFixed(
                                    odds * (+this.userDetail.max_prize_group - diff),
                                    4
                                );
                            }
                        }
                    }

                    for (let k of obj.BZ) {
                        for (let i of k.codes) {
                            if (k.method_group === "BZ") {
                                for (let j of Object.keys(prize["BZ"])) {
                                    if (i.code === j) {
                                        let odds = +prize["BZ"][j].prize / 1800;
                                        i.odds = this.Utils.toFixed(
                                            odds * (+this.userDetail.max_prize_group - diff),
                                            4
                                        );
                                    }
                                }
                            } else {
                                for (let j of Object.keys(prize["BO"])) {
                                    if (i.code === j) {
                                        let odds = +prize["BO"][j].prize / 1800;
                                        i.odds = this.Utils.toFixed(
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
    // pc蛋蛋 娱乐城 渲染列表
    pcddAllList() {
        let [temp = []] = [];
        this.pcdd.allCodeList = [];
        // pc蛋蛋
        let official = methods[this.currentLottery.series_id].official;
        let methodConfig = this.lotteryAll[this.currentLottery.en_name]
            .methodConfig;
        temp = {
            TM: {},
            DXDS: {},
            BZ: [],
            TMBS: {}
        };

        for (const k of methodConfig) {
            let json = {};
            json.codes = [];
            if (k.sign === "TM") {
                let tmbs = {};
                tmbs.codes = [];
                let tmbsJson = {};

                json.title = "特码";
                json.method_group = k.sign;

                tmbs.title = "特码包三";
                tmbs.method_group = k.sign;
                for (const o of k.rows[0].methods) {
                    if (o.method_sign === "TM") {
                        json.challenge_bonus = o.challenge_bonus;
                        json.challenge_config = o.challenge_config;
                        json.challenge_min_count = o.challenge_min_count;
                        json.challenge_type = o.challenge_type;
                        for (const i of official["TM"].layout.codes) {
                            // 特码包三
                            this.tmbsOptions.push({ value: i, label: i });
                            tmbsJson.method_sign = o.method_sign;
                            tmbsJson.method_name = o.method_name;
                            tmbsJson.code = 1;
                            tmbsJson.odds = 0;
                            tmbsJson.flag = false;
                            tmbsJson.money = 0;

                            let codeJson = {};
                            codeJson.method_sign = o.method_sign;
                            codeJson.method_name = o.method_name;
                            codeJson.code = i;
                            codeJson.odds = 0;
                            codeJson.flag = false;
                            codeJson.money = 0;
                            json.codes.push(codeJson);
                        }
                    }
                }
                tmbs.codes.push(tmbsJson);
                temp["TMBS"] = tmbs;
                temp["TM"] = json;
            }
            else if (k.sign === "DXDS") {
                let codes = official["DXDS"].layout.codes;
                json.title = "大小单双";
                json.method_group = k.sign;
                for (const o of k.rows[0].methods) {
                    if (o.method_sign === "PCDDDXDS") {
                        for (const i of Object.keys(codes)) {
                            let codeJson = {};
                            json.challenge_bonus = o.challenge_bonus;
                            json.challenge_config = o.challenge_config;
                            json.challenge_min_count = o.challenge_min_count;
                            json.challenge_type = o.challenge_type;
                            codeJson.method_sign = o.method_sign;
                            codeJson.method_name = o.method_name;
                            codeJson.code = codes[i];
                            codeJson.flag = false;
                            codeJson.money = 0;
                            codeJson.odds = 0;
                            json.codes.push(codeJson);
                        }
                    }
                }
                temp["DXDS"] = json;
            }
            else if (k.sign === "BZ" || k.sign === "BO") {
                json.title = "豹子";
                json.method_group = k.sign;
                for (const o of k.rows[0].methods) {
                    if (o.method_sign === "BAOZI") {
                        for (const i of official["BZ"].layout.codes) {
                            let codeJson = {};
                            json.challenge_bonus = o.challenge_bonus;
                            json.challenge_config = o.challenge_config;
                            json.challenge_min_count = o.challenge_min_count;
                            json.challenge_type = o.challenge_type;
                            codeJson.method_sign = o.method_sign;
                            codeJson.method_name = o.method_name;
                            codeJson.code = i;
                            codeJson.odds = 0;
                            codeJson.flag = false;
                            codeJson.money = 0;
                            json.codes.push(codeJson);
                            temp["BZ"].push(json);
                        }
                    } else if (k.sign === "BO") {
                        for (const o of k.rows[0].methods) {
                            if (o.method_sign === "BO") {
                                for (const i of official["BO"].layout.codes) {
                                    let json = {};
                                    json.codes = [];
                                    json.title = "波";
                                    json.method_group = k.sign;
                                    let codeJson = {};
                                    json.challenge_bonus = o.challenge_bonus;
                                    json.challenge_config = o.challenge_config;
                                    json.challenge_min_count = o.challenge_min_count;
                                    json.challenge_type = o.challenge_type;
                                    codeJson.method_sign = o.method_sign;
                                    codeJson.method_name = o.method_name;
                                    codeJson.code = i;
                                    codeJson.flag = false;
                                    codeJson.money = 0;
                                    codeJson.odds = 0;
                                    json.codes.push(codeJson);
                                    temp["BZ"].push(json);
                                }
                            }
                        }
                    }
                }
            }
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
