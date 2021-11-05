<template>
  <router-view></router-view>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "app",
  mounted() {
    this.getIco();
  },
  methods: {
    ...mapActions(["getBasicContent"]),
    //获取标签头部小图标
    getIco() {
      this.getBasicContent().then(({ success, data }) => {
        if (success) {
          this.$nextTick(() => {
            const href = `${data.system_pic_base_url}/${data.logo_icon}`,
              html = document.createElement("link"),
              domHead = document.getElementsByTagName("head");
            document.title = data.web_name;
            html.setAttribute("rel", "icon");
            html.setAttribute("href", href);
            domHead[0].appendChild(html);
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "./assets/css/base.scss";
@import "./assets/css/var.scss";
.custom-table {
  border-top: 1px solid #cfcfcf;
  border-left: 1px solid #cfcfcf;
  border-right: 1px solid #cfcfcf;
  .el-table {
    font-size: 13px;
  }

  .el-table::before {
    background-color: #cfcfcf;
  }
  .el-table thead tr,
  .el-table thead th {
    background: $child-color !important;
  }
  .el-table thead th + th {
    .cell {
      border-left: 1px solid #b7a383;
    }
  }
  .el-table thead th {
    color: #000;
    font-weight: 400;
    font-size: 14px;
    text-align: center;
  }
}
.m-t-25 {
  margin-top: 25px;
}
</style>
