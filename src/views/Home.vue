<template>
  <section>
    <head-bar ref="headBar"></head-bar>
    <div style="min-height:665px;">
      <router-view :key="$route.fullPath"></router-view>
    </div>

    <foot-bar></foot-bar>
    <!-- 悬浮 -->
    <transition name="el-zoom-in-center">
      <div class="float-layer" ref="floatLayer" v-if="showSideFloat">
        <div class="link-group">
          <router-link tag="div" :to="`/download`" class="link-item">
            <i class="el-icon-mobile-phone"></i> APP下载
          </router-link>
          <router-link tag="div" :to="`/account-center`" class="link-item">
            <i class="el-icon-user-solid"></i> 个人中心
          </router-link>
          <div @click="showMessageCenter" class="link-item">
            <i class="el-icon-message"></i> 站内信
          </div>
          <router-link tag="div" :to="`/account-center/bet-record`" class="link-item">
            <i class="el-icon-document"></i> 投注记录
          </router-link>
        </div>
        <a
          href="javascript:;"
          @click="$store.commit('SET_SHOW_FLOAT', !showSideFloat)"
          class="close"
        >
          <i class="fa el-icon-close" aria-hidden="true"></i>
        </a>
      </div>
    </transition>
    <transition name="el-zoom-in-center">
      <div class="float-layer" ref="floatLayer" v-if="!showSideFloat">
        <div class="link-group">
          <div
            @click="$store.commit('SET_SHOW_FLOAT', !showSideFloat)"
            class="link-item link-item-more"
          >
            <img src="../assets/images/more_copy.png" />
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import HeadBar from "../components/header";
import FootBar from "../components/footer";
export default {
  name: "home",
  components: {
    FootBar,
    HeadBar
  },
  mounted() {
    this.debounce = this._.debounce(this.handleScroll, 150);
    window.addEventListener("scroll", this.debounce);
  },
  computed: {
    ...mapGetters(["showSideFloat", "isLogin"])
  },
  data() {
    return {};
  },
  methods: {
    // 悬浮
    handleScroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      const floatLayer = this.$refs.floatLayer;
      if (!floatLayer) return;
      if (scrollTop > 400) {
        floatLayer.style.top = "28%";
      } else if (scrollTop < 1790) {
        floatLayer.style.top = "60%";
      } else {
        floatLayer.style.top = "50%";
      }
    },
    showMessageCenter() {
      if (this.isLogin) {
        this.$refs.headBar.showMessageCenter();
      } else {
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.float-layer {
  box-sizing: border-box;
  width: 90px;
  position: fixed;
  background-size: contain;
  z-index: 300;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  transition: all 0.3s;
  .link-group {
    color: #fff;
    .link-item {
      cursor: pointer;
      width: 90px;
      height: 70px;
      border-radius: 4px;
      background-image: linear-gradient(0deg, #ab0fe6 0%, #f15cff 100%);
      font-size: 15px;
      margin-top: 9px;
      text-align: center;
      &:first-child {
        margin-top: 0;
      }
      & > i {
        font-size: 30px;
        padding: 10px 0 2px 0;
        display: block;
      }
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  .close {
    display: block;
    position: relative;
    left: 50%;
    height: 18px;
    width: 1px;
    background: #c730ff;
    i {
      box-sizing: border-box;
      position: absolute;
      bottom: -32px;
      left: -16px;
      width: 32px;
      height: 32px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #c730ff;
      font-size: 22px;
      border: 2px solid #c730ff;
    }
  }
}
.link-item-more {
  cursor: pointer;
  width: 55px !important;
  height: 40px !important;
  border-radius: 4px;
  background-image: linear-gradient(0deg, #ab0fe6 0%, #f15cff 100%);
  font-size: 15px;
  text-align: center;
  margin-left: 35px;
  & > img {
    display: inline-block;
    width: 25px;
    margin-top: 7px;
  }
}
</style>
