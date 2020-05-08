<template>
  <div class="message-box">
    <div class="system-message" v-if="data.type === 'system'">
      <keep-alive>
        <component :is="messageType" />
      </keep-alive>
    </div>
    <div
      class="user-message"
      :class="{ group: isGroup, self: isSelf }"
      v-else
    >
      <div v-if="isGroup" class="username">{{ name }}</div>
      <img class="avatar" :src="avatar" />
      <Popover :type="isSelf ? 'right' : 'left'">
        <keep-alive>
          <component :is="messageType" :message="data" />
        </keep-alive>
      </Popover>
    </div>
  </div>
</template>

<script>
import { SOCKET } from '@/request'
import Popover from '@/components/popover'

import TextMessage from './message-types/text-message'
import ImageMessage from './message-types/image-message'
import FileMessage from './message-types/file-message'
import AudioMessage from './message-types/audio-message'
import VideoMessage from './message-types/video-message'
import SystemMessage from './message-types/system-message'

export default {
  name: 'message-box',
  data() {
    return {
      avatar: '',
      name: ''
    }
  },
  props: ['data'],
  components: {
    Popover,

    TextMessage,
    ImageMessage,
    FileMessage,
    AudioMessage,
    VideoMessage,
    SystemMessage
  },
  mounted() {
    if (this.isSelf) {
      this.setSelfInformation()
      return
    }
    this.fetchOtherInformation()
  },
  computed: {
    isSelf() {
      const { data } = this.$props
      const { uid } = this.$store.state
      return uid === data.from
    },
    isGroup() {
      const { data } = this.$props
      return data.to[0] === 'g'
    },
    messageType() {
      const { data } = this.$props
      const typeOfBigCamelCase = data.type.replace(/^./, l =>
        l.toUpperCase()
      )
      return `${typeOfBigCamelCase}Message`
    }
  },
  methods: {
    setSelfInformation() {
      const { state } = this.$store
      const { nickname, uid, avatar } = state.main.userInfo
      this.name = nickname || uid
      this.avatar = avatar
    },
    fetchOtherInformation() {
      const { data } = this.$props
      const eventName = 'get-user-info'
      SOCKET.emit(eventName, data.from, data => {
        this.avatar = data.avatar
        this.name = data.nickname || data.uid
      })
    }
  }
}
</script>

<style lang="less" scoped>
.message-box {
  margin-bottom: 15px;
}
.user-message {
  position: relative;
  display: flex;
}
.self {
  justify-content: flex-end;
  .avatar {
    order: 3;
  }
}
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
}
.username {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0.7em;
  color: #6c7989;
}
.group.self .username {
  width: fit-content;
  right: 0;
  left: initial;
}
.group {
  padding-top: 16px;
}
</style>
