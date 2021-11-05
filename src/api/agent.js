export default {
  // 团队盈亏
  getTeamProfits(data) {
    return this.post('/web-api/report/team/profitList', data).then(response =>  response)
  },
  // 娱乐城盈亏
  getCasinoProfitList(data) {
    return this.post('/web-api/report/team/casinoProfitList', data).then(response =>  response)
  },
  // 玩家 - 日工资
  getPlayerDaySalary(data) {
    return this.post('/web-api/report/player/salaryList', data).then(response =>  response)
  },

  // 团队 - 日工资
  getTeamDaySalary(data) {
    return this.post('/web-api/report/team/salaryList', data).then(response =>  response)
  },

  // 玩家 - 分红
  getPlayerBonus(data) {
    return this.post('/web-api/report/player/dividendList', data).then(response =>  response)
  },

  // 团队 - 分红
  getTeamBonus(data) {
    return this.post('/web-api/report/team/dividendList', data).then(response =>  response)
  },

  // 团队管理
  getTeamManagement(data) {
    return this.post('/web-api/proxy/childList', data).then(response =>  response)
  },

  // 团队报表
  getTeamReport(data) {
    return this.post('/web-api/proxy/main', data).then(response =>  response)
  },

  // 开户链接信息
  getRegisterLink(data) {
    return this.get('/web-api/proxy/inviteLinkList', data).then(response =>  response)
  },

  // 生成开户链接
  createRegisterLink(data) {
    return this.post('/web-api/proxy/addInviteLink', data).then(response =>  response)
  },

  // 删除开户链接
  deleteRegisterLink(data) {
    return this.post('/web-api/proxy/delInviteLink', data).then(response =>  response)
  },

  // 转账到下级
  transferToChild(data) {
    return this.post('/web-api/proxy/transferToChild', data).then(response =>  response)
  },

  // 转账到下级
  addChild(data) {
    return this.post('/web-api/proxy/addChild', data).then(response =>  response)
  },
  //团队管理-团队总额
  childTeamBalance(data){
    return this.post('/web-api/proxy/childTeamBalance', data).then(response =>  response)
  },
  // 奖金组设置
  prizeGroupSet(data){
    return this.post('/web-api/proxy/prizeGroupSet', data).then(response =>  response)
  },
  // 日工资设置
  salarySet(data){
    return this.post('/web-api/proxy/salarySet', data).then(response =>  response)
  },
  // 分红设置
  bonusSet(data){
    return this.post('/web-api/proxy/bonusSet', data).then(response =>  response)
  },
  // 上级用户信息
  childsDividend(data){
    return this.post('/web-api/proxy/childsDividend', data).then(response =>  response)
  },
  // 发放分红接口
  playerDividendSend(data){
    return this.post('/web-api/report/playerDividendSend', data).then(response =>  response)
  },
}
