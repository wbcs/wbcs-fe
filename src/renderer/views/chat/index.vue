<template>
  <div class="chat-box" @click="hideGroupSidebar">
    <div v-if="currentChat">
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
      const isToGroup = to[0] === 'g'

      notification.onclick = () => openChat(isToGroup ? to : from)
      if (
        (isToGroup && to === this.contactInfo.gid) ||
        (!isToGroup && from === this.currentChat)
      ) {
        this.messageList.push(message)
      }
    })
    SOCKET.on('request-video-chat', ({ from }) => {
      if (this.currentChat === from) {
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
      return this.currentChat[0] === 'g' ? true : false
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
        const event = this.isGroup ? 'get-group-info' : 'get-friend-info'
        const idName = this.isGroup ? 'gid' : 'uid'
        const id = this.currentChat
        const queryObj = this.isGroup
          ? id
          : { uid: this.$store.state.uid, friendUid: id }

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
      const option = {
        properties: ['openFile', 'multiSelections'],
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'png', 'gif']
          }
        ]
      }
      remote.dialog.showOpenDialog(option).then(res => {
        if (!res.filePaths) return
        res.filePaths.forEach(this.sendImage)
      })
    },
    sendImage(path) {
      const base64Data = fs.readFileSync(path, 'base64')
      SOCKET.emit('store-image', { base64Data }, data => {
        const message = {
          uuid: generateUUID(),
          from: this.$store.state.uid,
          to: this.currentChat,
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
            to: this.currentChat,
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
        to: this.currentChat,
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
      SOCKET.emit('message', msg, console.log)
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
  & > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}
</style>
