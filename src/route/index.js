import Vue from 'vue'
import Router from 'vue-router'

import { getToken, removeToken } from '@/utils/auth'
import store from '@/store'
import { Message, MessageBox } from 'element-ui'

const Login = () => import('../views/auth/Login.vue')
const Register = () => import('../views/auth/Register.vue')
const Home = () => import('../views/Home')
const GameMain = () => import('../views/game/GameMain')
const Index = () => import('../components/index_new')
const Ylc = () => import('../components/game/ylc')
const UserTrends = () => import('../views/user-trends')
const AgentCenter = () => import('../views/agent-center')
const Active = () => import('../views/active')
const FishGame = () => import('../views/games-page/game-fish.vue')
const LiveGame = () => import('../views/games-page/game-live.vue')
const EGame = () => import('../views/games-page/game-e.vue')
const chessGame = () => import('../views/games-page/game-chess.vue')
const Account = () => import('../views/account-center')
const P404 = () => import('../components/public/403-404-500.vue')
const Download = () => import('../components/public/download.vue')
const HelpCenter = () => import('../components/public/help-center.vue')
const HelpPlay = () => import('../components/public/help-play.vue')
const HelpInfo = () => import('../components/public/help-info.vue')
const PreventHijack = () => import('../components/public/preventHijack.vue')
const BigWheel = () => import('../views/active/components/big-wheel.vue')
const BigWheelOne = () => import('../views/active/components/big-wheel-one.vue')
const RedPackets = () => import('../views/active/components/red-packets.vue')
const ActiveInfo = () => import('../views/active/components/active_info.vue')
const FirstCharge = () => import('../views/active/components/first-charge.vue')
const GiftRecharge = () =>
  import('../views/active/components/gift-recharge.vue')
const SignActivity = () =>
  import('../views/active/components/sign-activity.vue')
const StopBet = () => import('../components/public/stop-bet.vue')

      
Vue.use(Router)

//处理报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '', name: 'index', component: Index },
        { path: '/login', name: 'Login', component: Login },
        {
          path: '/register/:code?',
          name: 'register',
          component: Register,
          props: true
        },
        {
          path: '/bet/:lotterySign?',
          name: 'bet',
          component: GameMain,
          props: true
        },
        { path: 'ylc', name: 'ylc', component: Ylc, props: true },
        {
          path: '/user-trends/:lotterySign?',
          name: 'user-trends',
          component: UserTrends,
          props: true
        },
        {
          path: '/agent-center/:tabName?',
          name: 'agent-center',
          component: AgentCenter
        },
        {
          path: '/active',
          name: 'active',
          component: Active
        },
        {
          path: '/fish-game',
          name: 'fish-game',
          component: FishGame
        },
        {
          path: '/live',
          name: 'live-game',
          component: LiveGame
        },
        {
          path: '/games-page/e-game',
          name: 'e-game',
          component: EGame,
          props: true
        },
        {
          path: '/games-page/card',
          name: 'chess-game',
          component: chessGame,
          props: true
        },
        {
          path: '/account-center/:type?/:subtype?',
          name: 'account-center',
          component: Account,
          props: true
        },
        {
          path: '/download',
          name: 'download',
          component: Download
        },
        {
          path: '/help-play',
          name: 'help-play',
          component: HelpPlay
        },
        {
          path: '/help-center',
          name: 'help-center',
          component: HelpCenter
        },
        {
          path: '/help-info/:pageId?',
          name: 'help-info',
          component: HelpInfo,
          props: true
        },
        {
          path: '/page403',
          name: 'page403',
          component: P404
        },
        {
          path: '/page404',
          name: 'page404',
          component: P404
        },
        {
          path: '/page500',
          name: 'page500',
          component: P404
        },
        // 防劫持
        {
          path: '/preventHijack',
          name: 'preventHijack',
          component: PreventHijack
        },
        // 大转盘
        {
          path: '/active/big-wheel/:activetyId?',
          name: 'big-wheel',
          component: BigWheel
        },
        // 大转盘1
        {
          path: '/active/big-wheel-one',
          name: 'big-wheel-one',
          component: BigWheelOne
        },
        // 签到
        {
          path: '/active/sgin-activity',
          name: 'sgin-activity',
          component: SignActivity
        },
        // 首充
        {
          path: '/active/first-charge',
          name: 'first-charge',
          component: FirstCharge
        },
        // 充值赠送
        {
          path: '/active/gift-recharge',
          name: 'gift-recharge',
          component: GiftRecharge
        },
        // 红包雨
        {
          path: '/active/red-pack-rain',
          name: 'red-pack-rain',
          component: RedPackets
        },
        // 红包雨
        {
          path: '/active/active_info',
          name: 'active_info',
          component: ActiveInfo
        },
        //新年通知
        {
          path: '/stop-bet',
          name: 'stop-bet',
          component: StopBet
        },
      ]
    },
    { path: '*', redirect: '/page404' }
  ],
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const hasToken = getToken()
  // const hasIsCryptData = getIsCryptData()
  // if (hasIsCryptData != null) {
  if (hasToken) {
    if (to.path === '/login' || to.path === '/register') {
      next({ path: '/' })
    } else {
      if (store.getters.userDetail && store.getters.userDetail.user_id > 0) {
        if (
          ['recharge', 'withdrawal', 'transfer'].includes(to.params.subtype)
        ) {
          store.dispatch('getUserDetail').then(({ success }) => {
            if (success) {
              switch (store.getters.userFrozen) {
                case 3: //禁止提现
                  if (to.path.includes('withdrawal')) {
                    MessageBox('对不起，您已被禁止提现', '提示', {
                      confirmButtonText: '确定',
                      closeOnClickModal: false,
                      closeOnPressEscape: false,
                      showClose: false
                    })
                  } else {
                    next()
                  }
                  break
                case 4: //禁止资金操作
                  if (
                    ['recharge', 'withdrawal', 'transfer'].includes(
                      to.params.subtype
                    )
                  ) {
                    MessageBox('对不起，您已被禁止资金操作', '提示', {
                      confirmButtonText: '确定',
                      closeOnClickModal: false,
                      closeOnPressEscape: false,
                      showClose: false
                    })
                  } else {
                    next()
                  }
                  break
                default:
                  next()
                  break
              }
            }
          })
        } else {
          if (to.name === 'agent-center') {
            if (
              store.getters.userDetail &&
              store.getters.userDetail.user_type == 3
            ) {
              next({ path: '/' })
            }
          }
          next()
        }
      } else {
        store
          .dispatch('getUserDetail')
          .then(res => {
            const { success } = res
            if (success) {
              next({ ...to, replace: true })
            }
          })
          .catch(() => {
            Message.error('请求用户信息失败！')
            store.commit('SET_TOKEN', '')
            store.commit('SET_USER_DETAIL', {})
            removeToken()
            next({ path: '/login' })
          })
      }
    }
  } else {
    store.commit('SET_TOKEN', '')
    store.commit('SET_USER_DETAIL', {})
    window.sessionStorage.clear()
    next()
  }
  // } else {
  //   store
  //     .dispatch('getIsCryptData')
  //     .then(res => {
  //       const { success } = res
  //       if (success) {
  //         next({ ...to, replace: true })
  //       }
  //     })
  //     .catch(error => {
  //       Message.error(error || '请求出错！')
  //     })
  // }
})

export default router
