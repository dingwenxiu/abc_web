import { API } from '@/api'
import { setIsCryptData } from '@/utils/auth'

const state = {
  banner: [],
  baseData: {},
  qrSrc: {},
  logoSrc: {},
  notice: '',
  innerNotice: '',
  activity: '',
  customerService: '',
  popularLotteries1: [],
  popularGame: [],
  ranking: [],
  lotteryNoticeList: [],
  showBanner: false,
  showSideFloat: true,
  showInitNotice: false,
  helpList: [],
  navigation:[],
  casinoPlat: null, // 导航-游戏平台
  picBaseUrl: '',
  readNum:null,
  registerBanner:[]
}

const mutations = {
  SET_RED_NUM: (state, data) => {
    state.readNum = data
  },
  SET_BASE_DATA: (state, data) => {
    state.baseData = data
  },
  SET_PIC_BASE_URL: (state, data) => {
    state.picBaseUrl = data
  },
  SET_NAVIGATION: (state, data) => {
    state.navigation = data
  },
  SET_CASION_PLAT: (state, data) => {
    state.casinoPlat = data
  },
  SET_CUSTOME_SERVICE: (state, data) => {
    state.customerService = data
  },
  SET_HELP_LIST: (state, data) => {
    state.helpList = data
  },
  SET_LOTTERY_NOTICE: (state, data) => {
    state.lotteryNoticeList = data
  },
  SET_SHOW_FLOAT: (state, data) => {
    state.showSideFloat = data
  },
  SET_INDEX_NOTICE: (state, data) => {
    state.showInitNotice = data
  },
  SET_SHOW_BANNER: (state, data) => {
    state.showBanner = data
  },
  SET_ACTIVITY: (state, data) => {
    state.activity = data
  },
  SET_POPULAR_LOTTERIES1: (state, data) => {
    state.popularLotteries1 = data
  },
  SET_POPULAR_GAME: (state, data) => {
    state.popularGame = data
  },
  SET_BANNER: (state, data) => {
    state.banner = data
  },
  SET_QR_SRC(state, data) {
    state.qrSrc = data
  },
  SET_LOGO_SRC(state, data) {
    state.logoSrc = data
  },
  SET_NOTICE(state, data) {
    state.notice = data
  },
  SET_INNER_NOTICE(state, data) {
    state.innerNotice = data
  },
  SET_RANKING(state, data) {
    state.ranking = data
  },
  SET_REGISTER_BANNER(state, data) {
    state.registerBanner = data
  }
}

const actions = {
  async getReadNum({ commit }) {
    const {success, data} = await API.getMessageList({page_size: 1})
    if (success) {
      commit('SET_RED_NUM', data.un_read)
    }
  },
  //获取banner
  async getBanner({ commit }) {
    commit('SET_SHOW_BANNER', true)
    const res = await API.getBanner()
    return res
  },
  //获取网站基本内容
  getBasicContent({ commit }) {
    return new Promise((resolve, reject) => {
      API.getBasicContent().then(res => {
        resolve(res)
        const { success, data } = res
        if (success) {
          commit('SET_REGISTER_BANNER', data['register_banner'])
          commit('SET_BANNER', data['home_banner'])
          commit('SET_BASE_DATA', data)
          commit('SET_PIC_BASE_URL', data.system_pic_base_url)
          commit('SET_LOGO_SRC', {
            logo_image_1: data.logo_image_pc_1,
            logo_image_2: data.logo_image_pc_2
          })
          commit('SET_QR_SRC', {
            qr_code_1: data.qr_code_1,  //安卓
            qr_code_2: data.qr_code_2    //ios
          })
          commit('SET_POPULAR_LOTTERIES1', data.popular_lottery)
          commit('SET_CUSTOME_SERVICE', data.cs_url)
          commit('SET_RANKING', data.ranking)
          commit('SET_CASION_PLAT', data.casino_plat)
          let obj = {}
          const navigation = data.casino_navigation.reduce((current, next) => {
            obj[next.name] ? "" : obj[next.name] = true && current.push(next);
            return current;
          }, [])
          commit('SET_NAVIGATION', navigation)
          const popularGame = []
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              if (key.split('_')[1]) {
                const gameArr = data.casino_plat.filter(
                  val => val.code === key.split('_')[1]
                )
                if (gameArr.length) {
                  const game = gameArr[0]
                  if (game.code !== 'lottery') {
                    game.list = data[key]
                    popularGame.push(game)
                  }
                }
              }
            }
          }
          commit('SET_POPULAR_GAME', popularGame)
        }
      }).catch(err => {
        reject(err)
      })
    });
    
  },
  //获取公告 API
  getNotice({ commit }, sendData) {
    return new Promise(resolve => {
      API.getNotice(sendData).then(res => {
        const { success, data } = res
        if (success) {
          resolve(res)
          commit('SET_NOTICE', data)
        }
      })
    })
  },
  getInnerNotice({ commit }, sendData) {
    return new Promise(resolve => {
      API.getNotice(sendData).then(res => {
        const { success, data } = res
        if (success) {
          resolve(res)
          commit('SET_INNER_NOTICE', data)
        }
      })
    })
  },
  getActivity({ commit }) {
    API.getActivity().then(({ success, data }) => {
      if (success) {
        commit('SET_ACTIVITY', data)
      }
    })
  },
  getLotteryNotice({ commit }) {
    API.lotteryNoticeList({ page_index: 1, page_size: 4 }).then(
      ({ success, data }) => {
        if (success) {
          commit('SET_LOTTERY_NOTICE', data)
        }
      }
    )
  },
  //获取是否加密
  getIsCryptData() {
    return new Promise(resolve => {
      API.isCryptData().then(res => {
        const { success, data } = res
        if (success) {
          setIsCryptData(data)
          resolve(res)
        }
      })
    })
  },
}

export default {
  state,
  mutations,
  actions
}
