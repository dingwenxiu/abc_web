<template>
	<section v-if="pcdd.allCodeList">
		<template v-if="currentMethod.method !== 'LHD'">
			<section class="fw" v-for="(list, index) in pcdd.allCodeList" :key="index">
				<!--				:class="{nrb: index === 3}"-->
				<template v-if="!list.arr">
					<section class="fw title" :class="{'frist-title': index === 0}">{{list.title}}</section>
					<section class="fw flex">
						<section class="flex1">
							<template v-if="currentMethod.method !== 'CHZ'">
								<ul class="ylc-title" v-for="(Iitem, Iindex) in list.codes.length" :key="Iindex">
									<li class="ylc-title-list">号码</li>
									<li class="ylc-title-list">赔率</li>
									<li class="ylc-title-list">金额</li>
								</ul>
							</template>
							<template v-else>
								<ul class="ylc-title" v-for="(Iitem, Iindex) in 4" :key="Iindex">
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
										<section class="w50 fl">
											<span class="ylc-bet-list-num">{{item.code}}</span>
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
							<!--						<ul class="ylc-title" v-for="(Iitem, Iindex) in arrItem.codes.length" :key="Iindex">-->
							<ul class="ylc-title">
								<li class="ylc-title-list">号码</li>
								<li class="ylc-title-list">赔率</li>
								<li class="ylc-title-list">金额</li>
							</ul>
							<ul class="ylc-bet w100">
								<li
									class="ylc-bet-list w25"
									:class="{active: item.flag}"
									v-for="(item, codeIndex) in arrItem.codes" :key="codeIndex"
								>
									<section class="w66 fl" @click="listChecked(item)">
										<section class="w50 fl">
											<span class="ylc-bet-list-num">
												<template v-if="item.method_sign === 'PK_CO_D1DXDS' && (item.code === '龙' || item.code === '虎')">
													1v10:
												</template>
												<template v-else-if="item.method_sign === 'PK_CO_D2DXDS' && (item.code === '龙' || item.code === '虎')">
													2v9:
												</template>
												<template v-else-if="item.method_sign === 'PK_CO_D3DXDS' && (item.code === '龙' || item.code === '虎')">
													3v8:
												</template>
												<template v-else-if="item.method_sign === 'PK_CO_D4DXDS' && (item.code === '龙' || item.code === '虎')">
													4v7:
												</template>
												<template v-else-if="item.method_sign === 'PK_CO_D5DXDS' && (item.code === '龙' || item.code === '虎')">
													5v6:
												</template>{{item.code}}
											</span>
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
			</section>
		</template>
	
		<section v-for="(list, index) in pcdd.allCodeList" v-else :key="index" class="tc">
			<section
				class="dinv ylc-lhd-list"
				v-for="(child, index) in list.arr"
				:key="index"
			>
				<h3 class="ylc-lhd-list-title">{{child.title}}</h3>
				<ul class="fw flex">
					<li
						class="ylc-lhd-list-q flex1"
						:class="{active: item.flag}"
						v-for="(item, iIndex) in child.codes"
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
      let FLAGTWO = true;
      
      for (const k of methodConfig_casino) {
        if (this.currentMethod.method === 'LM') {
          arr = [];
          for (const o of k.rows[0].methods) {
            let json = {};
            json.codes = [];
            json.method_group = k.sign;
            json.title = o.method_name;
            if (o.method_sign === 'PK_CO_GYHDXDS') {

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
            }
            else if(
              o.method_sign === 'PK_CO_D1DXDS' ||
              o.method_sign === 'PK_CO_D2DXDS' ||
              o.method_sign === 'PK_CO_D3DXDS' ||
              o.method_sign === 'PK_CO_D4DXDS' ||
              o.method_sign === 'PK_CO_D5DXDS'
            ) {
              if(FLAGONE) {
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
                temp.push({arrTitle: 'PK_CO_D1DXDS' , arr: arr})
              } else {
                let flag = temp.every( (i) => {
                  return !i.arrTitle || i.arrTitle !== 'PK_CO_D1DXDS'
                });
                if(flag) {
                  temp.push({arrTitle: 'PK_CO_D1DXDS' , arr: arr})
                }
              }
            }
            else if(
              o.method_sign === 'PK_CO_D6DXDS' ||
              o.method_sign === 'PK_CO_D7DXDS' ||
              o.method_sign === 'PK_CO_D8DXDS' ||
              o.method_sign === 'PK_CO_D9DXDS' ||
              o.method_sign === 'PK_CO_D10DXDS'
            ) {
              if(FLAGTWO) {
                arr = [];
                FLAGTWO = false;
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
                temp.push({arrTitle: 'PK_CO_D6DXDS' , arr: arr})
              } else {
                let flag = temp.every( (i) => {
                  return !i.arrTitle || i.arrTitle !== 'PK_CO_D6DXDS'
                });
                if(flag) {
                  temp.push({arrTitle: 'PK_CO_D6DXDS' , arr: arr})
                }
              }
            }
          }
        }
        
        else if (this.currentMethod.method === 'D1TO10') {
          arr = [];
          for (const o of k.rows[0].methods) {
            let json = {};
            json.codes = [];
            json.method_group = k.sign;
            json.title = o.method_name;
            if(
              o.method_sign === 'PK_CO_D1' ||
              o.method_sign === 'PK_CO_D2' ||
              o.method_sign === 'PK_CO_D3' ||
              o.method_sign === 'PK_CO_D4' ||
              o.method_sign === 'PK_CO_D5'
            ) {
              if(FLAGONE) {
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
                temp.push({arrTitle: 'PK_CO_D1' , arr: arr})
              } else {
                let flag = temp.every( (i) => {
                  return !i.arrTitle || i.arrTitle !== 'PK_CO_D1'
                });
                if(flag) {
                  temp.push({arrTitle: 'PK_CO_D1' , arr: arr})
                }
              }
            }
            else if(
              o.method_sign === 'PK_CO_D6' ||
              o.method_sign === 'PK_CO_D7' ||
              o.method_sign === 'PK_CO_D8' ||
              o.method_sign === 'PK_CO_D9' ||
              o.method_sign === 'PK_CO_D10'
            ) {
              if(FLAGTWO) {
                arr = [];
                FLAGTWO = false;
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
                temp.push({arrTitle: 'PK_CO_D6' , arr: arr})
              } else {
                let flag = temp.every( (i) => {
                  return !i.arrTitle || i.arrTitle !== 'PK_CO_D6'
                });
                if(flag) {
                  temp.push({arrTitle: 'PK_CO_D6' , arr: arr})
                }
              }
            }
          }
        }
        
        else if (this.currentMethod.method === 'LHD') {
          arr = [];
          for (const o of k.rows[0].methods) {
            let json = {};
            json.codes = [];
            json.method_group = k.sign;
            json.title = o.method_name;
            if(
              o.method_sign === 'PK_CO_LH1V10' ||
              o.method_sign === 'PK_CO_LH2V9' ||
              o.method_sign === 'PK_CO_LH3V8'
            ) {
              if(FLAGONE) {
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
                temp.push({arrTitle: 'PK_CO_LH1V10' , arr: arr})
              } else {
                let flag = temp.every( (i) => {
                  return !i.arrTitle || i.arrTitle !== 'PK_CO_LH1V10'
                });
                if(flag) {
                  temp.push({arrTitle: 'PK_CO_LH1V10' , arr: arr})
                }
              }
            }
            else if(
              o.method_sign === 'PK_CO_LH4V7' ||
              o.method_sign === 'PK_CO_LH5V6'
            ) {
              if(FLAGTWO) {
                arr = [];
                FLAGTWO = false;
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
                temp.push({arrTitle: 'PK_CO_LH4V7' , arr: arr})
              } else {
                let flag = temp.every( (i) => {
                  return !i.arrTitle || i.arrTitle !== 'PK_CO_LH4V7'
                });
                if(flag) {
                  temp.push({arrTitle: 'PK_CO_LH4V7' , arr: arr})
                }
              }
            }
          }
        }
        
        else if (this.currentMethod.method === 'CHZ') {
          arr = [];
    
          if (k.sign === 'CHZ') {
            for (const o of k.rows) {
              let json = {};
              json.codes = [];
              json.method_group = o.methods[0].method_sign;
              json.title = o.methods[0].method_name;
              for (const i of casino[k.sign].layout[o.methods[0].method_sign]) {
                let codeJson = {};
                codeJson.method_sign = o.methods[0].method_sign;
                codeJson.method_name = o.methods[0].method_name;
                codeJson.code = i;
                codeJson.odds = 0;
                codeJson.flag = false;
                codeJson.money = 0;
                json.codes.push(codeJson);
              }
              temp.push(json);
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
	.ylc-bet-list-num{
		width:auto;
		height:auto;
	}
</style>
