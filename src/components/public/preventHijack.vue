<template>
  <div class="hijack">
    <div class="hijack-content w">
      近期您可能有碰见登录网站时，页面跳转到另外陌生网页的情况。这是由于您的网络供应商漏洞而造成的。
      <br />
      <br />
      <strong>那么该如何避免这样的问题呢？</strong>
      <br />1. 请不要轻易连接陌生网络。
      <br />2. 可以通过手动指定DNS（DNS用于将域名正确转换为您想访问的网站的作用），修改后你的网络应用将更加稳定，安全。
      <br />
      <br />
      <strong>以下是具体修改方式：</strong>
      <h2 class="single-title">手动修复本地DNS教程</h2>
      <p>请根据以下简单步骤即可手动修复本地DNS：</p>
      <p>
        <strong>步骤1</strong>
        <strong>：</strong>
        <br />点击桌面左下角的 [开始]按钮，打开 [控制面板]，查看方式为类别，点击 [网络和Internet]，再进入 [网络和共享中心]。
      </p>
      <p class="p-pt">
        <img src="../../assets/images/preventHijack/picture-1.jpg" width="337" height="267" alt />
        <img
          src="../../assets/images/preventHijack/picture-2.jpg"
          width="337"
          height="267"
          class="hijack-pic"
          alt
        />
        <br />
        <br />
        <strong>步骤2</strong>
        <strong>：</strong>
        <br />点击 [更改适配器设置]。
      </p>
      <p class="p-pt">
        <img src="../../assets/images/preventHijack/picture-3.jpg" width="696" height="265" alt />
        <br />
        <br />
        <strong>步骤3</strong>
        <strong>：</strong>
        <br />右键点击当前活动的网络连接，点弹出菜单中的 [属性]。
      </p>
      <p class="p-pt">
        <img src="../../assets/images/preventHijack/picture-4.jpg" width="696" height="265" alt />
        <br />
        <br />
        <strong>步骤4</strong>
        <strong>
          ：
          <br />
        </strong>选择 [Internet 协议版本 4 (TCP/IPv4)]，再点击 [属性]。
      </p>
      <p class="p-pt">
        <img src="../../assets/images/preventHijack/picture-5.jpg" width="335" height="421" alt />
        <br />
        <br />
        <strong>步骤5</strong>
        <strong>：</strong>
        <br />选择 [使用下面的DNS服务器地址]，输入 [首选 DNS服务器为 8.8.8.8 ]和 [备用DNS服务器为8.8.4.4]，然后点击 [确定]。
      </p>
      <p class="p-pt">
        <img src="../../assets/images/preventHijack/picture-6.png" width="336" height="373" alt />
        <br />
        <br />
        <strong>注：</strong>
        <br />若完成手动修复本地DNS后仍无法解决问题，您可以参阅以下链接：
        <br />
        <a
          href="https://support.microsoft.com/zh-cn/kb/972034"
          target="_blank"
          class="hijack-a"
        >https://support.microsoft.com/zh-cn/kb/972034</a>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hijack {
  margin: 30px 0;
  line-height: 1.8;
  .hijack-content {
    width: 760px;
    margin: 0 auto;
  }
  .single-title {
    font-size: 30px;
    text-align: center;
    padding: 10px 0;
  }
  .p-pt {
    padding-top: 8px;
  }
  .hijack-pic {
    margin-left: 20px;
  }
  img {
    display: inline;
  }
}
</style>