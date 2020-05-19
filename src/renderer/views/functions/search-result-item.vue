<template>
  <div class="search-result-item">
    <div class="avatar">
      <img :src="data.avatar" alt="avatar" />
    </div>
    <div class="name">{{ data.nickname || data.uid }}</div>
    <div class="icon" @click="addContactRequest">
      <span :class="iconStatus"></span>
    </div>
  </div>
</template>

<script>
import { SOCKET } from '@/request'

export default {
  name: 'search-result-item',
  props: {
    data: {
      required: true,
      type: Object
    },
    isGroup: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      iconStatus: 'icon-add'
    }
  },
  methods: {
    addContactRequest() {
      if (this.iconStatus === 'icon-check') {
        return
      }

      const event = this.isGroup ? 'join-group' : 'ADD_FRIEND'
      const prop = this.isGroup ? 'gid' : 'friendUid'

      let obj = {
        uid: this.$store.state.uid,
        [prop]: this.isGroup ? this.data.gid : this.data.uid
      }

      SOCKET.emit(event, obj, data => {
        if (data.code === 0) {
          this.iconStatus = 'icon-check'
          alert(data.message)
        }
      })
    }
  }
}
</script>

<style lang="less">
.search-result-item {
  display: flex;
  align-items: center;
  width: 220px;
  height: 36px;
  margin: 0 auto 10px;
  background: #fff;
  border-radius: 4px;

  .avatar {
    width: 26px;
    height: 26px;
    margin: 0 8px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .name {
    width: 140px;
    font-size: 10px;
    color: #676767;
    letter-spacing: 0.14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon {
    width: 14px;
    height: 14px;
    margin: 0 8px 0 16px;

    text-align: center;
    font-size: 14px;
    color: #a7b0bb;
    cursor: pointer;

    &:hover {
      color: #666;
    }
  }

  .icon-check {
    color: #424951;
    cursor: text;
  }
}
</style>
