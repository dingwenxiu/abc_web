<template>
  <div class="user-manage">
    <!-- 搜索 -->
    <div class="filter-container">
      <div class="filter-label">
        用户名:
        <el-input
          size="mini"
          clearable
          v-model="listQuery.username"
          style="width: 150px; margin-bottom:5px"
          class="filter-item"
        ></el-input>
      </div>
      <div class="filter-label">
        奖金组范围:
        <el-input
          type="number"
          v-model="listQuery.min_prize "
          placeholder="最小奖金组"
          size="mini"
          style="width: 105px;"
          class="filter-item"
        ></el-input>&nbsp;-
        <el-input
          type="number"
          v-model="listQuery.max_prize"
          placeholder="最大奖金组"
          size="mini"
          style="width: 105px;"
          class="filter-item"
        ></el-input>
      </div>
      <div class="filter-label" style="margin-bottom:20px">
        时间:
        <el-date-picker
          size="mini"
          style="width:180px"
          v-model="listQuery.start_time"
          placeholder="开始时间"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        ></el-date-picker>&nbsp;至&nbsp;
        <el-date-picker
          size="mini"
          style="width:180px"
          v-model="listQuery.end_time"
          placeholder="结束时间"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
        ></el-date-picker>
      </div>
      <div class="bmn-search-button">
        <el-button @click="searchGame" :loading="searchLoading" class="btn">搜 索</el-button>
      </div>
    </div>
    <el-breadcrumb
      v-if="showBreadcrumb && !listQuery.username"
      separator="/"
      style="margin-bottom:10px;"
    >
      <el-breadcrumb-item @click.native="searchGame">{{userDetail.username}}</el-breadcrumb-item>
      <el-breadcrumb-item
        @click.native="handleBreadcrumb(item, index)"
        v-for="(item, index) in breadcrumbList"
        :key="index"
      >{{item.username}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="min-height:400px;" v-loading="listLoading">
      <div class="custom-table">
        <el-table
          :data="list"
          v-if="teamBalance"
          sum-text="本页变动"
          :summary-method="getSummaries"
          show-summary
          style="width: 100%"
        >
          <el-table-column align="center" label="用户名">
            <template slot-scope="scope">
              <div @click="handleNextLink(scope.row)" class="next-link">
                <span>{{ scope.row.username }}</span>
                <i
                  style="margin-left:2px;font-size:12px"
                  class="fa fa-caret-right"
                  aria-hidden="true"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="奖金组" width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.prize_group }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="团队人数" width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.child_count }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="注册日期">
            <template slot-scope="scope">
              <span>{{ scope.row.register_time }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="最新登录">
            <template slot-scope="scope">
              <span>{{ scope.row.last_login_time }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="团队余额" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ teamBalance[scope.row.hash_id] }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="80" label="在线">
            <template slot-scope="scope">
              <span class="inner-online" :class="{on : scope.row.is_online ==1}"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="80" label="玩家身份">
            <template slot-scope="scope">{{scope.row.type_desc}}</template>
          </el-table-column>
          <el-table-column align="center" width="300" label="操作">
            <template slot-scope="scope">
              <el-button
                :disabled="breadcrumbList.length > 0 || disableBtn"
                @click="handleSetPrize(scope.row)"
                size="mini"
              >奖金组</el-button>
              <el-button
                :disabled="scope.row.type == 1"
                v-if="showButton.allowed_transfer == 1"
                @click="handleTransfer(scope.row)"
                size="mini"
              >转账</el-button>
              <el-button
                :disabled="breadcrumbList.length > 0|| disableBtn"
                v-if="showButton.can_set_bonus == 1 && scope.row.type == 2"
                @click="handleBonusSet(scope.row)"
                size="mini"
              >分红</el-button>
              <el-button
                :disabled="breadcrumbList.length > 0|| disableBtn"
                v-if="showButton.can_set_salary == 1 && scope.row.type == 2"
                @click="handleSalarySet(scope.row)"
                size="mini"
              >日工资</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <p style="overflow:hidden">
      <span style="float:left">数据来源: 包网统计中心</span>
    </p>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page_index"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <!-- dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogTransferVisible">
      <!-- 转账 -->
      <template v-if="dialogStatus === 'transfer'">
        <el-form
          :model="transferForm"
          :rules="transferRules"
          ref="transferForm"
          label-width="80px"
          class="transfer-form"
        >
          <el-form-item label="账户余额">
            <span style="font-size: 16px;color: red;">{{userDetail.balance}}</span> 元
          </el-form-item>
          <el-form-item label="收款账号">
            <el-input style="width:250px" disabled v-model="userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="转账金额" prop="amount">
            <el-input-number
              class="custom-amount"
              v-model="transferForm.amount"
              style="width:200px"
              controls-position="right"
              :max="Number(userDetail.balance)"
            ></el-input-number>&nbsp;&nbsp;&nbsp;元
          </el-form-item>
          <el-form-item label="资金密码" prop="fund_password">
            <el-input
              maxlength="16"
              placeholder="请输入资金密码"
              type="password"
              v-model="transferForm.fund_password"
              style="width:250px"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="安全验证" prop="bank_card_id">
            <el-select
              style="width:300px"
              v-model="transferForm.bank_card_id"
              placeholder=" 请选择要验证的银行卡，以完成身份核实"
            >
              <el-option
                v-for="(item, index) in cardList"
                :key="index"
                :label="`${item.owner_name} ${item.card_num} [${item.bank_name}]`"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label prop="bank_card_number">
            <el-input
              maxlength="19"
              style="width:250px"
              v-model="transferForm.bank_card_number"
              placeholder="请输入完整卡号"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTransferVisible = false">取 消</el-button>
          <el-button type="primary" @click="transfer">确 定</el-button>
        </div>
      </template>
      <!-- 奖金组 -->
      <template v-else-if="dialogStatus === 'prize'">
        <el-form style="width:500px" label-width="120px" class="transfer-form">
          <el-form-item label="设置奖金组：">
            <el-slider
              :disabled="prizes.min >= prizes.max"
              v-model="prizeGroup"
              :min="prizes.min"
              :max="prizes.max"
            ></el-slider>
            <span style="font-size:12px;color:#909399;">{{prizeGroup}} / {{prizes.max}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTransferVisible = false">取 消</el-button>
          <el-button type="primary" @click="setPrize">确 定</el-button>
        </div>
      </template>
      <!-- 分红 日工资 -->
      <template v-else>
        <el-form :inline="true" style="width:500px" label-width="160px" class="transfer-form">
          <template v-if="dialogStatus === 'bonus'">
            <el-form-item label="上级用户名：">
              <span style="color:#f73b3b">{{preUser.userName}}</span>
            </el-form-item>
            <el-form-item label="上级分红比例：">
              <span style="color:#f73b3b">{{Number(preUser.bonusMax).toFixed(2)}}%</span>
            </el-form-item>
            <el-form-item :label="labelMap[dialogStatus]">
              <el-input
                class="bouns-input"
                style="width:100px;"
                v-on:input="bounsInput"
                v-model="bonusPercentage"
                controls-position="right"
              ></el-input>&nbsp;%
              &nbsp;&nbsp;&nbsp;
              <span
                style="font-size:12px;color:#909399;"
              >最小：{{Number(preBonusPercentage).toFixed(2)}}% - 最大：{{preUser.bonusMax.toFixed(2)}}%</span>
            </el-form-item>
          </template>
          <template v-if="dialogStatus === 'salary'">
            <el-form-item label="上级用户名：">
              <span style="color:#f73b3b">{{preUser.userName}}</span>
            </el-form-item>
            <el-form-item label="上级日工资比例：">
              <span style="color:#f73b3b">{{Number(preUser.salaryMax).toFixed(2)}}%</span>
            </el-form-item>
            <el-form-item :label="labelMap[dialogStatus]">
              <el-input
                class="bouns-input"
                style="width:100px;"
                v-on:input="salaryInput"
                v-model="salaryPercentage"
                controls-position="right"
              ></el-input>&nbsp;%
              &nbsp;&nbsp;&nbsp;
              <span
                style="font-size:12px;color:#909399;"
              >最小：{{Number(preSalaryPercentage).toFixed(2)}}% - 最大：{{preUser.salaryMax.toFixed(2)}}%</span>
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTransferVisible = false">取 消</el-button>
          <el-button v-if="dialogStatus === 'bonus'" type="primary" @click="setBonus">确 定</el-button>
          <el-button v-if="dialogStatus === 'salary'" type="primary" @click="setSalary">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { pswdEncode } from "@/utils/auth";
const validateCardNumber = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请填写银行卡号"));
  } else if (value.length < 16 || value.length > 19) {
    callback(new Error("银行卡卡号由16位到19位数字组成"));
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
export default {
  data() {
    return {
      list: [],
      cardList: [],
      total: undefined,
      listLoading: false,
      searchLoading: false,
      showBreadcrumb: false,
      breadcrumbList: [],
      dialogTransferVisible: false,
      preUser: {
        //上级用户
        userName: "",
        maxBonus: "",
        minBonus: "",
        maxsalary: "",
        minsalary: ""
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      userName: "", //收款账号
      // 转账表单
      transferForm: {
        user_id: "",
        amount: "",
        fund_password: "",
        bank_card_id: "",
        bank_card_number: ""
      },
      gameTime: [],
      listQuery: {
        page_size: 10,
        page_index: 1,
        start_time: undefined,
        end_time: undefined,
        price_group_conditions: [],
        min_prize: "",
        max_prize: "",
        parent_id: ""
      },
      transferRules: {
        amount: [
          { required: true, message: "请输入转账金额", trigger: "change" }
        ],
        fund_password: [
          { required: true, message: "请输入资金密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "资金密码长度应在 6-16 之间,",
            trigger: "blur"
          },
          { validator: validateFundPassword, trigger: "blur" }
        ],
        bank_card_id: [
          { required: true, message: "请选择银行卡", trigger: "change" }
        ],
        bank_card_number: [
          { required: true, validator: validateCardNumber, trigger: "blur" }
        ]
      },
      showButton: {},
      dialogStatus: "",
      textMap: {
        transfer: "转账操作",
        prize: "设置奖金组",
        bonus: "分红设置",
        salary: "日工资设置"
      },
      labelMap: {
        bonus: "分 红 比 例：",
        salary: "日工资比例："
      },
      // 设置奖金组
      prizeGroup: "",
      prizes: {
        min: null,
        max: null
      },
      //余额
      teamBalance: null,
      currentUser: null,
      // 日工资设置
      salaryPercentage: null,
      preSalaryPercentage: null,
      // 分红设置
      bonusPercentage: null,
      preBonusPercentage: null,
      disableBtn: false
    };
  },
  computed: {
    ...mapGetters(["userDetail"])
  },
  created() {
    this.getList();
    this.getCardList();
  },
  methods: {
    bounsInput(val) {
      this.bonusPercentage = val.replace(/\D/g, "");
    },
    salaryInput(val) {
      this.salaryPercentage = val
        .replace(/[^\d.]/g, "")
        .replace(/\D*(\d*)(\.?)(\d{0,1})\d*/, "$1$2$3");
    },
    getList() {
      for (let propName in this.listQuery) {
        if (this.listQuery[propName] == "" || this.listQuery[propName] == []) {
          delete this.listQuery[propName];
        }
      }
      this.disableBtn = false;
      this.teamBalance = null;
      this.listLoading = true;
      this.searchLoading = true;
      this.Api.getTeamManagement(this.listQuery)
        .then(({ success, data }) => {
          const {
            allowed_transfer,
            can_set_bonus,
            can_set_salary,
            maxbonusgroup
          } = data;
          if (success) {
            const idArr = [];
            this.showButton = {
              allowed_transfer,
              can_set_bonus,
              can_set_salary
            };
            this.prizes.max = Number(maxbonusgroup);
            this.list = data.data;
            this.total = data.total;
            this.list.forEach(v => {
              idArr.push(v.hash_id);
            });
            this.Api.childTeamBalance({ id: idArr })
              .then(({ success, data }) => {
                this.listLoading = false;
                this.searchLoading = false;
                if (success) {
                  this.teamBalance = data || {};
                }
              })
              .catch(() => {
                this.listLoading = false;
                this.searchLoading = false;
              });

            if (data["data"].length === 1 && this.listQuery.username) {
              this.Api.childsDividend({
                hash_id: data["data"][0]["hash_id"]
              }).then(({ success, data }) => {
                if (success) {
                  if (data["father_name"] !== this.userDetail["username"]) {
                    this.disableBtn = true;
                  }
                }
              });
            }
          } else {
            this.listLoading = false;
            this.searchLoading = false;
          }
        })
        .catch(() => {
          this.listLoading = false;
          this.searchLoading = false;
        });
    },
    getCardList() {
      this.Api.getCardList().then(res => {
        const { success, data } = res;
        if (success) {
          this.cardList = data["cards"];
        }
      });
    },
    searchGame() {
      this.listQuery.page_index = 1;
      this.listQuery.parent_id = "";
      this.showBreadcrumb = false;
      this.breadcrumbList = [];
      this.getList();
    },
    handleNextLink(row) {
      if (row.child_count <= 0) {
        this.$alert("此账户无下级", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      this.listQuery.page_index = 1;
      this.listQuery.username = "";
      this.listQuery.parent_id = row.hash_id;
      this.showBreadcrumb = true;
      if (row.username !== this.userDetail["username"]) {
        this.breadcrumbList.push(row);
      }

      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page_index = val;
      this.getList();
    },
    handleBreadcrumb(item, index) {
      this.listQuery.page_index = 1;
      this.breadcrumbList = this.breadcrumbList.slice(0, index + 1);
      this.listQuery.parent_id = item.hash_id;
      this.getList();
    },
    //初始化转账数据
    restTransferForm(data) {
      this.$refs["transferForm"] && this.$refs["transferForm"].clearValidate();
      this.userName = data.username;
      this.transferForm = {
        user_id: data.hash_id,
        amount: "",
        fund_password: "",
        bank_card_id: "",
        bank_card_number: ""
      };
    },
    //本页小结
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index == 0) {
          sums[index] = "小结";
          return;
        }
        if (index == 1) {
          sums[index] = "本页变动";
          return;
        }
        if (index == 5) {
          const values = Object.values(this.teamBalance);
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return Number(prev) + Number(curr);
            } else {
              return Number(prev);
            }
          }, 0);
          sums[index] = sums[index].toFixed(4);
        }
      });

      return sums;
    },
    // 转账
    handleTransfer(row) {
      if (this.cardList && this.cardList.length) {
        this.preUser.minBonus = this.dialogStatus = "transfer";
        this.dialogTransferVisible = true;
        this.restTransferForm(row);
      } else {
        this.$alert("还没有银行卡， 请先添加银行卡", "提示", {
          confirmButtonText: "确定",
          showCancelButton: true
        }).then(() => {
          this.$router.push("/account-center/account-manage/bank-manage");
        });
      }
    },
    setPreUser(row) {
      this.Api.childsDividend({ hash_id: row.hash_id }).then(
        ({ success, data }) => {
          if (success) {
            this.preUser.userName = data["father_name"];
            this.preUser.bonusMax = Number(data["father_bonus"]);
            this.preUser.salaryMax = Number(data["father_salary"]);
            this.preUser.bonusMin = Number(row.childMaxBonusPercentage);
            this.preUser.salaryMin = Number(row.childMaxSalaryPercentage);
          }
        }
      );
    },
    //奖金组设置
    handleSetPrize(row) {
      this.setPreUser(row);
      this.prizeGroup = row.prize_group;
      this.currentUser = row;
      this.prizes.min = Number(row.prize_group);
      // this.prizes.max = Number(maxbonusgroup);
      this.dialogStatus = "prize";
      this.dialogTransferVisible = true;
    },
    //分红设置
    handleBonusSet(row) {
      this.setPreUser(row);
      this.currentUser = row;
      this.bonusPercentage = Number(row.bonus_percentage);
      this.preBonusPercentage = JSON.parse(
        JSON.stringify(row.bonus_percentage)
      );
      this.dialogStatus = "bonus";
      this.dialogTransferVisible = true;
    },
    // 日工资设置
    handleSalarySet(row) {
      this.setPreUser(row);
      this.currentUser = row;
      this.salaryPercentage = Number(row.salary_percentage);
      this.preSalaryPercentage = JSON.parse(
        JSON.stringify(row.salary_percentage)
      );
      this.dialogStatus = "salary";
      this.dialogTransferVisible = true;
    },
    transfer() {
      this.$refs["transferForm"].validate(valid => {
        if (valid) {
          const sendData = {
            ...this.transferForm,
            fund_password: pswdEncode(this.transferForm.fund_password)
          };
          this.Api.transferToChild(sendData).then(({ success, msg }) => {
            if (success) {
              this.$alert(msg, "提示", {
                confirmButtonText: "确定"
              }).then(() => {
                this.dialogTransferVisible = false;
                this.listQuery.page_index = 1;
                this.getList();
              });
            }
          });
        }
      });
    },
    setPrize() {
      this.Api.prizeGroupSet({
        prize_group: this.prizeGroup,
        id: this.currentUser.hash_id
      }).then(({ success, msg }) => {
        if (success) {
          this.$alert(msg, "提示", {
            confirmButtonText: "确定"
          }).then(() => {
            this.$set(this.currentUser, "prize_group", this.prizeGroup);
            this.$nextTick(() => {
              this.dialogTransferVisible = false;
            });
          });
        }
      });
    },
    setBonus() {
      if (this.bonusPercentage < this.preBonusPercentage) {
        this.$alert("对不起, 您输入的分红比例小于最小值", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      if (this.bonusPercentage > this.preUser.bonusMax) {
        this.$alert("对不起, 您输入的分红比例超过了最大值", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      this.Api.bonusSet({
        rate: this.bonusPercentage,
        id: this.currentUser.hash_id
      }).then(({ success, msg }) => {
        if (success) {
          this.$alert(msg, "提示", {
            confirmButtonText: "确定"
          }).then(() => {
            this.$set(
              this.currentUser,
              "bonus_percentage",
              this.bonusPercentage
            );
            this.$nextTick(() => {
              this.dialogTransferVisible = false;
            });
          });
        }
      });
    },
    setSalary() {
      if (this.salaryPercentage < this.preSalaryPercentage) {
        this.$alert("对不起, 您输入的日工资比例小于最小值", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      if (this.salaryPercentage > this.preUser.salaryMax) {
        this.$alert("对不起, 您输入的日工资比例超过了最大值", "提示", {
          confirmButtonText: "确定"
        });
        return false;
      }
      this.Api.salarySet({
        rate: this.salaryPercentage,
        id: this.currentUser.hash_id
      }).then(({ success, msg }) => {
        if (success) {
          this.$alert(msg, "提示", {
            confirmButtonText: "确定"
          }).then(() => {
            this.$set(
              this.currentUser,
              "salary_percentage",
              this.salaryPercentage
            );
            this.$nextTick(() => {
              this.dialogTransferVisible = false;
            });
          });
        }
      });
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
  height: 36px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);
  border-style: solid;
  border-width: 1px;
  border-image-slice: 1;
  border-radius: 3px;
  text-align: center;
  line-height: 34px;
  color: white;
  margin-right: 8px;
  /deep/ {
    .el-button {
      border: 0;
      border-radius: 0;
    }
  }
  .btn {
    width: 80px;
    height: 100%;
    background: $button-color;
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15),
      inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4);
    border-width: 1px;
    color: #000;
    padding: 0;
  }
  &.send-btn {
    width: 120px;
    margin-left: 52px;
    .btn {
      width: 140px;
    }
  }
}
.filter-container {
  .filter-label {
    display: inline-block;
    margin-right: 20px;
  }
}
.line-center {
  height: 45px;
  line-height: 45px;
  font-size: 13px;
  text-align: center;
  border-left: 1px solid #cfcfcf;
  border-right: 1px solid #cfcfcf;
}
.next-link {
  text-decoration: underline;
  cursor: pointer;
}
.el-breadcrumb {
  cursor: pointer;
}
.transfer-form {
  width: 415px;
  margin: 0 auto;
}
.user-manage {
  padding: 15px;
  /deep/ {
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: $button-color;
      border-color: $button-color;
    }
    .el-input-number.is-controls-right .el-input-number__decrease,
    .el-input-number.is-controls-right .el-input-number__increase {
      display: none;
    }
    .el-input-number.is-controls-right .el-input__inner {
      padding-right: 15px;
    }
    .el-slider {
      position: relative;
      z-index: 0;
      display: inline-block;
      vertical-align: middle;
      width: 70%;
      margin: 0;
      padding-right: 15px;
    }

    .el-slider__bar {
      background-color: $ball-color;
    }
    .el-slider__button {
      border-color: $ball-color;
    }
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
}
.inner-online {
  display: inline-block;
  background: #ccc;
  width: 10px;
  height: 10px;
  &.on {
    background: #75b01f;
  }
}
.bouns-input {
  /deep/ {
    .el-input__inner {
      text-align: center;
    }
  }
}
</style>
