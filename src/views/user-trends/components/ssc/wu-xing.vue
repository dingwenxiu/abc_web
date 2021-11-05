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
          <th rowspan="2" colspan="3" class="border-bottom border-right title-issue">期号</th>
          <th rowspan="2" colspan="3" class="border-right">开奖号码</th>
          <th colspan="12" class="border-right border-bottom">万位</th>
          <th colspan="12" class="border-right border-bottom">千位</th>
          <th colspan="12" class="border-right border-bottom">百位</th>
          <th colspan="12" class="border-right border-bottom">十位</th>
          <th colspan="12" class="border-right border-bottom">个位</th>
          <th colspan="12" class="border-bottom">号码分布</th>
        </tr>
        <tr class="title-number">
          <th class="ball-none border-bottom-header"></th>
          <th class="border-bottom-header"></th>
          <template v-for="item in 6">
            <th class="ball-none border-bottom-header border-right td-bg" :key="`${item}-l`"></th>
            <th class="ball-none border-bottom-header td-bg" :key="`${item}-r`"></th>
            <th class="border-bottom-header td-bg" v-for="num in 10" :key="`${item}-${num}`">
              <i class="ball-noraml">{{num - 1}}</i>
            </th>
          </template>
          <th class="ball-none border-bottom-header td-bg"></th>
        </tr>
      </thead>
      <tbody ref="chart-content" class="chart" :class="{'table-guides':showGuides}">
        <tr
          v-for="(item, index) in data"
          :key="item[0]"
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
          <td class="ball-none border-right"></td>
          <td class="ball-none"></td>
          <!-- 万位 千位 百位 个位 -->
          <template v-for="(num, index) in item.slice(2, 7)">
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
            <td class="ball-none border-right" :key="`${item[0]}${index}border-right`"></td>
            <td class="ball-none" :key="`${item[0]}${index}ball-none`"></td>
          </template>
          <!-- 号码分布 -->
          <td v-for="(ball, index1) in item[7]" :key="`${item[0]}${index1}`">
            <i class="ball-noraml" :class="`f-${ball[2]}`">{{ball[0] == 0 ? ball[1] : ball[0]}}</i>
          </td>
          <td class="ball-none"></td>
        </tr>
      </tbody>
      <tbody class="tbody ball-content">
        <tr class="auxiliary-area">
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom border-top">出现总次数</td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom"></td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <template v-for="(items, index) in totalNum">
            <td class="border-bottom" v-for="(item, index1) in items" :key="`${index}-${index1}`">
              <i class="ball-noraml">{{item}}</i>
            </td>
            <td class="ball-none border-right border-bottom" :key="`${index}-ball`"></td>
            <td class="ball-none border-bottom" :key="`${index}-ball-bottom`"></td>
          </template>
        </tr>
        <tr class="auxiliary-area">
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom">平均遗漏值</td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom"></td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <template v-for="(items, index) in omissionNum">
            <td class="border-bottom" v-for="(item, index1) in items" :key="`${index}-${index1}`">
              <i class="ball-noraml">{{item}}</i>
            </td>
            <td class="ball-none border-right border-bottom" :key="`${index}-ball`"></td>
            <td class="ball-none border-bottom" :key="`${index}-ball-bottom`"></td>
          </template>
        </tr>
        <tr class="auxiliary-area">
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom">最大遗漏值</td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom"></td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <template v-for="(items, index) in omissionMaxNum">
            <td class="border-bottom" v-for="(item, index1) in items" :key="`${index}-${index1}`">
              <i class="ball-noraml">{{item}}</i>
            </td>
            <td class="ball-none border-right border-bottom" :key="`${index}-ball`"></td>
            <td class="ball-none border-bottom" :key="`${index}-ball-bottom`"></td>
          </template>
        </tr>
        <tr class="auxiliary-area">
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom">最大连出值</td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <td class="border-bottom"></td>
          <td class="ball-none border-right border-bottom"></td>
          <td class="ball-none border-bottom"></td>
          <template v-for="(items, index) in continuousNum">
            <td class="border-bottom" v-for="(item, index1) in items" :key="`${index}-${index1}`">
              <i class="ball-noraml">{{item}}</i>
            </td>
            <td class="ball-none border-right border-bottom" :key="`${index}-ball`"></td>
            <td class="ball-none border-bottom" :key="`${index}-ball-bottom`"></td>
          </template>
        </tr>
      </tbody>
      <tbody class="tbody tbody-footer-header">
        <tr class="auxiliary-area title-number">
          <td rowspan="2" colspan="3" class="border-right border-bottom">期号</td>
          <td rowspan="2" colspan="3" class="border-right border-bottom">开奖号码</td>
         <template v-for="items in 6">
            <td :key="`${items}-border-top`" class="ball-none border-bottom td-bg"></td>
            <td v-for="item in 10" :key="`${items}-${item}`" class="border-bottom td-bg">
              <i class="ball-noraml">{{item-1}}</i>
            </td>
            <td :key="`${items}-border-bottom`" class="ball-none border-right border-bottom td-bg"></td>
         </template>
        </tr>
        <tr class="auxiliary-area title-text">
          <td colspan="12" class="border-right border-bottom">万位</td>
          <td colspan="12" class="border-right border-bottom">千位</td>
          <td colspan="12" class="border-right border-bottom">百位</td>
          <td colspan="12" class="border-right border-bottom">十位</td>
          <td colspan="12" class="border-right border-bottom">个位</td>
          <td colspan="12" class="border-bottom">号码分布</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mathNum } from '@/utils'

export default {
  data() {
    return {
      // 开奖值
      data: [],
      // 出现总次数
      totalNum:[],
      // 平均遗漏值
      omissionNum: [],
      // 最大遗漏值	
      omissionMaxNum: [],
      // 最大连出值
      continuousNum: [],
      showTemperature: false,
      showLostPost: false,
      showTrend: true,
      showGuides: true,
      showLost: true
    }
  },
  props: ['list'],
  watch: {
    list: {
      handler(newVal) {
        if (newVal.data.length) this.handleDrawing(newVal)
      },
      deep: true
    }
  },
  mounted() {
    if (this.list.data.length) this.handleDrawing(this.list)
  },
  methods: {
    handleDrawing(list) {
      const sumData = list.statistics 
      this.totalNum = this._.chunk(sumData[0],10) 
      this.omissionNum = this._.chunk(sumData[1],10) 
      this.omissionMaxNum = this._.chunk(sumData[2],10) 
      this.continuousNum = this._.chunk(sumData[3],10)
      this.data = this.reBuildData(list).data
      let positionCount = 0,
        currentBallLeft = 0,
        currentBallTop = 0,
        chartTrendPosition = [],
        parentDom = this.$refs['chart-content']
      this.$nextTick(() => {
        for (let i = 0, current; i < this.data.length; i++) {
          current = this.data[i]
          for (let k = 0; k < current.length; k++) {
            if (k > 1 && k < 7) {
              for (let j = 0; j < current[k].length; j++) {
                if (j == 0) {
                  var currentDom = parentDom.getElementsByTagName('i')[
                      positionCount
                    ].parentNode,
                    left = parseInt(currentDom.offsetLeft),
                    top = parseInt(currentDom.offsetTop),
                    width = currentDom.offsetWidth,
                    height = currentDom.offsetHeight
                }
                //当前位置球
                positionCount++
                //当前号码
                if (current[k][j][0] == 0) {
                  //第一排渲染
                  if (typeof chartTrendPosition[k] == 'undefined') {
                    // 当前球的坐标
                    currentBallLeft = left + (j + 1) * width - width / 2
                    currentBallTop = top + height / 2
                    chartTrendPosition[k] = {}
                    chartTrendPosition[k]['top'] = currentBallTop
                    chartTrendPosition[k]['left'] = currentBallLeft
                  } else {
                    //当前球的坐标
                    currentBallLeft = left + (j + 1) * width - width / 2
                    currentBallTop = chartTrendPosition[k]['top'] + height
                    //绘制画布
                    //绘制走势图线
                    this.handleLine(
                      chartTrendPosition[k]['top'],
                      chartTrendPosition[k]['left'],
                      currentBallTop,
                      currentBallLeft
                    )
                    chartTrendPosition[k]['top'] = currentBallTop
                    chartTrendPosition[k]['left'] = currentBallLeft
                  }
                }
              }
            }
          }
          positionCount = 0
        }
      })
    },
    reBuildData(data) {
      var arrMain = [],
          newArr = [],
          timesData = data['statistics'][0],
          ballData = data['data'],
          loseBar = data['omissionBarStatus'],
          loseFlag = new Array(50),
          i2 = 0,
          i3 = 0
      const tem1 = [0, 1, 2, 3, 4]
      const tem2 = [0,1,2,3,4,5,6,7,8,9]
      tem1.forEach(i => {
        arrMain[i] = []
        tem2.forEach(j => {
          arrMain[i][j] = [timesData[i*10+j], j]
        })
        arrMain[i].sort(function(a, b){
            return b[0] - a[0]
        })
        arrMain[i].forEach((v, k) => {
          //cold 1
          //hot 3
          //other 2
          if(k < 3){
              newArr[i*10+arrMain[i][k][1]] = 3
          }else if(k > 6){
              newArr[i*10+arrMain[i][k][1]] = 1
          }else{
              newArr[i*10+arrMain[i][k][1]] = 2
          }
        })
      })

      ballData.forEach((v, i) => {
        i2 = 0
        v.forEach(j => {
          i3 = 0
          if(i2 > 1 && i2 < 7){
            j.forEach(m => {
              if (m[0] == 0) {
                m[2] = newArr[(i2 - 2)*10 + i3]
              }
              //loseBar
              if(loseBar[(i2 - 2)*10 + i3] < 0){
                loseFlag[(i2 - 2)*10 + i3] = true
              }
              if(loseFlag[(i2 - 2)*10 + i3]){
                  m[3] = 1
              }else{
                  m[3] = 0
              }
              if(loseBar[(i2 - 2)*10 + i3] == i){
                  loseFlag[(i2 - 2)*10 + i3] = true
              }
              i3++
            })
          }
          i2++
        })
      })
      return data
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
        left = Ly
      setTimeout(() => {
        maxNum = Math.max.apply(Math, [left, lastLeft])
        minNum = Math.min.apply(Math, [left, lastLeft])
        if (maxNum == minNum) {
          width = 2
        } else {
          width = maxNum - minNum
        }

        height = top - lastTop

        canvas = document.createElement('canvas')
        canvas.style.position = 'absolute'
        canvas.style.left = minNum + 'px'
        canvas.style.top = lastTop + 'px'

        if (lastLeft == left) {
          canvas.style.left = minNum - width / 2 + 'px'
        }

        canvas.setAttribute('width', width)
        canvas.setAttribute('height', height)
        this.$refs['chart-area'].appendChild(canvas)

        const ctx = canvas.getContext('2d')
        //开始一个新的绘制路径
        ctx.beginPath()

        if (lastLeft > left) {
          saveNum = mathNum(width, 0, 0, height, 7.5)
        } else {
          saveNum = mathNum(0, 0, width, height, 7.5)
        }

        //定义直线的起点坐标为(10,10)
        ctx.moveTo(saveNum[0], saveNum[1])
        //定义直线的终点坐标为(50,10)
        ctx.lineTo(saveNum[2], saveNum[3])
        //线的
        ctx.lineWidth = 2
        //线条颜色
        ctx.strokeStyle = 'red'
        //沿着坐标点顺序的路径绘制直线
        ctx.stroke()
        //关闭当前的绘制路径
        ctx.closePath()
      }, 25)
    },
    handleSelectOption(optionList) {
      this.showTemperature = optionList.some(val => val === 'temperature')
      this.showLostPost = optionList.some(val => val === 'lostPost')
      this.showTrend = optionList.some(val => val === 'trend')
      this.showGuides = optionList.some(val => val === 'guides')
      this.showLost = optionList.some(val => val === 'lost')
    }
  }
}
</script>


