<template>
  <div class="chat-box" @click="hideGroupSidebar">
    <div v-if="currentChat.uid || currentChat.gid">
      <header class="chat-box-head">
        <span class="title">{{ title }}</span>
        <span
          class="icon icon-users"
          v-show="isGroup"
          @click.stop="showGroupSidebar"
        />
      </header>
      <div class="chat-box-content" ref="chatBoxContent">
        <message-item
          v-for="item in messageArr"
          :key="item.uuid"
          :message="item"
        />
      </div>
      <div class="chat-box-foot" @click="handleFooterClick">
        <div>
          <div class="foot-tools">
            <span class="icon icon-happy2" @click="openFaceDialog" />
            <span
              class="icon icon-photo_size_select_actual"
              @click="openImageDialog"
            />
            <span
              v-show="!isGroup"
              class="icon icon-folder"
              @click="openFileDialog"
            />
            <span
              v-show="!isGroup"
              class="icon icon-microphone"
              @click="openVoiceChatDialog"
            />
            <span
              v-show="!isGroup"
              class="icon icon-video-camera"
              @click="openVideoChatDialog('call')"
            />
          </div>
          <div class="foot-input">
            <textarea
              v-model="message"
              ref="textarea"
              placeholder="请输入消息"
              @compositionstart="detectCompositionInput(true)"
              @compositionend="detectCompositionInput(false)"
              @keydown.enter="sendTextMessage($event)"
            />
          </div>
        </div>
        <div>
          <span class="icon icon-send-o" @click="sendTextMessage" />
        </div>
      </div>
      <div
        class="chat-box-group-sidebar"
        v-if="isGroup"
        :class="{ 'show-group-sidebar': isShowGroupSidebar }"
        @click.stop
      >
        <div class="sidebar-head">
          <span class="sidebar-head__title">
            <span>{{
              $store.state.MULTI_LANG_TEXT.chat.groupMember
            }}</span>
            <span style="font-size:12px;">[{{ memberArr.length }}]</span>
          </span>
          <span class="icon icon-close" @click.stop="hideGroupSidebar" />
        </div>
        <div class="sidebar-content">
          <group-member-item
            v-for="member in memberArr"
            :key="member.uid"
            :data="member"
            style="width:100%;"
          />
        </div>
      </div>
    </div>
    <defaultPage v-else />
  </div>
</template>

<script>
import * as fs from 'fs'
import { remote, ipcRenderer } from 'electron'

import { SOCKET } from '@/request'
import { openChat, generateUUID } from '@/utils'
import DefaultPage from '@/components/default-page'

import MessageItem from './message-item'
import GroupMemberItem from '@/components/group-member-item'

export default {
  name: 'chat-box',
  components: {
    DefaultPage,
    MessageItem,
    GroupMemberItem
  },
  data() {
    return {
      contactInfo: {},
      isShowGroupSidebar: false,
      isCompositionInput: false,
      videoWindow: null,
      message: '',
      messageArr: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.main.userInfo
    },
    currentChat() {
      return this.$store.state.chat.currentChat
    },
    isGroup() {
      return this.currentChat.gid ? true : false
    },
    memberArr() {
      return this.contactInfo.members || []
    },
    title() {
      const { alias, nickname, uid } = this.contactInfo
      return alias || nickname || uid
    }
  },
  watch: {
    currentChat() {
      this.$nextTick(() => {
        if (this.$refs.textarea) {
          this.$refs.textarea.focus()
        }
      })

      this.messageArr = []

      this.getContactInfo()
        .then(() => {
          this.getHistoryMessage()
        })
        .catch(err => {
          console.log(err)
        })
    },
    messageArr() {
      this.$nextTick(() => {
        if (this.$refs.chatBoxContent) {
          this.$refs.chatBoxContent.scrollTop = this.$refs.chatBoxContent.scrollHeight
        }
      })
    }
  },
  created() {
    // TODO 时间比较紧，暂时在客户端这样分发消息
    // 这样做的局限是，无法全局监听消息，所以有新消息时，没法及时给出通知
    SOCKET.on('new-message', message => {
      const { nickname, avatar, content, from } = message
      const noti = {
        title: nickname || 'hehe',
        body: content.text,
        icon:
          avatar ||
          'http://localhost:3000/upload/default/default-user-avatar.png'
      }
      const notification = new Notification(noti.title, noti)
      notification.onclick = () => {
        openChat(from)
      }
      console.log(message)
      const fromId = message.from
      const toId = message.to
      const isGroupMessage = message.to.startsWith('g')

      if (isGroupMessage && toId === this.contactInfo.gid) {
        this.messageArr.push(message)
      } else if (!isGroupMessage && fromId === this.currentChat.uid) {
        this.messageArr.push(message)
      }
    })

    SOCKET.on('request-video-chat', ({ from }) => {
      if (this.currentChat.uid === from) {
        this.openVideoChatDialog('pickUp')
      }
    })
  },
  methods: {
    handleFooterClick() {
      this.$refs.textarea.focus()
    },
    getContactInfo() {
      return new Promise(resolve => {
        let event = this.isGroup ? 'get-group-info' : 'get-friend-info'
        let _idName = this.isGroup ? 'gid' : 'uid'
        let _id = this.currentChat[_idName]
        let queryObj = this.isGroup
          ? _id
          : { uid: this.$store.state.uid, friendUid: _id }

        SOCKET.emit(event, queryObj, data => {
          this.contactInfo = data
          resolve()
        })
      })
    },
    getHistoryMessage() {
      const query = this.isGroup
        ? { gid: this.contactInfo.gid }
        : { uid: this.$store.state.uid, friendUid: this.contactInfo.uid }
      SOCKET.emit('get-history-message', query, data => {
        const messages = data.data
        this.messageArr.push(...messages)
      })
    },
    showGroupSidebar() {
      this.isShowGroupSidebar = true
    },
    hideGroupSidebar() {
      this.isShowGroupSidebar = false
    },
    openFaceDialog() {
      // do something
      alert('待开发')
    },
    openImageDialog() {
      const { dialog } = remote
      const option = {
        properties: ['openFile', 'multiSelections'],
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'png', 'gif']
          }
        ]
      }
      dialog.showOpenDialog(option, filePaths => {
        if (filePaths && filePaths.length) {
          filePaths.forEach(path => {
            if (path) {
              this.sendImage(path)
            }
          })
        }
      })
    },

    sendImage(path) {
      const base64Data = fs.readFileSync(path, 'base64')
      SOCKET.emit('store-image', { base64Data }, data => {
        const message = {
          uuid: generateUUID(),
          from: this.$store.state.uid,
          to: this.currentChat[this.isGroup ? 'gid' : 'uid'],
          type: 'image',
          content: {
            url: data.data.url
          }
        }
        this.sendMessage(message)
      })
    },
    openFileDialog() {
      // do something
      alert('待开发')
    },
    openVoiceChatDialog() {
      // do something
      alert('待开发')
    },
    openVideoChatDialog(type) {
      const handleClose = () => {
        if (type === 'call') {
          let message = {
            uuid: generateUUID(),
            from: this.$store.state.uid,
            to: this.currentChat.uid,
            type: 'video',
            content: {
              text: '视频通话已结束'
            }
          }
          this.sendMessage(message)
        }
        this.videoWindow = null
      }
      ipcRenderer.send('open-window', {
        uid: this.contactInfo.uid,
        type
      })
      ipcRenderer.on('sub-closed', handleClose)
    },
    detectCompositionInput(value) {
      this.isCompositionInput = value
    },
    sendTextMessage(e) {
      if (e.shiftKey || this.isCompositionInput) {
        // enter+shift  next line
        return
      }
      e.preventDefault()
      if (!this.message) return
      const { nickname, avatar } = this.userInfo
      const message = {
        uuid: generateUUID(),
        from: this.$store.state.uid,
        to: this.currentChat[this.isGroup ? 'gid' : 'uid'],
        type: 'text',
        nickname,
        avatar,
        content: {
          text: this.message
        }
      }
      this.sendMessage(message)
      this.message = ''
    },
    sendMessage(msg) {
      SOCKET.emit('message', msg, res => console.log(res))
      this.messageArr.push(msg)
    }
  }
}
</script>

<style scoped lang="less">
.icon {
  color: #a8b0ba;
  cursor: pointer;
  transition: 0.15s;
  &:hover {
    color: #666;
  }
}
.chat-box {
  position: relative;
  height: 100%;
  & > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}
.chat-box-head {
  position: relative;
  padding: 0.8em 20px;
  border-bottom: 1px solid #ddd;
  -webkit-app-region: drag;
  .title {
    font-size: 1.1em;
    font-weight: 400;
  }
  .icon {
    position: absolute;
    top: 0.8em;
    right: 20px;
    z-index: 2;
  }
}
.chat-box-content {
  flex: 1;
  padding: 12px 20px;
  overflow-y: auto;
}
.chat-box-foot {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 150px;
  padding: 9px 20px 10px;
  border-top: 1px solid #ddd;

  .foot-tools {
    display: flex;
    width: 490px;
    margin-bottom: 12px;

    .icon {
      display: block;
      width: 18px;
      height: 18px;
      margin-right: 12px;

      font-size: 18px;
      text-align: center;
    }
    .icon-happy2 {
      transform: scale(0.92);
    }
  }
  .foot-input {
    width: 490px;
    height: 60px;
    textarea {
      display: block;
      width: 100%;
      height: 60px;
      border: none;
      border-radius: 4px;
      resize: none;
      background: none;
      font-size: 14px;
      color: #666;
      letter-spacing: 0.07px;
      &:focus {
        outline: none;
      }
      &::placeholder {
        color: #ddd;
        letter-spacing: 0.1px;
        font-weight: 200;
      }
    }
  }
  .icon-send-o {
    line-height: 90px;
    font-size: 35px;
  }
}
.chat-box-group-sidebar {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  width: 240px;
  height: 100%;
  background: #ffffff;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: 0.2s;
  &.show-group-sidebar {
    transform: translateX(0);
  }
  .sidebar-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid #dddddd;
    &__title {
      font-size: 16px;
      color: #666666;
      letter-spacing: 0.04px;
    }
    .icon-close {
      font-size: 18px;
      color: #999999;
      cursor: pointer;
    }
  }
  .sidebar-content {
    overflow: auto;
  }
}
</style>
