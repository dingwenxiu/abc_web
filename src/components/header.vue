<template>
  <header class="header-wrapper">
    <div class="header-top">
      <div class="center clear">
        <div class="left" v-if="isLogin">
          <router-link class="toptray-item" to="/download">手机客户端</router-link>&nbsp;|&nbsp;
          <router-link class="toptray-item" to="/preventHijack">防劫持教程</router-link>
        </div>
        <div class="left" v-else>您好，欢迎光临快乐彩官方平台！</div>
        <template
          v-if="$route.path.indexOf('/login') == -1 && $route.path.indexOf('/register') == -1"
        >
          <div class="title-box right" v-if="isLogin">
            <el-tooltip
              :disabled="Number(userDetail.bonus_percentage) == 0 && Number(userDetail.salary_percentage) == 0"
              placement="bottom"
              effect="light"
            >
              <div slot="content">
                分红：{{userDetail.bonus_percentage}}%
                <br />
                日资：{{userDetail.salary_percentage}}%
              </div>
              <span class="user-name">
                <i
                  class="level-before"
                  :style="{ 'background-image': `url(${picBaseUrl}/${userDetail.vip_img})` }"
                ></i>
                {{userDetail.username}}
                <span
                  style="color:#999;font-size:12px;padding:0"
                >
                  <template v-if="userDetail.is_tester == 1">(测试)</template>
                </span>
              </span>
            </el-tooltip>
            <el-tooltip
              placement="bottom"
              effect="light"
              :visible-arrow="false"
              popper-class="all-balance-pop"
            >
              <ul class="balance-group" slot="content">
                <li class="balance-item" v-for="(item, index) in allBalance" :key="index">
                  <div class="l">{{item.name}}余额</div>
                  <div class="r">￥{{item.balance}}</div>
                </li>
              </ul>
              <span style>
                余额:
                <i
                  class="hiddle"
                  @click="hiddleMoney = !hiddleMoney"
                >￥{{this.userDetail.balance && Utils.toFixed(this.userDetail.balance)}}</i>
                <i
                  class="fa fa-refresh refresh"
                  :class="{loading: refreshLoading}"
                  @click="refresh()"
                ></i>
              </span>
            </el-tooltip>
            <span class="nav-span" @click="showMessageCenter">
              <em v-if="readNum > 0" class="message-num"></em>
              站内信
            </span>
            <router-link class="nav-span" tag="span" to="/account-center">个人中心</router-link>
            <router-link class="nav-span" tag="span" to="/account-center/bet-record">投注记录</router-link>
            <router-link class="nav-span" tag="span" to="/account-center/fund-manage/recharge">充值</router-link>
            <router-link class="nav-span" tag="span" to="/account-center/fund-manage/withdrawal">提款</router-link>
            <router-link class="nav-span" tag="span" to="/account-center/fund-manage/transfer">转帐</router-link>
            <span class="nav-span service">
              <a :href="customerService" target="_blank">在线客服</a>
            </span>
            <span @click="handleLogout">安全退出</span>
          </div>
          <div class="title-box right" v-else>
            <div class="input-box">
              <i class="fa fa-user-o" aria-hidden="true"></i>
              <input v-model="user.username" type="text" placeholder="用户名" />
            </div>
            <div class="input-box">
              <i class="fa fa-lock" aria-hidden="true"></i>
              <input v-model="user.password" type="password" placeholder="密码" />
            </div>
            <div
              class="btn"
              @click="!loginLoading && submitLogin()"
            >{{loginLoading ? '登录中...' : '登录'}}</div>&nbsp;|
            <router-link tag="div" style="display:inline-block" class="btn" :to="`/register`">注册</router-link>
          </div>
        </template>
      </div>
    </div>

    <div class="navs">
      <div class="center clear">
        <img :src="`${picBaseUrl}/${baseData['logo_image_pc_1']}`" alt="logo" class="logo left" />
        <div class="navbars right">
          <router-link tag="span" to="/home">首页</router-link>
          <span @mouseenter="showMenus = true" @mouseleave="showMenus = false">彩票大厅</span>
          <!-- 全部彩种 -->
          <div class="all-lottery" v-if="showAllLottery">
            <section
              class="nav-menu-box"
              @mouseenter="showMenus = true"
              @mouseleave="showMenus = false"
              v-show="showMenus"
            >
              <div class="nav-el-row" v-for="(itemRow, RowIndex) in navLotteryList" :key="RowIndex">
                <div class="nav-el-col" v-for="(lottery, lottIndex) in itemRow" :key="lottIndex">
                  <template v-if="lottery">
                    <div class="nav-menu-title">{{lottery.name}}</div>
                    <el-row :gutter="10" class="nav-menus">
                      <el-col
                        :span="8"
                        class="nav-menu"
                        :class="{hot: hotLottery.some(v => v === item.id)}"
                        v-for="(item, itemIndex) in lottery.list"
                        v-show="item.status == 1"
                        :key="itemIndex"
                      >
                        <a
                          @click="intoGame(`/bet/${item.id}`,item)"
                          href="javascript:;"
                          class="span wzfw"
                        >{{item.name}}</a>
                      </el-col>
                    </el-row>
                  </template>
                </div>
              </div>
            </section>
          </div>
          <router-link
            tag="span"
            v-for="(item, index) in navigation"
            :to="item.url"
            :key="index"
          >{{ item.name }}</router-link>
          <router-link
            v-if="isLogin && userDetail.user_type != 3"
            tag="span"
            to="/agent-center"
          >代理中心</router-link>
        </div>
      </div>
    </div>
    <dialog-bulletin
      v-if="showBulletin || showInitMessage"
      :showBulletin="showBulletin || showInitMessage"
      :showMessage="true"
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
  </header>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import dialogBulletin from "../components/public/dialog_bulletin";

export default {
  name: "head-bar",
  components: {
    dialogBulletin
  },
  data() {
    return {
      //热门彩种code
      hotLottery: [
        "cqssc",
        "qiqtxffc",
        "duotxffc",
        "txffc",
        "xjssc",
        "sd115",
        "gd115",
        "ftpk10",
        "jssc",
        "jsk3",
        "hklhc"
      ],
      showBulletin: false,
      loginLoading: false, //登录按钮
      hiddleMoney: true, //隐藏金额
      refreshLoading: false, //更新余额
      showMenus: false, //全部彩种切换
      showAllLottery: false, //全部彩种显示
      user: { username: "", password: "" },
      show: false,
      dialogTableVisible: false
    };
  },
  created() {
    // 记住密码
    let rememberPassword = this.Utils.storage.get("rememberPassword");
    if (rememberPassword) {
      this.user.username = rememberPassword.data.account;
      this.user.password = rememberPassword.data.password;
    }
  },
  mounted() {
    this.initData();
    if (this.isLogin) {
      this.getReadNum();
      this.getAllBalance();
    }
  },
  computed: {
    ...mapGetters([
      "showInitMessage",
      "readNum",
      "navigation",
      "userDetail",
      "isLogin",
      "customerService",
      "baseData",
      "picBaseUrl",
      "allBalance"
    ])
  },
  methods: {
    ...mapActions([
      "getReadNum",
      "getUserDetail",
      "lotteryAll",
      "getPopularGame",
      "getActivity",
      "logOut",
      "getAllBalance"
    ]),
    //初始化不常变动数据
    initData() {
      this.$store.commit("SET_SHOW_FLOAT", true);
      this.lotteryAll();
      this.lotteryList();
    },
    // 获取 导航 彩票游戏 全部彩种
    lotteryList() {
      this.Api.getLotteryList().then(({ success, data }) => {
        this.showAllLottery = true;
        if (success && data) {
          this.$store.commit("SET_LOTTERY_LISTS", data);
          this.navLotteryList = [
            [
              data["data"]["ssc"],
              data["data"]["k3"],
              data["data"]["pk10"],
              data["data"]["lhc"]
            ],
            [
              data["data"]["lotto"],
              data["data"]["sd"],
              data["data"]["p3p5"],
              data["data"]["ssl"],
              data["data"]["pcdd"],
              data["data"]["klsf"]
            ]
          ];
        }
      });
    },
    submitLogin() {
      if (this.user.username == "") {
        this.$alert("请输入账号", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      if (this.user.password == "") {
        this.$alert("请输入密码", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      this.loginLoading = true;
      this.$store
        .dispatch("login", {
          username: this.user.username,
          password: this.user.password
        })
        .then(() => {
          this.loginLoading = false;
          this.$store.dispatch("getReadNum");
          this.$store.dispatch("getUserDetail");
        })
        .catch(() => {
          this.loginLoading = false;
        });
    },
    handleLogout() {
      this.$confirm("是否确认退出！", "提示", {
        confirmButtonText: "确定",
        cancelButtonClass: "取消"
      })
        .then(() => {
          this.logOut().then(success => {
            if (success) {
              this.$nextTick(() => {
                this.$router.push("/login");
              });
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
    // 刷新用户余额
    refresh() {
      this.refreshLoading = true;
      this.$store.dispatch("getUserDetail").then(() => {
        this.getAllBalance().then(() => {
          this.refreshLoading = false;
        });
      });
    },
    // 进入游戏
    intoGame(route, item) {
      this.showMenus = false;
      if (!this.isLogin) {
       this.$router.push("/login");
        return;
      }  else if(item.closed_vacation === 0) {
        this.$router.push(route);
        //this.dialogTableVisible = true
      } else if(item.closed_vacation === 1) {
         this.dialogTableVisible = true
      }
    },
    //消息中心
    showMessageCenter() {
      this.showBulletin = true;
    },
    handleBulletinClose() {
      this.showBulletin = false;
      this.$store.commit("SET_INDEX_MESSAGE", false);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/css/var.scss";
.header-wrapper {
  min-width: 1200px;
  .header-top {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #fff;
    background: #3e2253;
    .toptray-item {
      color: #fff;
    }
    .title-box {
      .input-box {
        display: inline-block;
        width: 180px;
        height: 25px;
        line-height: 25px;
        margin-right: 10px;

        // border: 1px solid #800fa9;
        background: #fff;
        border-radius: 3px;
        .fa {
          margin: 0 3px;
          color: #000;
        }
        input {
          width: 90%;
        }
        input::placeholder {
          font-size: 12px;
        }
      }
      .btn {
        display: inline-block;
        margin: 0 5px;
        height: 25px;
        line-height: 25px;
        cursor: pointer;
      }

      span {
        display: inline-block;
        padding: 0 5px;
        padding-right: 13px;
        position: relative;
        cursor: pointer;
      }
      .nav-span {
        &:after {
          position: absolute;
          content: "|";
          right: 3px;
          top: 0px;
          height: 20px;
        }
        .message-num {
          position: absolute;
          display: block;
          background: #c82834;
          font-size: 12px;
          top: 8px;
          right: 5px;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          box-sizing: border-box;
        }
      }
      .user-name {
        padding-right: 13px;
        .level-before {
          position: absolute;
          left: -55px;
          top: 9px;
          width: 55px;
          height: 20px;
          background-image: url(../assets/images/header/vip1.png);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        &:after {
          position: absolute;
          content: "|";
          right: 3px;
          top: 0px;
          height: 20px;
        }
      }
      .service {
        padding-left: 29px;
        a {
          color: #fff;
        }
        &:before {
          position: absolute;
          content: "";
          left: 5px;
          top: 10px;
          width: 20px;
          height: 20px;
          background: url(../assets/images/header/kefu.png);
          background-size: 100% 100%;
        }
      }
    }
    .navs {
      height: 55px;
      line-height: 55px;
      background: #3e2253;
    }
  }
  .navs {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    color: #fff;
    background: #800fa9;
    .logo {
      max-width: 90px;
      max-height: 50px;
      position: absolute;
      top: -4px;
      bottom: 0;
      margin: auto 0;
    }
    .navbars {
      span {
        display: inline-block;
        padding: 0 20px;
        font-size: 16px;
        cursor: pointer;
        &:hover {
          background: #3e2253;
        }
        &.router-link-active {
          background: #3e2253;
          color: #fffefe;
        }
      }
    }
  }
  .center {
    width: 1200px;
    position: relative;
    margin: 0 auto;
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
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .navbars {
    height: 50px;
  }
}
@keyframes myRotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
.refresh {
  font-size: 15px;
  margin-left: 4px;
  vertical-align: -1px;
  &.loading {
    animation: myRotate 1.5s linear infinite;
  }
}
.all-lottery {
  display: inline-block;
  .nav-menu-box {
    line-height: 1.5;
    width: 974px;
    min-height: 350px;
    position: absolute;
    top: 50px;
    right: 0;
    background: #fff;
    z-index: 1001;
    padding: 15px 0;
    font-size: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    /deep/ {
      .el-loading-spinner i,
      .el-loading-spinner .el-loading-text {
        color: #fff;
      }
    }
    .nav-menu-title {
      text-align: left;
      color: #000;
      margin-bottom: 5px;
    }
    .nav-menus {
      .nav-menu {
        position: relative;
        &.hot {
          &::before {
            content: "";
            box-sizing: border-box;
            position: absolute;
            right: 2px;
            top: 0;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 25px 28px 0;
            border-color: transparent #ffea00 transparent transparent;
          }
          &::after {
            content: "热";
            position: absolute;
            color: #dd1010;
            right: 3px;
            top: 1px;
            font-size: 12px;
          }
        }
        .span {
          box-sizing: border-box;
          background: #dbd7f0;
          color: #666;
          display: block;
          text-align: center;
          margin-bottom: 8px;
          font-size: 14px;
          padding: 8px 5px;
          border-radius: 3px;
          &:hover {
            background: #3e2253;
            color: #fffefe;
          }
          &.router-link-active {
            background: #3e2253;
            color: #fffefe;
          }
        }
      }
    }
  }
}
.nav-el-row {
  float: left;
  .nav-el-col {
    width: 457px;
    padding: 0 15px;
  }
}
.balance-group {
  width: 120px;
  overflow: hidden;
  .balance-item {
    overflow: hidden;
    & + .balance-item {
      padding-top: 5px;
    }

    border-bottom: 1px datted #000;
    .l {
      float: left;
      width: 50%;
    }
    .r {
      float: right;
      width: 50%;
    }
  }
}
</style>
<style lang="scss">
.all-balance-pop {
  top: 28px !important;
}
.header-wrapper .closed {
  .el-dialog {
    width: 800px;
    height: 600px;
    background-image: url("../assets/images/xiushi.jpg");
  }
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
    .f18 {
      font-size: 16px;
      color: #000;
      span {
        font-weight: 700;
        color: #00aeff;
      }
    }
    .pd {
      padding: 15px 0;
    }
    .red {
      font-size: 16px;
      color:#ca0c00;
      padding-top: 5px;
    }
  }
}
</style>
