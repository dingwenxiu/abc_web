<template>
    <div class="active-info">
        <div class="banner" :style="{ 'background-image': 'url(' + baseData.system_pic_base_url + '/' + item.img + ')' }">
        </div>
        <div class="main">
            <div class="left"></div>
            <div class="right"></div>
            <h1 class="title">
                {{item.name}}
            </h1>
            <!-- <p class="time">
                <span class="start">{{this.Utils.formatTime(item.start_time?item.start_time:'2020-01-01 01:01:01', 'YYYY年MM月DD日 HH点')}} - - </span>
                <span class="start">{{this.Utils.formatTime( item.end_time?item.end_time:'2020-01-01 01:01:01', 'YYYY年MM月DD日 HH点')}}</span>
            </p> -->
            <div v-html="item.content_text" class="center">
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
    data() {
        return {
            item: {}
        }
    },
    created() {
      this.item = this.$route.query
      this.list()
    },
    computed: {
        ...mapGetters(["baseData"])
    },
    methods: {
        ...mapActions(["getBanner"]),
        list() {
             this.getBanner().then(({ success, data }) => {
                 if(success) {
                    const itemList = data.filter(element => {
                        return  element.type === "active_info"
                    });
                    this.item = itemList[0]
                 }
             })
        }
    }
}
</script>

<style  lang="scss" scoped>
.active-info {
    width: 100%;
    min-height: 1200px;
    background: url(../../../assets/images/activity/bg.jpg) center center;
    background-color: #fcdfaf;
    background-size: 100% 100%;
    .banner {
        width: 100%;
        height: 480px;
        margin: 0 auto;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .main {
        width: 1920px;
        height: auto;
        margin:  0 auto;
        position: relative;
    }
    .left {
        width: 300px;
        height: 300px;
        background: url(../../../assets/images/activity/left.png);
        background-size: 100% 100%;
        position: absolute;
        left: 50px;
       
    }
    .right {
        width: 300px;
        height: 300px;
        background: url(../../../assets/images/activity/right.png);
        background-size: 100% 100%;
        position: absolute;
        right: 50px;
        top: 50%;
    }
    .title {
        width: 800px;
        margin: 100px auto 0;
        font-size: 22px;
        border-radius:50px;
        font-weight: 400;
        color: #d32921;
        text-align: center;
    }
    .time {
        width: 800px;
        margin: 40px auto;
        text-align: center;
        .start {
            font-size: 20px;
            color: #d32921;
        }
    }
    .center {
        width: 800px;
        margin: 20px auto 0;
        font-size: 20px;
        color: #d32921;
        line-height: 30px;
    }
}
</style>