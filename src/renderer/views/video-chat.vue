<template>
  <div class="video-chat">
    <div
      class="local-video-container"
      :class="{ 'remote-video-loaded': isLocalVideoLoaded }"
    >
      <video class="local-video" ref="local-video" autoplay />
    </div>
    <div
      class="remote-video-container"
      :class="{ 'remote-video-loaded': isRemoteVideoLoaded }"
    >
      <video class="remote-video" ref="remote-video" autoplay />
    </div>
    <div class="video-tools">
      <div class="hang-up" @click.stop="closeVideo">
        <span class="icon icon-phone-hang-up" />
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import { SOCKET } from '@/request'
import { Message } from '@/utils'
import 'webrtc-adapter'

export default {
  name: 'video-chat',
  data() {
    return {
      isRemoteVideoLoaded: false,
      isLocalVideoLoaded: false,
      localStream: null,
      remoteStream: null,
      pc: null
    }
  },
  mounted() {
    this.loadLocalVideo().then(() => {
      this.initConnect()
      if (this.type === 'call') {
        SOCKET.emit('REQUEST_VIDEO_CHAT', {
          from: this.$store.state.uid,
          to: this.toUid
        })
        SOCKET.on('VIDEO_CHAT_REDAY', () => this.createOffer())
        SOCKET.on('REQUEST_VIDEO_REJECT', () => {
          Message.info({ message: '视频被拒绝' })
          this.closeVideo()
        })

        return
      }
      if (this.type === 'pickUp') {
        this.createAnswer()
        SOCKET.emit('VIDEO_CHAT_REDAY', {
          from: this.$store.state.uid,
          to: this.toUid
        })
        return
      }
    })
  },
  computed: {
    toUid() {
      return this.$route.query.to
    },
    type() {
      return this.$route.query.type
    }
  },
  watch: {
    localStream() {
      this.$refs['local-video'].srcObject = this.localStream
    },
    remoteStream() {
      this.$refs['remote-video'].srcObject = this.remoteStream
    }
  },
  methods: {
    loadLocalVideo() {
      const constraints = {
        audio: true,
        video: {
          width: 1200,
          height: 720
        }
      }
      return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(mediaStream => {
          this.localStream = mediaStream
          this.isLocalVideoLoaded = true
          console.log('%c 本地视频加载成功', 'color: #41C02D')
        })
        .catch(e => {
          console.log('%c 本地视频加载失败', 'color: red', e)
        })
    },
    initConnect() {
      // use free stun server
      const RTCConfig = {
        iceServers: [
          { urls: 'stun:stun.voxgratia.org' },
          { urls: 'stun:stun.voipstunt.com' },
          { urls: 'stun:stunserver.org' },
          { urls: 'stun:stun.ekiga.net' }
        ]
      }
      const pc = new RTCPeerConnection(RTCConfig)
      this.pc = pc
      SOCKET.on('RTC_CANDIDATE', ({ candidateSdp }) => {
        const candidate = new RTCIceCandidate({
          candidate: candidateSdp,
          sdpMid: '',
          sdpMLineIndex: null
        })
        pc.addIceCandidate(candidate)
          .then(() => {
            console.log('%c 候选人添加成功', 'color:#41C02D')
          })
          .catch(e => {
            console.error('%c 候选人添加失败', 'color: red', e)
          })
      })

      pc.onicecandidate = e => {
        if (!e.candidate) return
        const { candidate: candidateSdp } = e.candidate
        SOCKET.emit('RTC_CANDIDATE', {
          from: this.$store.state.uid,
          to: this.toUid,
          candidateSdp
        })
      }
      pc.oniceconnectionstatechange = event => {
        console.log(`ICE state: ${pc.iceConnectionState}`)
        console.log('ICE state change event: ', event)
      }
      pc.ontrack = e => {
        if (this.remoteStream === e.streams[0]) return
        this.remoteStream = e.streams[0]
        this.isRemoteVideoLoaded = true
        console.log('%c 远程视频流接收', 'color:#41C02D')
      }
      this.localStream.getTracks().forEach(track => {
        // note: chrome  not support addTrack method now, so we use a shim
        // https://github.com/webrtc/adapter
        pc.addTrack(track, this.localStream)
      })
    },
    createOffer() {
      let pc = this.pc
      let offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      }
      if (!pc) return

      pc.createOffer(offerOptions)
        .then(offer => {
          console.log('\ncreateoffer -> offer:')
          console.log(offer)
          console.log('\n')
          console.log('pc start setLocalDescription')
          pc.setLocalDescription(offer)
            .then(() => {
              console.log('pc setLocalDescription complete')
              // send offer to remote client
              SOCKET.emit('RTC_OFFER', {
                from: this.$store.state.uid,
                to: this.toUid,
                offerSdp: offer.sdp
              })
            })
            .catch(err => {
              console.log(
                `pc setLocalDescription failed：${err.toString()}`
              )
            })
        })
        .catch(err => {
          console.error(`pc createOffer fail：${err.toString()}`)
        })

      SOCKET.on('RTC_ANSWER', ({ answerSdp }) => {
        let answer = new RTCSessionDescription({
          type: 'answer',
          sdp: answerSdp
        })

        console.log('pc start setRemoteDescription')
        console.log(answer)

        pc.setRemoteDescription(answer)
          .then(() => {
            console.log('pc setRemoteDescription complete')
          })
          .catch(err => {
            console.log(
              `pc setRemoteDescription failed：${err.toString()}`
            )
          })
      })
    },
    createAnswer() {
      let pc = this.pc

      SOCKET.on('RTC_OFFER', ({ offerSdp }) => {
        let offer = new RTCSessionDescription({
          type: 'offer',
          sdp: offerSdp
        })

        console.log('pc start setRemoteDescription')
        console.log(offer)

        pc.setRemoteDescription(offer)
          .then(() => {
            console.log('pc setRemoteDescription complete')
          })
          .catch(err => {
            console.log(
              `pc setRemoteDescription failed：${err.toString()}`
            )
          })

        console.log('pc start createAnswer')

        pc.createAnswer()
          .then(answer => {
            console.log('\ncreateAnswer -> answer:')
            console.log(answer)
            console.log('pc start setLocalDescription')

            pc.setLocalDescription(answer)
              .then(() => {
                console.log('pc setLocalDescription complete')

                // send answer to remote client
                SOCKET.emit('RTC_ANSWER', {
                  from: this.$store.state.uid,
                  to: this.toUid,
                  answerSdp: answer.sdp
                })
              })
              .catch(err => {
                console.log(
                  `pc setLocalDescription failed：${err.toString()}`
                )
              })
          })
          .catch(err => {
            console.error(`pc createAnswer fail：${err.toString()}`)
          })
      })
    },
    closeVideo() {
      let win = remote.getCurrentWindow()

      this.pc.close()
      win.close()
    }
  }
}
</script>

<style lang="less" scoped>
html,
body {
  height: 100%;
}

.video-chat {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  -webkit-app-region: drag;

  &:hover .video-tools {
    opacity: 1;
    pointer-events: auto;
  }
}

.local-video-container,
.remote-video-container {
  width: 100%;
  height: 100%;
}

.local-video,
.remote-video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.local-video-container {
  &.remote-video-loaded {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 20%;
    height: auto;
    border: 1px solid #fff;
    border-radius: 2px;
  }
}

.remote-video-container {
  display: none;

  &.remote-video-loaded {
    display: block;
  }
}

.video-tools {
  display: flex;
  position: absolute;
  bottom: 14px;
  right: 20px;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: 0.4s;

  .hang-up {
    width: 36px;
    height: 36px;

    border-radius: 50%;
    background: #e5664e;
    text-align: center;
    cursor: pointer;

    .icon {
      font-size: 16px;
      color: #fff;
    }
  }
}
</style>
