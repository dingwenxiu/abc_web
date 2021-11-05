<template>
  <div class="first-charge">
    <div class="first-title">首充赠送</div>
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
              :disabled="!scope.row.achieve || awardYet"
              @click="handleAward(scope.row)"
              type="danger"
            >
              <span v-if="awardYet">已参与此活动</span>
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
      <!-- <h2 style="font-size:22px;font-weight:400;margin:15px 0;">活动时间</h2>
      <p style="padding-bottom:15px;">常驻活动</p>
      <h2 style="font-size:22px;font-weight:400;margin:15px 0;">活动规则</h2>
      <p>第一步：绑定并锁定银行卡</p>
      <p>第二步：联系客服报名，每日限额1000</p>
      <p>第三步：充值后，联系客服申请礼金</p>
      <p style="padding-bottom:15px;">第四步：完成流水，提现。</p>
      <h2 style="font-size:22px;font-weight:400;margin:15px 0;">注意事项</h2>
      <ul style="list-style-type:disc;">
        <li>参与该活动后，30天内不能更换绑定银行卡</li>
        <li>每人只能参与一次，使用多账户参与活动（同姓名、同银行卡、同IP）视为套利行为，资金将被冻结。</li>
        <li>投注码量不能超过80%，即定位胆玩法不能超过8注、二码玩法不能超过80注、三码玩法不能超过800注、四星玩法不能超过8000注、五星玩法不能超过80000注。</li>
        <li>全包玩法不计入有效投注。</li>
        <li>平台保留对活动的最终解释权。</li>
      </ul>-->
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
      activityType: "first_recharge",
      prizeOption: [],
      prize: null,
      textRule: null,
      currentUser: {}
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapGetters(["picBaseUrl"])
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

          this.awardYet = !!expired;
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
