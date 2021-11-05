<template>
  <section class="login">
    <section class="main">
      <div class="main-container">
        <div class="r">
          <div class="r-t">
            <div class="title">
              <div class="title-l">用户注册</div>
              <div class="title-r">
                <router-link
                  to="/login"
                  style="font-size:14px; position:relative;top:5px;"
                >已有帐号，立即登录</router-link>
              </div>
            </div>
            <el-form
              class="user-form"
              status-icon
              :model="userForm"
              :rules="userRules"
              label-width="100px"
              ref="userForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input
                  style="width:250px"
                  placeholder="用户名"
                  maxlength="16"
                  v-model="userForm.username"
                  type="text"
                  required
                ></el-input>
                <span class="tip">6-16个字符，必须包含字母和数字</span>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  style="width:250px"
                  placeholder="密码"
                  v-model="userForm.password"
                  maxlength="16"
                  type="password"
                  required
                ></el-input>
                <span class="tip">6-16个字符，必须包含字母和数字</span>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input
                  style="width:250px"
                  placeholder="确认密码"
                  v-model="userForm.checkPass"
                  maxlength="16"
                  type="password"
                  required
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input
                  style="width:250px"
                  placeholder="手机号码(11位数字)"
                  v-model="userForm.phone"
                  maxlength="11"
                  required
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="login-btn"
                  :loading="loading"
                  type="primary"
                  @click="submitForm('userForm')"
                >注册</el-button>
                <el-button
                  class="login-btn"
                  style="margin-left: 30px;"
                  @click="resetForm('userForm')"
                >重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { mapActions } from "vuex";
import { removeToken, pswdEncode } from "@/utils/auth";
export default {
  name: "register",
  props: ["code", "mapActions"],
  data() {
    // 验证
    const validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        if (
          !/^[a-zA-Z0-9_-]{6,16}$/.test(value) ||
          !/([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*/.test(value)
        ) {
          callback(new Error("请输入6-16位英文和数字组成的用户名"));
        }
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userForm.checkPass !== "") {
          this.$refs.userForm.validateField("checkPass");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    const validatePass3 = (rule, value, callback) => {
      if (!/([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*/.test(value)) {
        callback(new Error("密码是必须包含字母和数字"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if(value.length < 11){
        callback(new Error("请输入11位的手机号码！"));
      }
      else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
        callback(new Error("您输入的手机号不合法，请重新输入！"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      userForm: {
        username: "",
        password: "",
        checkPass: "",
        phone: ""
      },
      userRules: {
        username: [
          { required: true, validator: validateUser, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度应在 6-16 之间",
            trigger: "blur"
          },
          { validator: validatePass3, trigger: "blur" }
          // { validator: validatePass4, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions(["logOut"]),
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 注册
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          const sendData = {
            username: this.userForm.username,
            password: pswdEncode(this.userForm.password),
            phone: this.userForm.phone
          };
          if (this.code) {
            sendData.keyword = this.code;
            sendData.register_type = 2;
          }
          this.Api.register(sendData).then(({ success }) => {
            this.loading = false;
            if (success) {
              this.$alert("用户注册成功!", {
                confirmButtonText: "确定"
              }).then(() => {
                this.$store.commit("SET_TOKEN", "");
                this.$store.commit("SET_USER_DETAIL", {});
                removeToken();
                window.sessionStorage.clear();
                  this.$store
                  .dispatch("login", {
                    username: this.userForm.username,
                    password: this.userForm.password
                  })
                  .then(() => {
                    this.$msgbox.close();
                    this.$router.push("/");
                  });
              }).catch(() => {
                this.$store.commit("SET_TOKEN", "");
                this.$store.commit("SET_USER_DETAIL", {});
                removeToken();
                window.sessionStorage.clear();
                  this.$store
                  .dispatch("login", {
                    username: this.userForm.username,
                    password: this.userForm.password
                  })
                  .then(() => {
                    this.$msgbox.close();
                    this.$router.push("/");
                  });
              })
              
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.login {
  .main {
    .main-container {
      box-sizing: border-box;
      width: 1200px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      background: #fff;
      overflow: hidden;
      .l {
        float: left;
        width: 780px;
        height: 450px;
      }
      .r {
        position: relative;
        margin: 0 auto;
        overflow: hidden;
        box-sizing: border-box;
        background: #fff;
        position: relative;
        .r-t {
          .title {
            padding: 10px 0 15px;
            border-bottom: 1px dashed #ccc;
            overflow: hidden;
            height: auto;
            font-weight: bold;
            .title-l {
              float: left;
              color: $primary-color-hover;
              font-weight: 400;
              border-bottom: 1px solid $primary-color-hover;
              font-size: 18px;
              line-height: 1.5;
            }
            .title-r {
              float: right;
              a {
                color: #58b3f6;
              }
              cursor: pointer;
              font-size: 18px;
              font-weight: 400;
            }
          }
        }
        .r-b {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 70px;
          padding: 0 30px;
          box-sizing: border-box;
          font-size: 16px;
          background: #f3eadd;
          text-align: right;
          line-height: 70px;
          .register {
            color: #b98f59;
            i {
              display: inline-block;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              text-align: center;
              line-height: 20px;
              background: #b98f59;
              color: #fff;
            }
          }
        }
      }
      .r-forget {
        margin: -10px 4px 7px 0;
        font-size: 13px;
      }
      .r-forget-link:hover {
        text-decoration: underline;
      }
    }
  }
}
.user-form {
  min-height: 400px;
  padding: 48px 0 15px 150px;
  /deep/ {
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: $button-color;
      border-color: $button-color;
    }
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
    .el-form-item.is-error .el-input__validateIcon {
      color: #f56c6c;
    }
    .el-form-item--feedback .el-input__validateIcon {
      color: #409eff;
    }
  }
}
.tip {
  padding-left: 5px;
  font-size: 12px;
  color: #909399;
}
</style>
