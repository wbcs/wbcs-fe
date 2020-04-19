<template>
  <div class="left-message-box" :class="{ 'has-padding': isGroup }">
    <div v-if="isGroup" class="box-head">{{ nickname }}</div>
    <div class="avatar">
      <img :src="avatar" />
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { socket } from '@/utils'

export default {
  name: 'left-message-box',
  props: {
    message: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      avatar: '',
      nickname: ''
    }
  },
  computed: {
    isGroup() {
      return this.message.to.startsWith('g')
    }
  },
  created() {
    this.getContactInfo()
  },
  methods: {
    getContactInfo() {
      let event = 'get-user-info'
      let uid = this.message.from

      socket.emit(event, uid).then(data => {
        this.avatar = data.avatar
        this.nickname = data.nickname || data.uid
      })
    }
  }
}
</script>

<style lang="less">
.left-message-box {
  position: relative;
  display: flex;
  justify-content: flex-start;

  &.has-padding {
    padding-top: 16px;
  }

  .box-head {
    position: absolute;
    top: 0;
    z-index: 9;
    font-size: 10px;
    color: #6c7989;
  }

  .avatar {
    width: 34px;
    height: 34px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .content {
    position: relative;
    max-width: 300px;
    margin-left: 20px;
    padding: 8px;
    border-radius: 6px;
    background: #6c7989;
    font-size: 12px;
    color: #e0e0e0;
    letter-spacing: 0.06px;
    word-break: break-all;
    cursor: text;
    user-select: text;

    &::after {
      content: '';
      position: absolute;
      top: 6px;
      left: -22px;
      z-index: 3;
      width: 0;
      height: 0;
      border-left: 12px solid transparent;
      border-right: 12px solid #6c7989;
      border-bottom: 12px solid transparent;
      border-top: 12px solid transparent;
    }
  }
}
</style>
