<template>
  <div class="home">
    <div class="banners">
      <el-carousel height="480px">
        <el-carousel-item v-for="(item, index) in banner" :key="index">
          <a
            @click="goToBannerUrl(item)"
            :style="{ 'background-image': 'url(' + baseData.system_pic_base_url + '/' + item.img + ')' }"
            class="carousel-src"
          ></a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="main-box">
      <div class="main-content center">
        <div class="marquee-wrap">
          <i class="fa fa-volume-up ft21 head-notice-img"></i>
          <section class="head-meque">
            <section class="resultMarquee" id="head-meque">
              <p @click="openNotice" id="head-meque_text">{{noticeList}}</p>
            </section>
          </section>
        </div>
        <div class="hot-lottery">
          <h3 class="lottery-head">
            热门彩票
            <span class="remind">Hot lottery</span>
          </h3>
          <ul class="lottery-list">
            <li
              @click="intoGame(`/bet/${item.id}`, item)"
              v-for="(item, index) in lotteriesList.slice(0, 5)"
              :key="index"
              :style="{ 'background-image': `url(${picBaseUrl}/${item.ad_img})` }"
            >
              <div class="txt">
                <p class="txt1">{{ item.name }}</p>
                <p>倒计时{{ timeArr[index] }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="overseas clear">
          <div class="overseas-lottery left">
            <h3 class="lottery-head">
              福利彩票
              <span class="remind">Lottery</span>
            </h3>

            <ul class="lottery-list" v-if="popularLotteries1.length">
              <li
                @click="intoGame(`/bet/${item.en_name}`, item)"
                v-for="(item, index) in popularLottery.fast.slice(0, 8)"
                :key="index"
              >
                <img
                  v-if="hotLottery.some(v => v === item.cn_name)"
                  src="../assets/images/hot.png"
                  alt="hot"
                  class="hot"
                />
                {{ item.cn_name }}
              </li>
            </ul>
          </div>
          <div class="overseas-lottery right">
            <h3 class="lottery-head">
              体育彩票
              <span class="remind">Lottery</span>
            </h3>
            <ul class="lottery-list" v-if="popularLotteries1.length">
              <li
                @click="intoGame(`/bet/${item.en_name}`, item)"
                v-for="(item, index) in popularLottery.low.slice(0, 8)"
                :key="index"
              >
                <img
                  v-if="hotLottery.some(v => v === item.cn_name)"
                  src="../assets/images/hot.png"
                  alt="hot"
                  class="hot"
                />
                {{ item.cn_name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="platforms" v-if="Object.keys(baseData).length">
          <div class="platform">
            <h3 class="lottery-head">
              真人游戏
              <span class="remind">Live</span>
            </h3>
            <div
              class="real-plat plat"
              v-if=" baseData['popular_live'] &&  baseData['popular_live'].length"
            >
              <transition-group name="flip-list">
                <template v-for="(item, index) in baseData['popular_live'].slice(0, 4)">
                  <img
                    v-if="item.ad_img"
                    :src="`${picBaseUrl}/${item.ad_img}`"
                    :key="index"
                    v-show="index === index1"
                  />
                  <img v-else :src="real_plat[index1].src" :key="index" v-show="index === index1" />
                </template>
              </transition-group>
              <div class="titles">
                <span
                  v-for="(item, index) in baseData['popular_live'].slice(0, 4)"
                  :style="{'width': 100 / baseData['popular_live'].slice(0, 4).length + '%'}"
                  :key="index"
                  @click="openGameLive(item)"
                  @mouseover="changeImg('live', index)"
                  :class="{ cur: index === index1 }"
                >{{ item.cn_name }}</span>
              </div>
            </div>
          </div>
          <div class="platform game">
            <h3 class="lottery-head">
              电子游艺
              <span class="remind">Slot</span>
            </h3>
            <div
              class="game-plat plat"
              v-if=" baseData['popular_e-game'] &&  baseData['popular_e-game'].length"
            >
              <transition-group name="flip-list">
                <template v-for="(item, index) in baseData['popular_e-game'].slice(0, 4)">
                  <img
                    v-if="item.ad_img"
                    :src="`${picBaseUrl}/${item.ad_img}`"
                    :key="index"
                    v-show="index === index2"
                  />
                  <img v-else :src="game_plat[index2].src" :key="index" v-show="index === index2" />
                </template>
              </transition-group>
              <div class="titles">
                <span
                  v-for="(item, index) in baseData['popular_e-game'].slice(0, 4)"
                  :style="{'width': 100 / baseData['popular_e-game'].slice(0, 4).length + '%'}"
                  :key="index"
                  @click="openGame(item)"
                  @mouseover="changeImg('egame', index)"
                  :class="{ cur: index === index2 }"
                >{{ item.cn_name }}</span>
              </div>
            </div>
          </div>
          <div class="platform">
            <h3 class="lottery-head">
              棋牌游戏
              <span class="remind">Card</span>
            </h3>
            <div
              class="gym-plat plat"
              v-if=" baseData['popular_card'] &&  baseData['popular_card'].length"
            >
              <template v-for="(item, index) in baseData['popular_card'].slice(0, 4)">
                <img
                  v-if="item.ad_img"
                  :src="`${picBaseUrl}/${item.ad_img}`"
                  :key="index"
                  v-show="index === index3"
                />
                <img v-else :src="chess_plat[index3].src" :key="index" v-show="index === index3" />
              </template>
              <div class="titles">
                <span
                  v-for="(item, index) in baseData['popular_card'].slice(0, 4)"
                  :style="{'width': 100 / baseData['popular_card'].slice(0, 4).length + '%'}"
                  :key="index"
                  @click="openGame(item)"
                  @mouseover="changeImg('card', index)"
                  :class="{ cur: index === index3 }"
                >{{ item.cn_name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <dialog-bulletin
      v-if="showBulletin || showInitNotice"
      :showBulletin="showBulletin || showInitNotice"
      @close="handleBulletinClose"
    ></dialog-bulletin>
    <el-dialog class="closed"  :visible.sync="dialogTableVisible">
      <h1>春节期间部分彩种停售通知</h1>
      <p class="f18">敬爱的客户 您好: </p>
      <p class="f18 pd">根据"彩票管理条例实施规则" 2020 年春节休市通知：春节官彩休市具体恢复时间等待官方通知，请随时关注平台公告。休市期间其他国家官方彩种、充值、提款，线上客服正常运行。欢迎广大彩迷于春节期间参与游戏。 </p>
      <p class="f18" style="padding-bottom: 10px;">正常开派奖的彩种：<span>腾讯分分彩、极速一分彩、奇趣腾讯分分彩、幸运飞艇、台湾PC蛋蛋、六合彩</span></p>
      <p class="f18">快乐彩平台祝大家新春快乐，鼠年兴旺中大奖。</p>
      <p class="red">2020，有钱花，吃不胖，招桃花，想啥啥都有！比锦鲤更带福气!</p>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import dialogBulletin from "../components/public/dialog_bulletin";

export default {
  name: "index",
  components: {
    dialogBulletin
  },
  data() {
    return {
      hotLottery: [
        "奇趣腾讯分分彩",
        "重庆时时彩",
        "腾讯分分彩",
        "多彩腾讯分分彩",
        "新疆时时彩",
        "山东11选5",
        "广东11选五",
        "幸运飞艇",
        "极速赛车",
        "江苏快3",
        "极速快3",
        "香港六合彩"
      ],
      real_plat: [
        {
          name: "AG真人",
          src: require("../assets/images/home/real/1.png")
        },
        {
          name: "PT真人",
          src: require("../assets/images/home/real/2.png")
        },
        {
          name: "BBIN真人",
          src: require("../assets/images/home/real/3.png")
        },
        {
          name: "WM真人",
          src: require("../assets/images/home/real/4.jpg")
        }
      ],
      game_plat: [
        {
          name: "AG电游",
          src: require("../assets/images/home/egame/电游1.jpg")
        },
        {
          name: "PT电游",
          src: require("../assets/images/home/egame/电游2.jpg")
        },
        {
          name: "BBIN电游",
          src: require("../assets/images/home/egame/电游3.jpg")
        },
        {
          name: "BBIN电游",
          src: require("../assets/images/home/egame/电游4.jpg")
        }
      ],
      chess_plat: [
        {
          name: "AG电游",
          src: require("../assets/images/home/card/棋牌1.jpg")
        },
        {
          name: "PT电游",
          src: require("../assets/images/home/card/棋牌2.jpg")
        },
        {
          name: "BBIN电游",
          src: require("../assets/images/home/card/棋牌3.jpg")
        },
        {
          name: "BBIN电游",
          src: require("../assets/images/home/card/棋牌4.jpg")
        }
      ],
      // 切换图片index
      index1: 0,
      index2: 0,
      index3: 0,
      //热门游戏倒计时
      lotteriesList: [],
      timer: [],
      timeArr: ["-- : -- : --", "-- : -- : --"],
      timerContainer: [],
      showBulletin: false,
      // 公告内容
      noticeList: null,
      dialogTableVisible: false
    };
  },
  computed: {
    ...mapGetters([
      "isLogin",
      "picBaseUrl",
      "banner",
      "baseData",
      "popularLotteries1",
      "popularGame",
      "showInitNotice"
    ]),
    popularLottery() {
      const fast = this.popularLotteries1.filter(v => v.is_fast == 1);
      const low = this.popularLotteries1.filter(v => v.is_fast == 0);
      return { fast, low };
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapActions(["getNotice"]),
    //获取首页热门游戏
    initData() {
      //获取开奖公告
      this.getIndexLottery(); //热门彩票
      // 公告
      if (this.isLogin) {
        this.getNotice({ page_size: 6, page_index: 1 }).then(
          ({ success, data }) => {
            if (success && data) {
              const list = data["data"].filter(
                v => v.device_type != 2 && v.status != 0
              );
              this.$store.commit(
                "SET_INDEX_NOTICE",
                list.some(v => v.no_popup === "")
              );
              this.noticehandler(list.length && list[0]);
            }
          }
        );
      }
    },
    getIndexLottery() {
      this.Api.hotLotteryList().then(({ success, data }) => {
        if (success && data.length) {
          const list = Object.keys(data).map((v, i) => {
            if (data[v].currentIssue.end_time)
              this.timer[i] =
                data[v].currentIssue.end_time - new Date().getTime() / 1000;
            return {
              name: data[v].cn_name,
              ad_img: data[v].ad_img,
              id: data[v].en_name,
              issue: data[v].day_issue,
              end_time: data[v].currentIssue.end_time,
              closed_vacation: data[v].closed_vacation
            };
          });
          this.lotteriesList = list;
          this.times();
        }
      });
    },
    // 倒计时
    times() {
      if (this.timer.length) {
        this.timer.forEach((v, i) => {
          this.timerContainer[i] = setInterval(() => {
            // 计算 倒计时
            v -= 1;
            if (v >= 0) {
              this.$set(this.timeArr, i, this.Utils.formatSeconds(v));
            } else {
              this.timerContainer.forEach(setIn => {
                clearInterval(setIn);
              });
              this.$nextTick(() => {
                this.getIndexLottery();
              });
            }
          }, 1000);
        });
      }
    },
    // 进入游戏
    intoGame(route, item) {
      if (!this.isLogin) {
        this.$router.push("/login");
        return;
      } else if(item.closed_vacation === 0) {
        this.$router.push(route);
      } else if(item.closed_vacation === 1) {
        this.dialogTableVisible = true
      }
    },
    // 开启平台公告
    openNotice() {
      this.showBulletin = true;
    },
    // 关闭平台公告
    handleBulletinClose(val) {
      this.showBulletin = val;
      this.$store.commit("SET_INDEX_NOTICE", false);
    },
    // 处理公告内容
    noticehandler(data) {
      if (!data) return;
      let noticeList = data["content"].replace(/<\/?[^>]*>/g, ""); //去除HTML Tag
      noticeList = noticeList.replace(/[|]*\n/, ""); //去除行尾空格
      noticeList = noticeList.replace(/&nbsp;/gi, " "); //去掉npsp
      this.noticeList = noticeList;
      this.$nextTick(() => {
        this.Animation.notice("head-meque", "head-meque_text", -1);
      });
    },
    changeImg(itemName, index) {
      if (itemName === "live") {
        this.index1 = index;
      } else if (itemName === "egame") {
        this.index2 = index;
      } else if (itemName === "card") {
        this.index3 = index;
      }
    },
    // 点击banner
    goToBannerUrl(item) {
      window.location.href = item.url;
    },
    //进游戏
    async openGame(item) {
      if (!this.isLogin) {
        this.$router.push("/login");
      } else {
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
    async openGameLive(item) {
      if (!this.isLogin) {
        this.$router.push("/login");
      } else {
        const tempWindow = window.open();
        const sendData = {
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
  },
  destroyed() {
    // 清空倒计时
    this.timerContainer.forEach(setIn => {
      clearInterval(setIn);
    });
  }
};
</script>


<style lang="scss" scoped>
@keyframes hot {
  0% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(2px);
  }
}
.home {
  min-width: 1200px;
  .banners {
    width: 100%;
    height: 450px;
    .el-carousel,
    .el-carousel__container,
    .el-carousel__item {
      width: 100%;
      height: 100%;
    }
    .el-carousel--horizontal {
      overflow-x: visible;
    }
    .el-carousel__indicators {
      bottom: 20px !important;
    }
    .carousel-src {
      height: 480px;
      width: 100%;
      display: block;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
  }
  .main-box {
    margin-top: 30px;
    position: relative;
    width: 100%;
    min-height: 890px;
    background-color: #dbd7f2;
    .main-content {
      position: absolute;
      min-height: 878px;
      left: 50%;
      top: -25px;
      margin-left: -600px;
      padding: 10px 30px 40px;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 5px;
      z-index: 10;

      .marquee-wrap {
        height: 35px;
        line-height: 35px;
        border-bottom: 1px solid#eee;
        display: flex;
        .head-notice-img {
          float: left;
          margin: 10px 5px 0 0;
        }
        .head-meque {
          width: 100%;
        }
      }
      .lottery-head {
        margin: 30px 0 20px;
        font-style: italic;

        .remind {
          margin-left: 5px;
          color: #979797;
        }
      }
      .hot-lottery {
        .lottery-list {
          min-height: 200px;
          display: flex;
          justify-content: space-around;
          li {
            cursor: pointer;
            position: relative;
            width: 200px;
            height: 210px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            .txt {
              position: absolute;
              bottom: 20px;
              left: 20px;
            }
            .txt1 {
              font-size: 16px;
              color: #8821c8;
              font-weight: bold;
            }
          }
        }
      }
      .overseas-lottery {
        width: 49%;
        .lottery-list {
          display: flex;
          flex-wrap: wrap;
          padding: 15px 10px;
          box-sizing: border-box;
          min-height: 130px;
          justify-content: left;
          vertical-align: top;
          background: linear-gradient(to left, #b268cc 40%, #707acc 100%);
          border-radius: 5px;
        }
        li {
          cursor: pointer;
          position: relative;
          width: 23.5%;
          height: 40px;
          line-height: 40px;
          margin: 5px 3px;
          background-color: #5860a1;
          text-align: center;
          border-radius: 5px;
          color: #fff;
          .hot {
            position: absolute;
            top: -12px;
            right: -3px;
            width: 22px;
            height: auto;
            animation: hot 0.5s linear infinite alternate;
          }
        }
      }
      .platforms {
        .game {
          margin: 0 22px;
        }
        .platform {
          display: inline-block;
          width: 32%;
          .plat {
            position: relative;
            height: 240px;
            border-radius: 5px;
            img {
              width: 100%;
              height: 198px;
              position: absolute;
            }
            .titles {
              position: absolute;
              bottom: 1px;
              width: 100%;
              height: 41px;
              line-height: 40px;
              display: flex;
              justify-content: center;
              color: #fff;
              background: linear-gradient(to left, #b269cd 40%, #b2a5ff 100%);
              border-bottom-right-radius: 5px;
              border-bottom-left-radius: 5px;
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
              cursor: pointer;
              span {
                text-align: center;
                line-height: 40px;
                &:not(:last-child) {
                  border-right: 1px solid #995ba2;
                }
              }
              .cur {
                background: #7e3db5;
              }
            }
          }
          .real-plat {
            // background-image: url(../assets/images/home/6.png);
            background-size: cover;

            span {
              width: 25%;
            }
          }
          .game-plat {
            // background-image: url(../assets/images/home/7.png);
            background-size: cover;
            span {
              width: 33%;
            }
          }
          .gym-plat {
            // background-image: url(../assets/images/home/8.png);
            background-size: cover;
          }
        }
      }
    }
  }
  .center {
    width: 1200px;
    margin: 0 auto;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .clear:after {
    content: "";
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }
  .clear {
    zoom: 1; /*为了兼容IE*/
  }

  .flip-list-enter-active,
  .flip-list-leave-active {
    transition: all 2s;
  }

  .flip-list-enter,
  .flip-list-leave-to {
    opacity: 0;
  }

  .flip-list-enter-to,
  .flip-list-leave {
    opacity: 1;
  }
}
#head-meque {
  position: relative;
  left: 6px;
  height: 34px;
  overflow: hidden;
}
#head-meque_text {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  cursor: pointer;
  line-height: 35px;
}
</style>

<style lang="scss">
.home .closed .el-dialog {
  width: 800px;
  height: 600px;
  background-image: url("../assets/images/xiushi.jpg");
  .el-dialog__headerbtn {
    font-size: 40px;
    .el-dialog__close {
      color: #fff;
    }
  }
  .el-dialog__body {
    padding: 100px 140px;
    font-size: 18px;
    h1 {
      font-size: 30px;
      text-align: center;
      color: #000;
      padding-bottom: 20px;
    }
    .pd {
      padding: 15px 0;
    }
    .red {
      font-size: 16px;
      color:#ca0c00;
      padding-top: 5px;
    }
    .f18 {
      font-size: 16px;
      color: #000;
    }
  }
}
</style>

