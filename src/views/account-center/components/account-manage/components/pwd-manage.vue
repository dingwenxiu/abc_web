<template>
  <div class="container pwd-manage">
    <div class="custion-radio">
      <el-radio-group v-model="radio1" @change="changeRadio">
        <el-radio-button label="account">修改账户密码</el-radio-button>
        <el-radio-button label="funds">修改资金密码</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 账户密码修改 -->
    <div v-show="radio1 == 'account'">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="旧密码：" prop="oldPass">
          <el-input maxlength="16" type="password" v-model="form.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="pass" class="new-pwd">
          <el-input maxlength="16" type="password" v-model="form.pass" autocomplete="off"></el-input>
          <span class="pwd-info">6-16位字符，需使用字母或数字</span>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input maxlength="16" type="password" v-model="form.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="submit-btn">
        <button type="submit" @click="handleChangePass" class="form-button">提交修改</button>
      </div>
      <div class="bmn-time-content" v-if="!existFundPassword">
        <span class="bmn-time-text">
          <span class="bmn-form-icon-tips"></span>为了保证您的资金安全，请立即设置您的资金密码 &nbsp;&nbsp;
          <a
            @click="handleSetFundPass"
            class="btn"
            href="javascript:;"
          >立即设置</a>
        </span>
      </div>
    </div>
    <!-- 资金密码修改 -->
    <div v-show="radio1 == 'funds'">
      <el-form ref="fundForm" :rules="fundRules" :model="fundForm" label-width="150px">
        <el-form-item label="旧资金密码：" prop="oldPass">
          <el-input
            maxlength="16"
            type="password"
            max="16"
            v-model="fundForm.oldPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新资金密码：" prop="pass" class="new-pwd">
          <el-input maxlength="16" type="password" v-model="fundForm.pass" autocomplete="off"></el-input>
          <span class="pwd-info">6-16位字符，需使用字母或数字</span>
        </el-form-item>
        <el-form-item label="确认资金密码：" prop="checkPass">
          <el-input maxlength="16" type="password" v-model="fundForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="submit-btn">
        <button type="submit" @click="handleChangeFundPass" class="form-button">提交修改</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { removeToken, pswdEncode } from "@/utils/auth";

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const validateFundPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入资金密码"));
      } else {
        if (this.fundForm.checkPass !== "") {
          this.$refs.fundForm.validateField("checkPass");
        }
        callback();
      }
    };
    const validateFundPass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入资金密码"));
      } else if (value !== this.fundForm.pass) {
        callback(new Error("两次输入的资金密码不一致!"));
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
      radio1: "account",
      form: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      fundForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度应在 6-16 之间,",
            trigger: "blur"
          }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度应在 6-16 之间,",
            trigger: "blur"
          }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度应在 6-16 之间,",
            trigger: "blur"
          }
        ]
      },
      fundRules: {
        oldPass: [
          { required: true, message: "请输入旧资金密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "资金密码长度应在 6-16 之间,",
            trigger: "blur"
          },
          { validator: validateFundPassword, trigger: "blur" }
        ],
        pass: [
          { required: true, validator: validateFundPass, trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "资金密码长度应在 6-16 之间,",
            trigger: "blur"
          },
          { validator: validateFundPassword, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validateFundPass2, trigger: "blur" },
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
  props: ["existFundPassword"],
  computed: {},
  methods: {
    ...mapActions(["logOut"]),
    handleSetFundPass() {
      this.$emit("showSetFund");
    },
    handleChangePass() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const sendData = {
            old_password: pswdEncode(this.form.oldPass),
            password: pswdEncode(this.form.pass),
            password_confirm: pswdEncode(this.form.pass)
          };
          if (sendData.old_password === sendData.password) {
            this.$alert("旧密码和新密码不能相同！", "提示", {
              confirmButtonText: "确定"
            });
            return;
          }

          this.Api.resetUserPassword(sendData).then(({ success }) => {
            if (success) {
              this.$alert("账户密码修改成功，请重新登录！", "提示", {
                confirmButtonText: "确定"
              }).then(() => {
                this.$store.commit("SET_TOKEN", "");
                this.$store.commit("SET_USER_DETAIL", {});
                removeToken();
                window.sessionStorage.clear();
                this.$nextTick(() => {
                  this.$router.push("/login");
                });
              });
              this.form = {};
            }
          });
        }
      });
    },
    handleChangeFundPass() {
      this.$refs.fundForm.validate(valid => {
        if (valid) {
          const sendData = {
            old_password: pswdEncode(this.fundForm.oldPass),
            password: pswdEncode(this.fundForm.pass),
            password_confirm: pswdEncode(this.fundForm.pass)
          };
          if (sendData.old_password === sendData.password) {
            this.$alert("旧资金密码和新资金密码不能相同！", "提示", {
              confirmButtonText: "确定"
            });
            return;
          }
          this.Api.resetFundPassword(sendData).then(({ success }) => {
            if (success) {
              this.$alert("资金密码修改成功！", "提示", {
                confirmButtonText: "确定"
              });
              this.fundForm = {};
            }
          });
        }
      });
    },
    changeRadio(v) {
      if (v === "funds") {
        if (!this.existFundPassword) {
          this.$alert("还没有资金密码，请先设置资金密码！", "提示", {
            confirmButtonText: "确定"
          }).then(() => {
            this.handleSetFundPass();
          });
          this.radio1 = "account";
          return;
        }
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        this.$refs.fundForm.clearValidate();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


