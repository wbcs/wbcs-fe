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
import { fetchChatHistoryList } from '@/request'
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
    historyList() {
      return this.$store.state.chat.historyList
    }
  },
  watch: {
    historyList() {
      this.getRecentChatHistory()
    },
    $route: {
      deep: true,
      handler() {
        const { query } = this.$route
        const groupOrUserId = query.gid ? 'gid' : 'uid'
        const id = query[groupOrUserId]
        this.setActiveId(id)
        this.$store.commit('chat/setCurrentChat', {
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
      if (!this.historyList.length) {
        this.recentChatHistory = []
        return
      }
      const params = {
        userId: this.$store.state.uid,
        chatIdList: this.historyList
      }
      fetchChatHistoryList(params).then(
        ({ data = [] }) => (this.recentChatHistory = data)
      )
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
