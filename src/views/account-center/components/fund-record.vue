<template>
  <div class="bet-record sub-account">
    <div class="container">
      <div class="filter-container" style="margin-bottom:10px;">
        游戏时间：
        <el-date-picker
          size="mini"
          style="width:180px;margin-bottom:10px;"
          v-model="gameListQuery.start_time"
          placeholder="开始日期"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        ></el-date-picker>&nbsp;至&nbsp;
        <el-date-picker
          size="mini"
          style="width:180px"
          v-model="gameListQuery.end_time"
          placeholder="结束日期"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
        ></el-date-picker>
        <el-input
          @change="gameListInputChange"
          style="width:235px;margin:0 15px"
          size="mini"
          placeholder="请输入内容"
          v-model="valueSelect"
          class="input-with-select"
        >
          <el-select
            @change="gameListSelectChange"
            style="width:80px;"
            v-model="typeSelect"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option label="订单号" value="project_id"></el-option>
            <el-option label="奖期号" value="issue"></el-option>
          </el-select>
        </el-input>账变类型：
        <el-cascader
          style="width:200px;"
          size="mini"
          clearable
          v-model="changeType"
          :options="changeTypeList"
          :props="{ expandTrigger: 'hover', value: 'sign', label:'name' }"
        ></el-cascader>
        <br />彩种：
        <el-cascader
          style="margin-right:15px"
          size="mini"
          clearable
          :props="{ expandTrigger: 'hover' }"
          v-model="gameListQuery.lottery_id"
          :options="lotteryAllOptions"
        ></el-cascader>下级用户：
        <el-select
          value-key="id"
          clearable
          size="mini"
          v-model="childCode"
          :placeholder="currentUser"
        >
          <el-option label="<自己>" value></el-option>
          <el-option
            v-for="(item, index) in childOption"
            :key="index"
            :label="item.username"
            :value="item"
          ></el-option>
        </el-select>
        <el-input
          clearable
          size="mini"
          style="width: 160px;margin-left:5px"
          placeholder="请输入用户名"
          v-model="gameListQuery.username"
          class="input-with-select"
        ></el-input>
        <div class="bmn-search-button" style="margin-left:20px;">
          <input @click="searchGame" type="submit" value="搜 索" class="btn" />
        </div>
      </div>
      <div class="custom-table">
        <el-table
          :data="gameList"
          sum-text="本页变动"
          :summary-method="getSummaries"
          show-summary
          v-loading="listLoading"
          style="width: 100%"
        >
          <el-table-column align="center" width="120" label="用户名">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="编号" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="handleDetail(scope.row)"
              >{{ scope.row.hash_id }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="时间">
            <template
              slot-scope="scope"
            >{{Utils.formatTime(scope.row.process_time * 1000, 'YYYY-MM-DD HH:MM:SS')}}</template>
          </el-table-column>·
          <el-table-column align="center" label="账变类型">
            <template slot-scope="scope">
              <span>{{ scope.row.type_name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="游戏">
            <template slot-scope="scope">{{scope.row.lottery_name}}</template>
          </el-table-column>
          <el-table-column align="center" label="玩法">
            <template slot-scope="scope">
              <span>{{ scope.row.method_name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="变动金额">
            <template slot-scope="scope">
              <span v-if="scope.row.in_out == 1" style="color:green">+{{ scope.row.amount }}</span>
              <span v-else style="color:red">-{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="余额">
            <template slot-scope="scope">
              <span>{{ scope.row.balance }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="gameListQuery.page_index"
          :page-sizes="[10,20,30, 50]"
          :page-size="gameListQuery.page_size"
          layout="total, sizes, prev, pager, next"
          :total="gameListTotal"
        ></el-pagination>
      </div>
    </div>
    <record-details
      :detailData="detailData"
      @close="handleDetailClose"
      v-if="dialogVisible"
      :dialogVisible="dialogVisible"
      :isFund="true"
      :isChildUser="isChildUser"
    ></record-details>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import recordDetails from "../../../components/public/record_details";

export default {
  components: {
    recordDetails
  },
  data() {
    return {
      typeSelect: "project_id",
      valueSelect: "",
      changeTypeList: [],
      //下级用户
      childOption: [],
      isChildUser: false, //下级返点
      changeType: [],
      detailData: null,
      dialogVisible: false,
      activeName: "game",
      gameList: [],
      listLoading: true,
      gameListTotal: null,
      gameListQuery: {
        page_size: 10,
        page_index: 1,
        start_time: "",
        end_time: "",
        type: "",
        lottery_id: "",
        project_id: "",
        issue: "",
        username: ""
      },
      gameTime: [],
      childCode: "",
      currentUser: "请选择下级用户"
    };
  },
  computed: {
    ...mapGetters(["lotteryAll", "lotteryLists", "userDetail"]),
    lotteryAllOptions() {
      if (!Object.keys(this.lotteryLists).length) return;
      let list = [];
      for (let i in this.lotteryLists) {
        const val = this.lotteryLists[i];
        const children = val.list.map(val => {
          return {
            value: val.id,
            label: val.name
          };
        });
        list.push({
          value: val.sign,
          label: val.name,
          children: children
        });
      }
      return list;
    }
  },
  created() {
    this.getChangeTypeList();
    this.getGameList();
  },
  methods: {
    gameListInputChange(v) {
      this.gameListQuery[this.typeSelect] = v;
    },
    gameListSelectChange(v) {
      if (v === "serial_number") {
        this.gameListQuery.serial_number = this.valueSelect;
        this.gameListQuery.issue = "";
      } else if (v === "issue") {
        this.gameListQuery.issue = this.valueSelect;
        this.gameListQuery.serial_number = "";
      }
    },
    getChangeTypeList() {
      this.Api.changeTypeList().then(({ success, data }) => {
        if (success) {
          const addChild = data.filter(v => v.type == 1);
          const reduceChild = data.filter(v => v.type == 2);
          this.changeTypeList = [
            {
              name: "金额增加",
              sign: "add",
              children: addChild
            },
            {
              name: "金额减少",
              sign: "reduce",
              children: reduceChild
            }
          ];
        }
      });
    },
    getGameList() {
      Object.assign(this.gameListQuery, {
        user_id: this.childCode ? this.childCode["id"] : "",
        lottery_sign:
          this.gameListQuery.lottery_id &&
          this.gameListQuery.lottery_id.length == 2
            ? this.gameListQuery.lottery_id[1]
            : "",
        type:
          this.changeType && this.changeType.length == 2
            ? this.changeType[1]
            : ""
      });
      for (var propName in this.gameListQuery) {
        if (
          this.gameListQuery[propName] == "" ||
          this.gameListQuery[propName] == []
        ) {
          delete this.gameListQuery[propName];
        }
      }
      this.listLoading = true;
      this.Api.getUserFund(this.gameListQuery).then(res => {
        const { success, data, code } = res;
        this.listLoading = false;
        if (success) {
          this.gameList = data["data"];
          this.childOption = code["child"];
          this.gameListTotal = data["total"];
        }
      });
    },
    searchGame() {
      this.gameListQuery.page_index = 1;
      this.showBreadcrumb = false;
      this.breadcrumbList = [];
      this.childCode
        ? (this.currentUser = this.childCode["username"])
        : (this.currentUser = "请选择下级用户");
      this.getGameList();
    },
    handleSizeChange(val) {
      this.gameListQuery.page_size = val;
      this.getGameList();
    },
    handleCurrentChange(val) {
      this.gameListQuery.page_index = val;
      this.getGameList();
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "小结";
          return;
        }
        if (index === 1) {
          sums[index] = "本页变动";
          return;
        }
        if (index === 6) {
          const values = data.map(item => {
            return item["in_out"] == 1
              ? Number(item["amount"])
              : -Number(item["amount"]);
          });
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] =
            sums[index] > 0
              ? `+${sums[index].toFixed(4)}`
              : `${sums[index].toFixed(4)}`;
        }
      });

      return sums;
    },
    //投注记录详情
    handleDetail(row) {
      if (row.type_name === "下级返点") {
        this.isChildUser = true;
      } else {
        this.isChildUser = false;
      }
      this.Api.accountChangeDetail({ hash_id: row.hash_id }).then(
        ({ success, data }) => {
          if (success && data) {
            this.detailData = data;
            this.dialogVisible = true;
          }
        }
      );
    },
    handleDetailClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/var.scss";
.bmn-search-button {
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  width: 80px;
  height: 28px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);
  border-style: solid;
  border-width: 1px;
  border-image-slice: 1;
  border-radius: 3px;
  text-align: center;
  line-height: 28px;
  color: white;
  margin-right: 8px;
  input {
    cursor: pointer;
    width: 80px;
    height: 100%;
    background: $button-color;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
      inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);

    border-width: 1px;
    color: #000;
    padding: 0;
  }
}
.bet-record {
  .container {
    padding: 25px 35px 35px;
  }
  /deep/ {
    .el-input--mini .el-input__inner {
      height: 28px;
    }
    .el-table tr:nth-child(even) {
      background-color: #f1f1f1;
    }
  }
}
.next-link {
  text-decoration: underline;
  cursor: pointer;
}
.el-breadcrumb {
  cursor: pointer;
}
</style>
