import { API } from '@/api'
import { Promise } from 'q'

const state = {
  // 用户配置
  userConfig: {
    singlePrice: 1,
    mode: 1.0
  },
  // 当前彩种
  currentLotterySign: 'cqssc',
  // 模式配置
  modeConfig: {
    '1.000': '元',
    '0.100': '角',
    '0.010': '分',
    '0.001': '厘'
  },
  // 玩法相关
  defaultGroup: '',
  defaultMethod: '',
  allMethods: {},
  lotteryList: {},
  // 主界面头部
  currentLottery: {},
  // 当前奖期
  currentIssue: {},
  // 当前玩法
  currentMethod: {},
  // 当前玩法系列
  currentMethodGroup: '',
  beforeIssue: {},
  nextIssue: {},
  // 计算属性
  currentOrderState: {},
  totalCost: {},
  orderList: [],
  // 投注相关的
  bet: {
    // 游戏id
    gameIds: null,
    // 翻倍计算，初始化值
    doubleBeforeOrder: [],
    // 我的投注 我的追号
    betHistory: {
      myBetList: [],
      myChaseList: []
    },
    issueHistory: [],
    // 开奖区域 下方提示语
    issueDesc: '',
    // 玩法切换时
    methodsTab: 0,
    // 娱乐城的投注信息
    ylcBetData: [],
    // 当前订单

    currentOrder: {
      cost: 0,
      count: 0
    },

  },
  // 全部彩种
  lotteryAll: {},

  // 可用奖期
  issueInfo: [],

  // 切换 官方和娱乐城 玩法
  changeYlcPlays: {
    name: 'official',
    index: 0
  },
  // 拖动后的奖金组
  countPrize: 0,

  lotteryLists: [],
  // 六合彩号码
  lhcNumber: {
    // 红球
    redBall: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
    // 红合单
    hhd: [1, 7, 12, 18, 23, 29, 30, 34, 45],
    // 红合双
    hhs: [2, 8, 13, 19, 24, 35, 40, 46],
    // 蓝球
    blueBall: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
    // 蓝合单
    lhd: [3, 9, 10, 14, 25, 36, 41, 47],
    // 蓝合双
    lhs: [4, 15, 20, 26, 31, 37, 42, 48],
    // 绿球
    greenBall: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49],
    // 绿合单
    ghd: [5, 16, 21, 27, 32, 38, 43],
    // 绿合双
    ghs: [6, 11, 17, 22, 28, 33, 39, 44],
    // 生肖
    chineseZodiac: [
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
    ]
  },
  // 计算生肖
  chineseZodiac: [],

  //pc蛋蛋 信用玩法
  pcdd: {
    allCodeList: []
  },

  // pc蛋蛋 信用玩法
  currentOrders: {
    money: 0,
    betMoney: 0
  }
};

const mutations = {
  // 用户配置
  SET_USER_CONFIG(state, userConfig) {
    state.userConfig = userConfig
  },
  // 拖动后的奖金组
  SET_COUNT_PRIZE(state, data) {
    state.countPrize = data
  },
  // 注单列表
  SET_ORDER_LIST(state, orderList) {
    state.orderList = orderList
  },
  // 游戏列表
  initLotteryList(state, lotteryList) {
    state.lotteryList = lotteryList
  },
  // 当前游戏
  SET_CURRENT_LOTTERY(state, lottery) {
    if (lottery['valid_price'][2]) {
      state.userConfig.singlePrice = 2
    } else {
      state.userConfig.singlePrice = 1
    }
    state.currentLottery = lottery
  },
  // 下一奖期
  nextIssue(state, issue) {
    state.nextIssue = issue
  },
  // 上一奖期
  beforeIssue(state, issue) {
    state.beforeIssue = issue
  },
  // 当前玩法
  SET_CURRENT_METHOD(state, method) {
    state.currentMethod = method
  },
  // 当前玩法系列
  currentMethodGroup(state, data) {
    state.currentMethodGroup = data
  },
  // 当前选中订单数据
  currentOrderState(state, order) {
    state.currentOrderState = order
  },
  // 总花费
  totalCost(state, cost) {
    state.totalCost = cost
  },

  // 当前彩种所有玩法
  SET_ALL_METHODS(state, allMethods) {
    state.allMethods = allMethods
  },

  // 当前彩种所有玩法
  SET_DEFAULT_GROUP(state, defaultGroup) {
    state.defaultGroup = defaultGroup
  },

  // 当前彩种所有玩法
  SET_DEFAULT_METHOD(state, defaultMethod) {
    state.defaultMethod = defaultMethod
  },
  // 当前彩种
  currentLotterySign(state, sign) {
    state.currentLotterySign = sign
  },
  // 全部彩种
  lotteryAll(state, data) {
    state.lotteryAll = data
  },
  // 当前奖期信息
  currentIssue(state, data) {
    state.currentIssue = data
  },
  // 所有彩种期数
  issueInfo(state, data) {
    state.issueInfo = data
  },
  // 我的投注 和 我的追号
  betHistory(state, data) {
    state.bet.betHistory.myBetList = data.project
    state.bet.betHistory.myChaseList = data.trace
  },
  // 历史开奖记录
  SET_ISSUE_HISTORY(state, data) {
    state.bet.issueHistory = data
  },
  // 投注页面 奖期
  issueDesc(state, data) {
    state.bet.issueDesc = data
  },
  // 玩法切换时
  SET_METHODS_TAB(state) {
    state.bet.methodsTab += 1
  },

  // 切换 官方和娱乐城 玩法
  SET_CHANGE_YLCPLAYS(state, data) {
    state.changeYlcPlays = data
  },

  SET_LOTTERY_LISTS(state, data) {
    state.lotteryLists = data.data
  },
  // 计算后的生肖
  chineseZodiac(state, data) {
    state.chineseZodiac = data
  }
}

const actions = {
  // 全部彩种
  lotteryAll({ commit }) {
    API.getLotteryInfo().then(res => {
      if (res.success) {
        commit('lotteryAll', res.data)
      }
    })
  },
  // 我的投注 和 我的追号
  betHistory({ commit }) {
    const bet = {}
    const betHistory = API.getBetHistory().then(
      ({ success, data }) => {
        if (success) {
          bet.project = data.data
        }
      }
    )
    const traceHistory = API.getTracesHistory().then(({ success, data }) => {
      if (success) {
        bet.trace = data.data
      }
    })
    Promise.all([betHistory, traceHistory]).then(() => {
      commit('betHistory', bet)
    })
  },
  // 历史开奖记录
  issueHistory({ commit, state }) {
    let sendData = {
      lottery_sign: state.currentLottery.en_name,
      count: state.currentLottery.series_id === 'pk10' || state.currentLottery.series_id === 'klsf' ? 6 : 10
    }
    API.getIssueHistory(sendData).then(data => {
      if (data.success) {
        commit('SET_ISSUE_HISTORY', data.data)
      }
    })
  }
  //投注
  // actionBet({commit, state}) {

  // }
}

export default {
  state,
  mutations,
  actions
}
