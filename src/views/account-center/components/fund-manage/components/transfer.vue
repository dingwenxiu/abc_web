<template>
  <div class="transfer">
    <h4 class="title">请点击选取钱包:</h4>
    <div class="wallet-box" v-loading="btnLoading">
      <div class="box-l">
        <div class="wallet-box-item">
          <div class="stick">
            <template v-if="transfer">转出</template>
            <template v-else>转入</template>
          </div>
          <div class="title">主钱包</div>
          <div class="amount">{{this.userDetail.balance && Utils.toFixed(this.userDetail.balance)}}</div>
        </div>
      </div>
      <div class="box-r">
        <div
          @click="clickWalletBox(item)"
          class="wallet-box-item"
          v-for="(item, index) in casinoPlatOptions"
          :key="index"
        >
          <img class="ico" :src="`${picBaseUrl}/${item.image}`" />
          <div class="stick" v-if="transferPlat === item.main_game_plat_code">
            <template v-if="transfer">转入</template>
            <template v-else>转出</template>
          </div>
          <div class="title">{{item.main_game_plat_name}}</div>
          <div class="amount">{{item.balance && Utils.toFixed(item.balance)}}</div>
        </div>
      </div>
    </div>
    <div class="transfer-des">
      <p class="des">
        <span class="wallet-name">转出钱包：</span>
        {{transferName.toName}}
      </p>
      <p class="des">
        <span class="wallet-name">转入钱包：</span>
        {{transferName.inName}}
      </p>
      <i @click="changeTransfer" class="btn el-icon-sort"></i>
    </div>
    <div class="transfer-input transfer-des">
      <p class="des">
        <span class="wallet-name">转出金额：</span>
        <el-input style="width:200px" v-model="amount"></el-input>
      </p>
      <p class="des">
        <el-radio-group v-model="radio" @change="radioChange">
          <el-radio :label="50">50</el-radio>
          <el-radio :label="100">100</el-radio>
          <el-radio :label="1000">1000</el-radio>
          <el-radio label="all">全部</el-radio>
        </el-radio-group>
      </p>
    </div>
    <div class="bmn-search-button" @click="handleTransfer">确认转账</div>
    <!-- <div class="filter-container">
      <el-select size="mini" v-model="transfer" style="width:80px; margin-right:15px;">
        <el-option label="转入" value="in"></el-option>
        <el-option label="转出" value="to"></el-option>
      </el-select>
      <el-select
        size="mini"
        v-model="transferPlat"
        style="width:140px; margin-right:15px;"
        placeholder="请选择游戏平台"
      >
        <el-option
          v-for="(item, index) in casinoPlatOptions"
          :key="index"
          :label="item.main_game_plat_name"
          :value="item.main_game_plat_code"
        ></el-option>
      </el-select>额度转换：
      <el-input-number
        style="width:100px"
        size="mini"
        v-model="amount"
        controls-position="right"
        :min="1"
      ></el-input-number>
      <div class="bmn-search-button" style="margin-left:20px;">
        <el-button @click="handleTransfer" class="btn">确 定</el-button>
      </div>
    </div>
    <h2 class="h2">平台余额查询</h2>
    <div class="amout-search">
      <div
        v-for="(item, index) in tableData"
        :key="index"
      >{{item.main_game_plat_name}} {{item.balance}}</div>
    </div>-->

    <!-- 确认自己密码 -->
    <el-dialog class="dialog-create-pass" title="请输入资金密码" width="400px" :visible.sync="showSetFund">
      <el-form status-icon label-width="100px" class="demo-ruleForm">
        <el-form-item label="资金密码" prop="password">
          <el-input
            size="mini"
            maxlength="16"
            style="width:200px;"
            type="password"
            v-model="fundPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="fundPassword = ''">重置</el-button>
          <el-button size="medium" :loading="btnLoading" type="primary" @click="submitForm()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { pswdEncode } from "@/utils/auth";
export default {
  data() {
    return {
      radio: null,
      transfer: true, //true 转出， false 转入
      casinoPlatOptions: [],
      tableData: [],
      currentWallet: {},
      transferName: {
        inName: "", //转入钱包
        toNmae: "" //转出钱包
      },
      transferPlat: "",
      amount: null,
      btnLoading: false,
      balance: "",
      showSetFund: false,
      fundPassword: ""
    };
  },
  computed: {
    ...mapGetters(["userDetail", "picBaseUrl"])
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions(["getUserDetail"]),
    initData() {
      this.Api.casinoPlat().then(({ success, data }) => {
        if (success) {
          this.casinoPlatOptions = data;
          this.tableData = data;
          this.tableData.forEach(v => {
            this.handleAmountSearch(v.main_game_plat_code).then(val => {
              this.$set(v, "balance", val);
            });
          });
          this.currentWallet = this.tableData.length && this.tableData[0];
          this.transferPlat =
            this.tableData.length && this.tableData[0]["main_game_plat_code"];
          this.transferName.toName = "主钱包";
          this.transferName.inName =
            this.tableData.length && this.tableData[0]["main_game_plat_name"];
        }
      });
    },
    changeTransfer() {
      this.amount = null;
      this.radio = null;
      this.transfer = !this.transfer;
      if (this.transfer) {
        this.transferName.inName = this.transferName.toName;
        this.transferName.toName = "主钱包";
      } else {
        this.transferName.toName = this.transferName.inName;
        this.transferName.inName = "主钱包";
      }
    },
    clickWalletBox(item) {
      this.amount = null;
      this.radio = null;
      this.currentWallet = item;
      this.transferPlat = item.main_game_plat_code;
      if (this.transfer) {
        this.transferName.inName = item.main_game_plat_name;
        this.transferName.toName = "主钱包";
      } else {
        this.transferName.toName = item.main_game_plat_name;
        this.transferName.inName = "主钱包";
      }
    },
    radioChange(val) {
      if (val === "all") {
        if (this.transfer) {
          this.amount = Number(this.userDetail.balance);
        } else {
          this.amount = Number(this.currentWallet.balance);
        }
      } else {
        this.amount = val;
      }
    },
    handleTransfer() {
      if (this.amount == null || this.amount == "") {
        this.$alert("请输入额度转换金额", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      this.fundPassword = null;
      this.showSetFund = true;
    },
    submitForm() {
      if (!this.fundPassword) {
        this.$msgbox("请输入资金密码", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      const sendData = {
        mainGamePlat: this.transferPlat,
        fund_password: pswdEncode(this.fundPassword),
        amount: this.amount
      };
      this.btnLoading = true;
      if (!this.transfer) {
        this.Api.transferTo(sendData)
          .then(({ success, msg }) => {
            this.btnLoading = false;
            if (success) {
              this.amount = null;
              this.radio = null;
              this.showSetFund = false;
              this.$msgbox(msg, "提示", {
                confirmButtonText: "确定"
              });
              this.tableData.forEach(v => {
                this.handleAmountSearch(v.main_game_plat_code).then(val => {
                  this.$set(v, "balance", val);
                });
              });
              this.getUserDetail();
            }
          })
          .catch(() => {
            this.btnLoading = false;
          });
      } else {
        this.Api.transferIn(sendData)
          .then(({ success, msg }) => {
            this.btnLoading = false;
            if (success) {
              this.amount = null;
              this.radio = null;
              this.showSetFund = false;
              this.$msgbox(msg, "提示", {
                confirmButtonText: "确定"
              });
              this.tableData.forEach(v => {
                this.handleAmountSearch(v.main_game_plat_code).then(val => {
                  this.$set(v, "balance", val);
                });
              });
              this.getUserDetail();
            }
          })
          .catch(() => {
            this.btnLoading = false;
          });
      }
    },
    async handleAmountSearch(platCode) {
      const { success, data } = await this.Api.getBalance({
        mainGamePlat: platCode
      });
      if (success) {
        return String(data["data"]["balance"]);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../../assets/css/var.scss";
.bmn-search-button {
  cursor: pointer;
  width: 241px;
  height: 50px;
  line-height: 50px;
  border-radius: 3px;
  margin: 20px 0 70px 75px;
  font-size: 16px;
  text-align: center;
  color: #fff;
  filter: drop-shadow(0px 2px 2.5px rgba(0, 0, 0, 0.15));
  background-image: linear-gradient(0deg, #9947a3 0%, #7b2f97 100%);
}
.transfer {
  min-height: 600px;
  padding: 0 30px;
  .title {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  /deep/ {
    .el-radio__input.is-checked .el-radio__inner {
      border-color: #7b3097;
      background: #7b3097;
    }
    .el-radio__input.is-checked + .el-radio__label {
      color: #7b3097;
    }
  }
}
.wallet-box {
  display: flex;
  min-height: 444px;
  .box-l {
    border-right: 1px solid #e6d7c0;
    width: 300px;
    padding-right: 15px;
    .wallet-box-item {
      margin-right: 0;
      background: url("../../../../../assets/images/new/main_wallet.jpg")
        no-repeat;
      color: #fff;
      .amount {
        color: #fff;
      }
    }
  }
  .box-r {
    padding-left: 15px;
  }
  .box-l,
  .box-r {
    display: flex;
    position: relative;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
.wallet-box-item {
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 270px;
  height: 138px;
  padding: 20px;
  margin-bottom: 10px;
  margin-right: 8px;
  border: 1px solid #f9e7e5;
  border-radius: 5px;
  background: #fff5f4;
  & > .ico {
    position: absolute;
    top: 18px;
    right: 15px;
    height: 45px;
    max-width: 100px;
  }
  &:nth-child(3n) {
    margin-right: 0;
  }
  .amount {
    color: #ff4301;
    font-size: 28px;
    word-wrap: break-word;
    word-break: break-all;
  }
  .stick {
    position: absolute;
    top: 12px;
    right: 0;
    width: 49px;
    height: 26px;
    line-height: 26px;
    text-indent: 13px;
    border-radius: 15px 0 0 15px;
    color: #fff;
    background: #7b3097;
  }
}
.box-l {
  .wallet-box-item {
    cursor: pointer;
    box-sizing: border-box;
    width: 270px;
    height: 138px;
    padding: 20px;
    margin-bottom: 10px;
    margin-right: 8px;
    border: 1px solid #f9e7e5;
    border-radius: 5px;
    background: #fff5f4;
    &:nth-child(3n) {
      margin-right: 0;
    }
    .stick {
      background: #d9a9a4;
    }
  }
}
.transfer-des {
  zoom: 1;
  &:after {
    clear: both;
    content: ".";
    display: block;
    width: 0;
    height: 0;
    visibility: hidden;
  }
  .des {
    float: left;
    font-size: 16px;
    padding: 30px 40px 30px 0;
    .wallet-name {
      color: #9f9f9f;
    }
  }
  .btn {
    cursor: pointer;
    font-size: 32px;
    padding: 3px;
    border-radius: 50%;
    border: 1px solid #edc6c2;
    margin-top: 18px;
    &:before {
      display: block;
      color: #edc6c2;
      transform: rotate(90deg);
    }
    &:active {
      background: #fff5f4;
      animation: rotatefresh 0.2s linear;
    }
  }
}
@keyframes rotatefresh {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
    transition: all 0.2s;
  }
}
.transfer-input {
  .des {
    height: 40px;
    line-height: 40px;
    padding: 0;
    padding-right: 40px;
  }
}
</style>

