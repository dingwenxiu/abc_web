<template>
  <div class="withdrawal">
    <div class="container">
      <div class="acc-detail">
        <div class="fl">账号：{{userDetail.username}}</div>
        <div class="fl">
          余额：
          <span style="color:#d00000">{{userDetail.balance}}</span>
        </div>
        <p class="fl">
          剩余提现次数
          <span style="color:#ff8842">{{timeLeft}}</span>次
        </p>
        <div class="bmn-search-button">
          <router-link
            tag="input"
            type="submit"
            class="btn"
            value="提交记录"
            :to="`/account-center/user-withdraw`"
          ></router-link>
        </div>
      </div>
      <el-form class="withdrawal-form" label-width="90px">
        <el-form-item label="银行卡：">
          <el-select
            style="width:260px"
            popper-class="single-price"
            v-model="bankCard"
            placeholder="请选择"
            value-key="id"
          >
            <el-option
              v-for="item in cardList"
              :key="item.id"
              :label="`${item.owner_name} ${item.card_num} ${item.bank_name}`"
              :value="item"
            >{{item.owner_name}} {{item.card_num}} {{item.bank_name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提现金额：">
          <el-input-number
            v-model="amount"
            controls-position="right"
            :min="region.min"
            :max="region.max"
          ></el-input-number>&nbsp;&nbsp;元
          &nbsp;&nbsp;&nbsp;
          <span style="color:#d00000">*</span>
          <p style="display: inline;font-size:12px;color:#999">
            最小金额为
            <span style="color:#d00000">{{region.min}}</span> 元，最大金额为
            <span style="color:#d00000">{{region.max}}</span> 元
          </p>
        </el-form-item>
        <div class="submit-btn">
          <el-button @click="nextStep" class="form-button">提交提款订单</el-button>
        </div>
      </el-form>
    </div>
    <div class="tip">
      使用提示：
      <br />为确保您达资金安全，请填写您的提款银行资料，以免有心人士窃取，谢谢合作。
    </div>
    <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible">
      <table width="100%" class="table-field">
        <tbody>
          <tr>
            <td align="right" valign="top">
              <span class="field-name">用户名：</span>
            </td>
            <td>{{userDetail.username}}</td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <span class="field-name">可提现金额：</span>
            </td>
            <td>{{userDetail.balance}} 元</td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <span class="field-name">提现金额：</span>
            </td>
            <td>{{amount}} 元</td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <span class="field-name">开户银行名称：</span>
            </td>
            <td>{{bankCard.bank_name}}</td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <span class="field-name">开户人姓名：</span>
            </td>
            <td>{{bankCard.owner_name}}</td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <span class="field-name">个人银行账号：</span>
            </td>
            <td>{{bankCard.card_num}}</td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <span class="field-name">确认资金密码：</span>
            </td>
            <td>
              <el-input
                size="mini"
                maxlength="18"
                placeholder="请输入资金密码"
                type="password"
                v-model="fundPass"
                style="width:150px"
                autocomplete="off"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">&nbsp;</td>
            <td>
              <div class="submit-btn">
                <el-button @click="submitForm" :loading="btnLoading" class="form-button">确认提现</el-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </el-dialog>
  </div>
</template>

<script>
import { pswdEncode } from "@/utils/auth";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      btnLoading: false,
      dialogVisible: false,
      cardList: [],
      fundPass: "",
      amount: null,
      bankCard: null,
      timeLeft: null,
      region: {
        min: null,
        max: null
      }
    };
  },
  computed: {
    ...mapGetters(["userDetail"])
  },
  created() {
    this.fetchCardList();
    this.Api.configureList({ type: "Withdrawal_remaining_times" }).then(
      ({ success, data }) => {
        if (success) {
          this.timeLeft = data;
        }
      }
    );
    this.Api.configureList({ type: "finance_recharge_withdraw" }).then(
      ({ success, data }) => {
        if (success && data) {
          this.region.min = data.finance_min_withdraw;
          this.region.max = data.finance_max_withdraw;
        }
      }
    );
  },
  methods: {
    //获取银行卡列表
    fetchCardList() {
      return new Promise(() => {
        this.Api.getCardList().then(res => {
          const { success, data } = res;
          if (success) {
            if (!data || !data.cards.length) {
              this.$alert("还没有银行卡， 请先添加银行卡", "提示", {
                confirmButtonText: "确定"
              })
                .then(() => {
                  this.$router.push(
                    "/account-center/account-manage/bank-manage"
                  );
                })
                .catch(() => {
                  this.$router.push(
                    "/account-center/account-manage/bank-manage"
                  );
                });
            } else {
              this.cardList = data.cards;
              this.bankCard = data.cards[0];
            }
          }
        });
      });
    },
    nextStep() {
      if (this.amount == null) {
        this.$alert("请输入提现金额", "提示", {
          confirmButtonText: "确定"
        });
        return;
      }
      this.fundPass = "";
      this.dialogVisible = true;
    },
    //提交
    submitForm() {
      if (!this.fundPass) {
        this.$alert("请先输入资金密码！", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      } else if (
        !/([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*/.test(this.fundPass)
      ) {
        this.$alert("资金密码必须同时包含字母和数字", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      const sendData = {
        amount: this.amount,
        fund_password: pswdEncode(this.fundPass),
        card_id: this.bankCard.id
      };
      this.btnLoading = true;
      this.Api.postWithdraw(sendData).then(({ success }) => {
        this.btnLoading = false;
        if (success) {
          this.$alert("提款已申请！", "提示", {
            confirmButtonText: "确定"
          }).then(() => {
            this.dialogVisible = false;
          });
        }
      });
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../../../../assets/css/var.scss";
.bmn-search-button {
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  width: 80px;
  height: 28px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);
  border-style: solid;
  border-width: 1px;
  border-image-slice: 1;
  border-radius: 3px;
  text-align: center;
  line-height: 34px;
  color: white;
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
.withdrawal {
  padding: 0 30px 35px;
  /deep/ {
    .submit-btn {
      padding: 20px;
      text-align: left;
    }
    .form-button {
      cursor: pointer;
      width: 150px;
      height: 45px;
      text-align: center;
      box-sizing: border-box;
      color: #666;
      font-size: 16px;
      border-radius: 3px;
      background: $button-color;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
      border: none;
      border-image-slice: 1;
    }
  }
  .container {
    width: 600px;
  }
  .tip {
    margin-top: 15px;
    font-size: 14px;
    color: #6b3c00;
    background: #fff3e0;
    padding: 20px;
  }
  .acc-detail {
    overflow: hidden;
    background: #f6f6f6;
    padding: 35px;
    position: relative;
    .fl {
      margin-right: 30px;
    }
    .bmn-search-button {
      position: absolute;
      right: 30px;
      top: 28px;
    }
  }
  .withdrawal-form {
    margin-top: 30px;
  }
}
.table-field {
  margin: 20px 0;
  line-height: 28px;
  td {
    padding: 7px 5px;
  }
  .field-name {
    color: #7f7f7f;
  }
}
</style>
