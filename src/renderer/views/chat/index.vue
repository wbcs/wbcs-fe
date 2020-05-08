<template>
  <div class="chat-box" @click="hideGroupSidebar">
    <div v-if="currentChat.uid || currentChat.gid">
      <Header
        :title="title"
        :isGroup="isGroup"
        @iconClick="showGroupSidebar"
      />
      <DialogBox :messageList="messageList" />
      <Editor
        :isGroup="isGroup"
        @image="openImageDialog"
        @file="openFileDialog"
        @audio="openVoiceChatDialog"
        @video="openVideoChatDialog"
        @emoji="openFaceDialog"
        @send="sendTextMessage"
      />
      <GroupMembers
        :class="{ 'show-group-sidebar': showGroupMemberList }"
        v-if="isGroup"
        :memberList="memberArr"
        @close="hideGroupSidebar"
      />
    </div>
    <DefaultPage v-else />
  </div>
</template>

<script>
import * as fs from 'fs'
import { remote, ipcRenderer } from 'electron'

import { SOCKET } from '@/request'
import { openChat, generateUUID } from '@/utils'
import DefaultPage from '@/components/default-page'

import Header from './header'
import DialogBox from './dialog-box'
import Editor from './editor'
import GroupMembers from './group-members'

export default {
  name: 'chat-box',
  components: {
    Header,
    DialogBox,
    Editor,
    GroupMembers,
    DefaultPage
  },
  data() {
    return {
      showGroupMemberList: false,
      contactInfo: {},
      messageList: []
    }
  },
  mounted() {
    SOCKET.on('new-message', message => {
      const { nickname, avatar, content, from, to } = message
      const noti = {
        title: nickname || 'hehe',
        body: content.text,
        icon:
          avatar ||
          'http://localhost:3000/upload/default/default-user-avatar.png'
      }
      const notification = new Notification(noti.title, noti)
      notification.onclick = () => openChat(from)
      console.log(message)
      if (to === this.contactInfo.gid || from === this.currentChat.uid) {
        this.messageList.push(message)
      }
    })
    SOCKET.on('request-video-chat', ({ from }) => {
      if (this.currentChat.uid === from) {
        this.openVideoChatDialog('pickUp')
      }
    })
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
      this.messageList = []
      this.getContactInfo()
        .then(() => this.getHistoryMessage())
        .catch(console.log)
    }
  },
  methods: {
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
        this.messageList.push(...messages)
      })
    },
    showGroupSidebar() {
      this.showGroupMemberList = true
    },
    hideGroupSidebar() {
      this.showGroupMemberList = false
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
      }
      ipcRenderer.send('open-window', {
        uid: this.contactInfo.uid,
        type
      })
      ipcRenderer.on('sub-closed', handleClose)
    },
    sendTextMessage(data) {
      const { nickname, avatar } = this.userInfo
      const message = {
        uuid: generateUUID(),
        from: this.$store.state.uid,
        to: this.currentChat[this.isGroup ? 'gid' : 'uid'],
        type: 'text',
        nickname,
        avatar,
        content: {
          text: data
        }
      }
      this.sendMessage(message)
    },
    sendMessage(msg) {
      SOCKET.emit('message', msg, res => console.log(res))
      this.messageList.push(msg)
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
  border: 1px solid red;
  & > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}
</style>
