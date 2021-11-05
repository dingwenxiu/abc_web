<template>
  <div class="red-packets">
    <div class="container">
      <div class="red-packets-title"></div>
      <div class="red-packets-form">
        <div class="count-down">
          游戏时长:
          <el-select
            value-key="id"
            style="vertical-align: top;margin-top:-5px;"
            v-model="durationTime"
            popper-class="single-price"
            placeholder="请选择游戏时长"
          >
            <el-option
              v-for="item in durationOption"
              :key="item.id"
              :label="`${item.red_pack_time} 秒`"
              :value="item"
            ></el-option>
          </el-select>
        </div>
        <div class="red-packets-btn">
          <el-button @click="countDownFn" :loading="btnLoading" round>抢红包</el-button>
        </div>
      </div>
      <div class="red-packets-table">
        <div class="table-item">
          <div class="title" style="font-weight:bold">获奖名单</div>
        </div>
        <div class="table-item">
          <div class="title">活动内容</div>
          <div class="title">申请时间及方式</div>
          <div class="title">优惠规则与条款</div>
        </div>
      </div>
    </div>

    <div v-if="secondMask" @scroll.prevent class="mask">
      <div class="clock">{{second}}</div>
    </div>

    <!-- main start -->
    <div v-if="showRedRainWarp" ref="showRedRainWarp" class="red-Packet-Warp">
      <div class="header">
        <div class="leftBar">
          剩余时间:
          <span class="count-down-num">{{duration}}</span> 秒
        </div>
      </div>
      <ul class="red_packet" id="red_packet">
        <template v-for="(item, index) in redList">
          <li
            class="package"
            :style="{ 
              left: item.left,
              width:item.width,
              height: item.height,
              animationDuration: item.durTime, 
              webkitAnimationDuration: item.durTime}"
            :data-index="index"
            @webkitAnimationEnd="removeDom"
            @click="tapOpen(item)"
            :key="index"
          >
            <a href="javascript:;">
              <i
                :style="{
                  width:item.width,
                  height: item.height,
                  transform: item.transforms,
                  webkitTransform: item.transforms}"
                :class="[{ 'defaul':item.status==0},{'success':item.status==1},{'fail':item.status==2}]"
              ></i>
            </a>
          </li>
        </template>
      </ul>
    </div>
    <!-- 奖品弹窗 -->
    <el-dialog
      class="red-packets-dialog"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogTableVisible"
    >
      <template v-if="obtainRedPackets.length">
        <ul class="prize-group">
          <li class="prize-item" v-for="(item, index) in obtainRedPackets" :key="index">
            <div class="fl">{{getPrizeName(item.prize)}}</div>
            <div class="fr">{{item.prize_val}}</div>
          </li>
        </ul>
      </template>
      <template v-else>
        <img
          class="not-won"
          src="../../../assets/images/activity/red-packert/not_won.png"
          alt="未中奖"
        />
      </template>
      <span slot="footer" class="dialog-footer">
        <div @click="dialogTableVisible = false" class="confirm-btn">确认</div>
      </span>
    </el-dialog>
  </div>
</template>
 
<script>
import { mapGetters } from "vuex";
import CryptoJS from "crypto-js";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
export default {
  data() {
    return {
      btnLoading: false,
      prizeList: [], //奖品列表
      second: 3, //开场倒计时
      secondMask: false, //倒计时弹层
      redList: [], //红包数组
      timer: null,
      durationOption: [], //游戏时长选择
      durationTime: null, //游戏时长
      duration: null, //持续时间
      showRedRainWarp: false, //红包雨
      redPackCount: null, // 红包数量
      redPackIndex: 0,
      density: 200, //红包密度，越小越多
      speed: 10, // 速度，越小越快
      getRedCount: 0, // 抢到红包数
      activityType: "red_pack_rain",
      collectRedPackets: [], //抢到的红包
      obtainRedPackets: [], //抢到有奖的红包
      dialogTableVisible: false //奖品弹窗
    };
  },
  computed: {
    ...mapGetters(["picBaseUrl"])
  },
  created() {
    this.Api.getOne({
      type: this.activityType,
      getRedPackData: "getRedPackData1"
    }).then(({ success, data }) => {
      if (success) {
        this.durationOption = data["time"];
        this.redPackCount = data["radPackCount"];
      }
    });
    this.Api.getPrizes().then(({ success, data }) => {
      if (success) {
        this.prizeList = data;
      }
    });
  },
  methods: {
    getPrizeName(val) {
      let vm = this;
      const arr = vm.prizeList.filter(v => v.id == val);
      return arr.length && arr[0]["name"];
    },
    //开场倒计时
    countDownFn() {
      if (!this.durationTime.red_pack_time) {
        this.$alert("请先选择游戏时长！", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      this.redList = [];
      this.collectRedPackets = [];
      this.duration = this.durationTime.red_pack_time;
      this.btnLoading = true;
      this.Api.getOne({
        type: this.activityType,
        getRedPackData: "getRedPackData",
        turn_num: this.durationTime.id
      }).then(({ success, data }) => {
        this.btnLoading = false;
        if (success) {
          disableBodyScroll(this.$refs.showRedRainWarp);
          this.secondMask = true;
          let clockTimer = setInterval(() => {
            this.second -= 1;
            if (this.second === 0) {
              clearInterval(clockTimer);
              clockTimer = null;
              this.second = 3;
              this.secondMask = false;
              // 开始下雨
              this.showRedRainWarp = true;
              this.startRedPacket(data);
              this.countDownFnGame();
            }
          }, 1000);
        }
      });
    },
    // 游戏秒倒计时
    countDownFnGame() {
      let timer = setInterval(() => {
        if (this.duration == 0) {
          clearInterval(timer);
        } else {
          this.duration--;
        }
      }, 1000);
    },
    //动画结束移除dom结构
    removeDom(e) {
      let target = e.currentTarget;
      document.querySelector("#red_packet").removeChild(target);
    },
    startRedPacket(data) {
      this.$nextTick(() => {
        let win =
          document.documentElement.clientWidth || document.body.clientWidth;
        let rotate = parseInt(Math.random() * 90 - 45) + "deg"; // 旋转角度
        let w = Math.random() * 31 + 90;
        let h = (w / 175) * 350;
        let durTime = parseFloat(Math.random() * 2.0) + 2.0 + "s"; // 时间
        
        win = win > 1200 ? win : 1200;
        let left = parseInt(Math.random() * win);
        if (left < 0) {
          left = 0;
        } else if (left > win - 130) {
          left = win - 130;
        }
        this.redList.push(
          Object.assign(
            {
              left: left + "px",
              width: w + "px",
              height: h + "px",
              transforms: "rotate(" + rotate + ")",
              durTime: durTime,
              status: 0 // 0 默认 1 中奖 2 未中奖
            },
            data[this.redPackIndex]
          )
        );

        // 红包密度 游戏时长 / 红包数量
        this.timer = setTimeout(() => {
          if (this.redPackIndex >= this.redPackCount) {
            // 多少时间结束
            clearTimeout(this.timer);
            setTimeout(() => {
              this.redList = null;
              this.redPackIndex = 0;
              this.duration = this.durationTime.red_pack_time;
              this.showRedRainWarp = false;
              this.finishedRain();
            }, 2500);
          } else {
            this.startRedPacket(data);
          }
        }, (this.durationTime.red_pack_time * 1000 - 2500) / this.redPackCount);
        this.redPackIndex++;
      });
    },
    tapOpen(item) {
      if (Number(item.red_prize) > 0) {
        item.status = 1;
      } else {
        item.status = 2;
      }
      this.collectRedPackets.push(item);
    },
    // 简单加密
    encrypt(str) {
      // 加密
      const IV = "8NONwyJtHesysWpM";
      const KEY = "1234567898882222";
      var key = CryptoJS.enc.Utf8.parse(KEY);
      var iv = CryptoJS.enc.Utf8.parse(IV);
      var encrypted = CryptoJS.AES.encrypt(str, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString();
    },
    // 红包雨结束
    finishedRain() {
      clearAllBodyScrollLocks();
      this.collectRedPackets = this.collectRedPackets.map(v => {
        return {
          red_id: v.red_id,
          type: v.type,
          red_prize: v.red_prize
        };
      });
      const idArr = [
        { prize: this.collectRedPackets },
        { time: new Date().getTime() }
      ];

      this.Api.joinAct({
        type: this.activityType,
        turn_num: this.durationTime.id,
        red_pack_id_arr: this.encrypt(JSON.stringify(idArr))
      }).then(({ success, data }) => {
        if (success) {
          this.obtainRedPackets = data["prize"] || [];
          this.dialogTableVisible = true;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/var.scss";
.red-packets {
  min-height: 1500px;
  background: #b81321;
  .container {
    min-height: 1200px;
    border-top: 4px solid #e5c392;
    background: url("../../../assets/images/activity/red-packert/red_packet_bg.jpg")
      no-repeat top center;
    background-size: 100% auto;
  }
}
.red-packets-title {
  width: 730px;
  height: 309px;
  background: url("../../../assets/images/activity/red-packert/qiang_red_packet.png")
    no-repeat;
  background-size: contain;
  margin: 30px auto 10px;
}
.red-packets-form {
  width: 1000px;
  height: 753px;
  text-align: center;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 500px 0 0;
  background: url("../../../assets/images/activity/red-packert/red-packets-form.png")
    no-repeat;
  background-size: cover;
  .count-down {
    font-size: 28px;
    margin-top: 10px;
    color: #fff;
    .count-time {
      font-size: 32px;
      color: #fbd186;
      margin-top: 25px;
    }
  }
  .red-packets-btn {
    margin-top: 35px;
    /deep/ {
      .el-button.is-round {
        padding: 15px 55px;
        color: #c90129;
        border: 0;
        border-radius: 30px;
        font-size: 20px;
        font-weight: bold;
        background-image: linear-gradient(0deg, #face82 0%, #fff7d4 70%);
      }
    }
  }
}
.red-packets-table {
  width: 1000px;
  margin: 0 auto;
  padding: 30px 0;
}
.table-item {
  font-size: 15px;
  color: #d69f56;
  margin-bottom: 30px;
  border: 30px solid #000;
  border-image-source: url("../../../assets/images/activity/red-packert/red_packets_border.png");
  border-image-slice: 30 30 30 30;
  border-image-repeat: repeat;
  .title {
    width: 335px;
    height: 75px;
    margin: 0 auto;
    font-size: 34px;
    line-height: 75px;
    color: #c90129;
    text-align: center;
    background-image: linear-gradient(0deg, #face82 0%, #fff7d4 70%);
  }
}
.mask {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 101;
}
@keyframes clock {
  0% {
    transform: scale(10);
  }
  100% {
    transform: scale(0);
  }
}

.clock {
  position: fixed;
  top: 40%;
  left: 45%;
  font-size: 100px;
  animation: clock 1s infinite linear;
}
.red-Packet-Warp {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  margin: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  color: rgb(250, 238, 0);
}
@keyframes shake {
  from,
  to {
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translate3d(10px, 0, 0);
  }
}

.red_packet {
  i {
    display: block;

    &.defaul {
      background: url("../../../assets/images/activity/red-packert/red_packets.png")
        no-repeat center;
      background-size: 100% 100%;
    }
    &.fail {
      background: url("../../../assets/images/activity/red-packert/red_packets_fail.png")
        no-repeat center;
      background-size: 100% 100%;
      animation-name: shake;
      animation-duration: 3s;
      animation-delay: 2s;
      animation-iteration-count: infinite;
    }
    &.success {
      background: url("../../../assets/images/activity/red-packert/red_packets_success.png")
        no-repeat center;
      background-size: 100% 100%;
      animation-name: shake;
      animation-duration: 3s;
      animation-delay: 2s;
      animation-iteration-count: infinite;
    }
  }
  li {
    position: absolute;
    animation: all 3s linear;
    top: -100px;
    z-index: 3;
    &.package {
      animation: aim_move 5s linear 1 forwards;
    }
  }
  a {
    display: block;
  }
}
@keyframes aim_move {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(120vh);
  }
}

.red-packets-dialog {
  /deep/ {
    .el-dialog {
      width: 500px;
      background-image: linear-gradient(
        0deg,
        #ffd397 0%,
        #ffdfa9 25%,
        #fffaf1 100%
      );
    }
    .el-dialog__body {
      padding: 0;
      width: 450px;
      margin: 0 auto;
      padding: 15px 0;
    }
    .el-dialog__header {
      padding: 0;
      background: url("../../../assets/images/activity/red-packert/red_packets_dialog.png")
        no-repeat;
      height: 200px;
      background-size: contain;
    }
  }
}

.prize-group {
  font-size: 32px;
  color: #aa5d0e;
  min-height: 200px;
  .prize-item {
    font-size: 32px;
    overflow: hidden;
    padding: 15px 0;
    border-bottom: 1px solid #aa5d0e;
  }
}
.confirm-btn {
  cursor: pointer;
  width: 450px;
  height: 75px;
  line-height: 75px;
  font-size: 32px;
  text-align: center;
  color: #fff3c7;
  background: #dc3539;
}
.not-won {
  width: 200px;
  height: auto;
  margin: 0 auto;
}
</style>
