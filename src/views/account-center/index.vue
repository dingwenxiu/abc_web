<template>
  <div class="account">
    <el-tabs v-model="activeName" type="border-card" :before-leave="handleBeforeLeave">
      <el-tab-pane label="账户管理" :lazy="true" name="account-manage">
        <account-manage></account-manage>
      </el-tab-pane>
      <el-tab-pane label="投注记录" :lazy="true" name="bet-record">
        <bet-record></bet-record>
      </el-tab-pane>
      <el-tab-pane label="资金管理" :lazy="true" name="fund-manage">
        <fund-manage></fund-manage>
      </el-tab-pane>
      <el-tab-pane label="账变记录" :lazy="true" name="betchage-record">
        <fund-record></fund-record>
      </el-tab-pane>
      <el-tab-pane label="充值申请" :lazy="true" name="user-recharge">
        <user-recharge></user-recharge>
      </el-tab-pane>
      <el-tab-pane label="提现申请" :lazy="true" name="user-withdraw">
        <user-withdraw></user-withdraw>
      </el-tab-pane>
      <el-tab-pane label="奖金组详情" :lazy="true" name="prize-detail">
        <prize-detail></prize-detail>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import betRecord from "./components/bet-record";
import fundManage from "./components/fund-manage/index";
import fundRecord from "./components/fund-record";
import userRecharge from "./components/user-recharge";
import userWithdraw from "./components/user-withdraw";
import accountManage from "./components/account-manage/index";
import prizeDetail from "./components/prize-detail";

export default {
  name: "Account",
  components: {
    betRecord,
    fundManage,
    fundRecord,
    accountManage,
    userRecharge,
    userWithdraw,
    prizeDetail
  },
  data() {
    return {
      activeName: "",
      copyActiveName: "",
      showBulletin: false
    };
  },
  provide() {
    return {
      active: this.subtype
    };
  },
  props: ["type", "subtype"],
  computed: {
    ...mapGetters(["userFrozen"])
  },
  created() {
    this.activeName = this.type ? this.type : "account-manage";
  },
  methods: {
    handleBeforeLeave(activeName) {
      if (activeName === "fund-manage") {
        if (this.userFrozen === 4) {
          this.$alert("对不起，您已被禁止资金操作", "提示", {
            confirmButtonText: "确定",
            closeOnClickModal: false,
            closeOnPressEscape: false,
            showClose: false
          });
          return false;
        }
      } 
      this.$router.push(`/account-center/${activeName}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.account {
  width: 1200px;
  margin: 15px auto 55px;
  background: #fff;
  /deep/ {
    .pagination-container {
      text-align: right;
      margin-top: 5px;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: $button-color;
    }
    .el-tabs--border-card > .el-tabs__header .el-tabs__item {
      color: #fff;
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
      background: #fffbf5;
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
    .el-tabs--border-card > .el-tabs__content {
      padding: 0;
    }
  }
}
.account .sub-account {
  /deep/ {
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: $button-color;
      border-color: $button-color;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      box-shadow: -1px 0 0 0 $button-color;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__nav-scroll {
      background: #ffffff !important;
    }
    .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
      background-color: #fffbf5;
    }
    .el-tabs__item + .el-tabs__item {
      &::before {
        content: "";
        display: block;
        width: 1px;
        height: 18px;
        background: #e6d7c0;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
      }
    }
    .el-tabs__item.is-active {
      color: #000;
      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background: $primary-color;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
    }
    .el-tabs__item:hover {
      color: $primary-color-hover;
    }
  }
}
</style>

