<template>
  <div class="agent-center">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="代理首页" :lazy="true" name="team-list">
        <team-player-list></team-player-list>
      </el-tab-pane>
      <el-tab-pane label="团队管理" :lazy="true" name="user-manage">
        <child-manage></child-manage>
      </el-tab-pane>
      <el-tab-pane label="团队盈亏" :lazy="true" name="user-profits">
        <team-profits></team-profits>
      </el-tab-pane>
      <el-tab-pane
        v-if="Number(userDetail.salary_percentage) > 0"
        label="日工资报表"
        :lazy="true"
        name="user-daysalary"
      >
        <team-day-salary></team-day-salary>
      </el-tab-pane>
      <el-tab-pane
        v-if="Number(userDetail.bonus_percentage) > 0"
        label="代理分红报表"
        :lazy="true"
        name="user-bonus"
      >
        <team-bonus></team-bonus>
      </el-tab-pane>
      <el-tab-pane label="下级开户" :lazy="true" name="accurate-create">
        <accurate-create></accurate-create>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import teamProfits from "./components/team-profits";
import childManage from "./components/child-manage";
import accurateCreate from "./components/accurate-create";
import teamDaySalary from "./components/team-day-salary";
import teamBonus from "./components/team-bonus";
// import agentMessage from './components/agent-message'
import teamPlayerList from "./components/team-player-list";

export default {
  name: "agentCenter",
  components: {
    teamProfits,
    childManage,
    accurateCreate,
    teamDaySalary,
    teamBonus,
    // agentMessage,
    teamPlayerList
  },
  data() {
    return {
      activeName: "team-list"
    };
  },
  computed: {
    ...mapGetters(["userDetail"])
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.agent-center {
  width: 1200px;
  margin: 30px auto 55px;
  background: #fff;
  /deep/ {
    .el-input--mini .el-input__inner {
      height: 28px;
    }
    .el-tabs--border-card > .el-tabs__content {
      padding: 0;
    }
    .pagination-container {
      text-align: right;
      margin-top: 5px;
    }
    .el-tabs--border-card > .el-tabs__header .el-tabs__item {
      color: #000;
    }
    .el-tabs__nav-scroll {
      background-image: linear-gradient(
        to right,
        $deputy-color,
        $primary-color
      );
    }
    .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
      color: #000;
      position: relative;
      &::before {
        position: absolute;
        content: " ";
        width: 100%;
        height: 2px;
        top: 0;
        left: 0;
        background: $primary-color;
      }
    }
    .el-tabs--border-card
      > .el-tabs__header
      .el-tabs__item:not(.is-disabled):hover {
      color: $primary-color;
    }
    .el-tabs__item {
      height: 50px;
      line-height: 50px;
      padding: 0 30px !important;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: $button-color;
    }
    .el-input--mini {
      margin-top: -4px !important;
    }
  }
}
</style>
