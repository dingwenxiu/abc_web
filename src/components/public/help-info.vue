<template>
  <div class="help-info">
    <el-row :gutter="20">
      <el-col :span="7">
        <div class="help-box" v-for="(item, index) in helpList" :key="index"> 
          <div class="help-tit">{{item[0]}}</div>
          <div class="help-list">
            <ul>
              <li v-for="(item, index) in item" :key="index">
                <router-link
                  v-if="item.id"
                  :to="`/help-info/${item.id}`"
                >{{item.title}}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <div v-for="(items, index) in helpList" :key="index" class="help-wrap">
          <h3 id="help-tit1">{{items[0]}}</h3>
          <div v-for="(item, index) in items" :key="index">
            <div class="help-wrap-tit" :id="item.id">{{item.title}}</div>
            <div v-html="item.content" style="word-break:break-word;">
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      
    }
  },
  props: ['pageId'],
  computed: {
    ...mapGetters(['helpList'])
  },
  mounted () {
    // 定位到指定id 
    if(!this.helpList || !Object.keys(this.helpList).length) this.$router.push('/help-center')
    const anchor = document.getElementById(this.pageId)
    if (anchor) {
      this.$nextTick(() => {
        anchor.scrollIntoView()
      })
     
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/var.scss";
a {
  cursor: pointer;
}
.orange {
  color: $primary-color-hover;
}
.help-center {
  width: 1200px;
  margin: 0 auto;
}
.help-box {
  background: #fff;
  border: 1px solid #ececec;
  overflow: hidden;
  margin: 10px 0;
  .help-tit {
    height: 47px;
    line-height: 47px;
    color: #333;
    background: #fff3e0;
    border-bottom: 1px solid #ececec;
    padding: 0 15px;
    font-size: 16px;
    overflow: hidden;
    .fr {
      font-size: 12px;
    }
  }
  .help-list {
    min-height: 41px;
  }
  .help-list ul li {
    line-height: 40px;
    border-bottom: 1px solid #ececec;
    padding-left: 20px;
    .f16 {
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .help-info {
    padding: 20px;
    position: relative;
    .help-line {
      background: #ddd;
      width: 5px;
      height: 90%;
      position: absolute;
      left: 38px;
      top: 18px;
      bottom: 10px;
    }
    .help-cent {
      position: relative;
    }
    .help-icon {
      background: $primary-color;
      color: #fff;
      width: 22px;
      height: 22px;
      border: 2px solid #fff;
      border-radius: 50%;
      text-align: center;
      display: block;
      position: absolute;
      top: 10px;
      left: 7px;
    }
    .helpetin-left span {
      font-size: 14px;
      position: absolute;
      left: 40px;
      top: 12px;
      color: #333;
    }
    .helpetin-right {
      margin: 4px 0 0 72px;
      padding: 12px 0 0 5px;
    }
  }
}
.help-info {
  width: 1200px;
  margin: 0 auto;
}
.help-wrap {
  background: #fff;
  margin: 10px 0;
  padding: 10px 30px;
  line-height: 24px;
  overflow: hidden;
}
.help-wrap h3 {
  font-size: 18px;
  color: #fc9721;
}
.help-wrap-tit {
  color: #333;
  font-weight: bold;
  font-size: 14px;
  margin: 15px 0 0;
}
</style>

