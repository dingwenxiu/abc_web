export default {

  // 网站头ico 二维码  LOGO
  getBasicContent() {
    return this.get('/web-api/site/baseConfig').then(response =>  response)
  },

  // 获取需要展示的前台模块 
  showHomepageModel(data) {
    return this.get('/web-api/site/getModule', data).then(response =>  response)
  },
  // 热门彩种
  getPopularLotteries2(data) {
    return this.get('/web-api/site/popularMethods', data).then(response =>  response)
  },

  // 热门游戏
  getPopularGame(data) {
    return this.get('/web-api/homepage/get-popular-game', data).then(response =>  response)
  },
  //热门彩票
  hotLotteryList(data) {
    return this.get('/web-api/site/hotLotteryList', data).then(response =>  response)
  },
  // 二维码
  getActivity() {
    return this.get('/web-api/homepage/activity').then(response =>  response)
  },
  
  // 公告API
  getNotice(data) {
    return this.post('/web-api/noticeList', data).then(response =>  response)
  },
  // 关闭弹窗
  noPopup(data) {
    return this.post('/web-api/noPopup', data).then(response =>  response)
  },

  // 中奖排行
  getRanking() {
    return this.get('/web-api/homepage/ranking').then(response =>  response)
  },

  // 中奖排行
  getUserHelp() {
    return this.get('/web-api/helpMenuList').then(response =>  response)
  },

  // 开奖公告
  lotteryNoticeList(data) {
    return this.post('/web-api/site/openList', data).then(response =>  response)
  },
  // 站内信
  getMessageList(data) {
    return this.post('/web-api/getMessageList', data).then(response =>  response)
  },
  // 删除站内信
  deleteMessage(data) {
    return this.post('/web-api/deleteMessage', data).then(response =>  response)
  },
  // 公告|站内信 已读
  lotteryRedMessage(data) {
    return this.post('/web-api/readMessage', data).then(response =>  response)
  },
  // 传递的参数是否加密
  isCryptData(data) {
    return this.get('/web-api/system/is-crypt-data', data).then(response =>  response)
  },

  // 优惠活动
  activityList(data) {
    return this.post('/web-api/activity/getLists', data).then(response =>  response)
  },

  // 获取活动banner
  getBanner(data) {
    return this.get('/web-api/activity/getLists', data).then(response =>  response)
  },
  //获取活动信息
  getOne(data) {
    return this.post('/web-api/activity/getOne', data).then(response =>  response)
  },
  //参与活动
  joinAct(data) {
    return this.post('/web-api/activity/joinAct', data).then(response =>  response)
  },
  // 获取奖品/
  getPrizes(data) {
    return this.post('/web-api/activity/get-prizes', data).then(response =>  response)
  },
}
