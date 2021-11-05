export default {
  // 玩家-投注记录 
  getBetGameRecord(data) {
    return this.post('/web-api/lottery/projectHistory', data).then(response =>  response)
  },
  // 玩家-追号记录 
  getBetTraceRecord(data) {
    return this.post('/web-api/lottery/traceHistory', data).then(response =>  response)
  }
}
