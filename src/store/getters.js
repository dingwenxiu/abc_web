const getters = {
  // 登录
  token: state => state.user.token,
  userDetail: state => state.user.userDetail,
  isLogin: state => Boolean(state.user.token),
  userFrozen: state => state.user.userFrozen, //开放功能
  showInitMessage: state => state.user.showInitMessage,
  allBalance: state => state.user.allBalance,
  // 网站
  isCryptData: state => state.site.isCryptData, //参数加密
  banner: state => state.site.banner,
  ico: state => state.site.ico,
  qrSrc: state => state.site.qrSrc,
  logoSrc: state => state.site.logoSrc,
  baseData: state => state.site.baseData,
  notice: state => state.site.notice,
  innerNotice: state => state.site.innerNotice,
  popularLotteries1: state => state.site.popularLotteries1,
  showBanner: state => state.site.showBanner,
  showSideFloat: state => state.site.showSideFloat,
  picBaseUrl: state => state.site.picBaseUrl,
  showInitNotice: state => state.site.showInitNotice,
  ranking: state => state.site.ranking,
  lotteryNoticeList: state => state.site.lotteryNoticeList,
  popularGame: state => state.site.popularGame,
  casinoPlat: state => state.site.casinoPlat,
  navigation: state => state.site.navigation,
  helpList: state => state.site.helpList,
  customerService: state => state.site.customerService,
  readNum: state => state.site.readNum,
  registerBanner:state => state.site.registerBanner,
  // 彩票
  currentLottery: state => state.lottery.currentLottery,
  lotteryAll: state => state.lottery.lotteryAll,
  bet: state => state.lottery.bet,
  pcdd: state => state.lottery.pcdd,
  currentOrders: state => state.lottery.currentOrders,
  issueInfo: state => state.lottery.issueInfo,
  allMethods: state => state.lottery.allMethods,
  defaultGroup: state => state.lottery.defaultGroup,
  defaultMethod: state => state.lottery.defaultMethod,
  currentMethod: state => state.lottery.currentMethod,
  currentMethodGroup: state => state.lottery.currentMethodGroup,
  changeYlcPlays: state => state.lottery.changeYlcPlays,
  orderList: state => state.lottery.orderList,
  currentOrderState: state => state.lottery.currentOrderState,
  totalCost: state => state.lottery.totalCost,
  currentIssue: state => state.lottery.currentIssue,
  userConfig: state => state.lottery.userConfig,
  currentLotterySign: state => state.lottery.currentLotterySign,
  lotteryLists: state => state.lottery.lotteryLists,
  countPrize: state => state.lottery.countPrize,
  translation: () => number => {
    let temp = '';
    switch (number) {
      case '5单0双':
        temp = '5';
        break;
      case '4单1双':
        temp = '4';
        break;
      case '3单2双':
        temp = '3';
        break;
      case '2单3双':
        temp = '2';
        break;
      case '1单4双':
        temp = '1';
        break;
      case '0单5双':
        temp = '0';
        break;
      case '龙':
        temp = '1';
        break;
      case '虎':
        temp = '2';
        break;
      case '和':
        temp = '3';
        break;
      case '豹子':
        temp = 'b';
        break;
      case '顺子':
        temp = 's';
        break;
      case '对子':
        temp = 'd';
        break;
      case '大':
        temp = 'b';
        break;
      case '小':
        temp = 's';
        break;
      case '单':
        temp = 'o';
        break;
      case '双':
        temp = 'e';
        break;
      case '大单':
        temp = 'bo';
        break;
      case '大双':
        temp = 'be';
        break;
      case '小单':
        temp = 'so';
        break;
      case '小双':
        temp = 'se';
        break;
      case '极大':
        temp = 'sb';
        break;
      case '极小':
        temp = 'ss';
        break;
      case '红波':
        temp = 'red';
        break;
      case '蓝波':
        temp = 'blue';
        break;
      case '绿波':
        temp = 'green';
        break;
      case '春':
        temp = '1';
        break;
      case '夏':
        temp = '2';
        break;
      case '秋':
        temp = '3';
        break;
      case '冬':
        temp = '4';
        break;
      case '东':
        temp = '5';
        break;
      case '南':
        temp = '6';
        break;
      case '西':
        temp = '7';
        break;
      case '北':
        temp = '8';
        break;
      case '金':
        temp = '1';
        break;
      case '木':
        temp = '2';
        break;
      case '水':
        temp = '3';
        break;
      case '火':
        temp = '4';
        break;
      case '土':
        temp = '5';
        break;
      case '尾大':
        temp = 'wb';
        break;
      case '尾小':
        temp = 'ws';
        break;
      case '和单':
        temp = 'ho';
        break;
      case '和双':
        temp = 'he';
        break;
      case '1V2':
        temp = '12';
        break;
      case '1V3':
        temp = '13';
        break;
      case '1V4':
        temp = '14';
        break;
      case '1V5':
        temp = '15';
        break;
      case '1V6':
        temp = '16';
        break;
      case '1V7':
        temp = '17';
        break;
      case '1V8':
        temp = '18';
        break;
      case '2V3':
        temp = '23';
        break;
      case '2V4':
        temp = '24';
        break;
      case '2V5':
        temp = '25';
        break;
      case '2V6':
        temp = '26';
        break;
      case '2V7':
        temp = '27';
        break;
      case '2V8':
        temp = '28';
        break;
      case '3V4':
        temp = '34';
        break;
      case '3V5':
        temp = '35';
        break;
      case '3V6':
        temp = '36';
        break;
      case '3V7':
        temp = '37';
        break;
      case '3V8':
        temp = '38';
        break;
      case '4V5':
        temp = '45';
        break;
      case '4V6':
        temp = '46';
        break;
      case '4V7':
        temp = '47';
        break;
      case '4V8':
        temp = '48';
        break;
      case '5V6':
        temp = '56';
        break;
      case '5V7':
        temp = '57';
        break;
      case '5V8':
        temp = '58';
        break;
      case '6V7':
        temp = '67';
        break;
      case '6V8':
        temp = '68';
        break;
      case '7V8':
        temp = '78';
        break;
    }
    return temp;
  },
  lhcTransLation: () => number => {
    let temp = '';

    switch (number) {
      case '红大':
        temp = 'RB';
        break;
      case '红小':
        temp = 'RS';
        break;
      case '红单':
        temp = 'RO';
        break;
      case '红双':
        temp = 'RE';
        break;
      case '红合单':
        temp = 'RAO';
        break;
      case '红合双':
        temp = 'RAE';
        break;
      case '蓝大':
        temp = 'BB';
        break;
      case '蓝小':
        temp = 'BS';
        break;
      case '蓝单':
        temp = 'BO';
        break;
      case '蓝双':
        temp = 'BE';
        break;
      case '蓝合单':
        temp = 'BAO';
        break;
      case '蓝合双':
        temp = 'BAE';
        break;
      case '绿大':
        temp = 'GB';
        break;
      case '绿小':
        temp = 'GS';
        break;
      case '绿单':
        temp = 'GO';
        break;
      case '绿双':
        temp = 'GE';
        break;
      case '绿合单':
        temp = 'GAO';
        break;
      case '绿合双':
        temp = 'GAE';
        break;
      case '鼠':
        temp = 'SHU';
        break;
      case '牛':
        temp = 'NIU';
        break;
      case '虎':
        temp = 'HU';
        break;
      case '兔':
        temp = 'TU';
        break;
      case '龙':
        temp = 'LONG';
        break;
      case '蛇':
        temp = 'SHE';
        break;
      case '马':
        temp = 'MA';
        break;
      case '羊':
        temp = 'YANG';
        break;
      case '猴':
        temp = 'HOU';
        break;
      case '鸡':
        temp = 'JI';
        break;
      case '狗':
        temp = 'GOU';
        break;
      case '猪':
        temp = 'ZHU';
        break;
      case '大':
        temp = 'b';
        break;
      case '小':
        temp = 's';
        break;
      case '单':
        temp = 'o';
        break;
      case '双':
        temp = 'e';
        break;
      case '大单':
        temp = 'bo';
        break;
      case '大双':
        temp = 'be';
        break;
      case '小单':
        temp = 'so';
        break;
      case '小双':
        temp = 'se';
        break;
    }

    return temp;
  }
};

export default getters
