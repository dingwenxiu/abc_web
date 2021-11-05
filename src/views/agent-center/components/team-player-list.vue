<template>
  <div class="team-overview">
    <template v-if="data">
      <h2 class="title">人数统计</h2>
      <div class="container">
        <div class="filter-container" style="margin-bottom:20px;">
          <div class="filter-label">
            时间:
            <el-date-picker
              :clearable="false"
              size="medium"
              style="width:140px"
              v-model="gameTime[0]"
              placeholder="选择日期时间"
            ></el-date-picker>&nbsp;至&nbsp;
            <el-date-picker
              :clearable="false"
              size="medium"
              style="width:140px"
              v-model="gameTime[1]"
              placeholder="选择日期时间"
            ></el-date-picker>
          </div>
          <el-button size="medium" @click="changeTime('today')">今日</el-button>
          <el-button size="medium" @click="changeTime('yesterday')">昨日</el-button>
          <el-button size="medium" @click="changeTime('firstHalfMonth')">上半月</el-button>
          <el-button
            size="medium"
            :disabled="monthDisabled"
            @click="changeTime('secondHalfMonth')"
          >下半月</el-button>
          <el-button size="medium" @click="changeTime('thisMonth')">本月</el-button>
          <div class="bmn-search-button" style="margin-left:15px;">
            <el-button @click="searchList" :loading="searchLoading" class="btn">搜 索</el-button>
          </div>
        </div>
        <div class="paint-group">
          <div class="paint-item">
            <div class="label">投注人数</div>
            <div class="num">{{data['team_have_bet']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">新注册/团队人数</div>
            <div class="num">{{data['team_first_register']}} / {{data['child_count']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">首充人数</div>
            <div class="num">{{data['team_first_recharge_count']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">充值人数</div>
            <div class="num">{{data['team_repeat_recharge_count']}}</div>
          </div>
        </div>
      </div>
      <!-- 搜索 -->
      <h2 class="title">数据统计(彩票)</h2>
      <div class="container">
        <div class="paint-group" style="margin-top:15px;">
          <div class="paint-item">
            <div class="label">团队余额</div>
            <div class="num">￥{{data['team_balance']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">充值金额</div>
            <div class="num">￥{{data['team_recharge_amount']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">提现金额</div>
            <div class="num">￥{{data['team_withdraw_count']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">投注总额</div>
            <div class="num">￥{{data['team_bets']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">派奖总额</div>
            <div class="num">￥{{data['team_bonus']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">投注返点</div>
            <div class="num">￥{{data['team_commission_from_bet']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">代理返点</div>
            <div class="num">￥{{data['team_commission_from_child']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">活动礼金</div>
            <div class="num">￥{{data['team_gift']}}</div>
          </div>
          <div class="paint-item" v-if="data['team_salary'] > 0">
            <div class="label">日工资</div>
            <div class="num">￥{{data['team_salary']}}</div>
          </div>
          <div class="paint-item">
            <div class="label">净盈亏</div>
            <div class="num">
              <span
                :style="{'color': data['profit'] >= 0 ? 'green' : 'red'}"
              >￥{{ data['profit'] > 0 ? data['profit'] : data['profit'] }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    const date1 = new Date();
    date1.setHours(0, 0, 0);
    const date2 = new Date();
    date2.setHours(23, 59, 59);
    return {
      data: null,
      gameTime: [new Date(date1), new Date(date2)],
      searchLoading: false,
      listQuery: {
        page_size: 10,
        page_index: 1,
        start_day: "",
        end_day: ""
      }
    };
  },
  computed: {
    monthDisabled: function() {
      const now = new Date();
      if (now.getDate() < this.getMonthDays() / 2) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    gameTime: {
      handler(newName) {
        if (newName && newName.length) {
          this.listQuery.start_day = this.Utils.formatTime(
            newName[0],
            "YYYY-MM-DD"
          );
          this.listQuery.end_day = this.Utils.formatTime(
            newName[1],
            "YYYY-MM-DD"
          );
        } else {
          this.listQuery.start_day = "";
          this.listQuery.end_day = "";
        }
      },
      immediate: true
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getMonthDays() {
      const date = new Date(), //要新建一个对象，因为会改变date
        month = date.getMonth(),
        time = date.getTime(), //计算思路主要是month+1,相减除一天的毫秒数
        newTime = date.setMonth(month + 1);
      return Math.ceil((newTime - time) / (24 * 60 * 60 * 1000));
    },
    // 时间变动
    changeTime(time) {
      switch (time) {
        case "today":
          {
            const date1 = new Date();
            date1.setHours(0, 0, 0);
            const date2 = new Date();
            date2.setHours(23, 59, 59);
            this.gameTime = [new Date(date1), new Date(date2)];
          }
          break;
        case "yesterday":
          {
            const date = new Date();
            const before = date - 1000 * 60 * 60 * 24;
            const beforeDate = new Date(before);
            this.gameTime = [
              new Date(beforeDate.setHours(0, 0, 0)),
              new Date(beforeDate.setHours(23, 59, 59))
            ];
          }
          break;
        case "firstHalfMonth":
          {
            const date = new Date();
            const date1 = new Date(date.getFullYear(), date.getMonth(), 1);
            const date2 = new Date(
              date.getFullYear(),
              date.getMonth(),
              this.getMonthDays() / 2
            );
            this.gameTime = [
              date1.setHours(0, 0, 0),
              date2.setHours(23, 59, 59)
            ];
          }
          break;
        case "secondHalfMonth":
          {
            const date = new Date();

            const date1 = new Date(
              date.getFullYear(),
              date.getMonth(),
              this.getMonthDays() / 2 + 1
            );
            const date2 = new Date(
              date.getFullYear(),
              date.getMonth(),
              this.getMonthDays()
            );
            this.gameTime = [
              date1.setHours(0, 0, 0),
              date2.setHours(23, 59, 59)
            ];
          }
          break;
        case "thisMonth":
          {
            const date = new Date();

            const date1 = new Date(date.getFullYear(), date.getMonth(), 1);
            const date2 = new Date(
              date.getFullYear(),
              date.getMonth(),
              this.getMonthDays()
            );
            this.gameTime = [
              date1.setHours(0, 0, 0),
              date2.setHours(23, 59, 59)
            ];
          }
          break;
      }
      this.getList();
    },
    getList() {
      for (let propName in this.listQuery) {
        if (this.listQuery[propName] == "" || this.listQuery[propName] == []) {
          delete this.listQuery[propName];
        }
      }
      this.listLoading = true;
      this.searchLoading = true;
      this.Api.getTeamReport(this.listQuery)
        .then(res => {
          const { success, data } = res;
          this.listLoading = false;
          this.searchLoading = false;
          if (success) {
            this.data = data;
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    searchList() {
      this.listQuery.page_index = 1;
      this.listQuery.parent_id = "";
      this.showBreadcrumb = false;
      this.breadcrumbList = [];
      this.getList();
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../../assets/css/var.scss";
.bmn-search-button {
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  width: 80px;
  height: 36px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);
  border-style: solid;
  border-width: 1px;
  border-image-slice: 1;
  border-radius: 3px;
  text-align: center;
  line-height: 34px;
  color: white;
  margin-right: 8px;
  /deep/ {
    .el-button {
      border: 0;
      border-radius: 0;
    }
  }
  .btn {
    width: 80px;
    height: 100%;
    background: $button-color;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
      inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);
    border-width: 1px;
    color: #000;
    padding: 0;
  }
}
.team-overview {
  padding: 15px;
  min-height: 603px;
  h2.title {
    font-size: 20px;
    font-weight: 400;
    padding-left: 10px;
    margin-top: 15px;
    border-left: 3px solid $primary-color;
  }
}
.container {
  padding: 0 15px 15px;
}
.filter-container {
  margin-top: 10px;
  .filter-label {
    display: inline-block;
    margin-right: 20px;
  }
}
.paint-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.paint-item {
  box-sizing: border-box;
  width: 260px;
  padding: 20px;
  margin-right: 32px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-radius: 4px;
  background-image: linear-gradient(to bottom, $child-color, #ffffff);
  &:nth-child(4n) {
    margin-right: 0;
  }
}
</style>
