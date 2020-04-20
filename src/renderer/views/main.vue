<template>
  <div id="app">
    <div id="sidebar">
      <Menu />
      <div class="user-list">
        <Search />
        <div id="menu-content">
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
import Menu from './menu.vue'
import Search from '@/components/search.vue'

export default {
  name: 'app',
  components: {
    Menu,
    Search
  },
  created() {
    this.$socket.emit('user-connect', this.$uid)
    this.getUserInfo()
    this.loadRecentChatList()
  },
  methods: {
    getUserInfo() {
      if (!this.$uid) {
        this.$electron.ipcRenderer.send('logout')
        return
      }
      this.$socket.emit('get-user-info', this.$uid, data => {
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
#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  // background: #f6f9fd;
  overflow: hidden;
}
#sidebar {
  display: flex;
  border-right: 1px solid #d9dbde;
}
.user-list {
  width: 250px;
  min-width: 200px;
  max-width: 300px;
}
#menu-content {
  // height: 550px - 50px;
  overflow-y: auto;
}
#content {
  flex: 1;
}
</style>
