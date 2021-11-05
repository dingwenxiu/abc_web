<template>
  <div class="page-404">
    <div class="container">
      <img v-if="this.$route.path==='/page500'" class="img" src="../../assets/images/500.png" />
      <img v-if="this.$route.path==='/page404'" class="img" src="../../assets/images/404.png" />
      <img v-if="this.$route.path==='/page403'" class="img" src="../../assets/images/403.png" />
      <div class="submit-btn">
        <button @click="handleSubmit" type="submit" class="form-button">刷新</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '403-404-500',
  methods: {
    handleSubmit(){
      window.location.replace('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.page-404 {
  .container {
    width: 1200px;
    margin: 65px auto;
    text-align: center;
    background: #ffffff;
    padding: 100px 0 50px;
    .img {
      margin: 0 auto;
    }
  }
}
.submit-btn {
  margin-top: 50px;
  text-align: center;
}
.form-button {
  width: 150px;
  height: 45px;
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;
  color: #666;
  font-size: 16px;
  border-radius: 3px;
  background-image: linear-gradient(0deg, #ff8400 0%, #ffa200 100%),
    linear-gradient(#ff9700, #ff9700);
  background-blend-mode: normal, normal;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.4);
  border: none;
  border-image-source: linear-gradient(0deg, #d78700 0%, #e58f00 100%);
  border-image-slice: 1;
}
</style>

