<template>
  <div class="bet-record sub-account">
    <el-tabs v-model="activeName" :before-leave="handleBeforeLeave">
      <el-tab-pane label="充值" :lazy="true" name="recharge">
        <recharge></recharge>
      </el-tab-pane>
      <el-tab-pane label="提款" :lazy="true" name="withdrawal">
        <withdrawal></withdrawal> 
      </el-tab-pane>
      <el-tab-pane label="额度转换" :lazy="true" name="transfer">
        <transfer></transfer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import recharge from './components/recharge'
import transfer from './components/transfer'
import withdrawal from './components/withdrawal'
export default {
  inject:['active'],
  data() {
    return {
      activeName: '',
      value1: ''
    }
  },
  components: {
    recharge, transfer, withdrawal
  },
  created () {
    this.activeName = this.active ? this.active : 'recharge'
  },
  computed: {
    ...mapGetters(['userFrozen'])
  },
  methods: {
    handleBeforeLeave(activeName) {
      if (activeName === 'withdrawal') {
        if (this.userFrozen === 3) {
          this.$alert('对不起，您已被禁止提款', '提示', {
            confirmButtonText: '确定',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            showClose: false
          });
          return false;
        }
      }
    }
  }
}
</script>
