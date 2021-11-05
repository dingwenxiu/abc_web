<template>
  <div class="recharge" v-loading="showLoading">
    <div class="recharge-group">
      <div
        class="recharge-item"
        v-for="(item, index) in channelList"
        :key="index"
        @click="changeChannel(item)"
        :class="{on: item.name === currentIndex}"
      >
        <img class="img" v-if="item['list'].length" :src="`${picBaseUrl}/${item['list'][0].icon}`" />
        {{item.name}}
        <div class="on-r">
          <i class="fa fa-check" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <div class="recharge-content" v-if="Object.keys(channelList).length">
      <div class="channel-box">
        <div class="channel-title">充值渠道：</div>
        <div class="channel-group">
          <div class="channel-item">
            <el-radio-group @change="radioGroupChange" v-model="channel">
              <el-radio
                :label="item"
                v-for="(item, index) in channelList[currentIndex]['list']"
                :key="index"
              >
                <img
                  style="display:inline;height:14px; verical-align:top"
                  :src="`${picBaseUrl}/${item.icon}`"
                  alt="item.front_name"
                />
                {{item.front_name}}
                <div style="text-indent: 30px;color: #7f7f7f; margin-top:6px">
                  最低：
                  <span style="color:red">{{Number(item.min).toFixed(2)}}</span>&nbsp;元 &nbsp; &nbsp;
                  最高：
                  <span
                    style="color:red"
                  >{{Number(item.max).toFixed(2)}}</span> 元
                </div>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="p" v-if="channel['banks_code'] && channel['banks_code'].length">
        <div class="p-input fl">
          银行名称：
          <el-select v-model="banks_code" placeholder="请选择银行名称">
            <el-option
              v-for="item in channel['banks_code']"
              :key="item.code"
              :label="item.title"
              :value="item.code"
            ></el-option>
          </el-select>
          <span style="color:red">&nbsp;*</span>
        </div>
      </div>
      <div class="p">
        <div class="p-input fl">
          充值金额：
          <template
            v-if="!Boolean(channel['do_fixed_price'] && channel['do_fixed_price'].length)"
          >
            <el-input-number style="width:120px" v-model.trim="amount" controls-position="right"></el-input-number>
            <span style="color:red">&nbsp;*</span>
            元
          </template>
          <el-radio-group
            v-if="channel['do_fixed_price'] && channel['do_fixed_price'].length"
            v-model="radio"
            @change="radioChange"
            style="margin-left:30px;"
          >
            <el-radio
              v-for="item in channel['do_fixed_price'].split(',')"
              :key="item"
              :label="item"
            >{{item}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="submit-btn">
        <el-button @click="submitForm" :loading="btnLoading" class="form-button">提交充值订单</el-button>
      </div>
    </div>
    <form style="display:none" id="pureForm" :action="formUrl" method="post" target="_blank">
      <input type="text" name="token" :value="Token" />
      <input :value="amount" name="amount" />
      <input v-if="channel" :value="channel.type_sign" name="channel" />
      <input v-if="channel" :value="channel.channel_id" name="client_channel" />
      <input
        v-if="channel && channel['banks_code'] && channel['banks_code'].length"
        :value="banks_code"
        name="bank_code"
      />
    </form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      radio: 0,
      btnLoading: false,
      showLoading: false,
      // 最大最小额度
      prizes: {
        min: null,
        max: null
      },
      channelList: [],
      currentIndex: null,
      channel: null,
      banks_code: null,
      amount: null,
      formUrl: null,
      Token: getToken(),
      form: {
        amount: "",
        channel: ""
      },
      activeTime: 0
    };
  },
  computed: {
    ...mapGetters(["picBaseUrl"])
  },
  created() {
    this.initData();
    this.formUrl = `${process.env.VUE_APP_API_URL}/web-api/player/recharge`;
  },
  methods: {
    radioChange(val) {
      this.amount = val;
    },
    initData() {
      this.showLoading = true;
      this.Api.getRechargeChannel()
        .then(({ success, data }) => {
          this.showLoading = false;
          if (success) {
            this.channelList = data;
            this.currentIndex = Object.keys(data)[0];
            this.currentChannel(this.channelList[this.currentIndex]);
          }
        })
        .catch(() => {
          this.showLoading = false;
        });
    },
    currentChannel(item) {
      if (item["list"] && item["list"].length) {
        this.channel = item["list"][0];
        this.amount = this.channel.min;
      }
    },
    //切换频道
    radioGroupChange(val) {
      this.radio = "";
      this.amount = val.min;
    },
    // 切换支付渠道
    changeChannel(item) {
      this.radio = "";
      this.amount = null;
      this.currentIndex = item.name;
      this.currentChannel(item);
    },
    //提交
    submitForm() {
      if (this.activeTime <= 0) {
        if (this.amount == null) {
          this.$alert("请输入金额", "提示", {
            confirmButtonText: "确定"
          });
          return;
        }
        if (this.amount > this.channel.max || this.amount < this.channel.min) {
          this.$alert("对不起, 您输入金额不在允许金额范围!!!", "提示", {
            confirmButtonText: "确定"
          });
          return;
        }
        const sendData = {
          amount: this.amount,
          channel: this.channel.type_sign,
          client_channel: this.channel.id
        };
        if (this.channel["banks_code"] && this.channel["banks_code"].length) {
          if (this.banks_code) {
            Object.assign(sendData, {
              bank_code: this.banks_code
            });
          } else {
            this.$alert("请选择银行名称", "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
        }
        this.btnLoading = true;

        if (this.channel.request_mode == 1) {
          this.Api.postRecharge(sendData).then(({ success, data }) => {
            this.btnLoading = false;
            if (success) {
              this.$alert(data.msg, "提示", {
                confirmButtonText: "确定"
              });
            }
          });
        } else {
          this.btnLoading = false;
          document.getElementById("pureForm").submit();
        }

        // this.activeTime = 30;
        // for (let i = 1; i <= 30; i++) {
        //   window.setTimeout(() => {
        //     this.activeTime--;
        //   }, i * 1000);
        // }
      } else {
        this.$alert(
          `对不起, 充值太频繁,请${this.activeTime}s后再充值!!!`,
          "提示",
          {
            confirmButtonText: "确定"
          }
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../../assets/css/var.scss";
.recharge {
  padding: 0 30px 35px;
  min-height: 500px;
  /deep/ {
    .submit-btn {
      padding: 20px 95px;
      text-align: left;
    }
    .el-radio__input.is-checked + .el-radio__label {
      color: $font-color;
    }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: $button-color;
      background: $button-color;
    }
    .form-button {
      width: 150px;
      height: 45px;
      cursor: pointer;
      text-align: center;
      box-sizing: border-box;
      color: #666;
      font-size: 16px;
      border-radius: 3px;
      background: $button-color;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
      border-image-slice: 1;
      border: none;
    }
    .el-input-number.is-controls-right .el-input-number__decrease,
    .el-input-number.is-controls-right .el-input-number__increase {
      display: none;
    }
    .el-input-number.is-controls-right .el-input__inner {
      padding-right: 15px;
    }
    .el-input.is-disabled .el-input__inner {
      background-color: #fff;
      color: #c0c4cc;
    }
  }
  .tip {
    border: none;
    padding-left: 32px;
    background: url("../../../../../assets/images/recharge-hint.png") no-repeat;
    color: #c4a17c;
    font-size: 14px;
    margin-bottom: 15px;
  }
}
.recharge-group {
  font-size: 0;
  margin-top: 15px;
  box-sizing: border-box;
  .recharge-item {
    display: inline-block;
    box-sizing: border-box;
    font-size: 14px;
    cursor: pointer;
    height: 36px;
    border: 1px solid;
    border-color: #cfcfcf;
    padding: 5px 10px;
    margin-right: 15px;
    border-radius: 5px;
    .on-r {
      display: none;
    }
    &.on {
      box-sizing: border-box;
      border-color: $ball-color;
      position: relative;
      .on-r {
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 0;
        height: 0;
        border-bottom: 20px solid $ball-color;
        border-left: 20px solid transparent;
        i {
          font-size: 12px;
          position: absolute;
          left: -12px;
          top: 7px;
          color: #fff;
        }
      }
    }
    .img {
      display: inline-block;
      height: auto;
      height: 18px;
      vertical-align: top;
    }
  }
}
.recharge-content {
  padding: 20px 0;
  .title {
    color: #000;
    font-size: 16px;
    padding: 10px 0;
    .sub-title {
      font-size: 14px;
    }
    .num {
      display: inline-block;
      margin-right: 10px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      background: #000;
      border-radius: 50%;
      color: #fff;
    }
  }
  .p {
    overflow: hidden;
    padding-bottom: 15px;
    margin-left: 25px;
    .p-r {
      color: #d00000;
    }
    .p-input {
      margin-right: 25px;
    }
  }
}

.p-input-line {
  font-size: 12px;
  margin-top: 16px;
  span {
    color: red;
  }
}
.recharge-redio {
  margin-top: -3px;
  /deep/ {
    .el-radio {
      margin-right: 10px;
    }
    .el-radio__input {
      display: none;
    }
    .b-r {
      display: none;
    }
    .el-radio.is-bordered.is-checked {
      border-color: #000;
      position: relative;
      .b-r {
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 0;
        height: 0;
        border-bottom: 25px solid red;
        border-left: 25px solid transparent;
        i {
          font-size: 12px;
          position: absolute;
          left: -14px;
          top: 10px;
          color: #fff;
        }
      }
    }
    .el-radio__input.is-checked + .el-radio__label {
      color: #000;
    }
  }
}
.channel-box {
  margin: 25px 25px 0;
  display: flex;
  .channel-title {
    flex: 0 0 78px;
  }
}
.channel-group {
  .channel-item {
    /deep/ {
      .el-radio-group {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        .el-radio {
          min-width: 280px;
          margin-bottom: 40px;
        }
      }
    }
  }
}
</style>

