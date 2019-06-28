<template>
  <div class="ar-p2p">
    <div class="ar-await" v-show="isWaiting">
      <div class="ar-await-content">
        <div class="">
          <p>{{userId}}<span @click="logout"> 注销</span></p>
          <el-input placeholder="请输入呼叫号码" v-model="callId"></el-input>
          <el-button @click="audioCall">语音通话</el-button>
          <el-button @click="videoCall">视频通话</el-button>
        </div>
      </div>
    </div>
    <div class="ar-container" v-show="!isWaiting">
      <div class="ar-p2p_side ar-aside">
        <div class="ar-container ar-ara-ar is-vertical">
          <div class="ar-p2p_info">
            <div class="flex info_item isHoster1">
              <span class="inof_item_label">通话类型</span>
              <span style="font-size:14px; color:rgba(102,102,102,1);">{{isVideoCall ? '视频' : '音频'}}通话</span>
            </div>
            <div class="flex info_item" v-show="isVideoCall">
              <span class="inof_item_label">视频源:</span>
              <select class="ar-device_select" v-model="cameraDeviceId" @change="handleCameraChange">
                <option v-for="(camera, idx) in cameraList" :key="idx" :value="camera.value">{{camera.label}}</option>
              </select>
            </div>
            <div class="flex info_item">
              <span class="inof_item_label">音频源:</span>
              <select class="ar-device_select" v-model="micphoneDeviceId" @change="handleMicponeChange">
                <option v-for="(micphone, idx) in micphoneList" :key="idx" :value="micphone.value">{{micphone.label}}</option>
              </select>
            </div>
          </div>
          <div class="ar-p2p_log_title" v-show="isVideoCall">本地视频预览</div>
          <div class="video info_item" style="padding: 0px 30px;" v-show="isVideoCall">
            <div class="my_video" style="height:134px;" ref="myVideoView"></div>
          </div>
          <div class="ar-p2p_log_title">日志</div>
          <div class="ar-p2p_box_background"></div>
          <div class="ar-main ar-log_view" ref="logView">
            <div class="ar-p2p_log" ref="logList">
              <div :class="['ar-p2p_log_item', {'error': log.type === 'error'}]" v-for="(log, n) in logs" :key="n">{{log.content}}</div>
            </div>
          </div>
          <div class="ar-p2p_box_background"></div>
        </div>
      </div>
      <!--  -->
      <div class="ar-main ar-p2p_view">
        <div class="ar-container is-vertical">
          <!--  -->
          <div class="ar-p2p_control">
            <div class="ar-p2p_control_left">
            </div>
            <div class="ar-p2p_control_right">
              <button type="primary" hollow v-show="isVideoCall" @click="switchVideo" :class="videoEnable ? 'on': 'off'">视频 ： {{ videoEnable ? '开' : '关' }}</button>
              <button type="error" hollow @click="switchAudio" :class="audioEnable ? 'on': 'off'">音频 ： {{ audioEnable ? '开' : '关' }}</button>
              <button type="error" @click="leaveP2P(true)" class="signOut">退出</button>
            </div>
          </div>
          <!--  -->
          <h3>{{isVideoCall ? '视频通话窗口' : '语音通话成员'}}</h3>
          <!--  -->
          <div class="ar-main">
            <div class="ar-video_view" ref="videoView">
              <div class="ar-video_wrap" ref="videoWrap">
                <div class="ar-audio_call" v-if="!isVideoCall">
                  <h3>{{callId}}</h3>
                  <p>{{isShowAudio ? '正在通话中···' : '等待对方接听'}}</p>
                  <p>{{talkTime}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ar-message-box" v-show="isShowMessge">
      <div class="ar-message">
        <header>{{msg.title}}<span><i class="el-icon-close" @click="closeMessage"></i></span></header>
        <section>{{msg.text}}</section>
        <footer>
          <el-button type="default" size="small" @click="closeMessage">取消</el-button><el-button type="primary" size="small" @click="submit">确认</el-button>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import ArCall from 'ar-call';
import config from '@/config/index.js';
import { truncate } from 'fs';
import { constants } from 'crypto';
export default {
  data() {
    return {
      userId: this.$route.params.userId,
      callId: '',
      call: null,
      pubId: '',
      //等待状态  默认true
      isWaiting: true,
      //视频呼叫还是音频呼叫
      isVideoCall: false,
      //音频呼叫有没有开始
      isShowAudio: false,
      //音视频
      cameraDeviceId: '',
      cameraList: [],
      micphoneDeviceId: '',
      micphoneList: [],
      //日志
      logs: [],
      //本地音视频开关
      videoEnable: true,
      audioEnable: true,

      talkTime: '00 : 00 : 00',
      callTimer: null,
      //弹窗显示
      isShowMessge: false,
      msg: {
        title: '提示',
        text: '',
        roomId: '',
        peerUserId: '',
        callMode: '',
        peerUserData: '',
        callExtend: '',
      }
    }
  },
  mounted(){
    if(!(/^[0-9]*$/.test(this.userId))){ 
      this.$router.push('/');
      this.$message.error('用户昵称错误请重新登录')
      return;
    } 
    let that = this;
    let call = new ArCall({
        autoBitrate: true,
        userData: '{}',
        logLevel: 'info'
    });
    that.call = call;

    call.initAppInfo(config.APP_ID, config.APP_TOKEN);

    call.configServer(config.RTC_SERVE_URL);

    call.turnOn(that.userId, '');
    
    call.getDevices()
    .then(data =>{
      if(data.videoinput.length !== 0){
        that.cameraList = data.videoinput;
        that.cameraDeviceId = that.cameraList[0].value;
      }
      if(data.audioinput.length !== 0){
        that.micphoneList = data.audioinput;
        that.micphoneDeviceId = that.micphoneList[0].value;
      }
    })
    .catch(err => {
      console.log('getDevice error', err);
    })
    //用户收到通话请求
    call.on("make-call", (roomId, peerUserId, callMode, peerUserData, callExtend) => {
      console.log("make-call", roomId, peerUserId, callMode, peerUserData, callExtend);
      that.addLog('info', `回调make-call：收到${callMode == 0 ? '视频呼叫' : callMode == 2 ? '音频呼叫':''}请求`);
      that.isShowMessge = true;
      that.msg = {
        title: '提示',
        text: `接收到${peerUserId}的${callMode == 0 ? '视频呼叫' : callMode == 2 ? '音频呼叫' : callMode == 21 ? '视频呼叫客服' : '音频呼叫客服'}`,
        roomId: roomId,
        peerUserId: peerUserId,
        callMode: callMode,
        peerUserData: peerUserData,
        callExtend: callExtend,
      }
    });
    //用户上线成功回调
    call.on("online-success", () => {
      console.log('用户上线成功');
      that.addLog('info', '回调online-success：用户上线成功');
    });
    //用户上线失败回调
    call.on("online-failed", (errCode) => {
      console.log('用户上线失败'+ errCode)
      that.addLog('info', '回调online-failed：用户上线失败');
    });
    //对方同意呼叫回调
    call.on("accept-call", (peerUserId) => {
      that.addLog('info', '回调accept-call：对方同意呼叫');
      console.log('对方同意呼叫'+ peerUserId)
    });
    //对方拒绝呼叫
    call.on("reject-call", (peerUserId, code) => {
      that.addLog('info', '回调reject-call：对方拒绝呼叫');
      console.log('对方拒绝呼叫'+ peerUserId, code)
      that.$message.error('对方拒绝通话');
      that.leaveP2P();
    });
    //通话结束
    call.on("end-call", (peerUserId, errCode) => {
      console.log('通话结束'+ peerUserId, errCode);
      that.addLog('info', '回调end-call：对方拒绝呼叫'+errCode);
      that.$message.error('通话结束');
      that.isShowMessge = false;
      that.msg = {};
      that.leaveP2P();
    
    });
    //收到对方视频流
    call.on("stream-subscribed", (peerUserId, pubId, rtcUserData, mediaRender) => {
      console.log('收到对方视频流', peerUserId,pubId,rtcUserData, mediaRender)
      that.addLog('info', '回调stream-subscribed：收到对方音/视频');
      mediaRender.id = 'video_'+peerUserId;
      that.$refs.videoWrap.appendChild(mediaRender);

      if(!that.isVideoCall){
        that.isShowAudio = true;
        that.startTime();
        let box = document.getElementById('video_'+peerUserId);
        box.style = "z-index:-99; display:none;"
      }
      
    });
    //移除远程视频窗口
    call.on("stream-unsubscribed", (peerUserId, pubId, rtcUserData) => {
      console.log('移除远程视频窗口', peerUserId)
      that.addLog('info', '回调stream-unsubscribed：移除远程视频窗口');
      document.getElementById('video_'+peerUserId).remove();
      that.isWaiting = true;
      that.videoEnable = true;
      that.audioEnable = true;
      if(!that.isVideoCall){
        that.isShowAudio = false;
        that.isVideoCall = true;
        clearInterval(that.callTimer);
        that.talkTime = '00 : 00 : 00';
      }
      document.getElementById("myVideo").remove();
    });
  },
  methods: {
    closeMessage(){
      let that = this;
      that.call.rejectCall(that.msg.peerUserId);
      that.addLog('info', '方法rejectCall：拒绝接听');   
      that.isShowMessge = false;
    },
    submit(){
      let that = this;
      that.roomId = that.msg.roomId;
      that.pubId = that.msg.peerUserId;
      that.isWaiting = false; 
      that.isVideoCall = that.msg.callMode == 0 ? true : false;
      that.setLocalVideoCapturer(() => {
        that.call.acceptCall(that.msg.peerUserId); 
      });
      if(!that.isVideoCall){
        that.startTime();
      }
      that.isShowMessge = false;
    },
    setLocalVideoCapturer(cb){
      let that = this;
      if(document.getElementById("myVideo")) document.getElementById("myVideo").remove(); 
      that.call.setLocalVideoCapturer({
        video: {
          enabled: that.videoEnable,
          deviceId: that.cameraDeviceId
        },
        audio: {
          enabled: that.audioEnable,
          deviceId: that.micphoneDeviceId
        }
      }).then(e => {
        e.mediaRender.id = "myVideo";
        that.$refs.myVideoView.appendChild(e.mediaRender);
        that.addLog('info', '方法acceptCall：同意接听');
        cb && cb();
      }).catch(err => {
        console.log(err)
      });
    },
    startTime(){
      let that = this;
      that.callStartTime = Date.now();
      that.callTimer && clearInterval(that.callTimer);
      that.callTimer = setInterval(() => {
        let inTime = Date.now() - that.callStartTime;

        let totalHours = parseInt(inTime / 60 / 60 / 1000);
        let totalMinutes = parseInt(inTime / 60 / 1000);
        let totalSeconds = parseInt(inTime / 1000);

        let hours = totalHours;
        let minutes = parseInt(totalMinutes - (totalHours * 60));
        let seconds = parseInt(totalSeconds - (totalMinutes * 60));

        that.talkTime = `${hours < 10 ? '0' + hours : hours} : ${minutes < 10 ? '0' + minutes : minutes} : ${seconds < 10 ? '0' + seconds : seconds}`
      }, 1000);
    },
    logout(){
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.call.turnOff();
        this.$router.push(`/`);
      }).catch((err) => {
        console.log(err)   
      }); 
    },
    //音频呼叫
    audioCall(){
      let that = this;
      if(that.callId == ''){
        that.$message.error('请输入呼叫号码');
        return ; 
      }
      if(that.userId == that.callId){
        that.$message.error('不能呼叫自己');
        return ; 
      }
      if(!(/^[0-9]*$/.test(that.callId))){ 
        that.$message.error('帐号只能是数字');
        return ; 
      } 
      that.isWaiting = false;
      that.isVideoCall = false;
      that.pubId = that.callId;
      that.setLocalVideoCapturer();
      that.addLog('info','方法makeCall：发起音频呼叫');
      that.call.makeCall(this.callId, 2, '{}', {});
    },
    //视频呼叫
    videoCall(){
      let that = this;
      if(that.callId == ''){
        that.$message.error('请输入呼叫号码');
        return ; 
      }
      if(that.userId == that.callId){
        that.$message.error('不能呼叫自己');
        return ; 
      }
      if(!(/^[0-9]*$/.test(that.callId))){ 
        that.$message.error('帐号只能是数字');
        return ; 
      } 
      
      that.pubId = that.callId;
      that.isWaiting = false;
      that.isVideoCall = true;
      that.setLocalVideoCapturer();
      that.addLog('info','方法makeCall：发起视频呼叫');
      that.call.makeCall(that.callId, 0, '');
    },
    addLog(type, strLog) {
      this.logs.push({
        type: type,
        content: strLog
      });
      this.$nextTick(() => {
        let logView = this.$refs.logView.getBoundingClientRect();
        let logList = this.$refs.logList.getBoundingClientRect();
        if (logList.height > logView.height) {
          this.$refs.logView.scrollTop = (logList.height - logView.height);
        }
      });
    },
    handleCameraChange(){
      this.addLog('info', `方法switchDevice：切换摄像头`);
      this.call.switchDevice({
        video: {
          enable: this.videoEnable,
          deviceId: this.cameraDeviceId
        },
        audio: {
          enable: this.audioEnable,
          deviceId: this.micphoneDeviceId
        }
      }).then(e => {
        document.getElementById("myVideo").remove();
        e.mediaRender.id = "myVideo";
        this.$refs.myVideoView.appendChild(e.mediaRender);
      }).catch(err => {
        console.log(err)
      });
    },
    handleMicponeChange(){
      this.addLog('info', `方法switchDevice：切换麦克风`);
      this.call.switchDevice({
        video: {
          enable: this.videoEnable,
          deviceId: this.cameraDeviceId
        },
        audio: {
          enable: this.audioEnable,
          deviceId: this.micphoneDeviceId
        }
      }).then(e => {
        document.getElementById("myVideo").remove();
        e.mediaRender.id = "myVideo";
        this.$refs.myVideoView.appendChild(e.mediaRender);
      }).catch(err => {
        console.log(err)
      });
    },
    //切换本地音视频
    switchVideo(){
      this.addLog('info', `方法setLocalVideoEnable：切换视频`);
      this.videoEnable = !this.videoEnable;
      this.call.setLocalVideoEnable(this.videoEnable);
    },
    //切换音频
    switchAudio(){
      this.addLog('info', `方法setLocalVideoEnable：切换音频`);
      this.audioEnable = !this.audioEnable;
      this.call.setLocalAudioEnable(this.audioEnable);
    },
    //退出
    leaveP2P(val){
      if(val) this.call.endCall(this.pubId);
      this.isWaiting = true;
      this.videoEnable = true;
      this.audioEnable = true;
      this.isVideoCall = false;
      if(document.getElementById("myVideo")) document.getElementById("myVideo").remove();
      if(document.getElementById('video_'+this.pubId)) document.getElementById('video_'+this.pubId).remove();
      this.talkTime = '00 : 00 : 00';
      clearInterval(this.callTimer);
      this.pubId = '';
      this.logs = [];
    }
  } 
}
</script>
<style lang="scss" scoped>
@import "../assets/scss/index.scss";
.ar-p2p{
  height: 100%;
}
.ar-await{
  position: fixed;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 580px;
  height:132px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(238,238,238,1);
  box-shadow:2px 8px 8px 0px rgba(11,35,45,0.05);
  border-radius:2px;
  padding: 30px;
  box-sizing: border-box;
  p{
    height: 14px;
    line-height: 14px;
    font-size:12px;
    margin-bottom: 15px;
    color:rgba(187,187,187,1);
    span{
      color:rgba(67,133,255,1);
      cursor: pointer;
    }
  }
}
.el-input{
  width: 316px;
  margin-right: 10px;
  font-size: 12px;
}
.el-button{
  display: inline-block;
  background-color: #1DB553;
  font-size: 12px;
  color: #fff;
}
.ar-audio_call{
  position: relative;
  z-index: 2;
  top: 0;
  text-align: center;
  width:360px;
  height:240px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(238,238,238,1);
  box-shadow:0px 4px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius:4px;
  h3{
    margin: 80px 0 30px;
    height:20px;
    line-height: 20px;
    font-size:20px;
    font-weight:400;
    color:rgba(68,68,68,1);
  }
  p{
    height:24px;
    line-height: 24px;
    font-size:12px;
    color:rgba(153,153,153,1);
  }
}
.ar-message-box{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 200;
  background: rgba(0,0,0,.1);
  .ar-message{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 420px;
    padding-bottom: 10px;
    background-color: #FFF;
    border-radius: 4px;
    border: 1px solid #EBEEF5;
    font-size: 18px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    text-align: left;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    header{
      position: relative;
      padding: 15px 15px 10px;
      font-size: 18px;
      line-height: 1;
      color: #303133;
      span{
        position: absolute;
        top: 15px;
        right: 20px;
        cursor: pointer;
      }
    }
    section{
      position: relative;
      padding: 10px 15px;
      color: #606266;
      font-size: 14px;
      line-height: 24px;
    }
    footer{
      padding: 5px 15px 0;
      text-align: right;
      .el-button{
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #FFF;
        border: 1px solid #DCDFE6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        -webkit-transition: .1s;
        transition: .1s;
        -moz-user-select: none;
        padding: 9px 15px;
        font-size: 14px;
        border-radius: 4px;
        margin-left: 10px;
      }
      .el-button--primary {
        color: #FFF;
        background-color: #409EFF;
        border-color: #409EFF;
      }
    }
  }
}
</style>
