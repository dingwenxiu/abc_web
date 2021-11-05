<template>
	<section>
		<template  v-if="pcdd.allCodeList">
			<template v-if="currentMethod.method !== 'LHD'">
				<section class="fw" v-for="(list, index) in pcdd.allCodeList" :key="index">
					<!--				:class="{nrb: index === 3}"-->
					<template v-if="!list.arr">
						<section class="fw title" :class="{'frist-title': index === 0}">{{list.title}}</section>
						<section class="fw flex">
							<section class="flex1">
								<template v-if="list.title === '和值' || list.title === '两连'">
									<ul class="ylc-title" v-for="(Iitem, Iindex) in Math.ceil(list.codes.length / 4)" :key="Iindex">
										<li class="ylc-title-list">号码</li>
										<li class="ylc-title-list">赔率</li>
										<li class="ylc-title-list">金额</li>
									</ul>
								</template>
								<template v-else-if="list.title === '和值大小单双'">
									<ul class="ylc-title" v-for="(Iitem, Iindex) in list.codes.length" :key="Iindex">
										<li class="ylc-title-list">号码</li>
										<li class="ylc-title-list">赔率</li>
										<li class="ylc-title-list">金额</li>
									</ul>
								</template>
						
								<ul class="ylc-bet w100">
									<li
										class="ylc-bet-list w25"
										:class="{active: item.flag}"
										v-for="(item, codeIndex) in list.codes" :key="codeIndex"
									>
										<section class="w66 fl" @click="listChecked(item)">
											<section class="w50 fl" v-if="list.title === '和值' || list.title === '和值大小单双'">
												<span class="ylc-bet-list-num">{{item.code}}</span>
											</section>
											<section class="fl k3-sbth-lists" :style="{width: item.method_sign === 'KS_CO_BZ'  ? '68%' : '50%'}"  v-else>
												<span class="k3-sbth-dxds-lk" :class="['k3-sbth-' + itemChild]" v-for="(itemChild, childIndex) in String(item.code).split('')" :key="childIndex"></span>
											</section>
											<span
												class="fl red ylc-bet-list-odds"
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
						</section>
					</template>
					
					<template v-if="list.arr">
						<section class="fw flex arr-list-boxs">
							<section class="flex1 bor-right" :class="{nrb: arrIndex === list.arr.length - 1}" v-for="(arrItem, arrIndex) in list.arr" :key="arrIndex">
								<section class="fw title" :class="{'frist-title': index === 0}">{{arrItem.title}}</section>
								<ul class="ylc-title">
										<li class="ylc-title-list" :style="{width: arrItem.title === '豹子' ? '45%' : '33.33%'}">号码</li>
										<li class="ylc-title-list" :style="{width: arrItem.title === '豹子' ? '27.5%' : '33.33%'}">赔率</li>
										<li class="ylc-title-list" :style="{width: arrItem.title === '豹子' ? '27.5%' : '33.33%'}">金额</li>
								</ul>
								<ul class="ylc-bet w100">
									<li
										class="ylc-bet-list w25"
										:class="{active: item.flag}"
										v-for="(item, codeIndex) in arrItem.codes" :key="codeIndex"
									>
										<section class="w66 fl" @click="listChecked(item)">
											<section class="w50 fl" v-if="list.title === '和值' || list.title === '和值大小单双'">
												<span class="ylc-bet-list-num">{{item.code}}</span>
											</section>
											<section class="fl k3-sbth-lists" :style="{width: arrItem.title === '豹子' ? '68%' : '50%'}"  v-else>
												<span class="k3-sbth-dxds-lk" :class="['k3-sbth-' + itemChild]" v-for="(itemChild, childIndex) in String(item.code).split('')" :key="childIndex"></span>
											</section>
											<span
												:style="{width: arrItem.title === '豹子' ? '32%' : '50%'}"
												class="fl red ylc-bet-list-odds"
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
						</section>
					</template>
				</section>
			</template>
		</template>

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
    }
  },
  watch: {
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
        for (const k of codeList) {
          if(!k.arr) {
            for (const i of k.codes) {
              if (i.flag) {
                i.money = newVal;
              }
            }
          }
          else {
            for (let q of k.arr) {
              for (const i of q.codes) {
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
        for (let k of newVal) {
          if(!k.arr) {
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
          else {
            for (let q of k.arr) {
              for (const i of q.codes) {
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
            for (let p of obj) {
              if(!p.arr) {
                for (let j of p.codes) {
                  for (let o of Object.keys(prize)) {
                    if (j.method_sign === o) {
                      for (let m of Object.keys(prize[o])) {
                        if (j.code == m) {
                          let odds = +prize[j.method_sign][m].prize / 1800;
                          j.odds = this.Utils.toFixed(odds * (+this.userDetail.max_prize_group - diff) + .00000001, 4);
                        }
                      }
                    }
                  }

                }
              }
              else {
                for (let q of p.arr) {
                  for (let j of q.codes) {
                    for (let o of Object.keys(prize)) {
                      if (j.method_sign === o) {
                        for (let m of Object.keys(prize[o])) {
                          if (j.code == m) {
                            let odds = +prize[j.method_sign][m].prize / 1800;
                            j.odds = this.Utils.toFixed(odds * (+this.userDetail.max_prize_group - diff) + .00000001, 4);
                          }
                        }
                      }
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
    // 渲染列表
    pcddAllList() {
      let temp = [];
      this.pcdd.allCodeList = [];
      let casino = methods[this.currentLottery.series_id].casino;
      let methodConfig_casino = this.lotteryAll[this.currentLottery.en_name].methodConfig_casino;
      let arr = [];

      let FLAGONE = true;
      for (const k of methodConfig_casino) {
        if (this.currentMethod.method === 'ZH') {
          arr = [];
          for (const o of k.rows[0].methods) {
            let json = {};
            json.codes = [];
            json.method_group = k.sign;
            json.title = o.method_name;
            if (o.method_sign === 'KS_CO_HZ' || o.method_sign === 'KS_CO_HZDXDS' || o.method_sign === 'KS_CO_EL') {

              for (const i of casino[k.sign].layout[o.method_sign]) {
                let codeJson = {};
                codeJson.method_sign = o.method_sign;
                codeJson.method_name = o.method_name;
                codeJson.code = i;
                codeJson.odds = 0;
                codeJson.flag = false;
                codeJson.money = 0;
                json.codes.push(codeJson);
              }
              temp.push(json);
            } else if (
              o.method_sign === 'KS_CO_DD' ||
              o.method_sign === 'KS_CO_BZ' ||
              o.method_sign === 'KS_CO_DZ'
            ) {
              if (FLAGONE) {
                arr = [];
                FLAGONE = false;
              }
              for (const i of casino[k.sign].layout[o.method_sign]) {
                let codeJson = {};
                codeJson.method_sign = o.method_sign;
                codeJson.method_name = o.method_name;
                codeJson.code = i;
                codeJson.odds = 0;
                codeJson.flag = false;
                codeJson.money = 0;
                json.codes.push(codeJson);
              }
              arr.push(json);

              if (temp.length === 0) {
                temp.push({arrTitle: 'KS_CO_DD', arr: arr})
              } else {
                let flag = temp.every((i) => {
                  return !i.arrTitle || i.arrTitle !== 'KS_CO_DD'
                });
                if (flag) {
                  temp.push({arrTitle: 'KS_CO_DD', arr: arr})
                }
              }
            }
          }
        }
        
      }

      // 奖金计算
      this.countPrizes(temp);
      console.log(temp)
      this.pcdd.allCodeList = temp;
    },
  }
}
</script>

<style scoped>
	.title{
		padding:10px 0;
		border-top: 1px solid #D4D4D4;
		text-align:center;
		font-size:15px;
	}
	.frist-title {
		border-top:none;
	}
	.ylc-title{
		border-top: 1px solid #D4D4D4;
		border-bottom: 1px solid #D4D4D4;
	}
	.ylc-bet{
		padding: 6px 0;
	}
</style>
