<template>
  <div class="bet-record sub-account">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="(item, index) in lotteryLists"
        :lazy="true"
        :key="index"
        :label="item.name"
        :name="item.sign"
      >
        <div class="slider">
          奖金组:
          <el-slider
            :disabled="prizes.min == prizes.max"
            @change="sliderChange"
            v-model="countPrize"
            :min="prizes.min"
            :max="prizes.max"
          ></el-slider>
          {{countPrize}} / {{prizes.max}}
        </div>
        <div class="list-table">
          <el-table :span-method="objectSpanMethod" border :data="list" style="width: 100%">
            <el-table-column prop="name" label="玩法" align="center"></el-table-column>
            <template v-if="activeName !== 'pcdd' && activeName !== 'lhc'">
              <el-table-column prop="level" label ="奖级" align="center"></el-table-column>
            </template>
            <template v-else>
              <el-table-column prop="level" label="号码" align="center"></el-table-column>
            </template>
            <el-table-column prop="amount" label="奖金" align="center"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import prizes from '../../../lib/config/prizes';

export default {
  data() {
    return {
      activeName: '',
      showTable: false,
      // 奖金计算
      prizes: {},
      list: [],
      methodList: null,
      countPrize: null,
      // 合并列数列表
      spanArr: []
    };
  },
  computed: {
    ...mapGetters(['lotteryAll', 'lotteryLists', 'userDetail']),
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
  created() {
    this.activeName = Object.keys(this.lotteryLists)[0];
    this.prizes.min = parseInt(this.userDetail.min_prize_group);
    this.prizes.max = parseInt(this.userDetail.max_prize_group);
    this.countPrize = this.prizes.max;
  },
  mounted() {
    this.handleTabClick()
  },
  methods: {
    // 初始化数据
    initData() {
      this.list = [];
      let initList = [];
      const methodLists = this.lotteryAll[
        this.lotteryLists[this.activeName].list[0]['id']
      ]['methodConfig'];
      methodLists.forEach(e => {
        e.rows.forEach(el => {
          initList.push(...el.methods);
        });
      });
      if(this.activeName !== 'pcdd' && this.activeName  !== 'lhc') {
        // 展开分级奖金
        initList.forEach(v => {
          const amount = this.countPrizes(v.method_sign);
          if (this._.isArray(amount)) {
            amount.forEach(a => {
              this.list.push({
                name: v.method_name,
                level: a.label,
                amount: a.value
              });
            });
          } else {
            this.list.push({
              name: v.method_name,
              level: '1等奖',
              amount: amount
            });
          }
        });
      }
      else if(this.activeName === 'pcdd') {
        
        initList.forEach(v => {
          const amount = this.countPrizes(v.method_sign);
          amount.forEach(a => {
            this.list.push({
              name: v.method_name,
              level: a.label,
              amount: a.value
            });
          });
        });
        
      }
      else if(this.activeName === 'lhc') {
  
        initList.forEach(v => {
          const amount = this.countPrizes(v.method_sign);
    
          if (Array.isArray(amount)) {
            amount.forEach(a => {
              this.list.push({
                name: v.method_name,
                level: a.label,
                amount: a.value
              });
            });
          } else {
            this.list.push({
              name: v.method_name,
              level: '-',
              amount: amount
            });
          }
        });
  
      }
    },
    // 计算奖金
    countPrizes(methodName) {
      if(methodName === 'PCDDDXDS') {
        methodName = 'DXDS';
      } else if(methodName === 'BAOZI') {
        methodName = 'BZ';
      }
      let [
        seriesId = this.activeName,
        diff = 0,
        prize = prizes[this.activeName]['official'][methodName],
        count = 0,
        arr = []
      ] = [];
      if (seriesId !== 'pcdd' && seriesId !== 'lhc') {
        for (const k of this.gameId) {
          for (const i of k) {
            if (!prize) return;
            if (
                    i === 20 ||
                    i === 17 ||
                    i === 71 ||
                    seriesId === 'sd' ||
                    seriesId === 'ssl' ||
                    seriesId === 'p3p5'
            ) {
              diff = 30;
            } else if (seriesId === 'lotto') {
              diff = 20;
            }
            // 单个奖金时
            if (!Array.isArray(prize.count)) {
              count =
                      (((1 * 2) / (prize.count / prize.total)) *
                              (this.countPrize - diff)) /
                      2000 +
                      0.00000001;
              this.typeGroup = 'auto';
              return this.Utils.toFixed(String(count));
            }
      
            // 奖金为多个奖级时  数组
            else {
              for (const j of Object.keys(prize.count)) {
                let json = {};
          
                count =
                        (((1 * 2) / (prize.count[j] / prize.total)) *
                                (this.countPrize - diff)) /
                        2000 +
                        0.00000001;
          
                json.value = this.Utils.toFixed(String(count));
                if (this.currentMethodGroup === 'LH') {
                  if (+j === 0) {
                    json.label = '和 ';
                  } else if (+j === 1) {
                    json.label = '龙虎 ';
                  }
                } else {
                  json.label = +j + 1 + ' 等奖 ';
                }
                json.prize = count;
                arr.push(json);
              }
              return arr;
            }
          }
        }
      }

      else  if (seriesId === 'pcdd') {
        for (let k of Object.keys(prize)) {
          let jsonc = {};
          jsonc.label = k;
          let odds = +prize[k].prize / 1800;
          jsonc.value = this.Utils.toFixed(odds * this.countPrize, 2);

          arr.push(jsonc);
        }
        
        return arr;
      }
      
      else  if (seriesId === 'lhc') {
        if (prize.prize) {
          let jsonc = {};
          jsonc.label = '-';
          let odds = +prize.prize / 1800;
          jsonc.value = this.Utils.toFixed(odds * this.countPrize, 2);
          
          return jsonc.value;
          
        } else {
          for (let k of Object.keys(prize)) {
            let jsonc = {};
            switch (k) {
              case 'RB':
                jsonc.label = '红波';
                break;
              case 'RS':
                jsonc.label = '红小';
                break;
              case 'RO':
                jsonc.label = '红单';
                break;
              case 'RE':
                jsonc.label = '红双';
                break;
              case 'RAO':
                jsonc.label = '红合单';
                break;
              case 'RAE':
                jsonc.label = '红合双';
                break;
              case 'GB':
                jsonc.label = '绿大';
                break;
              case 'GS':
                jsonc.label = '绿小';
                break;
              case 'GO':
                jsonc.label = '绿单';
                break;
              case 'GE':
                jsonc.label = '绿双';
                break;
              case 'GAO':
                jsonc.label = '绿合单';
                break;
              case 'GAE':
                jsonc.label = '绿合双';
                break;
              case 'BB':
                jsonc.label = '蓝大';
                break;
              case 'BS':
                jsonc.label = '蓝小';
                break;
              case 'BO':
                jsonc.label = '蓝单';
                break;
              case 'BE':
                jsonc.label = '蓝双';
                break;
              case 'BAO':
                jsonc.label = '蓝合单';
                break;
              case 'BAE':
                jsonc.label = '蓝合双';
                break;
              case 'b':
                jsonc.label = '大';
                break;
              case 's':
                jsonc.label = '小';
                break;
              case 'o':
                jsonc.label = '单';
                break;
              case 'e':
                jsonc.label = '双';
                break;
              case 'bo':
                jsonc.label = '大单';
                break;
              case 'so':
                jsonc.label = '大双';
                break;
              case 'be':
                jsonc.label = '小单';
                break;
              case 'se':
                jsonc.label = '小双';
                break;
              case 'main':
                jsonc.label = '生肖年';
                break;
              case 'other':
                jsonc.label = '非生肖年';
                break;
              default:
                jsonc.label = k;
                break;
            }
  
            let odds = +prize[k].prize / 1800;
            jsonc.value = this.Utils.toFixed(odds * this.countPrize, 2);
  
            arr.push(jsonc);
          }
  
          return arr;
        }
      }

    },
    handleTabClick() {
      this.activeName = this.activeName;
      this.countPrize = this.prizes.max;
      this.initData();
      this.getSpanArr(this.list);
    },
    sliderChange() {
      this.initData();
    },
    // 计算合并列数
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].name === data[i - 1].name) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 合并第一列
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/var.scss";
.bet-record {
  .container {
    padding: 0 35px 35px;
  }
  /deep/ {
    .el-input--mini .el-input__inner {
      height: 28px;
    }
    .el-slider {
      position: relative;
      z-index: 0;
      margin: 0 20px;
      display: inline-block;
      vertical-align: middle;
      width: 250px;
    }

    .el-slider__bar {
      background-color: $ball-color;
    }
    .el-slider__button {
      border-color: $ball-color;
    }
  }
  .slider {
    text-align: center;
    margin: 15px 0 15px;
  }
  .list-table {
    padding: 30px;
  }
}
</style>
