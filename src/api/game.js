export default {
  // 导航-游戏平台
  casinoPlat(data) {
    return this.post('/casino-api/casino/gamePlat', data).then(
      response => response
    )
  },

  //获取所有游戏列表
  getGameList(data) {
    return this.post('/casino-api/casino/gameList', data).then(
      response => response
    )
  },

  //进游戏
  joinGame(data) {
    return this.post('/casino-api/casino/joinGame', data).then(
      response => response
    )
  }
}
