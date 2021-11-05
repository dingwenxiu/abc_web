<template>
  <div class="personal-info">
    <div class="container pwd-manage" style="padding-top:15px;">
      <div class="parsonal-info-head">
        <el-row>
          <el-col :span="12">
            <span class="tit">最近登录时间</span>
            {{form.last_login_time}}
          </el-col>
          <el-col :span="12">
            <span class="tit">注册时间</span>
            {{form.register_time}}
          </el-col>
          <el-col :span="12">
            <span class="tit">最近登录地址</span>
            {{form.login_ip}}
          </el-col>
        </el-row>
      </div>
      <el-form ref="form" :rules="rules" :model="form" label-width="90px">
        <div class="form-title">个人资料</div>
        <div class="avatar">
          <el-avatar :size="60" :src="`${picBaseUrl}/${userDetail.user_icon}`"></el-avatar>
          <el-button size="mini" class="change-btn" @click="handleChangeAvatar" type="text">修改</el-button>
        </div>
        <el-form-item label="用户名：" prop="username">
          <el-input type="text" disabled v-model="userDetail.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称：" prop="nickname">
          <el-input type="text" :disabled="isDisabled" v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="real_name">
          <el-input type="text" :disabled="isDisabled" v-model="form.real_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobile">
          <el-input type="text" v-model="form.mobile" :disabled="isDisabled" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input type="text" v-model="form.email" :disabled="isDisabled" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="submit-btn">
        <button @click="handleEdit" v-if="isBtn === 'edit'" type="submit" class="form-button">编辑</button>
        <button
          @click="handleSubmit"
          v-if="isBtn === 'submit'"
          type="submit"
          class="form-button"
        >提交修改</button>
      </div>
    </div>
    <el-dialog title="点击下方的图片更换头像" :visible.sync="dialogVisible" width="800px">
      <div class="avatar-list" v-loading="avatarListLoading">
        <div
          class="avatar-item"
          @click="changeAvatar(item.path)"
          v-for="(item, index) in avatarOption"
          :key="index"
        >
          <el-avatar :size="100" :src="`${picBaseUrl}/${item.path}`"></el-avatar>
        </div>
        <div
          class="avatar-item"
          @click="changeAvatar(item.path)"
          v-for="(item, index) in avatarOption2"
          :key="index"
        >
          <el-avatar :size="100" :src="`${picBaseUrl}/${item.path}`"></el-avatar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        nickname: "",
        real_name: "",
        mobile: "",
        email: "",
        zip_code: "",
        address: ""
      },
      avatarOption: [], //头像列表
      avatarOption2: [], //新头像列表
      avatarListLoading: false,
      dialogVisible: false, //修改图片
      isDisabled: true, //是否修改
      isBtn: "edit",
      rules: {
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["userDetail", "picBaseUrl"])
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.Api.userSpecificInfos().then(({ data, success }) => {
        if (success) {
          const { info, avatar_option, new_avatar } = data;
          this.avatarOption = avatar_option;
          this.avatarOption2 = new_avatar;
          Object.assign(this.form, info);
        }
      });
    },
    // 编辑
    handleEdit() {
      this.isBtn = "submit";
      this.isDisabled = false;
    },
    // 提交修改
    handleSubmit() {
      this.Api.resetSpecificInfos(this.form).then(({ success }) => {
        if (success) {
          this.isBtn = "edit";
          this.isDisabled = true;
          this.initData();
        }
      });
    },
    handleChangeAvatar() {
      this.dialogVisible = true;
    },
    changeAvatar(id) {
      this.avatarListLoading = true;
      this.Api.setAvatar({ avatar: id })
        .then(({ success }) => {
          this.avatarListLoading = false;
          if (success) {
            this.$store.dispatch("getUserDetail");
            this.$alert("恭喜, 设置头像成功!", "提示", {
              confirmButtonText: "确定"
            }).then(() => {
              this.dialogVisible = false;
            });
            this.$nextTick(() => {
              this.dialogVisible = false;
            });
          }
        })
        .catch(() => {
          this.avatarListLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../../assets/css/var.scss";
.parsonal-info-head {
  background: #f6f6f7;
  width: 600px;
  margin-bottom: 30px;
  padding: 5px 15px;
  line-height: 3;
  .tit {
    color: $font-color;
    margin-right: 5px;
  }
}
.form-title {
  font-size: 18px;
  font-weight: bold;
  margin: 15px 0 35px 0;
  border-left: 3px solid $primary-color;
  padding-left: 10px;
}
.personal-info {
  /deep/ {
    .el-input.is-disabled .el-input__inner {
      padding: 5px 3px;
      background-color: #fff;
      border-color: #fff;
      color: #606266;
    }
    .el-textarea.is-disabled .el-textarea__inner {
      background-color: #fff;
      border-color: #fff;
      color: #606266;
    }
    .el-form-item__label {
      padding: 0;
      text-align: left;
      text-indent: 15px;
    }
    .el-textarea__inner {
      padding: 5px 3px;
    }
  }
}
.avatar {
  margin-left: 20px;
  margin-top: -5px;
  .change-btn {
    margin-left: 5px;
  }
}
.avatar-list {
  cursor: pointer;
  min-height: 528px;
  display: flex;
  text-align: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  .avatar-item {
    flex: 0 0 20%;
    margin-bottom: 25px;
  }
}
</style>


