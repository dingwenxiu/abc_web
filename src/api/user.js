export default {
  // 登录
  login(username, password) {
    let data = {
        'username': username,
        'password': password,
    };
    return this.post('/web-api/login', data).then(response => response)
  },

  // 获取用户信息
  getUserDetail(data) {
    return this.get('/web-api/player/detail', data).then(response => response)
  },

  // 登出接口
  logout(data) {
    return this.get('/web-api/logout', data).then(response => response)
  },

  // 是否设置了资金密码
  existFundPassword(){
    return this.get('/web-api/user/exist-fund-password').then(response => response)
  },

  // 修改登录密码
  resetUserPassword(data) {
    return this.post('/web-api/player/changeLoginPassword', data).then(response => response)
  },
  // 修改资金密码
  resetFundPassword(data) {
    return this.post('/web-api/player/changeFundPassword', data).then(response => response)
  },

  // 添加绑定银行卡
  addBank(data) {
    return this.post('/web-api/player/bindCard', data).then(response => response)
  },
  configureList(data) {
    return this.post('/web-api/player/configureList', data).then(response => response)
  },
  // 二次添加银行卡验证资金密码与开户姓名
  twoAddVerify(data) {
    return this.post('/web-api/player/bindCardCheck', data).then(response => response)
  },

  // 玩家-银行卡列表
  getCardList(data) {
    return this.get('/web-api/player/cardList', data).then(response => response)
  },

  // 添加银行卡时选择的城市列表
  cityLists(data) {
    return this.post('/web-api/player/cityList', data).then(response => response)
  },
  resetSpecificInfos(data) {
    return this.post('/web-api/player/setInfo', data).then(response => response)
  },
  //设置资金密码
  setFundPassword(data) {
    return this.post('/web-api/player/setFundPassword', data).then(response => response)
  },

  // 个人资料列表
  userSpecificInfos(){
    return this.get('/web-api/player/info').then(response => response)
  },
  //修改头像
  setAvatar(data) {
    return this.post('/web-api/player/setAvatar', data).then(response => response)
  },
  // 账变类型列表
  changeTypeList(data){
    return this.post('/web-api/player/changeTypeList', data).then(response => response)
  },

  // 账变记录
  getUserFund(data){
    return this.post('/web-api/player/accountChangeList', data).then(response => response)
  },
  // 帐变详情
  accountChangeDetail(data){
    return this.post('/web-api/player/accountChangeDetail', data).then(response => response)
  },
  // 注册
  register(data) {
    return this.post('/web-api/register', data).then(response =>  response)
  }
}
