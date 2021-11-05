export default {
  // 获取彩种接口
  getLotteryList() {
    return this.post('/web-api/lottery/lotteryList').then(response => response)
  },

  // 获取彩种详情
  getLotteryInfo() {
    return this.post('/web-api/lottery/lotteryInfo').then(response => response)
  },

  // 获取奖期历史
  getIssueHistory(data) {
    return this.post('/web-api/lottery/issueHistory', data).then(response => response)
  },

  /*
   * 可用奖期
   */
  getOpenAward(sign) {
    let data = {
      lottery_sign: sign
    };
    return this.post('/web-api/lottery/availableIssues', data).then(
      response => response
    )
  },

  // 获取彩种上期的奖期
  lastIssue(sign) {
    return this.post(`/web-api/lottery/lastIssue/${sign}`).then(response =>  response)
  },

  /*
   * 投注历史
   */
  getBetHistory(sign, count = 10, start = 0) {
    let data = {
      lottery_sign: sign,
      page_size: count,
      start: start
    };
    return this.post('/web-api/lottery/projectHistory', data).then(
      response => response
    )
  },

   /*
   * 追号历史
   */
  getTracesHistory(sign, count = 10, start = 0) {
    let data = {
      lottery_sign: sign,
      page_size: count,
      start: start
    };
    return this.post('/web-api/lottery/traceHistory', data).then(
      response => response
    )
  },

    /*
   * 追号历史详情
   */
  getTraceDetail(id, data) {
    return this.post(`/web-api/lottery/traceDetail/${id}`, data).then(
      response => response
    )
  },

  /*
   * 投注
   *lottery_sign  彩种标识
   *trace_issues @json 追号期号
   *balls @[{}] 投注号码
   *trace_win_stop @ 0 否 1 是 是否中奖追号停止
   *total_cost  投注金额
   */
  bet(lotterySign, issues, balls, total_cost, is_trace = 0, trace_win_stop = 1) {
    let data = {
      lottery_sign: lotterySign,
      trace_issues: JSON.stringify(issues),
      balls: JSON.stringify(balls),
      trace_win_stop: trace_win_stop,
      total_cost: total_cost,
      is_trace: is_trace
    };
    return this.post('/web-api/lottery/bet', data).then(response => response)
  },

  // 游戏-投注撤销
  cancelBet(data) {
    return this.post('/web-api/lottery/cancelProject', data).then(response =>  response)
  },

  // 追号-投注撤销
  stopTrace(data) {
    return this.post('/web-api/lottery/cancelTrace', data).then(response =>  response)
  },
  // 游戏-追号详情撤单 
  stopTraceDetail(data) {
    return this.post('/web-api/lottery/cancelTraceDetail', data).then(response =>  response)
  },
  // 游戏-走势图
  getTrend(data) {
    return this.post('/web-api/lottery/trend', data).then(response =>  response)
  },
  //第三方游戏记录
  casinoProjectHistory(data) {
    return this.post('/web-api/lottery/casinoProjectHistory', data).then(response =>  response)
  },
}
