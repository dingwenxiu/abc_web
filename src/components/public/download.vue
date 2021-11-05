<template>
  <div class="download">
    <div class="content">
      <!-- ios -->
      <img class="qr-img" :src="`${picBaseUrl}/${qrSrc.qr_code_2}`" alt="二维码" />
      <!-- 安卓 -->
      <img class="qr-img qr-img-2" :src="`${picBaseUrl}/${qrSrc.qr_code_1}`" alt="二维码" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "download",
  computed: {
    ...mapGetters(["qrSrc", "picBaseUrl"])
  }
};
</script>

<style lang="scss" scoped>
.download {
  height: 980px;
  background-image: linear-gradient(-90deg, #89f7fd 0%, #66a5ff 100%);
  .content {
    position: relative;
    width: 1200px;
    height: 980px;
    margin: 0 auto;
    background: url("../../assets/images/new/download.png") no-repeat center
      center;
    background-size: contain;
  }
}
.qr-img {
  position: absolute;
  left: 638px;
  top: 380px;
  width: 220px;
  height: 220px;
  &.qr-img-2 {
    left: 953px;
  }
}
</style>
