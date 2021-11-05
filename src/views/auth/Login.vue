<template>
  <section class="login">
    <section class="main">
      <div class="main-container">
        <div class="r">
          <div class="r-t">
            <div class="title">
              <div class="title-l">账号密码登录</div>
              <div class="title-r">
                <a>忘记密码？</a>
              </div>
            </div>
            <el-form
              class="user-form"
              status-icon
              :model="user"
              :rules="userRules"
              label-width="100px"
              ref="userForm">
              <el-form-item label="用户名" prop="username">
                <el-input
                  maxlength="16"
                  style="width:250px"
                  placeholder="用户名"
                  v-model="user.username"
                  type="text"
                  required
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  style="width:250px"
                  maxlength="16"
                  placeholder="密码"
                  v-model="user.password"
                  type="password"
                  required
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="isRemember.checked"></el-checkbox>&nbsp;&nbsp; 是否记住密码
              </el-form-item>
              <el-form-item>
                <el-button
                  class="login-btn"
                  :loading="loading"
                  type="primary"
                  @click="submitForm('userForm')"
                >登陆</el-button>
                <router-link tag="el-button" :to="`/register`" style="margin-left: 30px;">注册</router-link>
              </el-form-item>
            </el-form>
            <div class="banner">
              <el-carousel height="300px">
                <el-carousel-item v-for="(item, index) in registerBanner" :key="index">
                  <a
                    @click="goToBannerUrl(item)"
                    :style="{ 'background-image': 'url(' + baseData.system_pic_base_url + '/' + item.img + ')' }"
                    class="carousel-src"
                  ></a>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "login",
  data() {
    // 验证
    var validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        if (!/^[a-zA-Z0-9_-]{6,16}$/.test(value)) {
          callback(new Error("请输入6-16位英文或者数字组成的用户名"));
        }
        callback();
      }
    };
    return {
      loading: false,
      user: { username: "", password: "", confirm_password: "" },
      //验证规则
      userRules: {
        username: [
          { required: true, validator: validateUser, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度应在 6-16 之间,",
            trigger: "blur"
          }
        ]
      },
      isRemember: {
        password: {},
        checked: true
      }
    };
  },
  created() {
    // 记住密码
    let rememberPassword = this.Utils.storage.get("rememberPassword");
    if (rememberPassword) {
      this.user.username = rememberPassword.data.account;
      this.user.password = rememberPassword.data.password;
    }
  },
  computed: {
    ...mapGetters(["registerBanner","baseData"])
  },
  methods: {
    // 登录
    login() {
      this.loading = true;
      this.$store
        .dispatch("login", {
          username: this.user.username,
          password: this.user.password
        })
        .then(() => {
          this.loading = false;
          if (this.isRemember.checked) {
            let rememberPassword = {
              account: this.user.username,
              password: this.user.password
            };
            this.Utils.storage.set("rememberPassword", rememberPassword);
          } else {
            let rememberPassword = this.Utils.storage.get("rememberPassword");
            if (rememberPassword) {
              this.Utils.storage.remove("rememberPassword");
            }
          }
          this.$store.dispatch("getReadNum");
          this.$router.push("/home");
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login();
        } else {
          return false;
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
  width: 400px;
  min-height: 300px;
  padding: 90px 0 20px 58px;
  float: left;
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
  }
}
.banner {
  float: right;
  width: 600px;
  //min-height: 400px;
  padding-top:48px;
  padding-right: 20px;
  .carousel-src {
      height: 300px;
      width: 100%;
      display: block;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
}
</style>