<template>
  <div
    class="chat-item"
    :class="{ active: isActive }"
    @click="handleChatItemClick"
  >
    <img class="avatar" :src="contactInfo.avatar" alt="avatar" />
    <div class="detail">
      <div v-if="isGroup && isGroupDissolve" class="group-dissolve">
        {{ $store.state.MULTI_LANG_TEXT.sidebar.groupDissolve }}
      </div>
      <div v-else>
        <div class="name">
          <span class="icon icon-users" v-if="isGroup" />
          {{
            contactInfo.alias || contactInfo.nickname || contactInfo.uid
          }}
        </div>
        <div class="last-message">
          {{ contactInfo.lastMessage }}
        </div>
      </div>
    </div>
    <div
      class="icon icon-close delete-chat"
      @click.stop="handleDeleteClick"
    />
  </div>
</template>

<script>
import { openChat } from '@/utils/chat'

export default {
  name: 'recent-chat-item',
  props: {
    contactInfo: {
      required: true,
      type: Object
    },
    isActive: {
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    _id() {
      return this.contactInfo.uid || this.contactInfo.gid
    },
    _idName() {
      return this.contactInfo.uid ? 'uid' : 'gid'
    },
    isGroup() {
      return this.contactInfo.gid ? true : false
    },
    isGroupDissolve() {
      return this.contactInfo.status === 'dissolve'
    }
  },
  methods: {
    handleChatItemClick() {
      if (this.isGroup && this.isGroupDissolve) {
        return
      }
      if (!this.isActive) {
        openChat(this._id)
      }
    },
    handleDeleteClick() {
      if (this.isActive) {
        this.$store.commit('CURRENT_CHAT', {})
      }
      this.$store.commit('DELETE_CHAT', {
        [this._idName]: this._id
      })
    }
  }
}
</script>

<style scoped lang="less">
.chat-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 60px;
  cursor: pointer;
  transition: 0.3s;
}
.chat-item.active {
  background: #eff0f1;
  &::before {
    content: '';
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    width: 3px;
    background: #3e74f6;
  }
}

.chat-item:hover {
  background: #dee0e3;
  .delete-chat {
    display: block;
    position: absolute;
    right: 5px;
    z-index: 10;
    width: 20px;
    text-align: center;
    color: #ccc;
  }
  .delete-chat:hover {
    color: #60d2ba;
  }
}
.avatar {
  margin: 0 10px 0 15px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
}
.detail {
  width: 145px;
  font-size: 12px;
  width: 70%;
  .group-dissolve {
    color: #e06c72;
  }
  .name,
  .last-message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .name .icon {
    margin-right: 4px;
    font-size: 10px;
  }
  .last-message {
    font-size: 10px;
    color: #999999;
    letter-spacing: 0.07px;
  }
}
.delete-chat {
  display: none;
}
</style>
