<template>
  <section class="game-mian" v-if="mainShow">
    <!--开奖区-->
    <game-issue></game-issue>

    <game-method></game-method>
  </section>
</template>
<script>
import GameIssue from './GameIssue'
import GameMethod from './GameMethod'
import { mapGetters } from 'vuex'
export default {
  name: 'game-main',
  components: {
    GameMethod,
    GameIssue
  },
  props: {
    lotterySign: String
  },
  data() {
    return {
      mainShow: false,
      historyIssueList: []
    }
  },
  computed: {
    ...mapGetters(['currentLottery', 'lotteryAll', 'bet', 'isLogin']),
  },
  watch: {
    'lotteryAll': {
      handler(newVal){
        if(Object.keys(newVal).length){
          this.getLotteryInfo(newVal)
        }
      },
      immediate: true
    }
  },
  created() {
    this.changePlay()
  },
  methods: {
    //切换娱乐城
    changePlay() {
      let json = {
        name: 'official',
        index: 0
      }
      this.$store.commit('SET_CHANGE_YLCPLAYS', json)
    },
    //获取所有彩种
    getLotteryInfo(lotteryAll) {
      let lottery = lotteryAll[this.lotterySign]
      this.$store.commit('SET_CURRENT_LOTTERY', lottery.lottery)
      this.$store.commit('SET_DEFAULT_GROUP', lottery.defaultGroup)
      this.$store.commit('SET_DEFAULT_METHOD', lottery.defaultMethod)
      this.$store.commit('SET_ALL_METHODS', lottery.methodConfig)
      this.$store.commit('SET_ISSUE_HISTORY', [])
      this.$store.dispatch('issueHistory')
      this.mainShow = true
    }
  }
}
</script>
