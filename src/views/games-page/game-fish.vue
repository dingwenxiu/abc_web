<template>
  <div class="fish_bg" ref="fish_bg">
    <div class="fish-content">
      <div
        :class="`fish-item-${index}`"
        class="fish-item"
        v-for="(item, index) in fishList"
        :key="index"
        :style="item.backgroundImage"
      >
        <div class="text">
          {{item.cn_name}}
          <a
            class="btn"
            @click="handleJoinGame(item)"
            href="javascript:;"
            v-if="index < 2"
          >立即游戏</a>
          <a class="btn" @click="handleJoinGame(item)" href="javascript:;" v-else>GO ></a>
        </div>
        <img :src="item.icon" class="fish-img" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { init, leave } from "@/utils/three";

export default {
  name: "fish-game",
  data() {
    return {
      fishListCache: [
        {
          backgroundImage:
            "background-image:linear-gradient(0deg, rgba(183,69,113,0.996078431372549) 0%, #f59f82 100%)",
          icon: require("../../assets/images/fishGame/fish1.png")
        },
        {
          backgroundImage:
            "background-image:linear-gradient(0deg, rgba(251,169,127,0.996078431372549) 0%, #f7cb6b 100%);",
          icon: require("../../assets/images/fishGame/fish2.png")
        },
        {
          backgroundImage:
            "background-image: linear-gradient(0deg, #9da639 0%, #19e5b9 100%);",
          icon: require("../../assets/images/fishGame/fish3.png")
        },
        {
          backgroundImage:
            "background-image: linear-gradient(0deg, #8770ee 0%, #f9829e 100%);",
          icon: require("../../assets/images/fishGame/fish4.png")
        },
        {
          backgroundImage:
            "background-image:linear-gradient(0deg, #048dd4 0%, #68dfcf 100%);",
          icon: require("../../assets/images/fishGame/fish5.png")
        },
        {
          backgroundImage:
            "background-image: linear-gradient(0deg, #048dd4 0%, #68dfcf 100%);",
          icon: require("../../assets/images/fishGame/fish6.png")
        }
      ],
      fishList: [],
      // 平台
      categorie: "fishing"
    };
  },
  mounted() {
    const [DOM = this.$refs.fish_bg] = [];

    this.$nextTick(() => {
      init(DOM);
    });
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
      if (this.platlist.length) {
        this.getGameList();
      }
    },
    //获取游戏
    async getGameList() {
      const { success, data } = await this.Api.getGameList({
        categorie: this.categorie
      });
      if (success) {
        const list = data["data"];
        this.fishList = list.map((val, index) =>
          Object.assign(this.fishListCache[index], val)
        );
        this.fishList = this.fishList.slice(0, 6);
      }
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
    }
  },
  destroyed() {
    leave();
  }
};
</script>

<style lang="scss" scoped>
.fish_bg {
  position: relative;
  min-height: 1200px;
  background: url("../../assets/images/fishGame/bg_1180.jpg") no-repeat center
    top;
  background-size: cover;
  /deep/ {
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
  }
}
.fish-content {
  width: 1200px;
  margin: 0 auto;
  padding-top: 450px;
  font-size: 0px;
}
.fish-item {
  display: inline-block;
  position: relative;
  width: 280px;
  height: 160px;
  margin-bottom: 40px;
  font-size: 20px;
  .fish-img {
    position: absolute;
    z-index: 1;
  }
  &.fish-item-0 {
    width: 516px;
    height: 350px;
    .fish-img {
      right: -40px;
      top: -40px;
    }
  }
  &.fish-item-1 {
    width: 684px;
    height: 350px;
    .fish-img {
      right: -20px;
      top: -72px;
    }
  }
  &.fish-item-2 {
    margin-right: 26px;
    .fish-img {
      right: -56px;
      top: -20px;
    }
  }
  &.fish-item-3,
  &.fish-item-4 {
    margin-right: 26px;
    .fish-img {
      right: -10px;
      top: -20px;
    }
  }

  &.fish-item-5 {
    .fish-img {
      right: -18px;
      top: -28px;
    }
  }
  &.fish-item-0,
  &.fish-item-1 {
    .text {
      position: absolute;
      left: 40px;
      top: 150px;
      font-size: 42px;
      color: #fff;
      z-index: 999;
      font-weight: bold;
      .btn {
        cursor: pointer;
        display: block;
        margin-top: 25px;
        width: 124px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        border: 1px solid #fff;
        &:hover {
          background: #fff;
          color: #e18b01;
        }
      }
    }
  }
  &.fish-item-3,
  &.fish-item-4,
  &.fish-item-2,
  &.fish-item-5 {
    .text {
      position: absolute;
      left: 18px;
      top: 50px;
      font-size: 16px;
      color: #fff;
      z-index: 999;
      font-weight: bold;
      .btn {
        cursor: pointer;
        display: block;
        margin-top: 5px;
        width: 80px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        border: 1px solid #fff;
        &:hover {
          background: #fff;
          color: #e18b01;
        }
      }
    }
  }
}
</style>

