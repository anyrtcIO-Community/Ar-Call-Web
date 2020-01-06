<template>
  <div class="ar-main join-page">
    <div class="call-container">
      <div class="join-wrap">
        <div class="join-download">
          <p class="join-download_title">客户端下载</p>
          <div class="download-qrcode">
            <div class="download-qrcode_item">
              <div class="download-qrcode_pic"><img src="../assets/img/ios.png" alt=""></div>
              <div class="download-qrcode_name">iOS</div>
            </div>
            <div class="download-qrcode_item">
              <div class="download-qrcode_pic"><img src="../assets/img/android.png" alt=""></div>
              <div class="download-qrcode_name">Android</div>
            </div>
            <!-- <div class="download-qrcode_item">
              <div class="download-qrcode_pic"></div>
              <div class="download-qrcode_name">微信小程序</div>
            </div> -->
          </div>

          <p class="join-download_title">开发文档</p>
          <div class="join-download_links">
            <a href="https://docs.anyrtc.io/v1/CALL/ios.html" target="_blank" class="join-download_link">iOS</a>
            <a href="https://docs.anyrtc.io/v1/CALl/android.html" target="_blank" class="join-download_link">Android</a>
            <a href="https://docs.anyrtc.io/v1/CAll/web.html" target="_blank" class="join-download_link">Web</a>
            <!-- <a href="javascript:void(0)" target="_blank" class="join-download_link">微信小程序</a> -->
          </div>

          <p class="join-download_title">查看源码</p>
          <div class="join-download_links">
            <a href="https://github.com/anyRTC/AR-Call-iOS" target="_blank" class="join-download_link">iOS</a>
            <a href="https://github.com/anyRTC/AR-Call-Android" target="_blank" class="join-download_link">Android</a>
            <a href="https://github.com/anyRTC/AR-Call-Web" target="_blank" class="join-download_link">Web</a>
            <!-- <a href="javascript:void(0)" target="_blank" class="join-download_link">微信小程序</a> -->
          </div>
        </div>
        <div class="join-form">
          <div>
            <img class="join-form_logo" src="../assets/img/logo.png" alt="" style="width: 70px;height: 70px;">
            <p class="join-form_appname">AR Call呼叫DEMO</p>
          </div>
          <div class="join-input">
            <el-input v-model="userId" placeholder="请输入手机号" @keyup.enter.native="join" ></el-input>
          </div>
          <div class="join-input">
            <el-button type="primary" @click="join">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        userId: '',
      }
    },
    methods: {
      join() {
        if(this.userId == ''){
          this.$message.error('请输入手机号');
          return ;
        }
        if(!(/^[0-9]*$/.test(this.userId))){ 
          this.$message.error('帐号只能是数字');
          return ; 
        } 
        this.$router.push(`/call/${this.userId}`)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .join-page {
    display: flex;
    height: 100%;
    align-items: center;
  }
  
  .join-wrap {
    display: flex;
    justify-content: space-between;

    .join-download {
      .join-download_title {
        margin-top: 25px;
        margin-bottom: 18px;
        padding-left: 10px;
        position: relative;
        font-size: 14px;
        color: #666;

        &:first-child {
          margin-top: 0;
        }

        &:before {
          content: "";
          position: absolute;
          display: block;
          width: 4px;
          height: 14px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          background-color: #1db553;
        }
      }
      .download-qrcode {
        display: flex;

        .download-qrcode_item {
          flex: 0 1 auto;
          margin: 0 15px;
          text-align: center;

          .download-qrcode_pic {
            display: block;
            margin-bottom: 10px;
            width: 80px;
            height: 80px;
            border-radius: 4px;
            border:1px solid rgba(238,238,238,1);
            box-shadow:0px 4px 6px 0px rgba(0, 0, 0, 0.1);
            img{
              width: 80px;
            }
          }
          .download-qrcode_name {
            font-size: 12px;
            color: #999;
          }


        }
      }
      .join-download_links {

        .join-download_link {
          margin: 0 20px 0 15px;
          text-decoration: none;
          font-size: 14px;
          color: #3875ff;
        }
      }
    }

    .join-form {
      padding: 50px 40px 40px;
      width: 320px;
      text-align: center;
      box-sizing: border-box;
      border:1px solid rgba(221,221,221,1);
      box-shadow: 0px 8px 12px 0px rgba(11, 35, 45, 0.11);
      border-radius:4px;

      .join-form_logo {
        margin-bottom: 10px;
        display: inline-block;
        width: 70px;
        height: 70px;
        border-radius: 10px;
        background-color: #333;
      }

      .join-form_appname {
        font-size: 12px;
        color: #333;
      }
    }
  }
  .join-input{
    margin-top: 40px;
    button{
      width: 100%;
      background-color: #1DB553;
      border: none;
    }
  }
  .join-radio{
    margin-top: 20px;
  }
  
  @media screen and (max-width: 475px) {
    .join-wrap {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
</style>

