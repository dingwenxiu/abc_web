<template>
  <div class="stop-bet">
    <div class="container">
      <div class="des-text">
        <p>官方休市通知:</p>
        <p>2020 年春节官彩休市时间为:2020 春节 10 天，休市时间为 2020 年 1 月 22 日 0:00 至 1 月 31 日 24:00。</p>
        <p>国庆节 4 天，休市时间为 2020 年 10 月 1 日 0:00 至 10 月 4 日 24:00(待定)</p>
        <p>
          新年快乐
          <br />特此通知，请商户在维护开市前做好准备
        </p>
        <br />
        <p>http://www.cwl.gov.cn/c/2019-12-17/461369.shtml</p>
      </div>
    </div>
  </div>
</template>0

<script>
export default {
  name: "stop-bet"
};
</script>

<style lang="scss" scoped>
.stop-bet {
  background: #f7f0e0;
  .container {
    position: relative;
    width: 100%;
    height: 1552px;
    overflow: hidden;
    background: url("../../assets/images/new/stop_bet_bg.jpg") no-repeat center
      top;
  }
}
.des-text{
  position: absolute;
  top: 342px;
  left: 50%;
  width: 635px;
  transform: translateX(-50%);
  font-size: 18px;
  p{
    margin-bottom: 20px;
  }
}
</style>