<template>
  <div class="first-charge">
    <div class="first-title">充值赠送</div>
    <div class="first-table">
      <el-table v-loading="listLoading" :data="tableData" border style="width: 100%">
        <el-table-column align="center" label="充值金额(元)">
          <template slot-scope="scope">
            <template v-if="scope.row.give_type == 1">{{scope.row.recharge}}元</template>
            <template v-else>{{scope.row.recharge}}+元</template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="赠送">
          <template slot-scope="scope">
            <template v-if="scope.row.give_type == 1">{{scope.row.prize_value}}元</template>
            <template v-else>{{scope.row.give_val}}%</template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              :disabled="!scope.row.achieve || !!scope.row.expired"
              @click="handleAward(scope.row)"
              type="danger"
            >
              <span v-if="scope.row.expired">已经领取</span>
              <span v-else>立即领取</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <p style="font-size:12px;color:#888">
        当前充值金额
        <span style="color:#F56C6C">{{currentUser.recharged}}</span>元
      </p>
    </div>
    <div class="first-body" v-html="textRule">
      <!-- <h2 style="font-size:22px;font-weight:400;margin:15px 0;">申请方式</h2>
      <p style="padding-bottom:15px;">联系客服进行申请</p>

      <h2 style="font-size:22px;font-weight:400;margin:15px 0;">活动时间</h2>
      <p style="padding-bottom:15px;">常驻活动</p>

      <h2 style="font-size:22px;font-weight:400;margin:15px 0;">活动规则</h2>
      <p>1.此活动彩金一倍流水即可 申请出款，每个会员仅限获得一个门栏彩金；</p>
      <p>2.每位玩家、每户、没地址、每电子邮箱、相同的支付方式及IP地址等只能一个账号享有优惠；</p>
      <p>3.若会员有重复申请或者注册多账号行为，公司保留取消或收回优惠彩及盈利的权利；</p>
      <p>4.本公司将保留对活动的最终解释权，在任何情况下都可以随时更改、停止、取消该优惠活动的权利；</p>
      <p style="padding-bottom:15px;">5.参与该优惠，即表示您同意本公司《优惠规则与条款》。</p>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      awardYet: 0,
      tableData: [],
      listLoading: false,
      activityType: "gift_recharge",
      prizeOption: [],
      prize: null,
      textRule: "",
      currentUser: {}
    };
  },
  computed: {
    ...mapGetters(["picBaseUrl"])
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.listLoading = true;
      this.Api.getOne({ type: this.activityType }).then(({ success, data }) => {
        this.listLoading = false;
        if (success) {
          const { prize, pc_desc, possible_total, expired, recharged } = data;
          this.currentUser.possible_total = possible_total;
          this.currentUser.recharged = recharged;
          this.awardYet = expired;
          this.tableData = prize;
          this.textRule = pc_desc;
        } else {
          this.$router.push("/active");
        }
      });
    },
    handleAward(row) {
      this.Api.joinAct({
        type: this.activityType,
        fist_recharge: row["prize_id"]
      }).then(({ success, msg }) => {
        if (success) {
          this.$alert(msg, "提示", {
            confirmButtonText: "确定"
          });
          this.getData();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/var.scss";
.first-charge {
  width: 1200px;
  margin: 35px auto 100px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.first-title {
  height: 45px;
  line-height: 45px;
  font-size: 18px;
  text-indent: 30px;
  color: #1a0d1e;
  background: $deputy-color;
}
.first-table {
  padding: 30px 30px 0;
  text-align: left;
  /deep/ {
    .el-table thead th {
      background: $child-color;
    }
  }
}
.first-body {
  min-height: 450px;
  padding: 15px 30px;
}
</style>
