<template>
  <div class="active" v-loading="loading">
    <el-row class="active-group">
      <el-col :span="24">
        <el-card
          v-for="(item, index) in list"
          :key="index"
          class="active-group-item"
          shadow="hover"
        >
          <div class="expire" v-if="item.expire">已过期</div>
          <img class="img" :src=" baseData.system_pic_base_url + '/' + item.img" />
          <div class="head">
            <p class="public_color">{{item.name}}</p>
            {{item.start_time}}-{{item.end_time}}
            <el-button class="btn" type="danger" @click="handeleShowDetail(item)">查看详细</el-button>
          </div>
          <el-collapse-transition>
            <div v-if="item.show" class="collapse">
              <div v-html="item.content_text"></div>
            </div>
          </el-collapse-transition>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      list: null,
      loading: false,
      rootUrl: process.env.VUE_APP_API_URL,
      show: false
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["baseData"])
  },
  methods: {
    ...mapActions(["getBanner"]),
    init() {
      this.loading = true;
      this.getBanner().then(({ success, data }) => {
        this.loading = false;
        if (success) {
          const now = new Date();
          data.forEach(val => {
            const endTime = new Date(val.end_time);
            if (endTime - now < 0) {
              val.expire = true;
            } else {
              val.expire = false;
            }
          });
          this.list = data.filter(v => v.status != 2);
        }
      });
    },
    handeleShowDetail(item) {
      if (item.type === "turntable_one") {
        this.$router.push("/active/big-wheel-one");
      } else if (item.type === "turntable") {
        this.$router.push("/active/big-wheel");
      } else if (item.type === "red_pack_rain") {
        this.$router.push("/active/red-pack-rain");
      } else if (item.type === "checkin") {
        this.$router.push("/active/sgin-activity");
      } else if (item.type === "first_recharge") {
        this.$router.push("/active/first-charge");
      } else if (item.type === "gift_recharge") {
        this.$router.push("/active/gift-recharge");
      } else if(item.type === "active_info") {
        this.$router.push({
          path:"/active/active_info"})
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.active {
  width: 1200px;
  min-height: 685px;
  margin: 0 auto;
  .active-group {
    padding-top: 30px;
  }
  .active-group-item {
    margin-bottom: 30px;
    position: relative;
    .expire {
      position: absolute;
      top: 0;
      right: 0;
      padding: 25px 15px;
      background: #e8744a;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      color: #fff;
    }
  }
  /deep/ {
    .el-card {
      transition: none;
    }
    .el-card__body {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 18px 40px 18px 20px;
      background: #fdfdfd;
      border-radius: 4px;
      .img {
        width: 710px;
        height: 184px;
      }
    }
    .el-button--danger {
      background-color: $primary-color;
      border-color: $primary-color;

      span {
        font-size: 18px;
      }
    }
    .head {
      position: relative;
      width: 390px;
      font-size: 14px;
      line-height: 25px;
      color: #999;
      .public_color {
        color: $primary-color-hover;
        border-color: #fc1805;
      }
      p {
        font-size: 20px;
        line-height: 50px;
      }
    }
    .btn {
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
  .collapse {
    clear: both;
    width: 100%;
  }
}
</style>
