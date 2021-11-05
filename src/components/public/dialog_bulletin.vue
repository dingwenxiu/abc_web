<template>
  <div class="dialog-bulletin">
    <el-dialog
      :class="{mail: currentIndex == 1}"
      :visible.sync="dialogVisible"
      @closed="$emit('close')"
      width="765px"
    >
      <template v-if="showMessage">
        <div class="close" @click="$emit('close')">
          <i class="fa fa-times" aria-hidden="true"></i>
        </div>
      </template>
      <template v-else>
        <div class="close always" @click="$emit('close')">关闭</div>
        <div class="close-always" @click="handleCloseAlways">不再提示</div>
      </template>

      <div class="head">
        <el-row>
          <template v-if="showMessage">
            <el-col
              @click.native="handleCurrentIndex(1)"
              :span="12"
              class="head-tab"
              :class="{on : currentIndex == 1}"
            >
              站内信
              <em v-if="readNum !== null" class="message-num">{{readNum}}</em>
            </el-col>
            <el-col
              @click.native="handleCurrentIndex(0)"
              :span="12"
              class="head-tab"
              :class="{on : currentIndex == 0}"
            >平台公告</el-col>
          </template>
          <template v-else>
            <el-col :span="24" class="head-tab on">{{currentIndex == 1 ? '站内信' : '平台公告'}}</el-col>
          </template>
        </el-row>
      </div>
      <div class="content" v-loading="loading">
        <el-row class="nr" element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-col :span="6" class="nr-l">
            <template v-if="list && list.length">
              <div
                class="nr-l-item"
                @click="handleTabBulletin(item, item.id)"
                v-for="item in list"
                :key="item.id"
              >
                <div v-if="currentIndex == 1 && item.read == 0" class="message-circle"></div>
                <i
                  @click="hanldeDeleteMes(item)"
                  v-if="currentIndex == 1"
                  class="el-icon-delete icon"
                ></i>
                <div class="title wzfw">{{item['title']}}</div>
                <div class="date">{{item['start_time'] || item['updated_at'] || item['created_at']}}</div>
              </div>
            </template>
            <div class="pagination">
              <el-pagination
                :pager-count="5"
                :small="true"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-size="page_size"
                :total="total"
                layout="prev, pager, next"
              ></el-pagination>
            </div>
          </el-col>
          <el-col v-if="currentBullrtin" :span="18" class="nr-r">
            <div class="title">{{ currentBullrtin.title}}</div>
            <div class="text-centent" v-html="currentBullrtin['content']"></div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "dialog_bulletin",
  data() {
    return {
      currentIndex: 0,
      dialogVisible: this.showBulletin,
      currentBullrtin: null,
      list: [],
      total: 0,
      page: 1,
      page_size: 6,
      loading: false
    };
  },
  props: ["showBulletin", "showMessage"],
  computed: {
    ...mapGetters(["notice", "picBaseUrl", "readNum", "showInitMessage"])
  },
  created() {
    if (this.showMessage && !this.showInitMessage) {
      this.currentIndex = 1;
    }
    this.initData();
  },
  methods: {
    ...mapActions(["getNotice", "getInnerNotice", "getReadNum"]),
    initData() {
      this.loading = true;
      // 平台公告
      if (this.currentIndex == 0) {
        this.Api.getNotice({
          page_size: this.page_size,
          page_index: this.page
        }).then(({ success, data }) => {
          this.loading = false;
          if (success) {
            this.total = data.total;
            this.list = data["data"].filter(
              v => v.device_type != 2 && v.status != 0
            );
            this.currentBullrtin = this.list[0];
          }
        });
      } else {
        // 消息中心
        this.Api.getMessageList({
          page_size: this.page_size,
          page_index: this.page
        }).then(({ success, data }) => {
          this.loading = false;
          if (success) {
            this.total = data.total;
            this.list = data.data;
            this.$store.commit("SET_RED_NUM", data.un_read);
            this.currentBullrtin = this.list[0];
          }
        });
      }
    },
    handleCurrentIndex(num) {
      this.list = [];
      this.currentBullrtin = null;
      this.currentIndex = num;
      this.initData();
    },
    handleTabBulletin(item, id) {
      if (this.currentIndex == 1) {
        if (item.read == 0) {
          this.Api.lotteryRedMessage({ id: id }).then(({ success }) => {
            if (success) {
              item.read = 1;
              this.$store.commit("SET_RED_NUM", this.readNum - 1);
            }
          });
        }
        this.currentBullrtin = this.list.filter(val => val.id === id)[0];
      } else {
        this.currentBullrtin = this.list.filter(val => val.id === id)[0];
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.initData();
    },
    hanldeDeleteMes(item) {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.Api.deleteMessage({ id: item.id }).then(({ success }) => {
          if (success) {
            this.initData();
          }
        });
      });
    },
    handleCloseAlways() {
      this.Api.noPopup().then(({ success }) => {
        if (success) {
          this.$store.commit("SET_INDEX_NOTICE", false);
          this.$emit("close");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.dialog-bulletin {
  /deep/ {
    .el-dialog {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto !important;
      width: 800px !important;
      height: 515px;
      border-radius: 5px;
      overflow: auto;
    }
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
    }
    .mail {
      .el-dialog {
        height: 515px;
      }
    }
  }
  position: relative;
  .close {
    position: absolute;
    cursor: pointer;
    z-index: 9;
    top: 9px;
    color: #fff;
    right: 15px;
    font-size: 26px;
    transition: transform 0.2s ease-out;
    &:hover {
      transform: rotate(90deg);
    }
    &.always {
      top: 1px;
      font-size: 14px;
      transition: none;
      &:hover {
        text-decoration: underline;
        transform: none;
      }
    }
  }
  .close-always {
    position: absolute;
    cursor: pointer;
    z-index: 9;
    top: 20px;
    color: #fff;
    right: 8px;
    font-size: 12px;
    &:hover{
      text-decoration: underline;
    }
  }
  .head {
    background: #000;
    text-align: center;
    font-size: 18px;
    color: #fff;
    .head-tab {
      position: relative;
      height: 45px;
      line-height: 45px;
      cursor: pointer;
      background: #292624;
      .message-num {
        display: inline-block;
        background: #c82834;
        font-size: 12px;
        position: absolute;
        top: 5px;
        right: 155px;
        padding: 0 5px;
        text-align: center;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        border-radius: 8px;
        box-sizing: border-box;
      }
      &.on {
        background: $primary-color;
        color: #fff;
      }
    }
  }
  .content {
    .banner {
      width: 100%;
      height: 135px;
      overflow: hidden;
      .img {
        width: 100%;
        height: 135px;
      }
    }
    .nr {
      color: #000;
      .nr-l {
        height: 470px;
        font-size: 14px;
        border-right: 1px solid #dadada;
        .pagination {
          width: 100%;
          overflow: hidden;
          text-align: center;
          padding: 8px 0;
          /deep/ {
            .el-pagination--small .btn-next,
            .el-pagination--small .btn-prev {
              min-width: 12px;
              padding: 0;
            }
          }
        }
      }
      .nr-l-item {
        cursor: pointer;
        line-height: 1.5;
        padding: 13px 15px;
        border-bottom: 1px dotted #dadada;
        position: relative;
        .message-circle {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c82834;
          position: absolute;
          left: 3px;
          top: 8px;
        }
        .icon {
          position: absolute;
          right: 4px;
          top: 13px;
          font-size: 16px;
          &:hover {
            color: $primary-color;
          }
        }
        &:hover {
          background: #f0f2f3;
        }
        .date {
          margin-top: 5px;
          font-size: 12px;
          color: #666666;
        }
      }
      .nr-r {
        padding: 0 10px;
        height: 460px;
        overflow: auto;
        .title {
          font-size: 18px;
          font-weight: 500;
          text-align: center;
          line-height: 70px;
          border-bottom: 1px dotted #dadada;
        }

        .text-centent {
          p {
            padding-bottom: 15px;
            text-indent: 2em;
          }
          /deep/ img {
            width: auto !important;
            max-width: 95%;
          }
        }
      }
    }
  }
}
</style>
<style>
.text-centent p,
.text-centent span,
.text-centent i,
.text-centent a,
.text-centent div {
  white-space: normal !important;
  word-wrap: break-word !important;
}
</style>