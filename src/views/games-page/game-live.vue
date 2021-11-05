<template>
  <div class="games-page">
    <div class="container">
      <div class="game-wrap">
        <div class="game-group">
          <div
            @click="handleJoinGame(item)"
            class="game-item"
            v-for="(item, index) in platlist"
            :key="index"
          >
            <img class="img" :src="models[index]['src']" />
            <div class="game-body">
              <div class="body-l">
                {{item.main_game_plat_name}}视讯
                <span class="sub">国际品牌，口碑载道</span>
              </div>
              <div class="body-r">
                <a class="btn" href="javascript:;">查看 ></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      gameLoading: false,
      models: [
        { src: require("../../assets/images/liveGame/model/model1.png") },
        { src: require("../../assets/images/liveGame/model/model2.png") },
        { src: require("../../assets/images/liveGame/model/model3.png") },
        { src: require("../../assets/images/liveGame/model/model4.png") },
        { src: require("../../assets/images/liveGame/model/model5.png") },
        { src: require("../../assets/images/liveGame/model/model6.png") },
        { src: require("../../assets/images/liveGame/model/model7.png") },
        { src: require("../../assets/images/liveGame/model/model8.png") }
      ],
      platlist: [],
      gameList: [],
      categorie: "live"
    };
  },
  computed: {
    ...mapGetters(["navigation", "isLogin"])
  },
  watch: {
    navigation: {
      handler(newVal) {
        this.initData(newVal);
      },
      immediate: true
    }
  },
  methods: {
    initData() {
      const currentPlat = this.navigation.filter(
        val => val.url === this.$route.path
      );
      this.platlist = currentPlat.length && currentPlat[0]["casino_plat_code"];
      // if (this.platlist.length) {
      //   this.platCode = this.platlist[0]['main_game_plat_code'];
      //   this.getGameList();
      // }
    },
    //进游戏
    async handleJoinGame(item) {
      if (!this.isLogin) {
        this.$router.push("/login");
        return;
      }
      const tempWindow = window.open();
      let sendData;
      sendData = {
        gamecode: "live",
        demo: 0,
        is_mobile: 0,
        main_game＿plat: item.main_game_plat_code
      };
      const { success, data } = await this.Api.joinGame(sendData);
      if (success) {
        tempWindow.location = data;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.games-page {
  width: 100%;
  background: #ebebeb;
  padding-bottom: 15px;
  .container {
    min-height: 1000px;
    padding: 1px;
    background: url("../../assets/images/liveGame/live_bg.jpg") no-repeat top
      center;
  }
}
.game-wrap {
  margin-top: 540px;
  margin-bottom: 30px;
  background-size: contain;
  .game-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 1200px;
    margin: 0 auto;
  }
}
.game-item {
  cursor: pointer;
  width: 282px;
  height: 322px;
  margin-top: 70px;
  margin-right: 24px;
  position: relative;
  background: url("../../assets/images/liveGame/game_item_bg.jpg") no-repeat;
  &:nth-child(4n) {
    margin-right: 0;
  }
  .img {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    height: 358px;
    width: auto;
  }
  .game-body {
    display: none;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 72px;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    overflow: hidden;
    background-image: linear-gradient(
      0deg,
      rgba(253, 83, 145, 0.996078431372549) 0%,
      #f76f64 100%
    );
    .body-l {
      position: relative;
      top: 15px;
      float: left;
      font-size: 22px;
      color: #fff;
      .sub {
        display: block;
        color: #fff;
        font-size: 14px;
      }
    }
    .body-r {
      float: right;
      .btn {
        position: relative;
        top: 28px;
        padding: 6px 12px;
        border-radius: 15px;
        font-size: 14px;
        border: 1px solid #fff;
        color: #fff;
        &:hover {
          background: #fff;
          color: #fa5e80;
        }
      }
    }
  }
  &:hover {
    .game-body {
      display: block;
    }
  }
}
</style>
