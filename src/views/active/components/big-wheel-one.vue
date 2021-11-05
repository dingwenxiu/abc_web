<template>
  <section class="container">
    <!--    转盘-->
    <section class="lucky-wheel">
      <div class="wheel-nr">
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
        <section class="wheel-rule">
          <h2 class="title">活动规则</h2>
          <div class="rule-text" v-html="textRule"></div>
          <div class="collect">
            <div class="turntable-num">{{!msgText ? '赶紧抽奖领取吧！' : msgText}}</div>
            <div v-if="msgText" @click="handleCollect" class="collect-instant"></div>
            <div v-else class="collect-text">每日可抽奖一次</div>
          </div>
        </section>
      </div>
    </section>
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
      activityType: "turntable_one",
      allData: "",
      textRule: null,
      msgText: ""
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
            "元" +
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
        this.msgText = res["msg"];
        this.prize_list = res["data"]["prize"];
        this.textRule = res["data"]["pc_desc"];
        this.lottery_ticket = res["data"]["turntableNum"];
        this.average_angle = 360 / this.prize_list.length / 2;
      });
    },
    join_activity() {
      if (this.lottery_ticket <= 0) {
        this.$alert("今日抽奖次数已用完", "提示", {
          confirmButtonText: "确定"
        });
        this.disable = false;
        return;
      }
      if (this.disable) return;
      this.disable = true;
      this.Api.joinAct({ type: this.activityType, step: "turntable" })
        .then(res => {
          if (res["success"]) {
            this.allData = res;
            this.award = res["data"];
            this.index = res["data"]["prize"]["id"] - 1; //指定每次旋转到的奖品下标
            this.lottery_ticket =
              this.lottery_ticket > 0 ? this.lottery_ticket - 1 : 0;
            this.rotating();
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
      this.init_prize_list();
      this.toast_control = true;
      this.disable = false;
      this.hasPrize = this.award.angle.length != 0;
    },
    //关闭弹窗
    close_toast() {
      this.toast_control = false;
    },
    //领取
    handleCollect() {
      this.Api.joinAct({ type: this.activityType, step: "getPrize" }).then(
        ({ success, msg }) => {
          if (success) {
            this.$alert(msg, "提示", {
              confirmButtonText: "确定"
            });
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.lucky-wheel {
  width: 100%;
  min-height: 885px;
  padding: 1px;
  box-sizing: border-box;
  background: rgb(252, 207, 133)
    url("../../../assets/images/activity/big-wheel-bg.jpg") no-repeat left top;
  background-size: cover;
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
  background: url("../../../assets/images/activity/close_store.png") no-repeat
    center top;
  background-size: 100%;
}
.wheel-nr {
  width: 1323px;
  min-height: 758px;
  margin: 65px auto 80px;
  position: relative;
  background: url("../../../assets/images/activity/big_wheel_nr.png") no-repeat;
  background-size: cover;
}
.wheel-main {
  position: absolute;
  top: 128px;
  left: 95px;
  width: 585px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
.wheel-bg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 585px;
  height: 585px;
  background: url(../../../assets/images/activity/draw_wheel.png) no-repeat
    center top;
  background-size: 100%;
  color: #fff;
  font-weight: 500;
  /* transition: transform 3s ease;
  transform: rotate(20deg); */
}
.wheel-rule {
  width: 488px;
  height: 600px;
  position: absolute;
  top: 158px;
  right: 122px;
  .title {
    font-size: 30px;
    color: #fff;
    text-align: center;
    margin-bottom: 25px;
  }
  .rule-text {
    max-height: 350px;
    overflow: hidden;
    color: #fff !important;
    font-size: 15px !important;
  }
  .collect {
    position: absolute;
    width: 100%;
    bottom: 35px;
  }
}
.turntable-num {
  width: 100%;
  height: 56px;
  line-height: 56px;
  text-align: center;
  font-size: 22px;
  color: #fcdf00;
  margin-bottom: 15px;
  background: url("../../../assets/images/activity/turntable_text.png")
    no-repeat;
  background-size: cover;
}
.collect-instant {
  cursor: pointer;
  width: 100%;
  height: 72px;
  background: url("../../../assets/images/activity/turntable_btn.png") no-repeat
    left top;
}
.collect-text {
  text-align: center;
  font-size: 16px;
  width: 100%;
  height: 72px;
}
</style>
