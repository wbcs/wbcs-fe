<template>
  <div id="app">
    <div id="sidebar">
      <menu-bar />
      <div>
        <search-bar />
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
import MenuBar from './menu-bar.vue'
import SearchBar from './search-bar.vue'

export default {
  name: 'app',
  components: {
    MenuBar,
    SearchBar
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

<style lang="stylus">
#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: $app-bg;
  overflow: hidden;
}
#sidebar {
  display: flex;
  border-right: 1px solid #d9dbde;
}
#menu-content {
  // height: $app-height - $search-bar-height;
  overflow-y: auto;
}
#content {
  flex: 1;
}
</style>
