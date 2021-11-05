<template>
  <div class="bet-record sub-account">
    <el-tabs v-model="activeName">
      <el-tab-pane :lazy="true" label="个人资料" name="personal-info">
        <personal-info></personal-info>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="密码管理" name="pwd-manage">
        <pwd-manage :existFundPassword="existFundPassword" @showSetFund="handleshowFundPwd"></pwd-manage>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="银行卡管理" name="bank-manage">
        <bank-manage v-if="activeName === 'bank-manage'" @showSetFund="handleshowFundPwd"></bank-manage>
      </el-tab-pane>
    </el-tabs>
    <!-- 创建资金密码弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog-create-pass"
      title="创建资金密码"
      @closed="closedDialog"
      :visible.sync="showSetFund"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="password">
          <el-input
            style="width:300px;"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirm">
          <el-input
            style="width:300px;"
            type="password"
            v-model="ruleForm.password_confirm"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="btnLoading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { pswdEncode } from "@/utils/auth";

import pwdManage from "./components/pwd-manage";
import bankManage from "./components/bank-manage";
import personalInfo from "./components/personal-info";

export default {
  inject: ["active"],
  data() {
    //密码验证
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.password_confirm !== "") {
          this.$refs.ruleForm.validateField("password_confirm");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const validateFundPassword = (rule, value, callback) => {
      if (!/([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*/.test(value)) {
        callback(new Error("资金密码必须同时包含字母和数字"));
      }
      callback();
    };
    return {
      activeName: "personal-info",
      showSetFund: false,
      ruleForm: {
        password: "",
        password_confirm: ""
      },
      btnLoading: false,
      existFundPassword: undefined,
      rules: {
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "资金密码长度应在 6-16 之间,",
            trigger: "blur"
          },
          { validator: validateFundPassword, trigger: "blur" }
        ],
        password_confirm: [
          { required: true, validator: validatePass2, trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "资金密码长度应在 6-16 之间,",
            trigger: "blur"
          },
          { validator: validateFundPassword, trigger: "blur" }
        ]
      }
    };
  },
  components: {
    pwdManage,
    bankManage,
    personalInfo
  },
  computed: {
    ...mapGetters(["userDetail"])
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapActions(["getUserDetail"]),
    initData() {
      this.activeName = this.active ? this.active : "personal-info";
      this.existFundPassword = this.userDetail.fund_password;
    },
    // 查看是否含有资金密码
    handleshowFundPwd() {
      this.ruleForm = {
        password: "",
        password_confirm: ""
      };
      this.showSetFund = true;
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //创建资金密码
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          const sendData = {
            password: pswdEncode(this.ruleForm.password),
            password_confirm: pswdEncode(this.ruleForm.password_confirm)
          };
          this.Api.setFundPassword(sendData).then(({ success }) => {
            this.btnLoading = false;
            if (success) {
              this.showSetFund = false;
              this.existFundPassword = true;
              this.$alert("设置资金密码成功！", "提示", {
                confirmButtonText: "确定"
              });
              this.getUserDetail();
              this.activeName = "personal-info";
            }
          });
        }
      });
    },
    // Dialog 关闭动画结束时的回调
    closedDialog() {
      this.activeName = "personal-info";
    }
  }
};
</script>
<style lang="scss">
@import "../../../../assets/css/var.scss";

.bet-record {
  .container {
    padding: 0 35px 35px;
  }
  .pwd-manage {
    /deep/ {
      .el-input,
      .el-textarea {
        width: 300px;
      }
    }
    .h1 {
      color: $primary-color;
      font-size: 16px;
      font-weight: 400;
      margin: 20px 0;
    }
    .pwd-info {
      padding-left: 15px;
      font-size: 14px;
      color: #9b9b9b;
    }
  }
  .submit-btn {
    padding: 20px 95px;
    text-align: left;
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
    background-blend-mode: normal, normal;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
    border: none;
    border-image-slice: 1;
  }
}
.bmn-time-content {
  color: #999999;
  margin-left: 40px;
  margin-top: 30px;
  .btn {
    position: relative;
    display: inline-block;
    padding: 0 10px;
    border: none;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    border-radius: 2px;
    outline: none;
    padding-bottom: 2px;
    font-family: microsoft yahei;
    background-image: linear-gradient(to top, #ff8400, #ff8400);
    background-color: #ff8400;
    border: 1px solid #ccc;
    color: #fff;
    box-shadow: none;
  }
}
.bank-manage {
  .form-container {
    text-align: center;
    padding: 100px 95px;
    position: relative;
    font-size: 14px;
    color: #222222;
    line-height: 20px;
    margin-left: 16px;
  }
}
.custion-radio {
  margin-bottom: 30px;
}
.dialog-create-pass {
  /deep/ {
    .el-button--primary {
      background-color: $button-color;
      border-color: $button-color;
    }
    .el-button--primary:focus,
    .el-button--primary:hover {
      background: $button-color;
      border-color: $button-color;
      color: #fff;
    }
  }
}
</style>
