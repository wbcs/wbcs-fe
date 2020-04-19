<template>
  <div class="app">
    <div class="sidebar">
      <menu-bar />
      <div class="user-list">
        <search-bar />
        <div class="menu-content">
          <keep-alive>
            <router-view name="menus" />
          </keep-alive>
        </div>
      </div>
    </div>
    <keep-alive>
      <router-view id="content" name="contents" />
    </keep-alive>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { socket } from '@/utils'
import MenuBar from './menu-bar.vue'
import SearchBar from './search-bar.vue'

export default {
  name: 'app',
  components: {
    MenuBar,
    SearchBar
  },
  created() {
    socket.emit('user-connect', this.$store.state.uid)
    this.getUserInfo()
    this.loadRecentChatList()
  },
  methods: {
    getUserInfo() {
      if (!this.$store.state.uid) {
        ipcRenderer.send('logout')
        return
      }
      socket.emit('get-user-info', this.$store.state.uid).then(data => {
        this.$store.commit('SET_USERINFO', data)
      })
    },
    loadRecentChatList() {
      this.$store.commit('LOAD_RECENT_CHAT')
    }
  }
}
</script>

<style scoped lang="less">
.app {
  display: flex;
  width: 100vw;
  height: 100vh;
  // background: #f6f9fd;
  overflow: hidden;
}
.sidebar {
  display: flex;
  border-right: 1px solid #d9dbde;
}
.user-list {
  width: 250px;
  min-width: 200px;
  max-width: 300px;
}
.menu-content {
  overflow-y: auto;
}
#content {
  flex: 1;
}
</style>
