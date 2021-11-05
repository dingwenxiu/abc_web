<template>
  <div class="games-page">
    <div class="container">
      <div class="game-wrap">
        <div class="game-plat">
          <div class="game-plat-group">
            <div class="arrow-left">
              <i @click="handleArrowLeft" class="el-icon-arrow-left"></i>
            </div>
            <div ref="carousel" class="game-plat-carousel">
              <div
                class="game-plat-item"
                @click="clickPlatList(item.main_game_plat_code)"
                v-for="(item, index) in platlist"
                :class="{'on' : platCode === item.main_game_plat_code}"
                :key="index"
              >
                <img class="img" :src="`${picBaseUrl}/${item.image}`" />
                {{item.main_game_plat_code.toUpperCase()}}棋牌
              </div>
            </div>
            <div class="arrow-right">
              <i @click="handleArrowRight" class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
        <div class="game-search">
          <el-input clearable placeholder="请输入游戏名称" v-model="cnName" class="input-with-search">
            <el-button @click="searchGame" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="game-content">
          <div class="content-group">
            <div class="content-item" v-for="(item, index) in gameList" :key="index">
              <div class="content-item-img">
                <img class="img" v-lazy="item.img" />
              </div>
              <div class="content-item-title wzfw">{{item.cn_name}}</div>
              <div class="item-mask">
                <div @click="handleJoinGame(item)" class="content-item-btn">立即游戏</div>
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
      gameType: "card",
      cnName: "",
      gameLoading: false,
      platCode: "",
      platlist: [],
      gameList: [],
      total: 0,
      page_index: 1,
      page_size: 300
    };
  },
  computed: {
    ...mapGetters(["navigation", "isLogin", "picBaseUrl"])
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
      if (this.platlist.length) {
        this.platCode = this.platlist[0]["main_game_plat_code"];
        this.getGameList();
      }
    },
    searchGame() {
      this.page_index = 1;
      this.getGameList();
    },
    async getGameList() {
      this.gameList = [];
      const sendData = {
        categorie: this.gameType,
        platCode: this.platCode,
        page_size: this.page_size,
        page_index: this.page_index
      };
      if (this.cnName) {
        sendData.cn_name = this.cnName;
      }
      this.gameLoading = true;
      const { success, data } = await this.Api.getGameList(sendData);
      this.gameLoading = false;
      if (success) {
        this.gameList = data["data"];
        this.gameList.forEach(item=> {
          if(item.pc_game_code === "100028") {
            this.image = this.picBaseUrl+'/'+item.img
          } else {
            this.image = item.img
          }
          item.img = this.image
        })
        this.total = data["count"];
      }
    },
    clickPlatList(key) {
      this.cnName = "";
      this.platCode = key;
      this.page_index = 1;
      this.getGameList();
    },
    //进游戏
    async handleJoinGame(item) {
      if (!this.isLogin) {
        this.$router.push("/login");
        return;
      }
      const tempWindow = window.open();
      const sendData = {
        demo: 0,
        is_mobile: 0,
        gamecode: item.pc_game_code,
        main_game＿plat: item.main_game_plat_code
      };
      if (!item.pc_game_code) {
        sendData.gamecode = item.mobile_game_code;
        sendData.is_mobile = 1;
      }
      const { success, data } = await this.Api.joinGame(sendData);
      if (success) {
        tempWindow.location = data;
      }
    },
    handleCurrentChange(val) {
      this.page_index = val;
      this.getGameList();
    },
    handleArrowLeft() {
      this.$refs["carousel"].scrollLeft = 0;
    },
    handleArrowRight() {
      this.$refs["carousel"].scrollLeft = 9999;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.games-page {
  width: 100%;
  min-height: 1500px;
  background: #000;
  .container {
    background: url("../../assets/images/chess/banner.png") no-repeat top center;
  }
  .game-wrap {
    width: 1200px;
    margin: 0 auto;
    padding-top: 1px;
  }
}
.game-plat {
  position: relative;
  margin-top: 600px;
  height: 150px;
  filter: drop-shadow(0px 4px 13.5px rgba(0, 0, 0, 0.1));
  background-color: #0e0c10;
  overflow: hidden;
  .arrow-left,
  .arrow-right {
    position: absolute;
    top: 0;
    width: 58px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    color: #fff;
    i {
      cursor: pointer;
    }
  }
  .arrow-left {
    left: 0;
  }
  .arrow-right {
    right: 0;
  }
}
.game-plat-carousel {
  display: flex;
  overflow: auto;
  width: 1090px;
  margin: 0 auto;
  .game-plat-item {
    cursor: pointer;
    box-sizing: border-box;
    flex: 0 0 16.6%;
    text-align: center;
    color: #828282;
    font-size: 14px;
    .img {
      display: block;
      height: 45px;
      width: auto;
      margin: 0 auto;
      filter: grayscale(100%);
      filter: gray;
      margin-bottom: 8px;
      margin-top: 35px;
    }
    &.on {
      color: #fff;
      .img {
        filter: none;
      }
    }
  }
}
.game-search {
  position: relative;
  height: 126px;
  margin-top: 19px;
  background: url("../../assets/images/chess/search-bg.jpg") no-repeat;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .input-with-search {
    position: absolute;
    top: 50%;
    left: 40px;
    transform: translateY(-20px);
    height: 40px;
    width: 328px;
    /deep/ {
      .el-input-group__append,
      .el-input-group__prepend {
        background: #eb614d;
        border-color: #eb614d;
        color: #fff;
      }
    }
  }
}

.game-content {
  margin-top: 30px;
  .content-group {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    min-height: 700px;
    .content-item {
      margin-right: 19px;
      margin-bottom: 30px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
.content-item {
  position: relative;
  width: 224px;
  height: 244px;
  overflow: hidden;
  background: #fff;
  text-align: center;
  filter: drop-shadow(0px 4px 13.5px rgba(0, 0, 0, 0.1));
  background-image: linear-gradient(0deg, #212125 0%, #3c3d42 100%);
  .content-item-img {
    position: relative;
    display: flex;
    width: 205px;
    height: 175px;
    margin-top: 10px;
    margin-left: 10px;
    justify-content: center;
    align-items: center;
    background: url("../../assets/images/chess/game-hover.jpg") no-repeat;
    background-size: cover;
    .img {
      position: absolute;
      max-width: 140px;
      max-height: 140px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .content-item-title {
    color: #fff;
    line-height: 60px;
  }
  .item-mask {
    display: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 224px;
    height: 244px;
    justify-content: center;
    align-items: center; /* 垂直居中 */
    background: rgba(0, 0, 0, 0.6);
    .content-item-btn {
      cursor: pointer;
      width: 126px;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      text-align: center;
      color: #fff;
      background-image: linear-gradient(0deg, #e9493f 0%, #ec7155 100%);
    }
  }
  &:hover {
    background-image: linear-gradient(
      0deg,
      rgba(245, 203, 61, 0.996078431372549) 0%,
      #fcf3b1 100%
    );
    .item-mask {
      display: flex;
    }
    .content-item-title {
      color: #291c19;
    }
  }
}
.content-pagination {
  text-align: center;
  padding: 20px 0 50px;
  line-height: 36px;
  /deep/ {
    .el-pagination {
      display: inline-block;
      margin-right: 5px;
    }
    .el-pager li {
      color: #fff;
      height: 36px;
      min-width: 36px;
      line-height: 36px;
      background: #393939;
      &.active {
        color: #409eff;
      }
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: $primary-color;
    }
  }
}
</style>
