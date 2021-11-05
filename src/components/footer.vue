<template>
  <footer class="footer">
    <div class="center container">
      <div class="award clear">
        <img :src="`${picBaseUrl}/${baseData['logo_image_pc_2']}`" alt="logo" class="logo left" />
        <div class="award-txt right">
          <p>
            ￥
            <span class="txt-big txt">
              <countTo
                :startVal="withdrawalTime.startVal"
                :endVal="withdrawalTime.endVal"
                :duration="4000"
              ></countTo>
            </span> 今日已实现兑奖
          </p>
          <p class="p2">
            <span class="txt-big txt">
              <countTo
                @reset="resetCountTo"
                :startVal="depositTime.startVal"
                :endVal="depositTime.endVal"
                :duration="4000"
              ></countTo>
            </span>在线人数
          </p>
        </div>
      </div>
      <div class="nav-container clear">
        <div class="navs left">
          <div class="nav-detail">
            <!-- <span class="span1">包网品牌</span> -->
            <router-link class="span1" tag="span" :to="`/help-center`">帮助中心</router-link>
            <router-link tag="span" :to="`/download`">手机客户端</router-link>
            <router-link tag="span" :to="`/preventHijack`">防劫持教程</router-link>
          </div>
          <p>
            ©2019快乐彩版权所有
            <span class="txt">菲律宾政府 PAGCOR 博彩牌照认证</span>
          </p>
          <p>快乐彩郑重提示：彩票有风险，投注需谨慎，不向未满18周岁的青少年出售彩票</p>
        </div>
        <div class="right">
          <p class="title">存款到账平均时间</p>
          <p>
            <span class="time1 time"></span>
            <span class="txt-big txt">10</span> 秒
          </p>
          <p class="title">取款到账平均时间</p>
          <p>
            <span class="time2 time"></span>
            <span class="txt-big txt">50</span> 秒
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import countTo from "vue-count-to";
import { mapGetters } from "vuex";
import { randomNum } from "@/utils";
export default {
  name: "footer-bar",
  components: { countTo },
  data() {
    return {
      withdrawalTime: {
        startVal: 0,
        endVal: 456100
      },
      depositTime: {
        startVal: 0,
        endVal: 500
      }
    };
  },
  computed: {
    ...mapGetters(["baseData", "picBaseUrl"])
  },
  mounted() {
    this.resetCountTo();
  },
  watch: {
    $route() {
      this.resetCountTo();
    }
  },

  methods: {
    resetCountTo() {
      const haveStorage = this.Utils.storage.get("withdrawalTime");
      const haveDepositTime = this.Utils.storage.get("depositTime");
      const now = new Date();
      const setTime = haveStorage && new Date(haveStorage.setTime);
      if (haveStorage && now.getDate() === setTime.getDate()) {
        this.withdrawalTime.endVal = haveStorage.data + randomNum(5, 1000);
        this.depositTime.endVal = haveDepositTime.data + randomNum(0, 50);
      } else {
        this.withdrawalTime.endVal = 456100 + randomNum(5, 1000);
        this.depositTime.endVal = 500 + randomNum(1, 50);
      }

      this.Utils.storage.set("withdrawalTime", this.withdrawalTime.endVal);
      this.Utils.storage.set("depositTime", this.depositTime.endVal);
    }
  }
};
</script>
<style lang="scss" scoped>
.footer {
  padding: 20px 80px 40px;
  min-width: 1200px;
  background-color: #2e2832;
  color: #8b8c91;
  .center {
    width: 1200px;
    margin: 0 auto;
  }
  .award {
    border-bottom: 1px dotted #8b8c91;
    position: relative;
    .logo {
      max-width: 120px;
      max-height: 50px;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }
    .award-txt {
      line-height: 50px;
      p {
        display: inline-block;
      }
      .p2 {
        margin-left: 50px;
      }
    }
  }
  .txt-big {
    font-size: 28px;
    font-weight: bold;
  }
  .txt {
    color: #b2b5bc;
  }
  .nav-container {
    .navs {
      .nav-detail {
        span {
          position: relative;
          display: inline-block;
          height: 50px;
          line-height: 55px;
          cursor: pointer;
          padding: 0 15px;

          &:not(:last-child):after {
            position: absolute;
            content: "|";
            right: -2px;
            top: 0px;
            height: 20px;
          }
        }
        .span1 {
          padding: 0 20px 0 0;
        }
      }
    }
    .time {
      display: inline-block;
      width: 250px;
      height: 10px;
      margin-right: 5px;
      border-radius: 10px;
    }
    .time1 {
      background: #fac209;
    }
    .time2 {
      background: #fac209;
    }
    .title {
      margin-top: 10px;
    }
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
}
</style>
