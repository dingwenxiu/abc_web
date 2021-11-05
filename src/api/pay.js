export default {
  //  获取充值渠道网关信息
  getRechargeChannel() {
    return this.post('/web-api/player/getRechargeChannel').then(response =>  response)
  },

  // 发起充值申请
  postRecharge(data) {
    return this.post('/web-api/player/recharge', data).then(response =>  response)
  },

  // 发起提现申请 
  postWithdraw(data) {
    return this.post('/web-api/player/withdraw', data).then(response =>  response)
  },

  // 用户充值到账列表
  realRechargeList(data) {
    return this.post('/web-api/pay/realRechargeList', data).then(response =>  response)
  },

  // 用户提现到账列表
  realWithdrawList(data) {
    return this.post('/web-api/pay/realWithdrawList', data).then(response =>  response)
  },

  // 用户充值申请列表
  rechargeList(data) {
    return this.post('/web-api/player/rechargeList', data).then(response =>  response)
  },

  // 用户提现申请列表
  withdrawList(data) {
    return this.post('/web-api/player/withdrawList', data).then(response =>  response)
  },

  // 转入游戏
  transferIn(data) {
    return this.post('/casino-api/casino/transferIn', data).then(response =>  response)
  },
  transferTo(data) {
    return this.post('/casino-api/casino/transferTo', data).then(response =>  response)
  },
  //查询余额
  getBalance(data) {
    return this.post('/casino-api/casino/getBalance', data).then(response =>  response)
  },
  //查询所有平台余额
  getAllBalance(data) {
    return this.post('/casino-api/casino/getAllBalance', data).then(response =>  response)
  },
}
