<template>
  <div class="sign-activity">
    <div class="container">
      <div class="sign-title"></div>
      <div class="checkin-centent">
        <div class="calendar">
          <div class="title">已连续签到 {{this.lxMax}} 天</div>
          <table class="calendar-body">
            <thead>
              <tr>
                <th class="calendar-week-day" v-for="(item, index) in sun" :key="index">{{item}}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="calendar-day-group" v-for="(items, index) in currentMonth" :key="index">
                <td
                  class="calendar-day-item"
                  :class="{on: item['checked']}"
                  v-for="(item, index) in items"
                  :key="index"
                >
                  <span :class="item['class']">{{item['data']}}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="checkin-btn">
            <el-button :loading="btnLoading" @click="handleCheckin" type="danger" round>签到</el-button>
          </div>
        </div>
        <div class="box-group">
          <div class="box-item" v-for="(item, index) in prize" :key="index">
            <div class="box-item-title">连续签到{{item.days}}天</div>
            <div :class="{on : !item.dis}" class="box-item-body">
              <img src="../../../assets/images/activity/gift_box.png" alt class="img" />
              <div class="box-item-btn">
                <el-button
                  :disabled="item.yet || item.dis"
                  :class="{dis : item.dis}"
                  @click="handleGetGift(item)"
                  type="danger"
                  round
                >
                  <template v-if="item.yet">已领取</template>
                  <template v-else>领取</template>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rule-body" v-html="textRule"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      sun: ["日", "一", "二", "三", "四", "五", "六"],
      btnLoading: false,
      btnBoxLoading: false,
      boxDays: [7, 14, 21, 30], //连续签到天数
      avtiveLog: [],
      lxMax: null,
      prize: [],
      textRule: null
    };
  },
  computed: {
    ...mapGetters(["picBaseUrl"]),
    currentMonth() {
      const date = new Date(),
        spanContainer = [],
        days = this.getDaysOfMonth(); //计算出这个月的天数
      date.setDate(1); //将date的日期设置为1号
      const firstDay = date.getDay(); //知道这个月1号是星期几

      //如果1号不是周日(一周的开头),则在1号之前要补全
      for (let i = 0; i < firstDay; i++) {
        const tempDate = new Date(date);
        tempDate.setDate(i - firstDay + 1);
        spanContainer.push({ data: tempDate.getDate(), class: "unshow" });
      }
      //1号到这个月最后1天
      for (let i = 1; i <= days; i++) {
        const curDate = new Date(date);
        spanContainer.push({
          data: curDate.getDate(),
          class: "show",
          checked: this.avtiveLog.some(v => {
            const newDate = new Date(v.created_at);
            return newDate.getDate() === curDate.getDate();
          })
            ? true
            : false
        });

        date.setDate(i + 1);
      }
      for (let i = date.getDay(); i <= 6; i++) {
        const curDate = new Date(date);
        spanContainer.push({ data: curDate.getDate(), class: "unshow" });
        date.setDate(date.getDate() + 1);
      }
      return this._.chunk(spanContainer, 7);
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      // 获取活动信息
      this.Api.getOne({ type: "checkin" }).then(({ success, data }) => {
        if (success) {
          const { avtive_log, avtive_lx_log, prize, lx_max, pc_desc } = data;
          this.textRule = pc_desc;
          this.lxMax = lx_max;
          this.avtiveLog = avtive_log;
          this.prize = prize.filter(v => {
            if (avtive_lx_log && avtive_lx_log.some(e => e.days == v.days)) {
              v.yet = true;
            } else {
              v.yet = false;
            }
            if (v.days > lx_max) {
              v.dis = true;
            } else {
              v.dis = false;
            }
            return v.days > 1;
          });
        }
      });
    },
    handleCheckin() {
      this.btnLoading = true;
      this.Api.joinAct({ type: "checkin", days: 1 })
        .then(({ success, msg }) => {
          this.btnLoading = false;
          this.initData();
          if (success) {
            this.$alert(msg, "提示", {
              confirmButtonText: "确定"
            });
            this.initData();
          }
        })
        .catch(() => {
          this.btnLoading = false;
        });
    },
    // 计算一个月的天数
    getDaysOfMonth() {
      const date = new Date(), //要新建一个对象，因为会改变date
        month = date.getMonth(),
        time = date.getTime(), //计算思路主要是month+1,相减除一天的毫秒数
        newTime = date.setMonth(month + 1);
      return Math.ceil((newTime - time) / (24 * 60 * 60 * 1000));
    },
    handleGetGift(item) {
      this.Api.joinAct({ type: "checkin", days: item["days"] }).then(
        ({ success, msg }) => {
          this.initData();
          if (success) {
            this.$alert(msg, "提示", {
              confirmButtonText: "确定"
            });
            this.initData();
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.sign-activity {
  background: #0b0704;
  position: relative;
  .container {
    box-sizing: border-box;
    height: auto;
    padding: 1px;
    background: url("../../../assets/images/activity/sign_activity.jpg") top
      center;
    background-size: cover;
  }
}
.checkin-centent {
  width: 1200px;
  margin: 192px auto 0;
  overflow: hidden;
  .calendar {
    position: relative;
    float: left;
    width: 670px;
    background: url("../../../assets/images/activity/calendar_bg.png") no-repeat;
    background-size: 100% 100%;
  }
}
.calendar {
  .title {
    font-size: 24px;
    color: #fb3352;
    text-align: center;
    margin-top: 45px;
  }
  .calendar-body {
    width: 512px;
    min-height: 445px;
    margin: 0 auto;
    .calendar-week-day {
      font-size: 26px;
      font-weight: normal;
      padding-top: 55px;
      padding-bottom: 25px;
      border-bottom: 1px solid #b9b9b9;
    }
    .calendar-day-group {
      .calendar-day-item {
        display: table-cell;
        text-align: center;
        font-size: 22px;
        line-height: 0;
        padding: 28px 0;
        &.on {
          background: url("../../../assets/images/activity/sign_checked.png")
            no-repeat center center;
        }
        .unshow {
          color: #ccc;
        }
      }
    }
  }
}
.checkin-btn {
  padding: 23px 0 40px;
  text-align: center;
  /deep/ {
    .el-button--danger {
      font-size: 26px;
      padding: 14px 64px;
    }
  }
}
.box-group {
  float: left;
  width: 516px;
  height: 612px;
  margin-left: 13px;
  overflow: hidden;
  .box-item {
    float: left;
    margin-right: 13px;
    margin-bottom: 14px;
    .box-item-title {
      width: 245px;
      height: 50px;
      font-size: 22px;
      text-align: center;
      color: #fff;
      line-height: 50px;
      border-radius: 30px 30px 0 0;
      background-image: linear-gradient(
        90deg,
        #ab131b 0%,
        #eb1b17 49%,
        #ab131b 100%
      );
    }
    .box-item-body {
      width: 245px;
      height: 245px;
      text-align: center;
      border-radius: 0 0 30px 30px;
      background-image: linear-gradient(
        0deg,
        #7f151b 1%,
        #190d1d 55%,
        #1d111f 100%
      );
      .img {
        display: inline-block;
        margin-left: 10px;
      }
      &.on {
        background-image: linear-gradient(
          0deg,
          #eda719 1%,
          #190d1d 55%,
          #1d111f 100%
        );
      }
    }
  }
}
.box-item-btn {
  /deep/ {
    .el-button--danger {
      font-size: 18px;
      padding: 10px 35px;
      &.dis {
        background-color: #afafaf;
        border-color: #afafaf;
      }
    }
  }
}
.rule-body {
  box-sizing: border-box;
  min-height: 450px;
  background: #e6a23c54;
  margin: 30px auto;
  width: 1200px;
  padding: 15px 30px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.sign-title {
  position: absolute;
  width: 1200px;
  left: 50%;
  top: 90px;
  margin-left: -600px;
  height: 69px;
  background: url("../../../assets/images/activity/sign_title.png") no-repeat
    left top;
}
</style>