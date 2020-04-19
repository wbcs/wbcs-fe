<template>
  <div id="menu-chats">
    <div v-if="!recentChatHistory.length" class="no-chat-object">
      暂无聊天对象
    </div>
    <RecentChatHistory
      v-for="item in recentChatHistory"
      :key="item.uid || item.gid"
      :contactInfo="item"
      :isActive="activatedId === (item.uid || item.gid)"
      @active-item="setActiveId"
    />
  </div>
</template>

<script>
import { socket } from '@/utils'
import RecentChatHistory from './recent-chat-item.vue'

export default {
  name: 'recent-chat-history',
  components: {
    RecentChatHistory
  },
  data() {
    return {
      activatedId: '',
      recentChatHistory: []
    }
  },
  created() {
    this.getRecentChatHistory()
  },
  activated() {
    this.getRecentChatHistory()
  },
  computed: {
    recentChatIdArr() {
      return this.$store.state.Chat.recentChatIdArr
    }
  },
  watch: {
    recentChatIdArr() {
      this.getRecentChatHistory()
    },
    $route: {
      deep: true,
      handler() {
        const { query } = this.$route
        const groupOrUserId = query.gid ? 'gid' : 'uid'
        const id = query[groupOrUserId]
        this.setActiveId(id)
        this.$store.commit('CURRENT_CHAT', {
          [groupOrUserId]: id
        })
      }
    }
  },
  methods: {
    setActiveId(id) {
      this.activatedId = id
    },
    getRecentChatHistory() {
      if (!this.recentChatIdArr.length) {
        this.recentChatHistory = []
        return
      }
      socket
        .emit('get-recent-contact-history', {
          userId: this.$store.state.uid,
          chatIdList: this.recentChatIdArr
        })
        .then(({ data = [] }) => {
          this.recentChatHistory = data
          console.log('chat-history', data)
        })
    }
  }
}
</script>

<style scoped lang="less">
.no-chat-object {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #a7b0bb;
  opacity: 0.5;
}
</style>
