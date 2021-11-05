<template>
  <div
    class="chart-section chart-container-main"
    :class="{'table-trend':showTrend}"
    ref="chart-area"
  >
    <table
      class="chart-table"
      :class="{
        'table-temperature':showTemperature, 
        'table-lost-post':showLostPost,
        'table-lost':showLost
        }"
    >
      <thead class="thead">
        <tr class="title-text">
          <th rowspan="2" colspan="3" class="border-bottom border-right title-issue">
            期号
            <span val="0" class="issue-order"></span>
          </th>
          <th rowspan="2" colspan="3" class="border-right">开奖号码</th>
          <th colspan="12" class="border-right">万位</th>
          <th colspan="12" class="border-right">千位</th>
          <th colspan="12" class="border-right">号码分布</th>
          <th colspan="12" class="border-right">跨度走势</th>
          <th rowspan="2" class="border-bottom border-right td-bg">对子(二同号)</th>
          <th rowspan="2" class="border-bottom">和值</th>
        </tr>
        <tr class="title-number">
          <th class="ball-none border-bottom-header"></th>
          <th class="border-bottom-header"></th>
          <th class="ball-none border-bottom-header border-right"></th>
          <th class="ball-none border-bottom-header td-bg"></th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">0</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">1</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">2</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">3</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">4</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">5</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">6</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">7</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">8</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">9</i>
          </th>
          <th class="ball-none border-bottom-header border-right td-bg"></th>
          <th class="ball-none border-bottom-header td-bg"></th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">0</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">1</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">2</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">3</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">4</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">5</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">6</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">7</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">8</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">9</i>
          </th>
          <th class="ball-none border-bottom-header border-right td-bg"></th>
          <th class="ball-none border-bottom-header td-bg"></th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">0</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">1</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">2</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">3</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">4</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">5</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">6</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">7</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">8</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">9</i>
          </th>
          <th class="ball-none border-bottom-header border-right td-bg"></th>
          <th class="ball-none border-bottom-header td-bg"></th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">0</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">1</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">2</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">3</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">4</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">5</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">6</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">7</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">8</i>
          </th>
          <th class="border-bottom-header td-bg">
            <i class="ball-noraml">9</i>
          </th>
          <th class="ball-none border-bottom-header td-bg"></th>
        </tr>
      </thead>
      <tbody ref="chart-content" class="chart" :class="{'table-guides':showGuides}">
        <tr
          v-for="(item, index) in data"
          :key="index"
          :class="{'border-bottom': (index+1)%5 === 0}"
        >
          <!-- 期号 开奖号码 -->
          <td class="ball-none"></td>
          <td class="issue-numbers">{{item[0]}}</td>
          <td class="ball-none border-right"></td>
          <td class="ball-none"></td>
          <td class>
            <span class="lottery-numbers">{{item[1]}}</span>
          </td>
          <!-- 万位 千位 -->
          <template v-for="(num, index) in item.slice(2, 4)">
            <td class="ball-none border-right" :key="`${item[0]}${index}border-right`"></td>
            <td class="ball-none" :key="`${item[0]}${index}ball-none`"></td>
            <td
              v-for="(items, index0) in num"
              :class="`l-${items[3]}`"
              :key="`${item[0]}${index}${index0}`"
            >
              <i
                class="ball-noraml"
                :class="`c-${items[0]}-${items[2]}`"
              >{{items[0] == 0 ? items[1] : items[0]}}</i>
            </td>
          </template>
          <td class="ball-none border-right"></td>
          <td class="ball-none"></td>
          <!-- 号码分布 -->
          <td v-for="(ball, index1) in item[5]" :key="`${item[1]}${index1}`">
            <i class="ball-noraml" :class="`f-${ball[2]}`">{{ball[0] == 0 ? ball[1] : ball[0]}}</i>
          </td>
          <td class="ball-none border-right"></td>
          <td class="ball-none"></td>
          <!-- 跨度走势 -->
          <template v-for="num in 10">
            <template v-if="item[6][num-1][0] == 0">
              <td class="bg-blue" :key="`${item[1]}${num}-ll`">
                <i class="ball-noraml">{{item[6][num-1][1]}}</i>
              </td>
            </template>
            <template v-else>
              <td class :key="`${item[1]}${num}-ll`">
                <i class="ball-noraml">{{item[6][num-1][0]}}</i>
              </td>
            </template>
          </template>
          <td class="ball-none border-right"></td>
          <!-- 对子 -->
          <td class="border-right">
            <template v-if="item[4] == 0">
              <span class="group-current"></span>
            </template>
            <template v-else>{{item[4]}}</template>
          </td>
          <td>{{item[7]}}</td>
        </tr>
      </tbody>
      <tbody ref="ball-content" class="tbody ball-content">
        <!-- 出现总次数 -->
        <tr class="auxiliary-area">
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom border-top">出现总次数</td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom"></td>
          <!-- 万位	千位 -->
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}`">
            <i class="ball-noraml">{{totalNum[index]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-0`">
            <i class="ball-noraml">{{totalNum[index+10]}}</i>
          </td>
          <td class="border-right border-bottom"></td>
          <td class="border-bottom"></td>
          <!-- 号码分布	跨度 -->
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-1`">
            <i class="ball-noraml">{{totalNum[index+21]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-2`">
            <i class="ball-noraml">{{totalNum[index+31]}}</i>
          </td>
          <!-- 对子(二同号) -->
          <td class="border-right border-bottom"></td>
          <td class="border-bottom border-right">
            <i class="ball-noraml">{{totalNum[20]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
        </tr>
        <!-- 平均遗漏值 -->
        <tr class="auxiliary-area">
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom">平均遗漏值</td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom"></td>
          <!-- 万位	千位 -->
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}`">
            <i class="ball-noraml">{{omissionNum[index]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-0`">
            <i class="ball-noraml">{{omissionNum[index+10]}}</i>
          </td>
          <td class="border-right border-bottom"></td>
          <td class="border-bottom"></td>
          <!-- 号码分布	跨度 -->
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-1`">
            <i class="ball-noraml">{{omissionNum[index+21]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-2`">
            <i class="ball-noraml">{{omissionNum[index+31]}}</i>
          </td>
          <!-- 对子(二同号) -->
          <td class="border-right border-bottom"></td>
          <td class="border-bottom border-right">
            <i class="ball-noraml">{{omissionNum[20]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
        </tr>
        <!-- 最大遗漏值 -->
        <tr class="auxiliary-area">
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom">最大遗漏值</td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom"></td>
          <!-- 万位	千位 -->
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}`">
            <i class="ball-noraml">{{omissionMaxNum[index]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-0`">
            <i class="ball-noraml">{{omissionMaxNum[index+10]}}</i>
          </td>
          <td class="border-right border-bottom"></td>

          <td class="border-bottom"></td>
          <!-- 号码分布	跨度 -->
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-1`">
            <i class="ball-noraml">{{omissionMaxNum[index+21]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-2`">
            <i class="ball-noraml">{{omissionMaxNum[index+31]}}</i>
          </td>
          <!-- 对子(二同号) -->
          <td class="border-right border-bottom"></td>
          <td class="border-bottom border-right">
            <i class="ball-noraml">{{omissionMaxNum[20]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
        </tr>
        <!-- 最大连出值 -->
        <tr class="auxiliary-area">
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom">最大连出值</td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom"></td>
          <!-- 万位	千位 -->
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}`">
            <i class="ball-noraml">{{continuousNum[index]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-0`">
            <i class="ball-noraml">{{continuousNum[index+10]}}</i>
          </td>
          <!-- 对子(二同号) -->
          <td class="border-right border-bottom"></td>
          <td class="border-bottom"></td>
          <!-- 号码分布	跨度 -->
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-1`">
            <i class="ball-noraml">{{continuousNum[index+21]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom" v-for="(item, index) in 10" :key="`${item}-${index}-2`">
            <i class="ball-noraml">{{continuousNum[index+31]}}</i>
          </td>
          <!-- 对子(二同号) -->
          <td class="border-right border-bottom"></td>
          <td class="border-bottom border-right">
            <i class="ball-noraml">{{continuousNum[20]}}</i>
          </td>
          <td class="ball-none border-right border-bottom"></td>
        </tr>
      </tbody>
      <tbody class="tbody tbody-footer-header">
        <tr class="auxiliary-area title-number">
          <td rowspan="2" colspan="3" class="border-right border-bottom">期号</td>
          <td rowspan="2" colspan="3" class="border-right border-bottom">开奖号码</td>
          <td class="ball-none border-bottom td-bg"></td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">0</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">1</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">2</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">3</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">4</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">5</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">6</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">7</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">8</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">9</i>
          </td>
          <td class="ball-none border-right border-bottom td-bg"></td>
          <td class="ball-none border-bottom td-bg"></td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">0</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">1</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">2</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">3</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">4</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">5</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">6</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">7</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">8</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">9</i>
          </td>

          <td class="border-right border-bottom td-bg"></td>
          <td class="ball-none border-bottom td-bg"></td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">0</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">1</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">2</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">3</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">4</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">5</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">6</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">7</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">8</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">9</i>
          </td>
          <td class="ball-none border-right border-bottom td-bg"></td>
          <td class="ball-none border-bottom td-bg"></td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">0</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">1</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">2</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">3</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">4</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">5</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">6</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">7</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">8</i>
          </td>
          <td class="border-bottom td-bg">
            <i class="ball-noraml">9</i>
          </td>
          <td class="ball-none border-right border-bottom td-bg"></td>
          <td class="ball-none border-right border-bottom td-bg"></td>
          <td class="border-bottom" rowspan="2">和值</td>
        </tr>
        <tr class="auxiliary-area title-text">
          <td colspan="12" class="border-right border-bottom">万位</td>
          <td colspan="12" class="border-right border-bottom">千位</td>
          <td colspan="12" class="border-right border-bottom">号码分布</td>
          <td colspan="12" class="border-right border-bottom">跨度</td>
          <td class="border-right border-bottom">对子(二同号)</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mathNum } from '@/utils'; // eslint-disable-next-line
import { isPair } from "../../../../utils/trend";
export default {
  data() {
    return {
      // 开将值
      data: [],
      // 出现总次数
      totalNum: [],
      // 平均遗漏值
      omissionNum: [],
      // 最大遗漏值
      omissionMaxNum: [],
      // 最大连出值
      continuousNum: [],
      // 全局计算
      showTemperature: false,
      showLostPost: false,
      showTrend: true,
      showGuides: true,
      showLost: true
    };
  },

  props: ['list'],
  watch: {
    list: {
      handler(newVal) {
        if (newVal.data.length) this.handleDrawing(newVal);
      },
      deep: true
    }
  },
  mounted() {
    if (this.list.data.length) this.handleDrawing(this.list);
  },
  methods: {
    handleDrawing(list) {
      const sumData = list.statistics;
      this.totalNum = sumData[0];
      this.omissionNum = sumData[1];
      this.omissionMaxNum = sumData[2];
      this.continuousNum = sumData[3];
      this.data = this.reBuildData(list).data;
      let positionCount = 0,
        currentBallLeft = 0,
        currentBallTop = 0,
        chartTrendPosition = [],
        parentDom = this.$refs['chart-content'];
      this.$nextTick(() => {
        for (let i = 0, current; i < this.data.length; i++) {
          current = this.data[i];
          for (let k = 0; k < current.length; k++) {
            if (k > 1 && k < 5) {
              for (let j = 0; j < current[k].length; j++) {
                if (j == 0) {
                  var currentDom = parentDom.getElementsByTagName('i')[
                      positionCount
                    ].parentNode,
                    left = parseInt(currentDom.offsetLeft),
                    top = parseInt(currentDom.offsetTop),
                    width = currentDom.offsetWidth,
                    height = currentDom.offsetHeight;
                }
                //当前位置球
                positionCount++;
                //当前号码
                if (current[k][j][0] == 0) {
                  //第一排渲染
                  if (typeof chartTrendPosition[k] == 'undefined') {
                    // 当前球的坐标
                    currentBallLeft = left + (j + 1) * width - width / 2;
                    currentBallTop = top + height / 2;
                    chartTrendPosition[k] = {};
                    chartTrendPosition[k]['top'] = currentBallTop;
                    chartTrendPosition[k]['left'] = currentBallLeft;
                  } else {
                    //当前球的坐标
                    currentBallLeft = left + (j + 1) * width - width / 2;
                    currentBallTop = chartTrendPosition[k]['top'] + height;
                    //绘制画布
                    //绘制走势图线
                    this.handleLine(
                      chartTrendPosition[k]['top'],
                      chartTrendPosition[k]['left'],
                      currentBallTop,
                      currentBallLeft
                    );
                    chartTrendPosition[k]['top'] = currentBallTop;
                    chartTrendPosition[k]['left'] = currentBallLeft;
                  }
                }
              }
            }
          }
          positionCount = 0;
        }
      });
    },
    reBuildData(data) {
      var arrMain = [],
        newArr = [],
        timesData = data['statistics'][0],
        ballData = data['data'],
        loseBar = data['omissionBarStatus'],
        loseFlag = new Array(40),
        i2 = 0,
        i3 = 0;
      const tem1 = [0, 1, 2];
      const tem2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      tem1.forEach(i => {
        arrMain[i] = [];
        tem2.forEach(j => {
          arrMain[i][j] = [timesData[i * 10 + j], j];
        });
        arrMain[i].sort(function(a, b) {
          return b[0] - a[0];
        });
        arrMain[i].forEach((v, k) => {
          //cold 1
          //hot 3
          //other 2
          if (k < 3) {
            newArr[i * 10 + arrMain[i][k][1]] = 3;
          } else if (k > 6) {
            newArr[i * 10 + arrMain[i][k][1]] = 1;
          } else {
            newArr[i * 10 + arrMain[i][k][1]] = 2;
          }
        });
      });

      ballData.forEach((v, i) => {
        i2 = 0;
        v.forEach(j => {
          i3 = 0;
          if (i2 > 1 && i2 < 4) {
            j.forEach(m => {
              if (m[0] == 0) {
                m[2] = newArr[(i2 - 2) * 10 + i3];
              }
              //loseBar
              if (loseBar[(i2 - 2) * 10 + i3] < 0) {
                loseFlag[(i2 - 2) * 10 + i3] = true;
              }
              if (!loseFlag[(i2 - 2) * 10 + i3]) {
                m[3] = 0;
              } else {
                m[3] = 1;
              }
              if (loseBar[(i2 - 2) * 10 + i3] == i) {
                loseFlag[(i2 - 2) * 10 + i3] = true;
              }
              i3++;
            });
          }
          i2++;
        });
      });
      return data;
    },
    handleLine(Mx, My, Lx, Ly) {
      let canvas = null,
        width = 0,
        height = 0,
        maxNum = 0,
        minNum = 0,
        saveNum = [],
        lastTop = Mx,
        lastLeft = My,
        top = Lx,
        left = Ly;
      setTimeout(() => {
        maxNum = Math.max.apply(Math, [left, lastLeft]);
        minNum = Math.min.apply(Math, [left, lastLeft]);
        if (maxNum == minNum) {
          width = 2;
        } else {
          width = maxNum - minNum;
        }

        height = top - lastTop;

        canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.left = minNum + 'px';
        canvas.style.top = lastTop + 'px';

        if (lastLeft == left) {
          canvas.style.left = minNum - width / 2 + 'px';
        }

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        this.$refs['chart-area'].appendChild(canvas);

        const ctx = canvas.getContext('2d');
        //开始一个新的绘制路径
        ctx.beginPath();

        if (lastLeft > left) {
          saveNum = mathNum(width, 0, 0, height, 7.5);
        } else {
          saveNum = mathNum(0, 0, width, height, 7.5);
        }

        //定义直线的起点坐标为(10,10)
        ctx.moveTo(saveNum[0], saveNum[1]);
        //定义直线的终点坐标为(50,10)
        ctx.lineTo(saveNum[2], saveNum[3]);
        //线的
        ctx.lineWidth = 2;
        //线条颜色
        ctx.strokeStyle = 'red';
        //沿着坐标点顺序的路径绘制直线
        ctx.stroke();
        //关闭当前的绘制路径
        ctx.closePath();
      }, 25);
    },
    handleSelectOption(optionList) {
      this.showTemperature = optionList.some(val => val === 'temperature');
      this.showLostPost = optionList.some(val => val === 'lostPost');
      this.showTrend = optionList.some(val => val === 'trend');
      this.showGuides = optionList.some(val => val === 'guides');
      this.showLost = optionList.some(val => val === 'lost');
    }
  }
};
</script>
