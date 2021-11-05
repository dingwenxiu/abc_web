<template>
  <div class="bank-manage" v-loading="loading">
    <!-- 没有银行卡 -->
    <div class="container" v-if="!haveBankCard">
      <div class="bank-manage">
        <div class="form-container">
          <div class="form-text">
            您还没有绑定银行卡：
            <button @click="handleOpenDialog" type="submit" class="form-button">立即绑定</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 银行卡管理 -->
    <div class="show-manage-bank" v-if="show.bankManage">
      <p>一个游戏账户最多绑定4张银行卡，您目前绑定了{{tableData.length}}张卡，还可以绑定{{4-tableData.length}}张。</p>
      <p>发起第一次提现后，系统会自动锁定银行卡。</p>
      <p>为了您的账户资金安全，银行卡“新增”和“修改”将在操作完成{{hour}}小时后，新卡才能发起“向平台提现”。</p>
      <div class="custom-table" style="margin-top:15px;">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="银行名称">
            <template slot-scope="scope">
              <span>{{ scope.row.bank_name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="卡号">
            <template slot-scope="scope">
              <span>{{ scope.row.card_num }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="绑定时间">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="更新时间">
            <template slot-scope="scope">
              <span>{{ scope.row.updated_at }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="银行卡状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">禁用</span>
              <span v-else>可用</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="form-text">
        <button class="form-button" @click="handleAddCreate" style="margin-right:30px;">增加绑定</button>
      </div>
    </div>
    <!-- 创建银行卡 -->
    <div class="create-bank" v-if="show.createBank">
      <el-row class="title">
        <el-col v-if="show.verifty" :span="8" :class="{on : show.verifty}">1.验证信息</el-col>
        <el-col
          :span="!show.verifty ? 12 : 8"
          :class="{on : show.form}"
        >{{!show.verifty ? 1 : 2}}.输入银行卡信息</el-col>
        <el-col
          :span="!show.verifty ? 12 : 8"
          :class="{on : !show.form && !show.verifty}"
        >{{!show.verifty ? 2 : 3}}.绑定结果</el-col>
      </el-row>
      <div class="content">
        <div v-if="show.verifty">
          <el-form
            :key="1"
            :model="veriftyForm"
            :rules="veriftyRules"
            ref="veriftyForm"
            label-width="120px"
            class="card-form"
          >
            <el-form-item label="开户人姓名：" prop="owner_name">
              <el-input style="width:285px" v-model="veriftyForm.owner_name"></el-input>
            </el-form-item>
            <el-form-item label="资金密码：" prop="fund_password">
              <el-input
                style="width:285px"
                maxlength="16"
                type="password"
                v-model="veriftyForm.fund_password"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="createLoading"
                @click="handleVerifty"
                type="submit"
                class="form-button"
              >下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="show.form">
          <el-form
            :key="2"
            :model="cardForm"
            :rules="rules"
            ref="cardForm"
            label-width="120px"
            class="card-form"
          >
            <el-form-item label="开户银行：" prop="bank_sign">
              <el-select
                style="width:285px"
                popper-class="single-price"
                v-model="cardForm.bank_sign"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in cardOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开户银行区域：" prop="province_id">
              <el-select
                style="margin-right:15px;width:285px"
                popper-class="single-price"
                v-model="cardForm.province_id"
                @change="handleChangeProvince"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in provinceOptions"
                  :key="item.region_id"
                  :label="item.region_name"
                  :value="item.region_id"
                ></el-option>
              </el-select>
              <el-select
                style="width:285px"
                popper-class="single-price"
                v-model="cardForm.city_id"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in cityOptions"
                  :key="item.region_id"
                  :label="item.region_name"
                  :value="item.region_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开户支行名称：" prop="branch">
              <el-input style="width:285px" v-model="cardForm.branch"></el-input>
            </el-form-item>
            <el-form-item label="持卡人姓名：" prop="owner_name">
              <el-input style="width:285px" v-model="cardForm.owner_name"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号：" prop="card_number">
              <el-input
                @paste.native.capture.prevent
                style="width:285px"
                maxlength="19"
                placeholder="银行卡卡号由16位到19位数字组成"
                v-model="cardForm.card_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认银行卡号：" prop="check_card_number">
              <el-input
                @paste.native.capture.prevent
                maxlength="19"
                style="width:285px"
                placeholder="银行卡卡号由16位到19位数字组成"
                v-model="cardForm.check_card_number"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="createLoading"
                @click="handleAddCard"
                type="submit"
                class="form-button"
              >确认提交</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else class="create-success">
          <h3>恭喜您，银行卡绑定成功</h3>
          <p>新的银行卡将在{{hour}}小时后可以发起“平台提现”</p>
          <div class="form-text">
            您现在可以：
            <button @click="goToBankManage" type="submit" class="form-button">银行卡管理</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { pswdEncode } from "@/utils/auth";

export default {
  data() {
    const validateCardNumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写银行卡号"));
      } else if (value.length < 16 || value.length > 19) {
        callback(new Error("银行卡卡号由16位到19位数字组成"));
      } else {
        // if (this.cardForm.check_card_number !== '') {
        //   this.$refs.cardForm.validateField('check_card_number')
        // }
        callback();
      }
    };
    const validateCheckCardNumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写银行卡号"));
      } else if (value !== this.cardForm.card_number) {
        callback(new Error("两次输入银行卡号不一致!"));
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
      loading: false,
      createLoading: false,
      tableData: [],
      haveBankCard: true,
      cardOptions: [],
      provinceOptions: [],
      cityOptions: [],
      hour: null,
      show: {
        bankManage: false,
        createBank: false,
        verifty: false,
        form: false
      },
      cardForm: {
        fund_password: "",
        bank_sign: "",
        province_id: undefined,
        city_id: undefined,
        card_number: "",
        check_card_number: "",
        branch: "",
        owner_name: ""
      },
      veriftyForm: {
        owner_name: "",
        fund_password: ""
      },
      rules: {
        bank_sign: [
          { required: true, message: "请选择开户银行", trigger: "change" }
        ],
        province_id: [
          { required: true, message: "请选择开户银行区域", trigger: "change" }
        ],
        branch: [
          { required: true, message: "请填写开户支行名称", trigger: "change" }
        ],
        owner_name: [
          { required: true, message: "请填写持卡人姓名", trigger: "blur" }
        ],
        card_number: [
          { required: true, validator: validateCardNumber, trigger: "blur" }
        ],
        check_card_number: [
          {
            required: true,
            validator: validateCheckCardNumber,
            trigger: "blur"
          }
        ]
      },
      veriftyRules: {
        owner_name: [
          { required: true, message: "请输入开户人姓名", trigger: "blur" }
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
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["userDetail"])
  },
  created() {
    if (!this.userDetail.fund_password) {
      this.$alert("还没有资金密码，请先设置资金密码！", "提示", {
        confirmButtonText: "确定"
      }).then(() => {
        this.$emit("showSetFund");
      });
    } else {
      this.initData();
    }
  },
  methods: {
    initData() {
      this.getCardList();
      this.Api.configureList().then(({ success, data }) => {
        if (success) {
          this.hour = data["value"];
        }
      });
    },
    //获取银行卡列表
    async fetchCardList() {
      const res = await this.Api.getCardList();
      if (res.success) {
        const { bank_list, cards, province } = res.data;
        this.tableData = cards;
        this.cardOptions = bank_list;
        this.provinceOptions = province;
        return res;
      }
    },
    //切换
    getCardList() {
      this.loading = true;
      this.fetchCardList().then(res => {
        this.loading = false;
        const { success, data } = res;
        if (success) {
          const { cards } = data;
          if (cards.length) {
            this.haveBankCard = true;
            this.show.bankManage = true;
          } else {
            this.haveBankCard = false;
          }
        }
      });
    },
    // 改变区域选择
    handleChangeProvince(id) {
      this.cardForm.city_id = "";
      this.Api.cityLists({ region_id: id }).then(({ success, data }) => {
        if (success && data) {
          this.cityOptions = data;
          this.cardForm.city_id = this.cityOptions[0]["region_id"];
        }
      });
    },
    // 复原
    restFrom() {
      (this.veriftyForm = {
        owner_name: "",
        fund_password: ""
      }),
        (this.cardForm = {
          bank_sign: "",
          province_id: undefined,
          city_id: undefined,
          card_number: "",
          check_card_number: "",
          branch: "",
          owner_name: ""
        });
    },
    // 立即绑定
    handleOpenDialog() {
      this.haveBankCard = true;
      this.show.createBank = true;
      this.show.form = true;
    },
    // 验证资金密码
    handleVerifty() {
      this.$refs["veriftyForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          const sendData = {
            ...this.veriftyForm,
            fund_password: pswdEncode(this.veriftyForm.fund_password)
          };
          this.Api.twoAddVerify(sendData).then(({ success }) => {
            this.createLoading = false;
            if (success) {
              this.show.verifty = false;
              this.show.form = true;
              this.cardForm.owner_name = this.veriftyForm.owner_name;
            }
          });
        }
      });
    },
    // 创建银行卡
    handleAddCard() {
      this.$refs["cardForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          const sendData = Object.assign({}, this.cardForm);
          Object.assign(sendData, {
            bank_name: this.cardOptions.filter(
              v => v.code === this.cardForm.bank_sign
            )[0].title,
            province_id: this.provinceOptions.filter(
              v => v.region_id === this.cardForm.province_id
            )[0].region_id,
            city_id: this.cityOptions.filter(
              v => v.region_id === this.cardForm.city_id
            )[0].region_id
          });
          delete sendData.check_card_number;
          this.Api.addBank(sendData)
            .then(({ success }) => {
              this.createLoading = false;
              if (success) {
                this.show.verifty = false;
                this.show.form = false;
                this.fetchCardList();
              }
            })
            .catch(() => {
              this.createLoading = false;
            });
        }
      });
    },
    handleAddCreate() {
      this.restFrom();
      this.show.createBank = true;
      this.show.bankManage = false;
      this.show.verifty = true;
    },
    goToBankManage() {
      this.show.createBank = false;
      this.show.bankManage = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.bank-manage {
  min-height: 280px;
  /deep/ {
    .el-button:focus,
    .el-button:hover {
      color: #fff;
      background: #f73b3b;
    }
  }
}
.create-bank {
  .title {
    text-align: center;
    .on {
      color: #ff8900;
    }
  }
  .card-form {
    margin-left: 240px;
    margin-top: 30px;
  }
  .create-success {
    font-size: 16px;
    text-align: center;
    margin: 80px auto 100px;
    p {
      margin: 15px auto 30px;
    }
  }
}
.show-manage-bank {
  padding: 0 35px 35px;
  & > p {
    margin-bottom: 5px;
  }
  .form-text {
    text-align: center;
    margin-top: 30px;
  }
}
</style>
