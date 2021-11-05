<template>
  <section class="container fw">
    <!--    转盘-->
    <section class="lucky-wheel">
      <section class="lucky-title"></section>
      <section class="wheel-main">
        <section class="wheel-pointer-box">
          <section
            class="wheel-pointer"
            @click="join_activity"
            :style="{transform:rotate_angle_pointer,transition:rotate_transition_pointer}"
          ></section>
        </section>
        <section
          class="wheel-bg"
          :style="{
            transform:rotate_angle,
            transition:rotate_transition,
            backgroundImage:`url(${picBaseUrl}/${prize_data.img})`}"
        ></section>
      </section>
    </section>

    <!--    活动规则-->

    <section class="main">
      <section class="main-bg"></section>
      <section class="content">今日抽奖次数： {{ lottery_ticket}}</section>
      <section class="tip">
        <section class="tip-title">活动规则</section>
        <section class="tip-content" v-html="textRule"></section>
      </section>
    </section>
    <section class="toast" v-show="toast_control">
      <section class="toast-container">
        <img :src="toast_pictrue" class="toast-picture" />
        <section class="close" @click="close_toast()"></section>
        <section class="toast-title">{{toast_title}}</section>
        <section class="toast-btn">
          <section class="toast-cancel" @click="close_toast">关闭</section>
        </section>
      </section>
    </section>
    <section class="toast-mask" v-show="toast_control"></section>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      easejoy_bean: 0, //金豆
      lottery_ticket: 0, //抽奖次数
      prize_data: "",
      prize_list: [], //奖品列表
      average_angle: "",
      disable: false,
      award: "", //中奖内容
      toast_control: false, //抽奖结果弹出框控制器
      hasPrize: false, //是否中奖
      start_rotating_degree: 0, //初始旋转角度
      rotate_angle: 0, //将要旋转的角度
      start_rotating_degree_pointer: 0, //指针初始旋转角度
      rotate_angle_pointer: 0, //指针将要旋转的度数
      rotate_transition: "transform 6s ease-in-out", //初始化选中的过度属性控制
      rotate_transition_pointer: "transform 12s ease-in-out", //初始化指针过度属性控制
      click_flag: true, //是否可以旋转抽奖
      activityType: "turntable",
      allData: "",
      textRule: ""
    };
  },
  created() {
    this.init_prize_list();
  },
  computed: {
    ...mapGetters(["picBaseUrl"]),
    toast_title() {
      return this.hasPrize
        ? "恭喜您，获得" +
            this.award.prize_val +
            " " +
            this.award.prize +
            "。" +
            this.allData.msg
        : "";
    },
    toast_pictrue() {
      return this.hasPrize
        ? require("../../../assets/images/activity/congratulation.png")
        : require("../../../assets/images/activity/sorry.png");
    }
  },
  methods: {
    //此方法为处理奖品数据
    init_prize_list() {
      this.Api.getOne({
        type: this.activityType
      }).then(res => {
        this.prize_data = res["data"];
        this.prize_list = res["data"]["prize"];
        this.textRule = res["data"]["pc_desc"];
        this.lottery_ticket = res["data"]["turntableNum"];
        this.average_angle = 360 / this.prize_list.length / 2;
      });
    },
    join_activity() {
      if (this.lottery_ticket < 0) {
        this.$alert("今日抽奖次数已用完!", "提示", {
          confirmButtonText: "确定"
        });
        this.disable = false;
        return;
      }
      if (this.disable) return;
      this.disable = true;
      this.Api.joinAct({ type: this.activityType })
        .then(res => {
          if (res["success"]) {
            this.allData = res;
            this.award = res["data"];
            this.index = res["data"]["prize"]["id"] - 1; //指定每次旋转到的奖品下标
            this.rotating();
            this.lottery_ticket =
              this.lottery_ticket > 0 ? this.lottery_ticket - 1 : 0;
          } else {
            this.disable = false;
          }
        })
        .catch(() => {
          this.disable = false;
        });
    },
    rotating() {
      if (!this.click_flag) return;
      let type = 0; // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
      let during_time = 5; // 默认为1s
      // let random = Math.floor(Math.random() * 7);
      let result_angle = this.award.angle[1] - this.average_angle; //接口返回的中奖度数-每份奖品的指针角度=中奖指针指向的角度
      let rand_circle = 6; // 附加多转几圈，2-3
      this.click_flag = false; // 旋转结束前，不允许再次触发
      if (type === 0) {
        // 转动盘子
        let rotate_angle =
          this.start_rotating_degree +
          rand_circle * 360 -
          result_angle -
          (this.start_rotating_degree % 360);
        this.start_rotating_degree = rotate_angle;
        this.rotate_angle = "rotate(" + rotate_angle + "deg)";
        // 旋转结束后，允许再次触发
        setTimeout(() => {
          this.click_flag = true;
          this.game_over();
        }, during_time * 1000 + 1500); // 延时，保证转盘转完
      }
    },
    game_over() {
      this.toast_control = true;
      this.disable = false;
      this.hasPrize = this.award.angle.length != 0;
    },
    //关闭弹窗
    close_toast() {
      this.toast_control = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.lucky-wheel {
  padding-top: 35px;
  widows: 100%;
  height: 885px;
  background: rgb(252, 207, 133)
    url(../../../assets/images/activity/color_pillar.png) no-repeat center
    bottom;
  background-size: 100%;
}
.lucky-title {
  height: 230px;
  background: url(../../../assets/images/activity/lucky_title.png) no-repeat
    center top;
}
.wheel-main {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.wheel-bg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 590px;
  height: 590px;
  background: url(../../../assets/images/activity/draw_wheel.png) no-repeat
    center top;
  background-size: 100%;
  color: #fff;
  font-weight: 500;
  /* transition: transform 3s ease;
  transform: rotate(20deg); */
}
.wheel-pointer-box {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100;
  width: 170px;
  height: 170px;
  transform: translate(-50%, -60%);
}
.wheel-pointer {
  width: 170px;
  height: 170px;
  cursor: pointer;
  background: url(../../../assets/images/activity/draw_btn.png) no-repeat center
    top;
  background-size: 100%;
  transform-origin: center 60%;
}
.prize-list {
  width: 100%;
  height: 100%;
  position: relative;
}
.prize-list .prize-item {
  position: absolute;
  z-index: 2;
  text-align: center;
}
/* .prize-list .prize-item:first-child {
  top: 50px;
  left: 180px;
  transform: rotate(-19deg);
}
.prize-list .prize-item:nth-child(2) {
  top: 50px;
  left: 310px;
  transform: rotate(33deg);
}
.prize-list .prize-item:nth-child(3) {
  top: 152px;
  left: 410px;
  transform: rotate(72deg);
}
.prize-list .prize-item:nth-child(4) {
  top: 292px;
  left: 410.5px;
  transform: rotate(111deg);
}
.prize-list .prize-item:nth-child(5) {
  top: 390px;
  left: 322px;
  transform: rotate(159deg);
}
.prize-list .prize-item:nth-child(6) {
  top: 382px;
  left: 176px;
  transform: rotate(196deg);
}
.prize-list .prize-item:nth-child(7) {
  top: 290px;
  left: 82px;
  transform: rotate(247deg);
}
.prize-list .prize-item:nth-child(8) {
  top: 155px;
  left: 78px;
  transform: rotate(286deg);
} */
.prize-item {
  height: 150px;
}
.prize-pic-img {
  width: 98px;
}
.prize-count {
  margin-top: 5px;
  font-size: 20px;
}
.prize-type {
  font-size: 20px;
}
.main {
  position: relative;
  z-index: 2;
  background: rgb(243, 109, 86);
  padding-bottom: 60px;
}
.main-bg {
  width: 100%;
  height: 210px;
  position: absolute;
  z-index: -1;
  top: -75px;
  left: 0;
  background: url(../../../assets/images/activity/luck_bg.png) no-repeat center
    top;
  background-size: 750px 210px;
}
.content {
  padding: 25px;
  height: 75px;
  font-size: 18px;
  background: rgb(243, 113, 88);
  color: #ffeb39;
  text-align: center;
}
.tip {
  position: relative;
  width: 750px;
  margin: 0 auto;
  background: rgb(243, 113, 88);
  border: 1.5px solid #fbc27f;
}
.tip-title {
  position: absolute;
  top: -36.5px;
  left: 50%;
  padding: 22.5px 45px;
  transform: translate(-50%, 0);
  font-size: 22.5px;
  color: #fccc6e;
  background: rgb(243, 112, 88);
}
.tip-content {
  padding: 30px 22.5px;
  line-height: 1.5;
  font-size: 22.5px;
  color: #fff8c5;
  /deep/ {
    h2,
    p,
    ul,
    li,
    h1,
    a {
      color: #fccc6e !important;
      background: transparent !important;
    }
  }
}
.toast-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 20000;
  padding: 23.5px;
  width: 450px;
  transform: translate(-50%, -50%);
  border-radius: 22.5px;
  background-color: rgb(252, 244, 224);
}
.toast-container {
  position: relative;
  border: 1.5px dotted #fccc6e;
}
.toast-picture {
  position: absolute;
  top: 1.5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 320px;
}
.toast-title {
  padding: 122px 0 22.5px;
  font-size: 18px;
  color: #fc7939;
  text-align: center;
}
.toast-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22.5px;
}
.toast-btn .toast-cancel {
  cursor: pointer;
  background-image: -moz-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  background-image: -ms-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  background-image: -webkit-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  box-shadow: 0 1.5px 0 0 rgba(174, 34, 5, 0.7);
  width: 225px;
  height: 60px;
  border-radius: 60px;
  text-align: center;
  line-height: 64px;
  color: #fff;
  font-size: 22.5px;
}
.close {
  position: absolute;
  cursor: pointer;
  top: -37.5px;
  right: -37.5px;
  width: 45px;
  height: 45px;
  background: url(../../../assets/images/activity/close_store.png) no-repeat
    center top;
  background-size: 100%;
}
</style>
